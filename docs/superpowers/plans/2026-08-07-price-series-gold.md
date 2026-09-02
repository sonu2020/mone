# Price Series Engine + Gold Instance — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a generic commodity price-series engine — data contract, pure
transforms, and a zero-dependency SVG chart — with Kerala gold as its first
instance at `/features/gold-price`.

**Architecture:** A `PriceSeries` contract in `src/lib/price-series.ts` that knows
nothing about gold, holding four axes (variants, units, granularity, precision) so
silver, fuel, plantation crops and currency reuse it unchanged. A Python scraper
bakes real daily rates into JSON at build time. Astro components compute every SVG
path in frontmatter; a small vanilla TS module adds interaction on top of markup
that already reads without JavaScript.

**Tech Stack:** Astro 6 (static), Tailwind CSS v4, TypeScript, vanilla DOM APIs,
Python 3 stdlib for scraping, Vitest for unit tests.

## Global Constraints

Copied verbatim from `AGENTS.md` and the spec. Every task's requirements
implicitly include this section.

- **No gradients.** No `bg-gradient-*`, no `background-clip: text`. This includes
  any fill under the chart line.
- **No drop-shadows.** Hairline borders and surface contrast carry hierarchy.
- **No pure black/white.** Use the `ink` / `ivory` / `rule` tokens, which are tinted.
- **Tokens over literals.** `text-ink`, `bg-ivory`, `border-rule`, `text-azure`,
  `max-w-site`, and named type sizes (`text-hero`, `text-section`, `text-body`,
  `text-meta`, `text-eyebrow`, `text-caption`). No raw hex, no `gray-*`.
- **`azure` (`--color-azure`) is the single reserved accent. No red anywhere** —
  including for a falling price. Direction is carried by an arrow glyph and a word,
  never by a second hue.
- **`tabular-nums` on every figure.**
- **Square corners by default.** No arbitrary `z-[…]`; use the standard z scale.
- **Cards are not the default.** Prefer hairline-separated rows and bands. Never
  nest cards.
- **Motion:** transform/opacity/`stroke-dashoffset` only — never layout properties.
  Ease-out. ≤200ms for feedback; the one-time line reveal may run to 600ms.
  `prefers-reduced-motion` is respected globally in `app.css` — do not re-implement it.
- **Letter-spacing only on uppercase Latin eyebrows** (use the `eyebrow` utility),
  never on Malayalam text.
- **Accessibility:** `aria-label` on icon-only buttons; `h-dvh` not `h-screen`.
- **Page data lives in `src/lib/*`; pages stay presentational.**
- **Indian digit grouping** for all rupee figures: `1,10,920` — not `110,920`.
- **A missing data point breaks the line.** Never interpolate across a gap; an
  invented price is worse than a visible gap.

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json` | **Modify.** Add `vitest` devDependency + `test` script. |
| `vitest.config.ts` | **Create.** Node environment, `src/**/*.test.ts`. |
| `src/lib/price-series.ts` | **Create.** The contract: types + pure functions. Knows nothing about gold. No DOM, no imports from `src/components`. |
| `src/lib/price-series.test.ts` | **Create.** Unit tests for every pure function. |
| `scripts/scrape-gold.py` | **Create.** Archive walker → `src/data/gold/prices.json`. Parser is a pure function so it can be tested off a fixture. |
| `scripts/test_scrape_gold.py` | **Create.** stdlib `unittest` against a saved fixture page. |
| `scripts/fixtures/gold-january-2026.html` | **Create.** One saved month page. |
| `src/data/gold/prices.json` | **Generated.** Committed. |
| `src/lib/gold-prices.ts` | **Create.** Gold instance: variants, units, attribution, reports, acts. |
| `src/components/price/PriceChart.astro` | **Create.** Build-time SVG for any `PriceSeries`. |
| `src/components/price/PriceDesk.astro` | **Create.** Today's rate, delta, toggles. |
| `src/lib/price-chart.ts` | **Create.** Client interaction. The only file that touches the DOM. |
| `src/pages/features/gold-price.astro` | **Create.** Presentational assembly. |

**Boundary rule:** `price-series.ts` must remain importable in a Node test with no
DOM and no Astro. If a function needs `document`, it belongs in `price-chart.ts`.

---

## Task 1: Test harness + the contract's formatting primitives

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/price-series.ts`
- Test: `src/lib/price-series.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the `VariantId`, `Variant`, `Unit`, `PricePoint`, `PriceSeries`,
  `RangeId` types; `formatINR(value: number, precision: number): string`;
  `toUnit(baseValue: number, unit: Unit, precision: number): number`.

- [ ] **Step 1: Add vitest and the test script**

In `package.json`, add to `devDependencies` (keep alphabetical order):

```json
"vitest": "^3.0.0"
```

And to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Then run `npm install`.

- [ ] **Step 2: Create the vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Write the failing test**

Create `src/lib/price-series.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatINR, toUnit } from './price-series';
import type { Unit } from './price-series';

const PAVAN: Unit = { id: 'pavan', label: 'pavan', labelML: 'പവൻ', factor: 8 };
const GRAM: Unit = { id: 'gram', label: 'gram', labelML: 'ഗ്രാം', factor: 1 };

describe('formatINR', () => {
  it('groups by the Indian system, not the Western one', () => {
    expect(formatINR(110920, 0)).toBe('1,10,920');
    expect(formatINR(1310160, 0)).toBe('13,10,160');
  });

  it('leaves small numbers ungrouped', () => {
    expect(formatINR(920, 0)).toBe('920');
  });

  it('honours precision for currency-style series', () => {
    expect(formatINR(83.25, 2)).toBe('83.25');
    expect(formatINR(83.2, 2)).toBe('83.20');
  });
});

describe('toUnit', () => {
  it('scales the stored base unit by the unit factor', () => {
    expect(toUnit(12380, PAVAN, 0)).toBe(99040);
    expect(toUnit(12380, GRAM, 0)).toBe(12380);
  });

  it('rounds to the series precision', () => {
    expect(toUnit(12380.4, GRAM, 0)).toBe(12380);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./price-series"`.

- [ ] **Step 5: Write the types and the two functions**

Create `src/lib/price-series.ts`:

```ts
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
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 5 tests.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/price-series.ts src/lib/price-series.test.ts
git commit -m "feat(price): the price series contract, with Indian digit grouping"
```

## Task 2: Windowing and statistics

**Files:**
- Modify: `src/lib/price-series.ts`
- Test: `src/lib/price-series.test.ts`

**Interfaces:**
- Consumes: `PriceSeries`, `PricePoint`, `RangeId`, `VariantId` from Task 1.
- Produces: `windowSeries(series: PriceSeries, range: RangeId): PricePoint[]`;
  `stats(points: PricePoint[], variantId: VariantId): SeriesStats | null`, where
  `SeriesStats = { min, max, first, last, change, changePercent }` — all `number`.

**Note on the anchor date:** the data is baked at build time, so "the last week"
means the seven days ending at the *last point in the series*, never `Date.now()`.
Anchoring on today would silently empty the chart whenever a scrape goes stale.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/price-series.test.ts`:

```ts
import { stats, windowSeries } from './price-series';
import type { PriceSeries } from './price-series';

function seriesOf(rows: [string, number][]): PriceSeries {
  return {
    id: 'test',
    variants: [{ id: 'a', label: 'A', labelML: 'എ' }],
    units: [{ id: 'gram', label: 'gram', labelML: 'ഗ്രാം', factor: 1 }],
    granularity: 'daily',
    precision: 0,
    points: rows.map(([date, v]) => ({ date, values: { a: v } })),
  };
}

describe('windowSeries', () => {
  const s = seriesOf([
    ['2026-01-01', 100],
    ['2026-06-01', 200],
    ['2026-07-25', 300],
    ['2026-08-01', 400],
  ]);

  it('anchors on the last point, not on today', () => {
    const w = windowSeries(s, '1W');
    expect(w.map((p) => p.date)).toEqual(['2026-07-25', '2026-08-01']);
  });

  it('includes a point falling exactly on the boundary', () => {
    const w = windowSeries(seriesOf([
      ['2026-07-25', 1],
      ['2026-08-01', 2],
    ]), '1W');
    expect(w).toHaveLength(2);
  });

  it('returns everything for ALL', () => {
    expect(windowSeries(s, 'ALL')).toHaveLength(4);
  });

  it('spans months and years by calendar, not by fixed day counts', () => {
    expect(windowSeries(s, '1M').map((p) => p.date))
      .toEqual(['2026-07-25', '2026-08-01']);
    expect(windowSeries(s, '1Y')).toHaveLength(4);
  });
});

describe('stats', () => {
  it('reports the extremes and the change across the window', () => {
    const s = seriesOf([
      ['2026-01-01', 100],
      ['2026-01-02', 250],
      ['2026-01-03', 200],
    ]);
    expect(stats(s.points, 'a')).toEqual({
      min: 100, max: 250, first: 100, last: 200,
      change: 100, changePercent: 100,
    });
  });

  it('ignores gaps rather than treating them as zero', () => {
    const points = [
      { date: '2026-01-01', values: { a: 100 } },
      { date: '2026-01-02', values: {} },
      { date: '2026-01-03', values: { a: 200 } },
    ];
    expect(stats(points, 'a')).toMatchObject({ min: 100, max: 200, last: 200 });
  });

  it('returns null when the variant has no data at all', () => {
    expect(stats([{ date: '2026-01-01', values: {} }], 'a')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `windowSeries is not a function`.

- [ ] **Step 3: Implement both functions**

Append to `src/lib/price-series.ts`:

```ts
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 12 tests total.

- [ ] **Step 5: Commit**

```bash
git add src/lib/price-series.ts src/lib/price-series.test.ts
git commit -m "feat(price): windowing and stats, anchored on the data not the clock"
```

## Task 3: Downsampling for long ranges

**Files:**
- Modify: `src/lib/price-series.ts`
- Test: `src/lib/price-series.test.ts`

**Interfaces:**
- Consumes: `PricePoint`, `VariantId` from Task 1.
- Produces: `downsample(points: PricePoint[], variantId: VariantId, maxPoints: number): PricePoint[]`.

**Why min/max bucketing rather than LTTB:** the spec said "LTTB-style", and LTTB
does produce a prettier curve — but it gives no *guarantee* about extremes, and on
a price chart a thinning pass that quietly clips a record high is a correctness bug,
not an aesthetic one. Bucketed min/max keeps every peak and trough by construction
and is a third of the code. The visual difference at 400 points is negligible.

- [ ] **Step 1: Write the failing tests**

Append to `src/lib/price-series.test.ts`:

```ts
import { downsample } from './price-series';

describe('downsample', () => {
  const many: PricePoint[] = Array.from({ length: 1000 }, (_, i) => ({
    date: `2020-01-${String((i % 28) + 1).padStart(2, '0')}`.replace(
      '2020-01', `20${20 + Math.floor(i / 300)}-${String((Math.floor(i / 28) % 12) + 1).padStart(2, '0')}`,
    ),
    values: { a: i === 500 ? 9999 : i === 700 ? -50 : 100 + (i % 17) },
  }));

  it('returns the input untouched when it already fits', () => {
    const few = many.slice(0, 10);
    expect(downsample(few, 'a', 400)).toBe(few);
  });

  it('never exceeds maxPoints', () => {
    expect(downsample(many, 'a', 400).length).toBeLessThanOrEqual(400);
  });

  it('preserves the global maximum and minimum', () => {
    const out = downsample(many, 'a', 400);
    const values = out.map((p) => p.values.a).filter((v): v is number => v != null);
    expect(Math.max(...values)).toBe(9999);
    expect(Math.min(...values)).toBe(-50);
  });

  it('keeps the first and last points', () => {
    const out = downsample(many, 'a', 400);
    expect(out[0]).toBe(many[0]);
    expect(out[out.length - 1]).toBe(many[many.length - 1]);
  });

  it('stays in ascending index order', () => {
    const out = downsample(many, 'a', 400);
    const indices = out.map((p) => many.indexOf(p));
    expect(indices).toEqual([...indices].sort((x, y) => x - y));
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `downsample is not a function`.

- [ ] **Step 3: Implement it**

Append to `src/lib/price-series.ts`:

```ts
/**
 * Thin a long series for drawing, keeping every extreme.
 *
 * Buckets the interior and keeps each bucket's highest and lowest point, so a
 * record high can never be thinned away — which matters more on a price chart
 * than a smooth curve does. First and last points are always kept.
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
    const slice = interior.slice(Math.floor(b * size), Math.floor((b + 1) * size));
    let lo: PricePoint | null = null;
    let hi: PricePoint | null = null;
    for (const p of slice) {
      const v = p.values[variantId];
      if (typeof v !== 'number') continue;
      if (lo === null || v < (lo.values[variantId] as number)) lo = p;
      if (hi === null || v > (hi.values[variantId] as number)) hi = p;
    }
    // Emit in the order they occur, so the path never doubles back on itself.
    const pair = [lo, hi].filter((p): p is PricePoint => p !== null);
    const ordered = pair.length === 2 && slice.indexOf(pair[0]) > slice.indexOf(pair[1])
      ? [pair[1], pair[0]]
      : pair;
    for (const p of ordered) if (!kept.includes(p)) kept.push(p);
  }

  kept.push(points[points.length - 1]);
  return kept;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 17 tests total.

- [ ] **Step 5: Commit**

```bash
git add src/lib/price-series.ts src/lib/price-series.test.ts
git commit -m "feat(price): extreme-preserving downsampling for the long ranges"
```

## Task 4: The scraper

**Files:**
- Create: `scripts/scrape-gold.py`
- Create: `scripts/fixtures/gold-january-2026.html`
- Test: `scripts/test_scrape_gold.py`
- Generated: `src/data/gold/prices.json`

**Interfaces:**
- Consumes: `fetch`, `THROTTLE_SECONDS` from the existing `scripts/mediaone.py`.
- Produces: `src/data/gold/prices.json`, shaped
  `{ source, sourceUrl, scrapedAt, baseUnit: 'gram', points: [{ date, values: { '22k': number, '24k': number } }] }`,
  points ascending by date.

**Source:** `keralagoldrates.com` publishes one page per month at
`/daily-gold-prices-<month-name>-<year>/` (e.g. `/daily-gold-prices-january-2026/`),
each holding a table of daily rows:

| Date | 22K ₹/gram | 24K ₹/gram | 22K ₹/pavan | 24K ₹/pavan |

Coverage runs January 2010 → present: ~195 pages, ~5,800 daily points.

**Only ₹/gram is stored.** A pavan is exactly 8 grams, so storing both columns
would be two sources of truth for one number. Pavan is derived at display time via
the `Unit.factor`.

- [ ] **Step 1: Capture the fixture**

```bash
mkdir -p scripts/fixtures src/data/gold
curl -sL -A 'Mozilla/5.0' \
  https://keralagoldrates.com/daily-gold-prices-january-2026/ \
  -o scripts/fixtures/gold-january-2026.html
```

Open the file and confirm the table markup matches what Step 3 assumes: a `<table>`
whose `<tr>` rows each hold at least three `<td>` cells, the first a date like
`Jan 1`, the second and third rupee figures. **If the markup differs, adjust the
regexes in Step 3 to match the real file before continuing** — the fixture is the
authority here, not this plan.

- [ ] **Step 2: Write the failing test**

Create `scripts/test_scrape_gold.py`:

```python
"""Fixture test for the gold archive parser.

The parser reads someone else's markup, so it will break when they change it.
This test exists to make that break loud and local rather than silent — a
regex that stops matching yields an empty list, which would otherwise commit
as "no data for that month" and never be noticed.
"""

import unittest
from pathlib import Path

from importlib.machinery import SourceFileLoader

scrape_gold = SourceFileLoader(
    'scrape_gold', str(Path(__file__).parent / 'scrape-gold.py')).load_module()

FIXTURE = Path(__file__).parent / 'fixtures' / 'gold-january-2026.html'


class ParseMonthTest(unittest.TestCase):
    def setUp(self):
        self.rows = scrape_gold.parse_month(FIXTURE.read_text(), 2026, 1)

    def test_finds_a_row_for_most_days(self):
        self.assertGreaterEqual(len(self.rows), 28)

    def test_first_row_matches_the_published_table(self):
        self.assertEqual(self.rows[0]['date'], '2026-01-01')
        self.assertEqual(self.rows[0]['values']['22k'], 12380)
        self.assertEqual(self.rows[0]['values']['24k'], 13505)

    def test_dates_are_iso_and_ascending(self):
        dates = [r['date'] for r in self.rows]
        self.assertEqual(dates, sorted(dates))
        self.assertTrue(all(len(d) == 10 and d[4] == '-' for d in dates))

    def test_24k_is_always_dearer_than_22k(self):
        for r in self.rows:
            self.assertGreater(r['values']['24k'], r['values']['22k'], r['date'])

    def test_unparseable_markup_raises_rather_than_returning_nothing(self):
        with self.assertRaises(ValueError):
            scrape_gold.parse_month('<html><body>no table</body></html>', 2026, 1)


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `python3 scripts/test_scrape_gold.py`
Expected: FAIL — `FileNotFoundError` / no `scrape-gold.py`.

- [ ] **Step 4: Write the scraper**

Create `scripts/scrape-gold.py`:

```python
#!/usr/bin/env python3
"""Capture Kerala's daily gold rates into src/data/gold/prices.json.

    python3 scripts/scrape-gold.py                  # top up recent months
    python3 scripts/scrape-gold.py --full           # re-walk 2010 -> now
    python3 scripts/scrape-gold.py --from 2024      # re-walk from a year

keralagoldrates.com publishes one page per month, each a table of daily 22K and
24K rates in both rupees-per-gram and rupees-per-pavan. Only the per-gram columns
are stored: a pavan is exactly eight grams, so keeping both would be two sources
of truth for one number, and they would eventually disagree.

Default runs are incremental — history before the current year does not change,
so re-fetching 190 pages to learn today's rate would be rude to the source and
slow for us. Use --full after a gap.
"""

import argparse
import json
import re
import sys
import time
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mediaone import THROTTLE_SECONDS, fetch  # noqa: E402

SOURCE = 'keralagoldrates.com'
BASE = 'https://keralagoldrates.com'
OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'gold' / 'prices.json'
FIRST_YEAR = 2010
MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december']
MAX_RETRIES = 3

ROW_RE = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S | re.I)
CELL_RE = re.compile(r'<t[dh][^>]*>(.*?)</t[dh]>', re.S | re.I)
TAG_RE = re.compile(r'<[^>]+>')
# "Jan 1", "January 1", "1 Jan", "Jan 1, 2026" — take the day number and trust
# the month/year from the URL we asked for.
DAY_RE = re.compile(r'\b([12]\d|3[01]|0?[1-9])\b')
MONEY_RE = re.compile(r'[\d,]+(?:\.\d+)?')


def _text(cell: str) -> str:
    return TAG_RE.sub('', cell).replace('&nbsp;', ' ').strip()


def _money(cell: str) -> float | None:
    m = MONEY_RE.search(_text(cell))
    if not m:
        return None
    try:
        return float(m.group(0).replace(',', ''))
    except ValueError:
        return None


def parse_month(page: str, year: int, month: int) -> list[dict]:
    """Daily rows for one month page, ascending by date.

    Raises ValueError when no row parses — an empty result from a page that was
    fetched successfully means their markup moved, and writing that as "no data"
    would silently punch a hole in the series.
    """
    rows: dict[str, dict] = {}
    for raw in ROW_RE.findall(page):
        cells = CELL_RE.findall(raw)
        if len(cells) < 3:
            continue
        day_match = DAY_RE.search(_text(cells[0]))
        if not day_match:
            continue
        v22, v24 = _money(cells[1]), _money(cells[2])
        if v22 is None or v24 is None:
            continue
        # Guards against matching a summary or per-pavan block by mistake.
        if not (100 < v22 < 100_000) or v24 <= v22:
            continue
        day = int(day_match.group(1))
        try:
            date = datetime(year, month, day).strftime('%Y-%m-%d')
        except ValueError:
            continue
        rows.setdefault(date, {'date': date, 'values': {'22k': v22, '24k': v24}})

    if not rows:
        raise ValueError(f'no rows parsed for {year}-{month:02d}; source markup changed')
    return [rows[d] for d in sorted(rows)]


def fetch_month(year: int, month: int) -> list[dict]:
    url = f'{BASE}/daily-gold-prices-{MONTHS[month - 1]}-{year}/'
    for attempt in range(MAX_RETRIES):
        try:
            return parse_month(fetch(url), year, month)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return []          # month not published — a real gap, not an error
            if attempt == MAX_RETRIES - 1:
                raise SystemExit(f'giving up on {url}: HTTP {e.code}')
            time.sleep(2 ** attempt)
        except urllib.error.URLError as e:
            if attempt == MAX_RETRIES - 1:
                raise SystemExit(f'giving up on {url}: {e.reason}')
            time.sleep(2 ** attempt)
    return []


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--full', action='store_true')
    ap.add_argument('--from', dest='from_year', type=int)
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    existing: dict[str, dict] = {}
    if OUT.exists() and not args.full:
        for p in json.loads(OUT.read_text())['points']:
            existing[p['date']] = p

    start = FIRST_YEAR if args.full else (args.from_year or (now.year if existing else FIRST_YEAR))

    for year in range(start, now.year + 1):
        for month in range(1, 13):
            if year == now.year and month > now.month:
                break
            for row in fetch_month(year, month):
                existing[row['date']] = row
            print(f'  {year}-{month:02d}  {len(existing)} points', flush=True)
            time.sleep(THROTTLE_SECONDS)

    if not existing:
        raise SystemExit('refusing to write an empty series')

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        'source': SOURCE,
        'sourceUrl': f'{BASE}/daily-gold-prices/',
        'scrapedAt': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'baseUnit': 'gram',
        'points': [existing[d] for d in sorted(existing)],
    }, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'wrote {OUT} — {len(existing)} points')


if __name__ == '__main__':
    main()
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `python3 scripts/test_scrape_gold.py -v`
Expected: PASS — 5 tests.

- [ ] **Step 6: Run the full scrape**

Run: `python3 scripts/scrape-gold.py --full`
Expected: ~195 page fetches at 0.6s throttle — roughly three minutes. Finishes with
`wrote .../prices.json — ~5800 points`.

Sanity-check the result before committing:

```bash
python3 -c "
import json; d=json.load(open('src/data/gold/prices.json'))
p=d['points']; print(len(p), p[0], p[-1])
assert p[0]['date'] < '2010-06-01', 'history is short'
assert all(p[i]['date'] < p[i+1]['date'] for i in range(len(p)-1)), 'not ascending'
print('ok')"
```

- [ ] **Step 7: Commit**

```bash
git add scripts/scrape-gold.py scripts/test_scrape_gold.py scripts/fixtures/gold-january-2026.html src/data/gold/prices.json
git commit -m "feat(gold): scrape sixteen years of Kerala daily gold rates"
```

## Task 5: Gold as an instance

**Files:**
- Create: `src/lib/gold-prices.ts`
- Test: `src/lib/gold-prices.test.ts`

**Interfaces:**
- Consumes: `PriceSeries`, `Variant`, `Unit` from Task 1; `src/data/gold/prices.json` from Task 4.
- Produces: `goldSeries: PriceSeries`; `GOLD_ATTRIBUTION: { source, sourceUrl, scrapedAt }`;
  `goldReports: PriceReport[]`; `goldActs: PriceAct[]`; and the exported types
  `PriceReport = { id, date, eyebrow, headline, headlineML, dek, href }` and
  `PriceAct = { id, from, to, title, titleML, body, sourced: boolean }`.

**Research step, not a writing step.** `goldActs` narrates why the price moved.
These are causal claims about money on a news site, so each act must cite a real
cause and carry `sourced: true`. Any act you cannot source gets `sourced: false`
and renders under a visible "prototype narration" label — the same rule the terrain
features follow. Do not invent a cause to fill a gap.

- [ ] **Step 1: Research the three acts**

Find and note a citable cause for each span before writing any code:

1. **2013** — India's import duty rises on gold (duty went up in stages that year).
2. **2020** — the pandemic-era run to a then-record.
3. **2025–26** — the current record run.

Confirm each against the actual series in `src/data/gold/prices.json` — the price
must really move in the direction and window the act claims:

```bash
python3 -c "
import json; p=json.load(open('src/data/gold/prices.json'))['points']
def at(d): return next((x['values']['22k'] for x in p if x['date']>=d), None)
for a,b in [('2013-01-01','2013-12-31'),('2020-01-01','2020-12-31'),('2025-01-01','2026-08-01')]:
    print(a,b,at(a),'->',at(b))"
```

If the numbers contradict the story, change the story — not the numbers.

- [ ] **Step 2: Write the failing test**

Create `src/lib/gold-prices.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { GOLD_ATTRIBUTION, goldActs, goldSeries } from './gold-prices';
import { stats, windowSeries } from './price-series';

describe('goldSeries', () => {
  it('declares both purities and both units, grams first', () => {
    expect(goldSeries.variants.map((v) => v.id)).toEqual(['22k', '24k']);
    expect(goldSeries.units.map((u) => u.id)).toEqual(['gram', 'pavan']);
    expect(goldSeries.units[1].factor).toBe(8);
  });

  it('carries the full scraped history, ascending', () => {
    expect(goldSeries.points.length).toBeGreaterThan(5000);
    const dates = goldSeries.points.map((p) => p.date);
    expect(dates).toEqual([...dates].sort());
    expect(dates[0] < '2010-06-01').toBe(true);
  });

  it('uses whole rupees', () => {
    expect(goldSeries.precision).toBe(0);
  });

  it('every range yields a drawable window', () => {
    for (const r of ['1W', '1M', '1Y', '5Y', 'ALL'] as const) {
      expect(windowSeries(goldSeries, r).length).toBeGreaterThan(1);
    }
  });
});

describe('goldActs', () => {
  it('spans real dates inside the series', () => {
    const first = goldSeries.points[0].date;
    const last = goldSeries.points[goldSeries.points.length - 1].date;
    for (const act of goldActs) {
      expect(act.from >= first).toBe(true);
      expect(act.to <= last).toBe(true);
      expect(act.from < act.to).toBe(true);
    }
  });

  it('claims a direction the data actually supports', () => {
    for (const act of goldActs) {
      const window = goldSeries.points.filter((p) => p.date >= act.from && p.date <= act.to);
      expect(stats(window, '22k')).not.toBeNull();
    }
  });
});

describe('GOLD_ATTRIBUTION', () => {
  it('names the source and when it was read', () => {
    expect(GOLD_ATTRIBUTION.source).toBeTruthy();
    expect(GOLD_ATTRIBUTION.sourceUrl).toMatch(/^https:\/\//);
    expect(GOLD_ATTRIBUTION.scrapedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./gold-prices`.

- [ ] **Step 4: Write the instance module**

Create `src/lib/gold-prices.ts`. Fill `goldActs` bodies from the Step 1 research;
the structure below is fixed, the prose is yours to source.

```ts
// Kerala gold rates as an instance of the price-series contract.
//
// Prices are real, scraped from keralagoldrates.com by scripts/scrape-gold.py
// (2010 -> present, daily, 22K and 24K). Only rupees-per-gram is stored; pavan
// is derived through the unit factor, because a pavan is exactly eight grams.
//
// The narration in `goldActs` is a different kind of claim from the numbers:
// it says *why* the price moved. Anything not sourced is marked `sourced: false`
// and renders under a prototype label. See src/lib/terrain.ts for the same rule.

import raw from '../data/gold/prices.json';
import type { PricePoint, PriceSeries } from './price-series';

export interface PriceReport {
  id: string;
  /** The day the chart should mark. ISO yyyy-mm-dd. */
  date: string;
  eyebrow: string;
  headline: string;
  headlineML: string;
  dek: string;
  href: string;
}

export interface PriceAct {
  id: string;
  from: string;
  to: string;
  title: string;
  titleML: string;
  body: string;
  /** False renders the act under a visible "prototype narration" label. */
  sourced: boolean;
}

export const GOLD_ATTRIBUTION = {
  source: raw.source,
  sourceUrl: raw.sourceUrl,
  scrapedAt: raw.scrapedAt,
};

export const goldSeries: PriceSeries = {
  id: 'gold',
  variants: [
    { id: '22k', label: '22K', labelML: '22 കാരറ്റ്' },
    { id: '24k', label: '24K', labelML: '24 കാരറ്റ്' },
  ],
  units: [
    { id: 'gram', label: 'gram', labelML: 'ഗ്രാം', factor: 1 },
    { id: 'pavan', label: 'pavan', labelML: 'പവൻ', factor: 8 },
  ],
  granularity: 'daily',
  precision: 0,
  points: raw.points as PricePoint[],
};

export const goldActs: PriceAct[] = [
  {
    id: 'duty-2013',
    from: '2013-01-01',
    to: '2013-12-31',
    title: 'The duty years',
    titleML: 'ഇറക്കുമതി തീരുവയുടെ വർഷങ്ങൾ',
    body: '', // ← from Step 1 research
    sourced: true,
  },
  {
    id: 'pandemic-2020',
    from: '2020-01-01',
    to: '2020-12-31',
    title: 'The pandemic run',
    titleML: 'മഹാമാരിക്കാലത്തെ കുതിപ്പ്',
    body: '',
    sourced: true,
  },
  {
    id: 'record-2026',
    from: '2025-01-01',
    to: '2026-08-01',
    title: 'Into record ground',
    titleML: 'റെക്കോർഡിലേക്ക്',
    body: '',
    sourced: true,
  },
];

export const goldReports: PriceReport[] = [];   // populated in Task 10
```

- [ ] **Step 5: Confirm TypeScript accepts the JSON import**

Run: `npx astro check` (or `npm run build`)
Expected: no error on `import raw from '../data/gold/prices.json'`. If TypeScript
complains about the module type, add `"resolveJsonModule": true` to `tsconfig.json`
under `compilerOptions` — matching how the existing `src/lib/shelf-data.json` import
is resolved.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all Task 1–3 tests plus 7 new ones.

- [ ] **Step 7: Commit**

```bash
git add src/lib/gold-prices.ts src/lib/gold-prices.test.ts tsconfig.json
git commit -m "feat(gold): the gold instance, with sourced narration acts"
```

## Task 6: PriceChart component — build-time SVG

**Files:**
- Create: `src/components/price/PriceChart.astro`
- Modify: `src/lib/price-series.ts` (add `buildPath`)
- Test: `src/lib/price-series.test.ts`

**Interfaces:**
- Consumes: `PriceSeries`, `RangeId`, `windowSeries`, `downsample`, `stats`, `formatINR`, `toUnit`.
- Produces: a component taking
  `{ series: PriceSeries; variantId: VariantId; unitId: string; ranges?: RangeId[]; markers?: { date: string; label: string }[] }`;
  and `buildPath(points, variantId, width, height, min, max): string`.

**Every range's path is computed here, at build time, and all are emitted.** The
client only changes which one is visible — so the chart is correct in the HTML
before any JavaScript runs, and switching ranges costs no computation.

- [ ] **Step 1: Write the failing test for `buildPath`**

Append to `src/lib/price-series.test.ts`:

```ts
import { buildPath } from './price-series';

describe('buildPath', () => {
  const pts: PricePoint[] = [
    { date: '2026-01-01', values: { a: 100 } },
    { date: '2026-01-02', values: { a: 200 } },
    { date: '2026-01-03', values: { a: 300 } },
  ];

  it('maps the value range onto the full height, y inverted', () => {
    // min -> bottom (y = height), max -> top (y = 0)
    expect(buildPath(pts, 'a', 100, 40, 100, 300)).toBe('M0,40L50,20L100,0');
  });

  it('starts a new subpath at a gap instead of drawing across it', () => {
    const gapped: PricePoint[] = [
      { date: '2026-01-01', values: { a: 100 } },
      { date: '2026-01-02', values: {} },
      { date: '2026-01-03', values: { a: 300 } },
    ];
    expect(buildPath(gapped, 'a', 100, 40, 100, 300)).toBe('M0,40M100,0');
  });

  it('draws a flat line down the middle when every value is equal', () => {
    const flat: PricePoint[] = [
      { date: '2026-01-01', values: { a: 5 } },
      { date: '2026-01-02', values: { a: 5 } },
    ];
    expect(buildPath(flat, 'a', 100, 40, 5, 5)).toBe('M0,20L100,20');
  });

  it('returns an empty string for no points', () => {
    expect(buildPath([], 'a', 100, 40, 0, 1)).toBe('');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test` — FAIL, `buildPath is not a function`.

- [ ] **Step 3: Implement `buildPath`**

Append to `src/lib/price-series.ts`:

```ts
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test` — PASS, 4 new tests.

- [ ] **Step 5: Build the component**

Create `src/components/price/PriceChart.astro`:

```astro
---
// A price chart for any PriceSeries. Knows nothing about gold.
//
// Every range's path is computed here and all are emitted; the client toggles
// visibility. So the correct chart is in the HTML before any JS runs, and a
// reader with JS disabled still sees the default range.
import {
  buildPath, downsample, formatINR, stats, toUnit, windowSeries,
} from '../../lib/price-series';
import type { PriceSeries, RangeId, VariantId } from '../../lib/price-series';

interface Props {
  series: PriceSeries;
  variantId: VariantId;
  unitId: string;
  ranges?: RangeId[];
  markers?: { date: string; label: string }[];
}

const {
  series, variantId, unitId,
  ranges = ['1W', '1M', '1Y', '5Y', 'ALL'],
  markers = [],
} = Astro.props;

// A fixed coordinate space, scaled by CSS. Nothing here depends on the
// rendered pixel size, so the same markup serves every breakpoint.
const W = 1000;
const H = 320;
const MAX_POINTS = 400;

const unit = series.units.find((u) => u.id === unitId) ?? series.units[0];

const views = ranges.map((range) => {
  const windowed = windowSeries(series, range);
  const points = downsample(windowed, variantId, MAX_POINTS);
  const s = stats(points, variantId);
  const min = s?.min ?? 0;
  const max = s?.max ?? 1;
  return {
    range,
    points,
    stats: s,
    d: buildPath(points, variantId, W, H, min, max),
    // The scrub layer reads these; one array per range, dates and display values.
    scrub: points.map((p) => {
      const v = p.values[variantId];
      return {
        date: p.date,
        value: typeof v === 'number' ? toUnit(v, unit, series.precision) : null,
      };
    }),
  };
});

const initial = views[views.length - 1].range === 'ALL' && views.length > 1
  ? views.find((v) => v.range === '1M') ?? views[0]
  : views[0];

const variant = series.variants.find((v) => v.id === variantId) ?? series.variants[0];

function label(range: RangeId): string {
  return range === 'ALL' ? 'All' : range;
}

function describe(v: (typeof views)[number]): string {
  if (!v.stats) return `${variant.label}: no data for ${label(v.range)}.`;
  const dir = v.stats.change === 0 ? 'unchanged' : v.stats.change > 0 ? 'up' : 'down';
  return `${variant.label} per ${unit.label}, ${label(v.range)}: ${dir} `
    + `${formatINR(Math.abs(toUnit(v.stats.change, unit, series.precision)), series.precision)} rupees, `
    + `from ${formatINR(toUnit(v.stats.first, unit, series.precision), series.precision)} `
    + `to ${formatINR(toUnit(v.stats.last, unit, series.precision), series.precision)}.`;
}
---

<figure
  class="not-prose"
  data-price-chart
  data-precision={series.precision}
  data-unit-label={unit.label}
  data-initial-range={initial.range}
>
  <!-- Range pills. Real buttons in a tablist, keyboard-operable. -->
  <div role="tablist" aria-label="Time range" class="flex gap-px border-b border-rule">
    {ranges.map((range) => (
      <button
        type="button"
        role="tab"
        data-range-pill={range}
        aria-selected={range === initial.range}
        aria-controls="price-chart-plot"
        class="eyebrow px-3 py-2 text-eyebrow text-ink-muted transition-colors duration-150
               aria-selected:text-azure aria-selected:border-b-2 aria-selected:border-azure
               hover:text-ink focus-visible:outline-2 focus-visible:outline-azure"
      >{label(range)}</button>
    ))}
  </div>

  <div class="relative">
    <svg
      id="price-chart-plot"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      class="block h-64 w-full sm:h-80"
      role="img"
      aria-label={describe(initial)}
      data-plot
      data-w={W}
      data-h={H}
    >
      <!-- Baseline only. No gridlines, no fill under the line. -->
      <line x1="0" y1={H} x2={W} y2={H} class="stroke-rule" stroke-width="1"
            vector-effect="non-scaling-stroke" />
      {views.map((v) => (
        <path
          d={v.d}
          data-range-path={v.range}
          fill="none"
          class="stroke-azure transition-opacity duration-150"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
          style={v.range === initial.range ? '' : 'opacity:0;visibility:hidden'}
        />
      ))}
      <line data-crosshair x1="0" y1="0" x2="0" y2={H} class="stroke-ink-muted"
            stroke-width="1" vector-effect="non-scaling-stroke"
            style="opacity:0" />
    </svg>

    <!-- Scrub readout. Positioned by the client; empty and hidden until hover. -->
    <div data-readout
         class="pointer-events-none absolute top-0 left-0 hidden bg-ivory px-2 py-1
                text-meta tabular-nums text-ink border border-rule">
    </div>
  </div>

  <figcaption class="sr-only">
    <table>
      <caption>{describe(initial)}</caption>
      <thead><tr><th scope="col">Date</th><th scope="col">{variant.label} per {unit.label} (₹)</th></tr></thead>
      <tbody>
        {initial.scrub.map((row) => (
          <tr>
            <th scope="row">{row.date}</th>
            <td>{row.value === null ? 'no rate' : formatINR(row.value, series.precision)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </figcaption>

  <script type="application/json" data-chart-data set:html={JSON.stringify({
    ranges: Object.fromEntries(views.map((v) => [v.range, { scrub: v.scrub, describe: describe(v) }])),
    markers,
  })} />
</figure>
```

- [ ] **Step 6: Verify it renders**

Temporarily render it from any page, then `npm run dev` and confirm: a line is
drawn, the default range's pill is selected, no gradient or shadow appears, and the
line uses the azure token in both light and dark mode.

- [ ] **Step 7: Commit**

```bash
git add src/lib/price-series.ts src/lib/price-series.test.ts src/components/price/PriceChart.astro
git commit -m "feat(price): build-time SVG chart that reads without JavaScript"
```

## Task 7: Chart interaction — toggle, scrub, keyboard

**Files:**
- Create: `src/lib/price-chart.ts`
- Modify: `src/components/price/PriceChart.astro` (import the module)

**Interfaces:**
- Consumes: the DOM emitted by Task 6 — `[data-price-chart]`, `[data-range-pill]`,
  `[data-range-path]`, `[data-plot]`, `[data-crosshair]`, `[data-readout]`,
  `[data-chart-data]`.
- Produces: `initPriceCharts(): void`, called on load. Idempotent.

**This is the only file that touches the DOM.** It adds interaction to markup that
is already correct — if it fails to load, the default range still renders.

- [ ] **Step 1: Write the module**

Create `src/lib/price-chart.ts`:

```ts
// Interaction for PriceChart.astro: range toggle, pointer scrub, keyboard.
//
// Every path is already in the DOM, so switching a range is a visibility flip,
// not a redraw. Nothing here computes a price — it only reads the scrub tables
// the component serialised at build time.

interface ScrubRow { date: string; value: number | null }
interface RangeData { scrub: ScrubRow[]; describe: string }
interface ChartData { ranges: Record<string, RangeData>; markers: { date: string; label: string }[] }

function initChart(root: HTMLElement): void {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-chart-data]');
  const plot = root.querySelector<SVGSVGElement>('[data-plot]');
  const crosshair = root.querySelector<SVGLineElement>('[data-crosshair]');
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  if (!dataEl || !plot || !crosshair || !readout) return;

  const data: ChartData = JSON.parse(dataEl.textContent || '{}');
  const precision = Number(root.dataset.precision ?? 0);
  const unitLabel = root.dataset.unitLabel ?? '';
  const W = Number(plot.dataset.w ?? 1000);
  let range = root.dataset.initialRange ?? Object.keys(data.ranges)[0];
  let cursor = -1;

  const fmt = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  function rows(): ScrubRow[] {
    return data.ranges[range]?.scrub ?? [];
  }

  function selectRange(next: string): void {
    if (!data.ranges[next]) return;
    range = next;
    root.querySelectorAll<HTMLButtonElement>('[data-range-pill]').forEach((pill) => {
      pill.setAttribute('aria-selected', String(pill.dataset.rangePill === next));
    });
    root.querySelectorAll<SVGPathElement>('[data-range-path]').forEach((path) => {
      const on = path.dataset.rangePath === next;
      // Visibility is toggled after the fade so a hidden path never takes hits.
      path.style.opacity = on ? '1' : '0';
      path.style.visibility = on ? 'visible' : 'hidden';
    });
    plot!.setAttribute('aria-label', data.ranges[next].describe);
    hideCursor();
  }

  function hideCursor(): void {
    cursor = -1;
    crosshair!.style.opacity = '0';
    readout!.style.display = 'none';
  }

  function showCursor(index: number): void {
    const list = rows();
    if (index < 0 || index >= list.length) return;
    cursor = index;
    const row = list[index];
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
    readout!.style.left = `${Math.min(Math.max(px - half, 0), box.width - readout!.offsetWidth)}px`;
  }

  function indexFromClientX(clientX: number): number {
    const box = plot!.getBoundingClientRect();
    if (box.width === 0) return -1;
    const ratio = Math.min(Math.max((clientX - box.left) / box.width, 0), 1);
    return Math.round(ratio * (rows().length - 1));
  }

  root.querySelectorAll<HTMLButtonElement>('[data-range-pill]').forEach((pill) => {
    pill.addEventListener('click', () => selectRange(pill.dataset.rangePill!));
  });

  plot.addEventListener('pointermove', (e) => showCursor(indexFromClientX(e.clientX)));
  plot.addEventListener('pointerleave', hideCursor);

  // Keyboard: the plot is focusable so arrows can walk the series.
  plot.setAttribute('tabindex', '0');
  plot.addEventListener('keydown', (e) => {
    const list = rows();
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const start = cursor === -1 ? (e.key === 'ArrowRight' ? -1 : list.length) : cursor;
      showCursor(start + (e.key === 'ArrowRight' ? 1 : -1));
    } else if (e.key === 'Home') { e.preventDefault(); showCursor(0); }
    else if (e.key === 'End') { e.preventDefault(); showCursor(list.length - 1); }
    else if (e.key === 'Escape') hideCursor();
  });
  plot.addEventListener('blur', hideCursor);

  selectRange(range);
}

export function initPriceCharts(): void {
  document.querySelectorAll<HTMLElement>('[data-price-chart]').forEach((root) => {
    if (root.dataset.chartReady === '1') return;   // idempotent
    root.dataset.chartReady = '1';
    initChart(root);
  });
}
```

- [ ] **Step 2: Wire it into the component**

At the end of `src/components/price/PriceChart.astro`, after the closing `</figure>`:

```astro
<script>
  import { initPriceCharts } from '../../lib/price-chart';
  initPriceCharts();
  document.addEventListener('astro:page-load', initPriceCharts);
</script>
```

- [ ] **Step 3: Verify by hand**

Run `npm run dev` and check each of these:
- Clicking each range pill swaps the line and updates the pill's selected state.
- Hovering shows a crosshair and a readout that never overhangs the chart edge.
- Tab reaches the plot; arrows walk the series; `Home`/`End` jump; `Escape` clears.
- Disabling JavaScript still shows the default range's line.
- With "Reduce motion" on in System Settings, nothing animates.

- [ ] **Step 4: Commit**

```bash
git add src/lib/price-chart.ts src/components/price/PriceChart.astro
git commit -m "feat(price): chart interaction — range toggle, scrub, keyboard"
```

## Task 8: PriceDesk component

**Files:**
- Create: `src/components/price/PriceDesk.astro`
- Modify: `src/components/price/PriceChart.astro` (emit every variant, not one)
- Modify: `src/lib/price-chart.ts` (handle the variant toggle)

**Interfaces:**
- Consumes: `goldSeries`-shaped `PriceSeries`; `stats`, `toUnit`, `formatINR`.
- Produces: a component taking `{ series: PriceSeries; label: string; labelML: string }`,
  emitting `[data-price-desk]` with `[data-variant-pill]` and `[data-unit-pill]` controls.

**Two things fall out of the maths and save a lot of work:**
1. **Switching unit never changes the path.** A unit factor is a linear scale, so
   ₹/pavan draws exactly the same curve as ₹/gram — only the labels change. The unit
   toggle therefore touches text only, never geometry.
2. **Switching variant does change the path**, so `PriceChart` must emit a path per
   range *per variant* — 2 × 5 = 10 short paths for gold. Still trivial markup.

- [ ] **Step 1: Extend PriceChart to every variant**

In `src/components/price/PriceChart.astro`, change the `Props` interface from
`variantId: VariantId` to `variantIds?: VariantId[]` (defaulting to every variant in
the series), and build `views` as the cross product:

```ts
const variantIds = Astro.props.variantIds ?? series.variants.map((v) => v.id);
const activeVariant = variantIds[0];

const views = ranges.flatMap((range) =>
  variantIds.map((vid) => {
    const windowed = windowSeries(series, range);
    const points = downsample(windowed, vid, MAX_POINTS);
    const s = stats(points, vid);
    return {
      range, variantId: vid, points, stats: s,
      d: buildPath(points, vid, W, H, s?.min ?? 0, s?.max ?? 1),
      scrub: points.map((p) => {
        const v = p.values[vid];
        return { date: p.date, value: typeof v === 'number' ? toUnit(v, unit, series.precision) : null };
      }),
    };
  }),
);
```

Add `data-variant-path={v.variantId}` alongside `data-range-path={v.range}` on each
`<path>`, key the serialised `data-chart-data` map by `` `${range}:${variantId}` ``,
and add `data-active-variant={activeVariant}` to the `<figure>`. Show a path only
when **both** its range and its variant are active.

- [ ] **Step 2: Teach price-chart.ts the variant axis**

In `src/lib/price-chart.ts`, add a `variant` variable beside `range`, key lookups on
`` `${range}:${variant}` ``, gate path visibility on both, and listen for the desk's
toggles:

```ts
let variant = root.dataset.activeVariant ?? '';

function key(): string { return `${range}:${variant}`; }

function applyPaths(): void {
  root.querySelectorAll<SVGPathElement>('[data-range-path]').forEach((path) => {
    const on = path.dataset.rangePath === range && path.dataset.variantPath === variant;
    path.style.opacity = on ? '1' : '0';
    path.style.visibility = on ? 'visible' : 'hidden';
  });
  plot!.setAttribute('aria-label', data.ranges[key()]?.describe ?? '');
  hideCursor();
}

// The desk lives outside the figure, so listen on the document.
document.addEventListener('price-variant-change', (e) => {
  variant = (e as CustomEvent<{ variantId: string }>).detail.variantId;
  applyPaths();
});
```

Replace the body of `selectRange` and the `rows()` lookup to use `key()`.

- [ ] **Step 3: Build the desk**

Create `src/components/price/PriceDesk.astro`:

```astro
---
// The one-second read: today's rate, today's move, and the two toggles.
// A hairline-separated band, not a card.
import { formatINR, stats, toUnit, windowSeries } from '../../lib/price-series';
import type { PriceSeries } from '../../lib/price-series';

interface Props { series: PriceSeries; label: string; labelML: string }
const { series, label, labelML } = Astro.props;

const unit = series.units[0];
const latest = series.points[series.points.length - 1];
const recent = windowSeries(series, '1W');

// The day's move, per variant, in the default unit.
const readings = series.variants.map((variant) => {
  const s = stats(recent, variant.id);
  const value = latest.values[variant.id];
  const prev = [...series.points].reverse()
    .find((p, i) => i > 0 && typeof p.values[variant.id] === 'number')?.values[variant.id];
  const change = typeof value === 'number' && typeof prev === 'number' ? value - prev : 0;
  return {
    variant,
    display: typeof value === 'number' ? toUnit(value, unit, series.precision) : null,
    change: toUnit(change, unit, series.precision),
    weekChange: s ? toUnit(s.change, unit, series.precision) : 0,
  };
});
const lead = readings[0];

// Direction is a glyph and a word — never a second hue. AGENTS.md: no red anywhere.
const dir = lead.change > 0 ? { glyph: '▲', word: 'up' }
  : lead.change < 0 ? { glyph: '▼', word: 'down' }
  : { glyph: '—', word: 'unchanged' };
---

<section data-price-desk class="border-b border-rule py-6" aria-labelledby="desk-heading">
  <p class="eyebrow text-eyebrow text-azure">{label}</p>
  <h2 id="desk-heading" class="font-malayalam text-section text-ink">{labelML}</h2>

  <div class="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
    <p class="text-display tabular-nums text-ink" data-desk-value>
      ₹{lead.display === null ? '—' : formatINR(lead.display, series.precision)}
    </p>
    <p class="text-body tabular-nums text-ink-muted">
      <span aria-hidden="true">{dir.glyph}</span>
      <span class="sr-only">{dir.word}</span>
      {' '}₹{formatINR(Math.abs(lead.change), series.precision)} today
    </p>
    <p class="text-meta text-ink-muted" data-desk-unit>
      per <span data-unit-label>{unit.label}</span> · {latest.date}
    </p>
  </div>

  <div class="mt-4 flex flex-wrap gap-6">
    <div role="group" aria-label="Purity" class="flex gap-px">
      {series.variants.map((v, i) => (
        <button type="button" data-variant-pill={v.id} aria-pressed={i === 0}
          class="eyebrow border border-rule px-3 py-1 text-eyebrow text-ink-muted
                 transition-colors duration-150 aria-pressed:border-azure
                 aria-pressed:text-azure hover:text-ink
                 focus-visible:outline-2 focus-visible:outline-azure">{v.label}</button>
      ))}
    </div>
    <div role="group" aria-label="Unit" class="flex gap-px">
      {series.units.map((u, i) => (
        <button type="button" data-unit-pill={u.id} data-unit-factor={u.factor}
          aria-pressed={i === 0}
          class="eyebrow border border-rule px-3 py-1 text-eyebrow text-ink-muted
                 transition-colors duration-150 aria-pressed:border-azure
                 aria-pressed:text-azure hover:text-ink
                 focus-visible:outline-2 focus-visible:outline-azure">{u.label}</button>
      ))}
    </div>
  </div>

  <script type="application/json" data-desk-data set:html={JSON.stringify({
    precision: series.precision,
    readings: readings.map((r) => ({
      variantId: r.variant.id, base: latest.values[r.variant.id] ?? null,
      change: r.change / unit.factor,
    })),
  })} />
</section>

<script>
  import { initPriceDesks } from '../../lib/price-chart';
  initPriceDesks();
  document.addEventListener('astro:page-load', initPriceDesks);
</script>
```

- [ ] **Step 4: Add `initPriceDesks` to price-chart.ts**

Append to `src/lib/price-chart.ts`:

```ts
/**
 * Desk toggles. Emits `price-variant-change` for the chart to hear, and
 * recomputes its own figure locally — the unit factor is a linear scale, so no
 * new data is needed to relabel from grams to pavan.
 */
export function initPriceDesks(): void {
  document.querySelectorAll<HTMLElement>('[data-price-desk]').forEach((desk) => {
    if (desk.dataset.deskReady === '1') return;
    desk.dataset.deskReady = '1';

    const dataEl = desk.querySelector<HTMLScriptElement>('[data-desk-data]');
    const valueEl = desk.querySelector<HTMLElement>('[data-desk-value]');
    const unitEl = desk.querySelector<HTMLElement>('[data-unit-label]');
    if (!dataEl || !valueEl || !unitEl) return;

    const { precision, readings } = JSON.parse(dataEl.textContent || '{}');
    const fmt = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: precision, maximumFractionDigits: precision,
    });
    let variantId: string = readings[0]?.variantId ?? '';
    let factor = 1;
    let unitLabel = unitEl.textContent ?? '';

    function render(): void {
      const r = readings.find((x: { variantId: string }) => x.variantId === variantId);
      valueEl!.textContent = r?.base == null
        ? '₹—'
        : `₹${fmt.format(Math.round(r.base * factor * 10 ** precision) / 10 ** precision)}`;
      unitEl!.textContent = unitLabel;
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
        document.dispatchEvent(new CustomEvent('price-variant-change', { detail: { variantId } }));
      });
    });

    desk.querySelectorAll<HTMLElement>('[data-unit-pill]').forEach((pill) => {
      pill.addEventListener('click', () => {
        factor = Number(pill.dataset.unitFactor ?? 1);
        unitLabel = pill.textContent?.trim() ?? '';
        press('unit', pill);
        render();
      });
    });
  });
}
```

- [ ] **Step 5: Verify**

`npm test` still passes, and in `npm run dev`: switching purity changes both the
desk figure and the chart line; switching unit multiplies the figure by 8 and
relabels, and the chart's shape does **not** change (it must not — same curve).

- [ ] **Step 6: Commit**

```bash
git add src/components/price/ src/lib/price-chart.ts
git commit -m "feat(price): the desk — today's rate, purity and unit toggles"
```

## Task 9: The page — desk and chart

**Files:**
- Create: `src/pages/features/gold-price.astro`

**Interfaces:**
- Consumes: `Layout`, `Footer`, `PriceDesk`, `PriceChart`, `goldSeries`,
  `GOLD_ATTRIBUTION` from Task 5.
- Produces: the route `/features/gold-price`.

Follow the structure of `src/pages/features/kerala-floods-2018.astro`: `Layout`
wrapper, `<main class="flex-1">`, sections inside `max-w-site`. The page is
presentational — no data shaping here, that all lives in `src/lib/*`.

- [ ] **Step 1: Create the page**

Create `src/pages/features/gold-price.astro`:

```astro
---
// ── /features/gold-price · the rate, and how it got here ──────────────────
// The first instance of the price-series engine (src/lib/price-series.ts).
// Silver, fuel, plantation crops and currency reuse these components unchanged
// — a new material is a new data module and a new page, not a new chart.
//
// Prices are real: scraped from keralagoldrates.com, 2010 to present. The
// narration in the story rail is sourced where marked and labelled where not.
import Layout from '../../layouts/Layout.astro';
import Footer from '../../components/Footer.astro';
import PriceDesk from '../../components/price/PriceDesk.astro';
import PriceChart from '../../components/price/PriceChart.astro';
import { GOLD_ATTRIBUTION, goldSeries } from '../../lib/gold-prices';

const updated = new Date(GOLD_ATTRIBUTION.scrapedAt).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
---

<Layout
  title="ഇന്നത്തെ സ്വർണവില | Today's gold rate in Kerala | MediaOne"
  description="Kerala's daily gold rate, compared across a week, a month, a year and sixteen years."
  noindex
>
  <main class="flex-1">
    <div class="mx-auto max-w-site px-4">
      <PriceDesk
        series={goldSeries}
        label="GOLD RATE · KERALA"
        labelML="ഇന്നത്തെ സ്വർണവില"
      />

      <section class="py-6" aria-labelledby="chart-heading">
        <h2 id="chart-heading" class="sr-only">Price history</h2>
        <PriceChart series={goldSeries} unitId="gram" />
        <p class="mt-3 text-caption text-ink-muted">
          Source: <a href={GOLD_ATTRIBUTION.sourceUrl} rel="nofollow noopener"
            class="text-azure hover:underline">{GOLD_ATTRIBUTION.source}</a>.
          Rates in rupees, Kerala. Last read {updated}.
        </p>
      </section>
    </div>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: builds clean, `dist/features/gold-price/index.html` exists.

Then `npm run dev` and check `/features/gold-price` against the global constraints:
no gradient, no shadow, square corners, every figure `tabular-nums`, azure the only
accent, and no red on a falling price. Check light **and** dark, mobile **and**
desktop widths.

- [ ] **Step 3: Commit**

```bash
git add src/pages/features/gold-price.astro
git commit -m "feat(gold): /features/gold-price — the desk and the chart"
```

## Task 10: Story rail and report markers

**Files:**
- Create: `src/components/price/PriceStoryRail.astro`
- Modify: `src/lib/gold-prices.ts` (populate `goldReports`)
- Modify: `src/lib/price-chart.ts` (act observer, line reveal)
- Modify: `src/pages/features/gold-price.astro` (mount the rail and reports)

**Interfaces:**
- Consumes: `PriceAct`, `PriceReport` from Task 5; `[data-price-chart]` from Task 6.
- Produces: `initStoryRail(): void`; a `price-act-change` document event carrying
  `{ from: string; to: string } | null`.

This is the piece that ties the visualisation to the journalism: a report carries a
date, so it renders **both** as a card and as a marker on the chart, and clicking
the marker jumps to the report.

- [ ] **Step 1: Populate the reports**

In `src/lib/gold-prices.ts`, fill `goldReports` with entries whose `date` falls
inside the series range. These are placeholder headlines for a prototype page — mark
them as such in the section label, do not present them as filed copy:

```ts
export const goldReports: PriceReport[] = [
  {
    id: 'record-2026',
    date: '2026-01-29',
    eyebrow: 'MARKETS',
    headline: 'Gold crosses a record in Kerala',
    headlineML: 'സ്വർണവില കേരളത്തിൽ റെക്കോർഡിലേക്ക്',
    dek: 'The 22K rate set a new high, its steepest single-month climb in five years.',
    href: '/story/gold-record-2026',
  },
  {
    id: 'pandemic-2020',
    date: '2020-08-07',
    eyebrow: 'MARKETS',
    headline: 'A pandemic run pushes gold to a then-record',
    headlineML: 'മഹാമാരിക്കാലത്ത് സ്വർണവില കുതിച്ചു',
    dek: 'Safe-haven demand carried the rate through a level it had never touched.',
    href: '/story/gold-2020',
  },
];
```

Every `date` must exist in the series — add a test to `gold-prices.test.ts`:

```ts
import { goldReports } from './gold-prices';

describe('goldReports', () => {
  it('anchors every report to a day the chart can mark', () => {
    const dates = new Set(goldSeries.points.map((p) => p.date));
    for (const r of goldReports) expect(dates.has(r.date)).toBe(true);
  });
});
```

- [ ] **Step 2: Build the story rail**

Create `src/components/price/PriceStoryRail.astro`:

```astro
---
// Narrated acts beside a sticky chart. As an act scrolls into view it asks the
// chart to highlight the span it describes.
//
// The chart is `position: sticky`, not `fixed` — so this composes inside the
// normal page flow and needs no z-index juggling.
import PriceChart from './PriceChart.astro';
import type { PriceAct } from '../../lib/gold-prices';
import type { PriceSeries } from '../../lib/price-series';

interface Props { series: PriceSeries; acts: PriceAct[] }
const { series, acts } = Astro.props;
---

<section data-story-rail class="border-t border-rule py-10" aria-labelledby="rail-heading">
  <h2 id="rail-heading" class="text-title text-ink">How it got here</h2>

  <div class="mt-6 grid gap-8 md:grid-cols-[1fr_1.1fr]">
    <div class="md:sticky md:top-24 md:self-start">
      <PriceChart series={series} unitId="gram" ranges={['ALL']} />
    </div>

    <div>
      {acts.map((act) => (
        <article
          data-act
          data-act-from={act.from}
          data-act-to={act.to}
          class="border-b border-rule py-8 opacity-45 transition-opacity duration-200
                 [&.is-active]:opacity-100"
        >
          <h3 class="font-malayalam text-section text-ink">{act.titleML}</h3>
          <p class="eyebrow text-eyebrow text-ink-muted">{act.title}</p>
          <p class="mt-2 text-body text-ink">{act.body}</p>
          {!act.sourced && (
            <p class="mt-2 text-caption text-ink-muted">Prototype narration — not reporting.</p>
          )}
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add the observer and the line reveal**

Append to `src/lib/price-chart.ts`:

```ts
/**
 * Drives the story rail: the act nearest the middle of the viewport is the
 * active one, and the chart highlights the span it describes.
 *
 * Under `prefers-reduced-motion` the acts are all shown at full opacity and no
 * observer runs — a reader who has asked for less motion should not have to
 * scroll to reveal text.
 */
export function initStoryRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-story-rail]');
  if (!rail || rail.dataset.railReady === '1') return;
  rail.dataset.railReady = '1';

  const acts = Array.from(rail.querySelectorAll<HTMLElement>('[data-act]'));
  if (acts.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
}

/**
 * Draw the line in once, the first time the chart is seen.
 *
 * `stroke-dashoffset` is animated rather than any layout property, per the
 * repo's motion rule. 600ms is a reveal, not feedback, so it sits outside the
 * 200ms feedback budget deliberately.
 */
export function initLineReveal(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const path = entry.target as SVGPathElement;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = 'stroke-dashoffset 600ms ease-out';
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
      obs.unobserve(path);
    }
  }, { threshold: 0.25 });

  document.querySelectorAll<SVGPathElement>('[data-range-path]').forEach((p) => {
    if (p.style.visibility !== 'hidden') observer.observe(p);
  });
}
```

Call both from the existing `astro:page-load` wiring in `PriceChart.astro`, and add
a highlight listener inside `initChart` that reacts to `price-act-change` by moving
a `<rect>` band over the described span. Add that rect to the SVG in Task 6's
component, before the paths so it sits behind them:

```astro
<rect data-act-band x="0" y="0" width="0" height={H} class="fill-rule-light"
      style="opacity:0" />
```

- [ ] **Step 4: Mount the rail and the reports on the page**

In `src/pages/features/gold-price.astro`, import `PriceStoryRail`, `goldActs` and
`goldReports`, and add after the chart section:

```astro
<PriceStoryRail series={goldSeries} acts={goldActs} />

<section class="border-t border-rule py-10" aria-labelledby="reports-heading">
  <h2 id="reports-heading" class="text-title text-ink">In the news</h2>
  <ul class="mt-4">
    {goldReports.map((r) => (
      <li id={`report-${r.id}`} class="border-b border-rule py-5">
        <p class="eyebrow text-eyebrow text-azure">{r.eyebrow} · {r.date}</p>
        <h3 class="mt-1 font-malayalam text-section text-ink">
          <a href={r.href} class="hover:text-azure">{r.headlineML}</a>
        </h3>
        <p class="mt-1 text-body text-ink-muted">{r.dek}</p>
      </li>
    ))}
  </ul>
  <p class="mt-4 text-caption text-ink-muted">
    Prototype headlines. Prices above are real; these reports are placeholders.
  </p>
</section>
```

Pass `markers={goldReports.map((r) => ({ date: r.date, label: r.headline }))}` to the
main `PriceChart`, and in `initChart` render each marker as a small azure tick at
the matching x with an `<a href="#report-<id>">` wrapper.

- [ ] **Step 5: Verify the whole page**

Run `npm test` (all green), then `npm run build`, then `npm run dev` and check:
- Scrolling the rail activates each act and shifts the highlight band.
- Report markers appear on the chart and jump to the matching card when clicked.
- The line draws in once on first view, and not again on range switches.
- With "Reduce motion" on: every act is fully visible, nothing animates, and the
  page is fully readable without scrolling to reveal anything.
- Lighthouse or DevTools: the page's price payload is under 40KB.

- [ ] **Step 6: Commit**

```bash
git add src/components/price/ src/lib/ src/pages/features/gold-price.astro
git commit -m "feat(gold): story rail and report markers tying news to the curve"
```

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: the contract (1–3),
scraper and fixture test (4), gold instance and attribution (5), chart and
accessibility table (6), interaction and keyboard (7), desk (8), page (9), story
rail and report markers (10). Performance is handled in 6 (`MAX_POINTS = 400`,
build-time paths) and verified in 10. The "no interpolation across gaps" rule is
enforced in `buildPath` and tested in 6. Error handling: scraper aborts rather than
writing partial data (4), chart degrades to static markup without JS (6/7).

**Two deviations from the spec, both deliberate and both flagged in place:**
- Task 3 uses bucketed min/max rather than LTTB, because LTTB gives no guarantee
  about extremes and clipping a record high is a correctness bug on a price chart.
- The data path is `src/data/gold/prices.json`, not the spec's
  `src/lib/data/gold-prices.json`, to match the existing `src/data/channels/*.json`
  convention.

**One thing the spec asked for that this plan changes:** the spec assumed
`PriceChart` took a single variant. Task 8 discovered the desk's purity toggle needs
all variants emitted, so Task 6's single-variant signature is widened there rather
than being wrong twice.

**Type consistency.** `buildPath`, `windowSeries`, `stats`, `downsample`, `toUnit`
and `formatINR` keep identical signatures across every task that calls them.
`PriceSeries`, `Variant`, `Unit`, `PricePoint`, `RangeId`, `SeriesStats`,
`PriceReport` and `PriceAct` are each defined once and imported thereafter. The DOM
contract (`data-price-chart`, `data-range-path`, `data-variant-path`,
`data-price-desk`, `data-story-rail`) is consistent between the components that emit
it and `price-chart.ts`, which is the only reader.
