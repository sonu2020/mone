// MC inspector — the PUBLIC_MC_OUTLINE audit toolbar.
//
// In outline mode every custom component stamps its root with `mc` (see
// app.css) and this module adds the engineer's control room: a toggleable,
// fixed toolbar sheet with three views.
//
//   Components  — every `.mc` root on the page, named and counted. Click one
//                 to select it: the page scrolls to it, it gets a solid
//                 outline, and the Fix view audits it.
//   Type scales — the named type tokens, coloured and live: hovering a scale
//                 highlights every element on the page set in that scale and
//                 reports the count, so a reviewer can see the scale actually
//                 in use rather than trust the spec.
//   Fix         — token-compliance audit of the selected component. Classes
//                 are matched against known violation patterns (arbitrary
//                 sizes, raw colours, gradients, radii, inline colour) and
//                 curated fixes are offered where the pattern is known. Fixes
//                 patch the DOM so the engineer can preview; source fixes ship
//                 with the component. The curated set currently covers
//                 LeadPackage only — other components report, not yet fix.
//
// Everything renders with tokens; nothing here ships CSS in normal mode (the
// module returns before touching the DOM unless <html> carries .mc-outline).

export interface McScale {
  name: string;
  cls: string;        // the utility, e.g. 'text-hero'
  token: string;      // the @theme token, e.g. '--text-hero'
  clamp: string;      // the clamp expression, for the label
  color: string;      // a token-derived swatch colour
  sample: string;
}

// The named fluid scale from the @theme block in src/styles/app.css. Clamp
// values are the ones the tokens resolve to — kept here as labels only; the
// sample below renders through the real utility, so the label can drift and
// the sample cannot.
export const MC_SCALES: McScale[] = [
  { name: 'Display',   cls: 'text-display',   token: '--text-display',   clamp: '2rem → 3.5rem',   color: 'var(--color-azure)', sample: 'കേരളം' },
  { name: 'Hero',      cls: 'text-hero',      token: '--text-hero',      clamp: '1.5rem → 2.75rem', color: 'var(--color-ink)', sample: 'കേരളം' },
  { name: 'Title',     cls: 'text-title',     token: '--text-title',     clamp: '1.31rem → 1.875rem', color: 'var(--color-azure-dark)', sample: 'കേരളം' },
  { name: 'Section',   cls: 'text-section',   token: '--text-section',   clamp: '1.19rem → 1.5rem', color: 'var(--color-ink-light)', sample: 'കേരളം' },
  { name: 'Headline',  cls: 'text-headline',  token: '--text-headline',  clamp: '0.875rem → 1.125rem', color: 'var(--color-text-blue)', sample: 'കേരളം' },
  { name: 'Lead',      cls: 'text-lead',      token: '--text-lead',      clamp: '0.94rem → 1.19rem', color: 'var(--color-azure-light)', sample: 'കേരളം' },
  { name: 'Body',      cls: 'text-body',      token: '--text-body',      clamp: '0.875rem → 1.06rem', color: 'var(--color-ink-muted)', sample: 'കേരളം' },
  { name: 'Meta',      cls: 'text-meta',      token: '--text-meta',      clamp: '0.75rem → 0.81rem', color: 'var(--color-text-muted)', sample: 'കേരളം' },
  { name: 'Eyebrow',   cls: 'text-eyebrow',   token: '--text-eyebrow',   clamp: '0.69rem → 0.75rem', color: 'var(--color-azure)', sample: 'KERALA' },
  { name: 'Caption',   cls: 'text-caption',   token: '--text-caption',   clamp: '0.69rem → 0.75rem', color: 'var(--color-ink-muted)', sample: 'കേരളം' },
  { name: 'Category',  cls: 'text-category',  token: '--text-category',  clamp: '1.75rem → 2.5rem', color: 'var(--color-nav-bg)', sample: 'കേരളം' },
  { name: 'Deck',      cls: 'text-deck',      token: '--text-deck',      clamp: '0.94rem → 1.03rem', color: 'var(--color-text-blue)', sample: 'കേരളം' },
  { name: 'Feature',   cls: 'text-feature',   token: '--text-feature',   clamp: '1.19rem → 1.375rem', color: 'var(--color-ink)', sample: 'കേരളം' },
  { name: 'Lead story', cls: 'text-lead-story', token: '--text-lead-story', clamp: '1.31rem → 1.56rem', color: 'var(--color-azure-dark)', sample: 'കേരളം' },
  { name: 'Band',      cls: 'text-band',      token: '--text-band',      clamp: '1.125rem → 1.375rem', color: 'var(--color-azure)', sample: 'KERALA' },
  { name: 'Body small', cls: 'text-body-small', token: '--text-body-small', clamp: '0.75rem → 0.81rem', color: 'var(--color-text-muted)', sample: 'കേരളം' },
  { name: 'Nav',       cls: 'text-nav',       token: '--text-nav',       clamp: '0.94rem → 1.06rem', color: 'var(--color-ink-light)', sample: 'കേരളം' },
];

// ── Audit ────────────────────────────────────────────────────────────────────

export interface McViolation {
  cls: string;
  type: string;
  note: string;
  count: number;
}

const VIOLATION_PATTERNS: { re: RegExp; type: string; note: string }[] = [
  { re: /^text-\[\d/, type: 'arbitrary type', note: 'raw font-size — the value almost certainly has a named token (text-lead, text-body …)' },
  { re: /^(size|w|h|min-w|min-h|max-w|max-h|gap|p|m)-\[/, type: 'arbitrary size', note: 'raw size — prefer a spacing token or a standard utility' },
  { re: /^bg-gradient/, type: 'gradient', note: 'gradients are banned by the baseline' },
  { re: /(^|-)gray-\d|^white$|^black$|^bg-white$|^text-white$|^border-white$/, type: 'raw colour', note: 'literal colour — use ink / ivory / rule tokens' },
  { re: /^rounded-full/, type: 'radius', note: 'square geometry — no rounded corners outside icons' },
  { re: /^\[/, type: 'arbitrary property', note: 'raw CSS in a class — hoist to a utility or use the var() form' },
  { re: /^(bg|text|border|ring|outline|fill|stroke)-\[#/, type: 'raw colour', note: 'hex in an arbitrary value — use a token' },
];

const INLINE_COLOUR = /#[0-9a-f]{3,8}\b|rgb\(|rgba\(|oklch\(/i;

/** Scan a component root for token violations, deduped by class. */
export function auditComponent(root: HTMLElement): McViolation[] {
  const seen = new Map<string, McViolation>();
  const note = (cls: string, type: string, message: string) => {
    const key = `${type}·${cls}`;
    const hit = seen.get(key);
    if (hit) hit.count += 1;
    else seen.set(key, { cls, type, note: message, count: 1 });
  };

  const walk = (el: Element) => {
    for (const cls of el.classList) {
      for (const p of VIOLATION_PATTERNS) {
        if (p.re.test(cls)) {
          note(cls, p.type, p.note);
          break;
        }
      }
    }
    const style = el.getAttribute('style');
    if (style && INLINE_COLOUR.test(style)) {
      note(`style="${style.slice(0, 48)}…"`, 'inline colour', 'colour in an inline style — move it to a token class');
    }
  };

  walk(root);
  root.querySelectorAll('*').forEach(walk);
  return [...seen.values()].sort((a, b) => b.count - a.count);
}

// ── Curated fixes — LeadPackage first, others later ─────────────────────────

export interface McFix {
  from: string;
  to: string;
  note: string;
  /** If true the class is replaced in the DOM for preview; otherwise it is
   *  reported as a review item only (source change ships with the component). */
  preview?: boolean;
}

export const MC_CURATED: Record<string, { fixes: McFix[]; reviews: McFix[] }> = {
  LeadPackage: {
    fixes: [
      {
        from: 'text-[0.9375rem]',
        to: 'text-lead',
        note: '15px is the --text-lead floor (0.9375rem → 1.1875rem clamp). Drop the literal.',
      },
      {
        from: 'size-[7px]',
        to: 'size-2',
        note: '7px has no token. size-2 (8px) matches the square chips elsewhere on the site.',
      },
      {
        from: 'rounded-full',
        to: 'rounded-none',
        note: 'Square geometry — the feed dot becomes a square like the front chips.',
      },
    ],
    reviews: [
      {
        from: '[font-variation-settings:',
        to: 'var(--font-wdth) / var(--font-wght)',
        note: 'Font axes are tokenised as --font-wdth/--font-wght — prefer the var() form so the axes follow the theme.',
      },
    ],
  },
};

// ── Toolbar ──────────────────────────────────────────────────────────────────

const reduceMotion = () =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// Astro strips data-astro-source-* from the live DOM in dev, so component
// names come from the SSR HTML instead: fetch the current URL once, map every
// .mc root's structural path (ancestors + nth-of-type) to its component file,
// and look live roots up by the same path. Roots with no SSR counterpart
// (runtime-rendered) fall back to their tag name.
let ssrNames: Map<string, string> | null = null;

function pathOf(el: Element): string {
  const parts: string[] = [];
  const docBody = el.ownerDocument.body;
  let node: Element | null = el;
  while (node && node !== docBody && node.parentElement) {
    const tag = node.tagName.toLowerCase();
    const same = [...(node.parentElement.children as unknown as Element[])].filter(
      (s) => s.tagName === node!.tagName,
    );
    const idx = same.indexOf(node) + 1;
    parts.unshift(`${tag}:${idx}`);
    node = node.parentElement;
  }
  return parts.join('>');
}

async function ensureSsrNames(): Promise<void> {
  if (ssrNames) return;
  try {
    const html = await fetch(location.href).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const map = new Map<string, string>();
    doc.querySelectorAll<HTMLElement>('.mc').forEach((el) => {
      const src = el.getAttribute('data-astro-source-file');
      if (!src) return;
      const name = src.split('/').pop()?.replace(/\.astro$/, '') ?? '?';
      map.set(pathOf(el), name);
    });
    ssrNames = map;
  } catch {
    ssrNames = new Map();
  }
}

const nameOf = (el: Element): string => {
  const fromSsr = ssrNames?.get(pathOf(el));
  if (fromSsr) return fromSsr;
  const cls = [...el.classList].find((c) => /^[A-Z]/.test(c));
  return cls ?? el.tagName.toLowerCase();
};

export function mountMcInspector(): void {
  if (!document.documentElement.classList.contains('mc-outline')) return;
  if (!document.getElementById('mci-root')) ssrNames = null;
  if (document.getElementById('mci-root')) return;
  const reduce = reduceMotion();
  let selected: HTMLElement | null = null;

  // ── Build the shell ─────────────────────────────────────────────────────
  const root = document.createElement('div');
  root.id = 'mci-root';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mci-toggle';
  toggle.setAttribute('aria-label', 'Toggle component inspector');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<i class="ti ti-components" aria-hidden="true"></i>';
  toggle.addEventListener('click', () => setOpen(sheet.hidden));

  const sheet = document.createElement('div');
  sheet.className = 'mci-sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Component inspector');

  const header = document.createElement('div');
  header.className = 'mci-head';
  header.innerHTML = `
    <p class="mci-title">
      <span class="mci-kicker">MC OUTLINE · INSPECTOR</span>
      <span class="mci-sub" data-mci-count>0 components</span>
    </p>
    <button type="button" class="mci-close" aria-label="Close inspector"><i class="ti ti-x" aria-hidden="true"></i></button>`;

  const tabs = document.createElement('div');
  tabs.className = 'mci-tabs';
  tabs.innerHTML = `
    <button type="button" data-mci-tab="components" class="is-active">Components</button>
    <button type="button" data-mci-tab="types">Type scales</button>
    <button type="button" data-mci-tab="fix">Fix</button>`;

  const body = document.createElement('div');
  body.className = 'mci-body';

  sheet.append(header, tabs, body);
  root.append(toggle, sheet);
  document.body.appendChild(root);

  header.querySelector('.mci-close')?.addEventListener('click', () => setOpen(false));

  const setOpen = (open: boolean) => {
    sheet.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    try { localStorage.setItem('mci-open', open ? '1' : '0'); } catch { /* private mode */ }
    if (open) renderActive();
  };
  try { setOpen(localStorage.getItem('mci-open') === '1'); } catch { setOpen(false); }

  // ── Tabs ────────────────────────────────────────────────────────────────
  const panes: Record<string, () => void> = {
    components: renderComponents,
    types: renderTypes,
    fix: renderFix,
  };
  let activeTab = 'components';

  tabs.querySelectorAll<HTMLButtonElement>('[data-mci-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.mciTab ?? 'components';
      tabs.querySelectorAll('[data-mci-tab]').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderActive();
    });
  });

  function renderActive(): void {
    panes[activeTab]?.();
  }

  // Names arrive async (SSR fetch); refresh whichever tab is live once they do.
  void ensureSsrNames().then(() => {
    if (activeTab === 'components') renderComponents();
    if (activeTab === 'fix') renderFix();
  });

  // ── Components view ─────────────────────────────────────────────────────
  function renderComponents(): void {
    const roots = [...document.querySelectorAll<HTMLElement>('.mc')];
    const counts = new Map<string, number>();
    roots.forEach((r) => {
      const n = nameOf(r);
      counts.set(n, (counts.get(n) ?? 0) + 1);
    });
    const total = counts.size;
    header.querySelector('[data-mci-count]')!.textContent = `${total} component${total === 1 ? '' : 's'} · ${roots.length} instances`;

    const list = document.createElement('div');
    list.className = 'mci-list';
    const byName = new Map<string, HTMLElement[]>();
    roots.forEach((r) => {
      const n = nameOf(r);
      if (!byName.has(n)) byName.set(n, []);
      byName.get(n)!.push(r);
    });

    [...byName.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, instances]) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'mci-row';
      const first = instances[0];
      const cls = [...first.classList].filter((c) => c !== 'mc').slice(0, 4).join(' · ');
      row.innerHTML = `
        <span class="mci-row-name">${name}${instances.length > 1 ? ` <em class="mci-n">×${instances.length}</em>` : ''}</span>
        <span class="mci-row-cls">${cls}</span>`;
      row.addEventListener('click', () => select(name, instances[0]));
      list.appendChild(row);
    });

    if (!roots.length) {
      list.innerHTML = '<p class="mci-empty">No .mc components on this page.</p>';
    }
    body.replaceChildren(list);
  }

  // ── Type scales view ────────────────────────────────────────────────────
  let typeHl: HTMLElement[] = [];
  function clearTypeHl(): void {
    typeHl.forEach((el) => el.classList.remove('mci-type-hl'));
    typeHl = [];
  }
  function highlightMatches(cls: string): number {
    clearTypeHl();
    const els = [...document.querySelectorAll<HTMLElement>(`.${cls}`)]
      .filter((el) => el.classList.contains(cls) && !el.closest('#mci-root'));
    els.forEach((el) => el.classList.add('mci-type-hl'));
    typeHl = els;
    return els.length;
  }

  function renderTypes(): void {
    const list = document.createElement('div');
    list.className = 'mci-list';
    MC_SCALES.forEach((s) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'mci-scale';
      row.innerHTML = `
        <span class="mci-swatch" style="background-color:${s.color}" aria-hidden="true"></span>
        <span class="mci-scale-sample ${s.cls}" style="color:${s.color}">${s.sample}</span>
        <span class="mci-scale-meta">
          <span class="mci-scale-name">${s.name}</span>
          <span class="mci-scale-token">${s.token} · ${s.cls}</span>
          <span class="mci-scale-clamp">${s.clamp}</span>
        </span>
        <span class="mci-scale-count" data-mci-count></span>`;
      row.addEventListener('mouseenter', () => {
        const n = highlightMatches(s.cls);
        row.querySelector('[data-mci-count]')!.textContent = n ? `${n} on page` : 'none';
      });
      row.addEventListener('mouseleave', clearTypeHl);
      list.appendChild(row);
    });
    body.replaceChildren(list);
  }

  // ── Fix view ────────────────────────────────────────────────────────────
  function renderFix(): void {
    const wrap = document.createElement('div');
    wrap.className = 'mci-fix';

    if (!selected) {
      wrap.innerHTML = `
        <p class="mci-empty">Select a component in the Components view to audit it.</p>
        <p class="mci-hint">The audit scans every class against the token baseline — arbitrary sizes, raw colours, gradients, radii and inline colour. Curated fixes exist for <strong>LeadPackage</strong>; every other component reports its violations for the source fix.</p>`;
      body.replaceChildren(wrap);
      return;
    }

    const violations = auditComponent(selected);
    const curated = MC_CURATED[nameOf(selected)];

    const head = document.createElement('div');
    head.className = 'mci-fix-head';
    head.innerHTML = `
      <p class="mci-row-name">${nameOf(selected)} <em class="mci-n">${violations.length ? `${violations.length} violations` : 'clean'}</em></p>
      <button type="button" class="mci-clear" data-mci-clear>Clear selection</button>`;

    const audit = document.createElement('div');
    audit.className = 'mci-audit';
    if (violations.length === 0) {
      audit.innerHTML = '<p class="mci-clean">Token-clean — no violations found in this snapshot.</p>';
    } else {
      violations.forEach((v) => {
        const item = document.createElement('div');
        item.className = 'mci-vio';
        item.innerHTML = `
          <span class="mci-vio-cls">${v.cls}</span>
          <span class="mci-vio-type">${v.type} · ${v.count}</span>
          <span class="mci-vio-note">${v.note}</span>`;
        audit.appendChild(item);
      });
    }

    const fixes = document.createElement('div');
    fixes.className = 'mci-fixes';
    if (curated) {
      fixes.innerHTML = `<p class="mci-fixes-title">CURATED FIXES · ${nameOf(selected)}</p>`;
      curated.fixes.forEach((f) => {
        const row = document.createElement('div');
        row.className = 'mci-fix-row';
        row.innerHTML = `
          <span class="mci-fix-from"><s>${f.from}</s> → <b>${f.to}</b></span>
          <span class="mci-vio-note">${f.note}</span>
          <button type="button" class="mci-apply" data-mci-apply="${f.from}">Apply preview</button>`;
        row.querySelector('[data-mci-apply]')?.addEventListener('click', () => {
          applyFix(f);
          renderFix(); // re-audit reflects the preview
        });
        fixes.appendChild(row);
      });
      curated.reviews.forEach((r) => {
        const row = document.createElement('div');
        row.className = 'mci-fix-row is-review';
        row.innerHTML = `
          <span class="mci-fix-from">${r.from} → ${r.to}</span>
          <span class="mci-vio-note">${r.note} · review only</span>`;
        fixes.appendChild(row);
      });
      const hint = document.createElement('p');
      hint.className = 'mci-hint';
      hint.textContent = 'Fixes patch the DOM for preview only. The source fix ships with the component (LeadPackage is first; the rest follow).';
      fixes.appendChild(hint);
      if (nameOf(selected) === 'LeadPackage') {
        const link = document.createElement('a');
        link.href = '/design/inspector';
        link.className = 'mci-hint';
        link.textContent = 'Open the dedicated LeadPackage inspector →';
        fixes.appendChild(link);
      }
    } else {
      fixes.innerHTML = `
        <p class="mci-fixes-title">${nameOf(selected)} — not yet curated</p>
        <p class="mci-hint">Violations above are the fix list. Curated token replacements will follow for this component.</p>`;
    }

    wrap.append(head, audit, fixes);
    body.replaceChildren(wrap);
  }

  function applyFix(f: McFix): void {
    if (!selected) return;
    selected.querySelectorAll<HTMLElement>(`.${CSS.escape(f.from)}`).forEach((el) => {
      el.classList.replace(f.from, f.to);
    });
  }

  function select(name: string, el: HTMLElement): void {
    if (selected) selected.classList.remove('mci-sel');
    selected = el;
    el.classList.add('mci-sel');
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    activeTab = 'fix';
    tabs.querySelectorAll('[data-mci-tab]').forEach((b) => b.classList.toggle('is-active', b.dataset.mciTab === 'fix'));
    renderActive();
  }

  document.addEventListener('click', (e) => {
    const clear = (e.target as HTMLElement).closest('[data-mci-clear]');
    if (!clear) return;
    if (selected) selected.classList.remove('mci-sel');
    selected = null;
    renderActive();
  });
}
