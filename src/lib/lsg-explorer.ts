// Client controller for the LSG explorer (/features/lsg-elections-2025).
//
// One static map, one stacked sidebar. The page renders the overview (desk,
// state map, district list) at build time; this module owns the drill. The map
// never moves: selecting a district swaps its GeoJSON in place and fits the
// district, selecting a local body focuses it. The sidebar is a navigation
// stack — Districts › District › Local body — one level at a time, each with
// a back control and a breadcrumb showing the stack. Nothing scrolls the page:
// levels swap in place inside the drill container.
//
// The controller learns the map's controls from the map:ready event and sends
// feature clicks back through map:select, so it never touches Leaflet itself.
// State is held in the DOM (data-* attributes) rather than a framework: the
// same pattern as sitemap.astro's filter and the price desk.

import type { ElectionMapControls } from './election-map';

interface WardWinner {
  ward: string; name: string; party: string; group: string;
  votes: number; margin: number | null; voters: number | null;
}
interface LbResult {
  code: string; name: string; type: string; wards: number; declared: number;
  voters: number; seats: Record<string, number>; leading: string; winners: WardWinner[];
}
interface Chunk {
  district: { name: string; slug: string; declared: number; voters: number };
  lBs: LbResult[];
}

const FRONT_FILL: Record<string, string> = {
  LDF: 'bg-accent-red', UDF: 'bg-azure', NDA: 'bg-saffron',
  OTHERS: 'bg-ink-muted', TIE: 'bg-ink-light',
};
const FRONT_LABEL: Record<string, string> = {
  LDF: 'എൽഡിഎഫ്', UDF: 'യുഡിഎഫ്', NDA: 'എൻഡിഎ', OTHERS: 'മറ്റുള്ളവർ', TIE: 'ടൈ',
};
const TYPE_ML: Record<string, string> = {
  'Grama Panchayat': 'ഗ്രാമപഞ്ചായത്ത്', Municipality: 'മുനിസിപ്പാലിറ്റി',
  Corporation: 'കോർപറേഷൻ', 'Block Panchayat': 'ബ്ലോക്ക് പഞ്ചായത്ത്',
  'District Panchayat': 'ജില്ലാ പഞ്ചായത്ത്',
};
const DISTRICT_ML: Record<string, string> = {
  Thiruvananthapuram: 'തിരുവനന്തപുരം', Kollam: 'കൊല്ലം', Pathanamthitta: 'പത്തനംതിട്ട',
  Alappuzha: 'ആലപ്പുഴ', Kottayam: 'കോട്ടയം', Idukki: 'ഇടുക്കി', Ernakulam: 'എറണാകുളം',
  Thrissur: 'തൃശ്ശൂർ', Palakkad: 'പാലക്കാട്', Malappuram: 'മലപ്പുറം', Kozhikode: 'കോഴിക്കോട്',
  Wayanad: 'വയനാട്', Kannur: 'കണ്ണൂർ', Kasaragod: 'കാസർഗോഡ്',
};
const FRONTS = ['LDF', 'UDF', 'NDA', 'OTHERS'] as const;

const fmt = (n: number): string => n.toLocaleString('en-IN');
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduceMotion = (): boolean =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const DISTRICTS_URL = '/lsg-data/districts.geojson';

interface ExplorerState {
  map: ElectionMapControls | null;
  districts: GeoJSON.FeatureCollection | null;
  slug: string | null;      // open district, null = districts level
  chunk: Chunk | null;
  currentLb: string | null; // selected local body, null = district level
  activeType: string | null;
  query: string;
  lbListScroll: number;     // LB list scroll, restored when the level re-renders
}

const state: ExplorerState = {
  map: null, districts: null, slug: null, chunk: null,
  currentLb: null, activeType: null, query: '', lbListScroll: 0,
};

export function initLsExplorer(root: HTMLElement): void {
  if (root.dataset.lsInit) return;
  root.dataset.lsInit = '1';

  const drill = root.querySelector<HTMLElement>('[data-ls-drill]');
  if (!drill) return;

  const mapEl = root.querySelector<HTMLElement>('#lsg-state-map');
  mapEl?.addEventListener('map:ready', ((e: Event) => {
    state.map = (e as CustomEvent).detail?.controls ?? null;
  }) as EventListener);
  mapEl?.addEventListener('map:select', ((e: Event) => {
    const id = (e as CustomEvent).detail?.id;
    if (!id) return;
    if (state.slug) selectLb(root, drill, id);
    else void openDistrict(root, drill, id);
  }) as EventListener);

  root.querySelectorAll<HTMLElement>('[data-ls-district-row]').forEach((row) => {
    row.addEventListener('click', () => {
      const slug = row.getAttribute('data-ls-district-row');
      if (slug) void openDistrict(root, drill, slug);
    });
  });

  const applyHash = () => {
    const m = location.hash.match(/^#\/district\/([\w-]+)(?:\/lb\/([\w-]+))?/);
    if (!m) return;
    const slug = m[1];
    void openDistrict(root, drill, slug, m[2] ?? null);
  };
  window.addEventListener('hashchange', applyHash);
  applyHash();
}

async function loadDistricts(): Promise<GeoJSON.FeatureCollection> {
  if (state.districts) return state.districts;
  const res = await fetch(DISTRICTS_URL);
  if (!res.ok) throw new Error(`districts ${res.status}`);
  state.districts = await res.json();
  return state.districts;
}

async function openDistrict(
  root: HTMLElement, drill: HTMLElement, slug: string, focusLb: string | null = null,
): Promise<void> {
  if (state.slug === slug && state.chunk) {
    // Already open — pop back to the district level, then focus if asked.
    if (state.currentLb) {
      state.currentLb = null;
      renderDrill(root, drill, state.chunk);
      history.replaceState(null, '', `#/district/${slug}`);
    }
    if (focusLb) selectLb(root, drill, focusLb);
    return;
  }

  state.slug = slug;
  state.currentLb = null;
  state.activeType = null;
  state.query = '';
  markActiveDistrict(root, slug);

  drill.hidden = false;
  drill.setAttribute('aria-busy', 'true');
  drill.innerHTML =
    `<div class="px-4 py-10 text-center"><p class="caption-text text-ink-muted">Loading ${esc(slug)}…</p></div>`;

  let chunk: Chunk;
  let geojson: GeoJSON.FeatureCollection;
  try {
    const [chunkRes, geoRes] = await Promise.all([
      fetch(`/lsg-data/district/${slug}.json`),
      fetch(`/lsg-data/district/${slug}.geojson`),
    ]);
    if (!chunkRes.ok || !geoRes.ok) throw new Error(`HTTP ${chunkRes.status} / ${geoRes.status}`);
    chunk = await chunkRes.json();
    geojson = await geoRes.json();
  } catch {
    if (state.slug !== slug) return;
    drill.setAttribute('aria-busy', 'false');
    drill.innerHTML =
      `<div class="px-4 py-10 text-center">
         <p class="body-small text-ink dark:text-ivory">ഡാറ്റ ലഭ്യമായില്ല</p>
         <p class="mt-1 caption-text text-ink-muted">Could not load ${esc(slug)} — try again.</p>
         <button type="button" data-ls-retry class="mt-4 border border-rule px-4 py-2 text-caption font-semibold text-ink dark:text-ivory">Retry</button>
       </div>`;
    drill.querySelector<HTMLElement>('[data-ls-retry]')?.addEventListener('click', () => {
      state.slug = null;
      void openDistrict(root, drill, slug, focusLb);
    });
    return;
  }
  if (state.slug !== slug) return;

  state.chunk = chunk;
  state.map?.setData(geojson); // the static map swaps data and fits the district
  renderDrill(root, drill, chunk);
  history.replaceState(null, '', `#/district/${slug}`);
  // On desktop the sticky map keeps the drill beside it; on mobile the drill
  // lands below the tall district list, so bring it up gently.
  if (window.matchMedia('(max-width: 1023px)').matches) {
    drill.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }
  if (focusLb) selectLb(root, drill, focusLb);
}

function markActiveDistrict(root: HTMLElement, slug: string): void {
  root.querySelectorAll<HTMLElement>('[data-ls-district-row]').forEach((row) => {
    const active = row.getAttribute('data-ls-district-row') === slug;
    row.setAttribute('aria-current', active ? 'true' : 'false');
  });
}

async function closeDistrict(root: HTMLElement, drill: HTMLElement): Promise<void> {
  state.slug = null;
  state.chunk = null;
  state.currentLb = null;
  state.activeType = null;
  state.query = '';
  markActiveDistrict(root, '');
  drill.hidden = true;
  drill.innerHTML = '';
  if (state.map) {
    try {
      state.map.setData(await loadDistricts()); // back to the state view
    } catch {
      state.map.fit();
    }
  }
  history.replaceState(null, '', location.pathname);
  if (window.matchMedia('(max-width: 1023px)').matches) {
    root.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }
}

// ── Level 1 · the district: seats, search, local-body list ──────────────────

function renderDrill(root: HTMLElement, drill: HTMLElement, chunk: Chunk, restoreScroll = 0, activeLb: string | null = null): void {
  const d = chunk.district;
  const ml = DISTRICT_ML[d.name] ?? d.name;
  const sum = FRONTS.reduce((s, f) => s + (d.seats?.[f] ?? 0), 0) || d.declared;

  const seatsHtml = FRONTS.map((f) => {
    const n = d.seats?.[f] ?? 0;
    const pct = sum > 0 ? (n / sum) * 100 : 0;
    return `
      <div class="grid grid-cols-[2.75rem_1fr_3.25rem] items-center gap-2">
        <span class="caption-text font-semibold text-ink dark:text-ivory">${FRONT_LABEL[f]}</span>
        <div class="h-1 overflow-hidden bg-rule" role="img" aria-label="${FRONT_LABEL[f]} ${fmt(n)} of ${fmt(sum)}">
          <span class="block h-full ${FRONT_FILL[f]}" style="width:${pct}%"></span>
        </div>
        <span class="text-right caption-text font-semibold tabular-nums text-ink dark:text-ivory">${fmt(n)}</span>
      </div>`;
  }).join('');

  drill.setAttribute('aria-busy', 'false');
  drill.innerHTML = `
    <div>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-ls-back
          class="flex items-center gap-1.5 border border-rule px-3 py-1.5 text-caption font-semibold text-ink hover:border-ink dark:text-ivory dark:hover:border-ivory"
          aria-label="Back to districts">
          <i class="ti ti-arrow-left text-sm" aria-hidden="true"></i>ജില്ലകൾ
        </button>
        <span class="eyebrow text-azure dark:text-azure-light">DISTRICT · ${esc(d.name.toUpperCase())}</span>
      </div>

      <h2 class="mt-3 font-malayalam text-hero text-ink dark:text-ivory">${esc(ml)}</h2>
      <p class="mt-1 text-meta text-ink-muted">
        ${fmt(chunk.lBs.length)} തദ്ദേശ സ്ഥാപനങ്ങൾ · ${fmt(d.declared)} വാർഡുകൾ · ${fmt(d.voters)} വോട്ടർമാർ
      </p>

      <div class="mt-5 space-y-1.5">${seatsHtml}</div>

      <p class="mt-6 body-small text-ink dark:text-ivory">ജില്ലയിലെ തദ്ദേശ സ്ഥാപനങ്ങൾ</p>
      <p class="mt-0.5 caption-text text-ink-muted">Local bodies shaded by leading front — click a shape on the map or a row below.</p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input type="search" data-ls-search placeholder="തിരയുക · Search body…"
          aria-label="Search local bodies"
          class="h-9 w-full max-w-xs border border-rule bg-transparent px-3 text-body text-ink placeholder:text-ink-muted focus:border-azure dark:text-ivory" />
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
          ${Object.entries(TYPE_ML).map(([type, mlType]) => `
            <button type="button" data-ls-type="${type}"
              class="border border-rule px-2.5 py-1.5 text-caption font-semibold text-ink hover:border-ink dark:text-ivory dark:hover:border-ivory"
              aria-pressed="false">${mlType}</button>`).join('')}
        </div>
      </div>

      <ul data-ls-lb-rows class="mt-3 border-t border-rule lg:max-h-[28rem] lg:overflow-y-auto lg:overscroll-contain">
        ${chunk.lBs.map((lb) => lbRowHtml(lb, lb.code === activeLb)).join('')}
      </ul>
    </div>`;

  const list = drill.querySelector<HTMLElement>('[data-ls-lb-rows]');
  if (list && restoreScroll > 0) list.scrollTop = restoreScroll;

  drill.querySelector<HTMLElement>('[data-ls-back]')?.addEventListener('click', () => {
    void closeDistrict(root, drill);
  });

  // Rows.
  drill.querySelectorAll<HTMLElement>('[data-ls-lb]').forEach((row) => {
    row.addEventListener('click', () => {
      const code = row.getAttribute('data-ls-lb');
      if (code) selectLb(root, drill, code);
    });
  });

  // Search + type filter. The chips live in their own group; LB rows also
  // carry data-ls-type (for filtering), so scope the wiring to the group.
  const search = drill.querySelector<HTMLInputElement>('[data-ls-search]');
  const typeGroup = drill.querySelector('[role="group"][aria-label="Filter by type"]');
  const typeBtns = typeGroup ? typeGroup.querySelectorAll<HTMLElement>('[data-ls-type]') : [];
  typeBtns.forEach((btn) => btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-ls-type');
    state.activeType = state.activeType === type ? null : type;
    typeBtns.forEach((b) => {
      const active = b.getAttribute('data-ls-type') === state.activeType;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('is-active', active);
      b.classList.toggle('bg-azure', active);
      b.classList.toggle('text-white', active);
    });
    filterRows(drill);
  }));
  search?.addEventListener('input', () => {
    state.query = search.value.trim().toLowerCase();
    filterRows(drill);
  });

  state.chunk = chunk;
}

function lbRowHtml(lb: LbResult, active: boolean): string {
  const declaredNote = lb.declared < lb.wards ? ` · ${lb.declared}/${lb.wards} ഫലം` : '';
  const chip = FRONT_FILL[lb.leading] ? `<span class="inline-block size-2.5 align-middle ${FRONT_FILL[lb.leading]}"></span>` : '';
  const stateCls = active ? 'is-active' : '';
  return `
    <li>
      <button type="button" data-ls-lb="${lb.code}" data-ls-type="${esc(lb.type)}" aria-current="${active ? 'true' : 'false'}"
        class="${stateCls} grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b border-rule py-3.5 text-left transition-colors hover:bg-light-gray dark:hover:bg-brand-overlay">
        <span>
          <span class="block text-body font-semibold text-ink dark:text-ivory">${esc(lb.name)}</span>
          <span class="mt-0.5 block caption-text text-ink-muted">${TYPE_ML[lb.type] ?? esc(lb.type)}${declaredNote} · ${fmt(lb.voters)} വോട്ടർമാർ</span>
        </span>
        <span class="flex items-center gap-2 text-right">
          <span class="caption-text tabular-nums text-ink-muted">${fmt(lb.seats.LDF)}/${fmt(lb.seats.UDF)}/${fmt(lb.seats.NDA)}</span>
          ${chip}
          <span class="caption-text font-semibold text-ink dark:text-ivory">${FRONT_LABEL[lb.leading] ?? esc(lb.leading)}</span>
        </span>
      </button>
    </li>`;
}

// ── Level 2 · the local body: seats and ward results ────────────────────────

function selectLb(root: HTMLElement, drill: HTMLElement, code: string): void {
  const chunk = state.chunk;
  if (!chunk) return;
  const lb = chunk.lBs.find((x) => x.code === code);
  if (!lb) return;

  // Keep the list's scroll so popping back lands where the reader left it.
  const list = drill.querySelector<HTMLElement>('[data-ls-lb-rows]');
  const savedScroll = list?.scrollTop ?? state.lbListScroll;
  if (list) state.lbListScroll = savedScroll;

  state.currentLb = code;
  state.map?.focus(code);
  history.replaceState(null, '', `#/district/${chunk.district.slug}/lb/${code}`);
  renderLbPanel(root, drill, chunk, lb, savedScroll);
  // The drill container itself never moves; this only nudges if the reader
  // scrolled past it (block:nearest means no movement when it is in view).
  drill.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
}

function renderLbPanel(
  root: HTMLElement, drill: HTMLElement, chunk: Chunk, lb: LbResult, savedScroll: number,
): void {
  const ml = DISTRICT_ML[chunk.district.name] ?? chunk.district.name;
  const sum = FRONTS.reduce((s, f) => s + lb.seats[f], 0) || lb.declared;
  const gridCols = 'grid-cols-[2.5rem_minmax(0,1fr)_3.75rem_3.25rem_3.75rem]';
  const rows = [...lb.winners]
    .sort((a, b) => parseInt(a.ward, 10) - parseInt(b.ward, 10))
    .map((w) => {
      const fill = FRONT_FILL[w.group] ?? 'bg-rule';
      const votes = w.votes === 0 ? '<span class="text-ink-muted">ഏകകക്ഷി</span>' : `<span class="caption-text font-semibold tabular-nums text-ink dark:text-ivory">${fmt(w.votes)}</span>`;
      const margin = w.margin !== null && w.votes > 0 ? `<span class="tabular-nums">+${fmt(w.margin)}</span>` : '<span aria-hidden="true">—</span>';
      const voters = w.voters !== null ? `<span class="tabular-nums">${fmt(w.voters)}</span>` : '—';
      return `
        <li class="grid ${gridCols} items-baseline gap-x-3 border-b border-rule-light py-2">
          <span class="caption-text tabular-nums text-ink-muted">${esc(w.ward)}</span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block size-2 shrink-0 ${fill}" aria-hidden="true"></span>
            <span>
              <span class="block body-small text-ink dark:text-ivory">${esc(w.name)}</span>
              <span class="block caption-text text-ink-muted">${esc(w.party)}</span>
            </span>
          </span>
          <span class="text-right">${votes}</span>
          <span class="caption-text tabular-nums text-ink-muted text-right">${margin}</span>
          <span class="caption-text tabular-nums text-ink-muted text-right">${voters}</span>
        </li>`;
    })
    .join('');

  drill.setAttribute('aria-busy', 'false');
  drill.innerHTML = `
    <div>
      <nav class="flex flex-wrap items-center gap-1.5 text-caption text-ink-muted" aria-label="Breadcrumb">
        <button type="button" data-ls-back
          class="flex items-center gap-1.5 border border-rule px-3 py-1.5 text-caption font-semibold text-ink hover:border-ink dark:text-ivory dark:hover:border-ivory"
          aria-label="Back to local bodies in ${esc(chunk.district.name)}">
          <i class="ti ti-arrow-left text-sm" aria-hidden="true"></i>തദ്ദേശ സ്ഥാപനങ്ങൾ
        </button>
        <span aria-hidden="true">›</span>
        <span class="font-semibold text-ink dark:text-ivory">${esc(ml)}</span>
        <span aria-hidden="true">›</span>
        <span class="max-w-[12rem] truncate">${esc(lb.name)}</span>
      </nav>

      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="eyebrow text-ink-muted">LOCAL BODY · ${esc(lb.code)}</p>
          <h3 class="mt-1 font-malayalam text-title text-ink dark:text-ivory">${esc(lb.name)}</h3>
          <p class="mt-1 text-meta text-ink-muted">
            ${TYPE_ML[lb.type] ?? esc(lb.type)} · ${fmt(lb.declared)}/${fmt(lb.wards)} വാർഡുകൾ · ${fmt(lb.voters)} വോട്ടർമാർ
          </p>
        </div>
        <div class="w-full max-w-[13rem] space-y-1.5">
          ${FRONTS.map((f) => {
            const n = lb.seats[f];
            const pct = sum > 0 ? (n / sum) * 100 : 0;
            return `<div class="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
              <span class="caption-text text-ink dark:text-ivory">${FRONT_LABEL[f]}</span>
              <span class="h-1 overflow-hidden bg-rule"><span class="block h-full ${FRONT_FILL[f]}" style="width:${pct}%"></span></span>
              <span class="text-right caption-text tabular-nums text-ink dark:text-ivory">${fmt(n)}</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <p class="mt-6 eyebrow text-ink-muted">WARD RESULTS · ${lb.winners.length} വാർഡുകൾ</p>
      <div class="mt-2 grid ${gridCols} gap-x-3 border-b border-rule py-2">
        <span class="eyebrow text-[0.625rem] text-ink-muted">വാർഡ്</span>
        <span class="eyebrow text-[0.625rem] text-ink-muted">വിജയി</span>
        <span class="eyebrow text-[0.625rem] text-ink-muted text-right">വോട്ട്</span>
        <span class="eyebrow text-[0.625rem] text-ink-muted text-right">ഭൂരിപക്ഷം</span>
        <span class="eyebrow text-[0.625rem] text-ink-muted text-right">വോട്ടർമാർ</span>
      </div>
      <ul class="border-b border-rule">
        ${rows || '<li class="py-4 caption-text text-ink-muted">No declared winners in this snapshot.</li>'}
      </ul>
    </div>`;

  drill.querySelector<HTMLElement>('[data-ls-back]')?.addEventListener('click', () => {
    state.currentLb = null;
    state.map?.focus(null);
    state.map?.fit(); // back out to the district
    renderDrill(root, drill, chunk, savedScroll, lb.code);
    history.replaceState(null, '', `#/district/${chunk.district.slug}`);
  });
}

function filterRows(drill: HTMLElement): void {
  drill.querySelectorAll<HTMLElement>('[data-ls-lb]').forEach((row) => {
    const name = (row.querySelector('span')?.textContent ?? '').toLowerCase();
    const type = row.getAttribute('data-ls-type');
    const matchesType = state.activeType === null || type === state.activeType;
    const matchesQuery = state.query === '' || name.includes(state.query);
    row.closest('li')?.classList.toggle('hidden', !(matchesType && matchesQuery));
  });
}
