// Interaction for PriceChart.astro and PriceDesk.astro: range toggle, purity
// toggle, unit relabelling, pointer scrub, keyboard, and the story rail.
//
// Every path is already in the DOM, so switching a range or a purity is a
// visibility flip, not a redraw. Nothing here computes a price from raw data —
// it only reads the scrub tables the components serialised at build time.
//
// This is the only module in the feature that touches the DOM. If it fails to
// load, the build-time markup still renders a correct default chart.

/** Values for one range x variant. Dates live once per range, in `dates`. */
interface ViewData { v: (number | null)[]; d: string }
interface ChartData {
  dates: Record<string, string[]>;
  views: Record<string, ViewData>;
  allRange: string;
}

const REDUCED = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initChart(root: HTMLElement): void {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-chart-data]');
  const plot = root.querySelector<SVGSVGElement>('[data-plot]');
  const crosshair = root.querySelector<SVGLineElement>('[data-crosshair]');
  const band = root.querySelector<SVGRectElement>('[data-act-band]');
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  if (!dataEl || !plot || !crosshair || !readout) return;

  const data: ChartData = JSON.parse(dataEl.textContent || '{}');
  const precision = Number(root.dataset.precision ?? 0);
  const unitLabel = root.dataset.unitLabel ?? '';
  const W = Number(plot.dataset.w ?? 1000);

  let range = root.dataset.initialRange ?? '';
  let variant = root.dataset.activeVariant ?? '';
  let cursor = -1;

  const fmt = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  const key = () => `${range}:${variant}`;
  const values = (): (number | null)[] => data.views[key()]?.v ?? [];
  const dates = (): string[] => data.dates[range] ?? [];

  function hideCursor(): void {
    cursor = -1;
    crosshair!.style.opacity = '0';
    readout!.style.display = 'none';
  }

  function applyPaths(): void {
    root.querySelectorAll<SVGPathElement>('[data-range-path]').forEach((path) => {
      const on = path.dataset.rangePath === range && path.dataset.variantPath === variant;
      path.style.opacity = on ? '1' : '0';
      // Hidden after the fade so a stale path never takes a pointer hit.
      path.style.visibility = on ? 'visible' : 'hidden';
    });
    plot!.setAttribute('aria-label', data.views[key()]?.d ?? '');
    hideCursor();
  }

  function selectRange(next: string): void {
    range = next;
    root.querySelectorAll<HTMLElement>('[data-range-pill]').forEach((pill) => {
      pill.setAttribute('aria-selected', String(pill.dataset.rangePill === next));
    });
    // Markers are placed against the all-time window, so they only make sense there.
    const onAll = next === data.allRange;
    root.querySelectorAll<SVGLineElement>('[data-marker]').forEach((m) => {
      m.style.opacity = onAll ? '1' : '0';
    });
    root.querySelectorAll<HTMLElement>('[data-marker-link]').forEach((m) => {
      m.style.display = onAll ? '' : 'none';
    });
    applyPaths();
  }

  function showCursor(index: number): void {
    const list = values();
    const days = dates();
    if (index < 0 || index >= list.length) return;
    cursor = index;
    const row = { date: days[index] ?? '', value: list[index] };
    const x = list.length > 1 ? (index / (list.length - 1)) * W : 0;

    crosshair!.setAttribute('x1', String(x));
    crosshair!.setAttribute('x2', String(x));
    crosshair!.style.opacity = '1';

    const date = new Date(`${row.date}T00:00:00Z`).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    });
    readout!.textContent = row.value === null
      ? `${date} — no rate quoted`
      : `${date} · ₹${fmt.format(row.value)}/${unitLabel}`;
    readout!.style.display = 'block';

    // Clamp inside the plot so the readout never overhangs the page edge.
    const box = plot!.getBoundingClientRect();
    const px = (x / W) * box.width;
    const half = readout!.offsetWidth / 2;
    readout!.style.left = `${Math.min(Math.max(px - half, 0), Math.max(box.width - readout!.offsetWidth, 0))}px`;
  }

  function indexFromClientX(clientX: number): number {
    const box = plot!.getBoundingClientRect();
    if (box.width === 0) return -1;
    const ratio = Math.min(Math.max((clientX - box.left) / box.width, 0), 1);
    return Math.round(ratio * (values().length - 1));
  }

  root.querySelectorAll<HTMLElement>('[data-range-pill]').forEach((pill) => {
    pill.addEventListener('click', () => selectRange(pill.dataset.rangePill!));
  });

  plot.addEventListener('pointermove', (e) => showCursor(indexFromClientX(e.clientX)));
  plot.addEventListener('pointerleave', hideCursor);

  // Keyboard: the plot is focusable so arrows can walk the series.
  plot.setAttribute('tabindex', '0');
  plot.addEventListener('keydown', (e) => {
    const list = values();
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const start = cursor === -1 ? (e.key === 'ArrowRight' ? -1 : list.length) : cursor;
      showCursor(start + (e.key === 'ArrowRight' ? 1 : -1));
    } else if (e.key === 'Home') { e.preventDefault(); showCursor(0); }
    else if (e.key === 'End') { e.preventDefault(); showCursor(list.length - 1); }
    else if (e.key === 'Escape') hideCursor();
  });
  plot.addEventListener('blur', hideCursor);

  // The desk lives outside the figure, so its toggle arrives on the document.
  document.addEventListener('price-variant-change', (e) => {
    variant = (e as CustomEvent<{ variantId: string }>).detail.variantId;
    applyPaths();
  });

  // The story rail asks for a span to be highlighted.
  document.addEventListener('price-act-change', (e) => {
    if (!band) return;
    const detail = (e as CustomEvent<{ from: string; to: string } | null>).detail;
    // The band is drawn on whichever range is showing, so it uses that range's
    // own date column — not a fixed one.
    const days = dates();
    if (!detail || days.length === 0) { band.style.opacity = '0'; return; }
    const last = days.length - 1;
    const at = (d: string, fallback: number) => {
      const i = days.findIndex((x) => x >= d);
      return i === -1 ? fallback : (i / last) * W;
    };
    const x1 = at(detail.from, 0);
    const x2 = at(detail.to, W);
    band.setAttribute('x', String(Math.min(x1, x2)));
    band.setAttribute('width', String(Math.max(Math.abs(x2 - x1), 1)));
    band.style.opacity = '1';
  });

  selectRange(range);
}

export function initPriceCharts(): void {
  document.querySelectorAll<HTMLElement>('[data-price-chart]').forEach((root) => {
    if (root.dataset.chartReady === '1') return;   // idempotent
    root.dataset.chartReady = '1';
    initChart(root);
  });
  initLineReveal();
}

/**
 * Desk toggles. Emits `price-variant-change` for the chart to hear, and
 * recomputes its own figure locally — a unit factor is a linear scale, so no new
 * data is needed to relabel from grams to pavan.
 */
export function initPriceDesks(): void {
  document.querySelectorAll<HTMLElement>('[data-price-desk]').forEach((desk) => {
    if (desk.dataset.deskReady === '1') return;
    desk.dataset.deskReady = '1';

    const dataEl = desk.querySelector<HTMLScriptElement>('[data-desk-data]');
    const valueEl = desk.querySelector<HTMLElement>('[data-desk-value]');
    const changeEl = desk.querySelector<HTMLElement>('[data-desk-change]');
    const glyphEl = desk.querySelector<HTMLElement>('[data-desk-glyph]');
    const wordEl = desk.querySelector<HTMLElement>('[data-desk-word]');
    const unitEl = desk.querySelector<HTMLElement>('[data-unit-label]');
    if (!dataEl || !valueEl || !unitEl) return;

    const { precision, readings } = JSON.parse(dataEl.textContent || '{}') as {
      precision: number;
      readings: { variantId: string; base: number | null; change: number }[];
    };
    const fmt = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: precision, maximumFractionDigits: precision,
    });
    const scale = (n: number, factor: number) =>
      Math.round(n * factor * 10 ** precision) / 10 ** precision;

    let variantId = readings[0]?.variantId ?? '';
    let factor = 1;
    let unitLabel = unitEl.textContent ?? '';

    function render(): void {
      const r = readings.find((x) => x.variantId === variantId);
      valueEl!.textContent = r?.base == null ? '₹—' : `₹${fmt.format(scale(r.base, factor))}`;
      unitEl!.textContent = unitLabel;
      if (!r || !changeEl) return;
      const change = scale(r.change, factor);
      changeEl.textContent = `₹${fmt.format(Math.abs(change))}`;
      // Direction is a glyph and a word — never a second hue. No red anywhere.
      if (glyphEl) glyphEl.textContent = change > 0 ? '▲' : change < 0 ? '▼' : '—';
      if (wordEl) wordEl.textContent = change > 0 ? 'up' : change < 0 ? 'down' : 'unchanged';
    }

    function press(group: string, active: HTMLElement): void {
      desk.querySelectorAll<HTMLElement>(`[data-${group}-pill]`).forEach((b) => {
        b.setAttribute('aria-pressed', String(b === active));
      });
    }

    desk.querySelectorAll<HTMLElement>('[data-variant-pill]').forEach((pill) => {
      pill.addEventListener('click', () => {
        variantId = pill.dataset.variantPill!;
        press('variant', pill);
        render();
        document.dispatchEvent(new CustomEvent('price-variant-change', {
          detail: { variantId },
        }));
      });
    });

    desk.querySelectorAll<HTMLElement>('[data-unit-pill]').forEach((pill) => {
      pill.addEventListener('click', () => {
        factor = Number(pill.dataset.unitFactor ?? 1);
        unitLabel = pill.dataset.unitLabel ?? pill.textContent?.trim() ?? '';
        press('unit', pill);
        render();
      });
    });
  });
}

/**
 * Drives the story rail: an act near the middle of the viewport becomes active
 * and asks the chart to highlight the span it describes.
 *
 * Under reduced motion every act is shown at full opacity and no observer runs —
 * a reader who asked for less motion should not have to scroll to reveal text.
 */
export function initStoryRail(): void {
  document.querySelectorAll<HTMLElement>('[data-story-rail]').forEach((rail) => {
    if (rail.dataset.railReady === '1') return;
    rail.dataset.railReady = '1';

    const acts = Array.from(rail.querySelectorAll<HTMLElement>('[data-act]'));
    if (acts.length === 0) return;

    if (REDUCED()) {
      acts.forEach((a) => a.classList.add('is-active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const act = entry.target as HTMLElement;
        act.classList.toggle('is-active', entry.isIntersecting);
        if (entry.isIntersecting) {
          document.dispatchEvent(new CustomEvent('price-act-change', {
            detail: { from: act.dataset.actFrom, to: act.dataset.actTo },
          }));
        }
      }
    }, { rootMargin: '-40% 0px -40% 0px' });

    acts.forEach((a) => observer.observe(a));
  });
}

/**
 * Draw the line in once, the first time a chart is seen.
 *
 * `stroke-dashoffset` is animated rather than any layout property, per the
 * repo's motion rule. 600ms is a reveal, not feedback, so it sits outside the
 * 200ms feedback budget deliberately.
 */
export function initLineReveal(): void {
  if (REDUCED()) return;

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const path = entry.target as SVGPathElement;
      obs.unobserve(path);
      const length = path.getTotalLength();
      if (!length) continue;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      requestAnimationFrame(() => {
        path.style.transition = 'stroke-dashoffset 600ms ease-out';
        path.style.strokeDashoffset = '0';
      });
    }
  }, { threshold: 0.2 });

  document.querySelectorAll<SVGPathElement>('[data-range-path]').forEach((p) => {
    if (p.style.visibility !== 'hidden' && !p.dataset.revealed) {
      p.dataset.revealed = '1';
      observer.observe(p);
    }
  });
}
