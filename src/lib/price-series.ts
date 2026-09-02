// The commodity price contract. Gold is one instance; silver, fuel, plantation
// crops and currency are others. Nothing here knows about any of them.
//
// This module must stay importable in a plain Node test — no DOM, no Astro.
// Anything that needs `document` belongs in lib/price-chart.ts instead.

export type VariantId = string;

/** A comparable line within one series: 22K/24K, petrol/diesel, a city, a pair. */
export interface Variant {
  id: VariantId;
  label: string;
  labelML: string;
}

/** A reader-switchable display unit. `factor` multiplies the stored base unit. */
export interface Unit {
  id: string;
  label: string;
  labelML: string;
  factor: number;
}

export interface PricePoint {
  /** ISO yyyy-mm-dd. */
  date: string;
  /** In the stored base unit. A variant absent here is a real gap, not a zero. */
  values: Partial<Record<VariantId, number>>;
}

export type RangeId = '1W' | '1M' | '1Y' | '5Y' | 'ALL';

export interface PriceSeries {
  id: string;
  variants: Variant[];
  /** First entry is the default. */
  units: Unit[];
  granularity: 'daily' | 'weekly' | 'intraday';
  /** Decimal places. Gold 0, currency 2. */
  precision: number;
  /** Ascending by date. */
  points: PricePoint[];
}

/** Indian digit grouping — 1,10,920 rather than 110,920. */
export function formatINR(value: number, precision: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function toUnit(baseValue: number, unit: Unit, precision: number): number {
  const scaled = baseValue * unit.factor;
  const p = 10 ** precision;
  return Math.round(scaled * p) / p;
}

/**
 * An SVG path for one variant across `points`, in a `width` x `height` box.
 *
 * A point missing the variant starts a new subpath rather than being skipped:
 * drawing a straight line across a gap would invent prices that were never
 * quoted. A flat series sits mid-box rather than dividing by zero.
 */
export function buildPath(
  points: PricePoint[],
  variantId: VariantId,
  width: number,
  height: number,
  min: number,
  max: number,
): string {
  if (points.length === 0) return '';
  const span = max - min;
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;
  let d = '';
  let penDown = false;

  points.forEach((p, i) => {
    const v = p.values[variantId];
    if (typeof v !== 'number') {
      penDown = false;
      return;
    }
    const x = round(i * stepX);
    const y = round(span === 0 ? height / 2 : height - ((v - min) / span) * height);
    d += `${penDown ? 'L' : 'M'}${x},${y}`;
    penDown = true;
  });

  return d;
}

/** Two decimals is below one device pixel at these sizes, and halves the markup. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Thin a long series for drawing, keeping every extreme.
 *
 * Buckets the interior and keeps each bucket's highest and lowest point, so a
 * record high can never be thinned away — which matters more on a price chart
 * than a smooth curve does. LTTB draws a prettier line but guarantees nothing
 * about extremes, and quietly clipping a record is a correctness bug here, not
 * an aesthetic one. First and last points are always kept.
 */
export function downsample(
  points: PricePoint[],
  variantId: VariantId,
  maxPoints: number,
): PricePoint[] {
  if (points.length <= maxPoints) return points;

  const buckets = Math.max(1, Math.floor((maxPoints - 2) / 2));
  const interior = points.slice(1, -1);
  const size = interior.length / buckets;
  const kept: PricePoint[] = [points[0]];

  for (let b = 0; b < buckets; b++) {
    const from = Math.floor(b * size);
    const slice = interior.slice(from, Math.floor((b + 1) * size));
    let lo: PricePoint | null = null;
    let hi: PricePoint | null = null;
    let loAt = -1;
    let hiAt = -1;

    slice.forEach((p, i) => {
      const v = p.values[variantId];
      if (typeof v !== 'number') return;
      if (lo === null || v < (lo.values[variantId] as number)) { lo = p; loAt = i; }
      if (hi === null || v > (hi.values[variantId] as number)) { hi = p; hiAt = i; }
    });

    // Emit in the order they occur, so the path never doubles back on itself.
    const ordered = (loAt <= hiAt ? [lo, hi] : [hi, lo])
      .filter((p): p is PricePoint => p !== null);
    for (const p of ordered) if (!kept.includes(p)) kept.push(p);
  }

  kept.push(points[points.length - 1]);
  return kept;
}

export interface SeriesStats {
  min: number;
  max: number;
  first: number;
  last: number;
  change: number;
  changePercent: number;
}

/** Calendar-aware start of a range, counted back from the anchor date. */
function rangeStart(anchor: string, range: RangeId): string | null {
  if (range === 'ALL') return null;
  const d = new Date(`${anchor}T00:00:00Z`);
  if (range === '1W') d.setUTCDate(d.getUTCDate() - 7);
  if (range === '1M') d.setUTCMonth(d.getUTCMonth() - 1);
  if (range === '1Y') d.setUTCFullYear(d.getUTCFullYear() - 1);
  if (range === '5Y') d.setUTCFullYear(d.getUTCFullYear() - 5);
  return d.toISOString().slice(0, 10);
}

/**
 * The slice of `series` covered by `range`, anchored on the series' own last
 * point. ISO dates compare correctly as strings, so no parsing is needed here.
 *
 * Anchoring on the data rather than on `Date.now()` is deliberate: the series is
 * baked at build time, so a clock anchor would silently empty the chart the
 * moment a scrape went stale.
 */
export function windowSeries(series: PriceSeries, range: RangeId): PricePoint[] {
  if (series.points.length === 0) return [];
  const anchor = series.points[series.points.length - 1].date;
  const start = rangeStart(anchor, range);
  if (start === null) return series.points;
  return series.points.filter((p) => p.date >= start);
}

/** Null when the variant is absent throughout — the caller must handle it. */
export function stats(points: PricePoint[], variantId: VariantId): SeriesStats | null {
  const values: number[] = [];
  for (const p of points) {
    const v = p.values[variantId];
    if (typeof v === 'number') values.push(v);
  }
  if (values.length === 0) return null;

  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    first,
    last,
    change,
    changePercent: first === 0 ? 0 : (change / first) * 100,
  };
}
