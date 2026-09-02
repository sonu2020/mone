# Price Series — an interactive commodity price engine, with gold as the first instance

> Design spec · 2026-08-07

## Goal

A reader who lands on `/features/gold-price` sees today's Kerala gold rate in one
second, can compare it across week / month / year / five years without leaving the
page, and — if they keep scrolling — gets the story of how it got there, with news
reports anchored to the exact days they describe.

The chart machinery is generic. Silver, fuel, plantation crops and currency follow
as new data modules, not new chart code.

## Non-goals

- No live runtime API. The build is static; data is scraped and baked in.
- No trading features (no portfolio, alerts, calculators, buy links).
- No intraday data for gold. Kerala gold rates move once or twice a day.
- No generic "dashboard". This is an editorial page, not an analytics tool.

## Data

**Source.** `keralagoldrates.com` publishes month-archive pages at
`/daily-gold-prices-<month>-<year>/`, each a table of daily rows:

| Date | 22K ₹/gram | 24K ₹/gram | 22K ₹/pavan | 24K ₹/pavan |

Coverage runs January 2010 → present: roughly 195 pages and ~5,800 daily points.

**Scraper.** `scripts/scrape-gold.py`, following the existing `scripts/scrape-*.py`
pattern. Walks the archive index, fetches each month page throttled, parses rows,
and writes `src/lib/data/gold-prices.json`. Idempotent: re-running tops up recent
months without rewriting history. A pavan is 8 grams, so only ₹/gram is stored and
₹/pavan is derived — one source of truth per DRY.

**Attribution.** `GOLD_ATTRIBUTION` in `src/lib/gold-prices.ts` names the source and
the last-scraped date, and renders on the page. Mirrors `TERRAIN_ATTRIBUTION`.

**Honesty rule.** Prices are real. The narration in the story acts is placeholder
unless separately researched, and is labelled as such — the same rule the terrain
features follow (see the header of `src/lib/terrain.ts`).

## The contract

`src/lib/price-series.ts` knows nothing about gold. It carries four axes, because
the four materials that follow gold each stress a different one.

```ts
type VariantId = string;

type Variant = {
  id: VariantId;        // '22k' · 'petrol' · 'kochi' · 'usd-inr'
  label: string;        // English
  labelML: string;      // Malayalam
};

type Unit = {
  id: string;           // 'gram' · 'pavan' · 'litre' · 'quintal'
  label: string;
  labelML: string;
  factor: number;       // multiplier from the stored base unit
};

type PriceSeries = {
  id: string;
  variants: Variant[];
  units: Unit[];              // reader-switchable; first is default
  granularity: 'daily' | 'weekly' | 'intraday';
  precision: number;          // decimal places — gold 0, currency 2
  points: PricePoint[];       // ascending by date
};

type PricePoint = {
  date: string;               // ISO yyyy-mm-dd
  values: Record<VariantId, number>;   // in the stored base unit
};
```

How each future material lands on it:

| Material | Axis it exercises |
|---|---|
| Silver | Same shape as gold. Different `precision` and unit set. |
| Fuel | `variants` become petrol/diesel **and** city. Daily, ₹/litre. |
| Plantation crops | `granularity: 'weekly'`, ₹/quintal, higher volatility. |
| Currency | `precision: 2`, potentially `granularity: 'intraday'`. |

**Pure functions**, all in `price-series.ts`, all unit-testable without a DOM:

- `windowSeries(series, range)` — slice to `1W | 1M | 1Y | 5Y | ALL`
- `downsample(points, maxPoints)` — LTTB-style thinning for long ranges
- `stats(points, variantId)` — min, max, first, last, absolute and percent change
- `toUnit(value, unit, precision)` — base unit → display unit
- `formatINR(value, precision)` — Indian digit grouping (`1,10,920`, not `110,920`)

## Components

### `src/lib/gold-prices.ts`
Gold as an instance. Imports the JSON, declares the two variants (22K / 24K), the
two units (gram / pavan, factor 1 and 8), `precision: 0`, `granularity: 'daily'`,
the attribution, and the `reports` list.

### `components/price/PriceDesk.astro`
Today's rate at display scale in `tabular-nums`, the day's delta with direction, and
the variant + unit toggles. No card — a hairline-separated band, per DESIGN.md.

### `components/price/PriceChart.astro`
Hand-rolled inline SVG. All range paths computed at build time in the frontmatter
and emitted together; the client only toggles which is visible. Hairline stroke, no
fill, no gridlines beyond a faint baseline and the min/max ticks. Uses the `azure`
token for the line, `rule` for the baseline. Dark mode falls out of tokens.

Accepts any `PriceSeries` plus a list of ranges and an optional marker list.

### `src/lib/price-chart.ts`
Vanilla TS, roughly 200 lines. Range toggle, pointer scrub with crosshair and
readout, keyboard navigation (arrows step points, tab reaches the pills), and the
`IntersectionObserver` that drives the story rail. No dependencies.

### `src/pages/features/gold-price.astro`
Presentational only, per the repo convention that page data lives in `src/lib/*`.

## Page structure

1. **Desk** — `PriceDesk`, above the fold. The one-second read.
2. **Chart** — `PriceChart` with `1W · 1M · 1Y · 5Y · All` pills, directly under the
   desk so comparison needs no scrolling.
3. **Story rail** — a pinned mini-chart with narrated acts. As each act scrolls into
   view the chart highlights that date span and the annotation lights up. Reuses the
   act pattern already working in the terrain features.
4. **Reports** — news report cards. Each report carries a date, so it renders both as
   a card and as a marker on the chart; clicking a marker jumps to the report. This
   is the mechanism that ties the visualisation to feature stories.

## Motion

- Line draws in on first view via `stroke-dashoffset` — a compositor property, not
  a layout one, per the AGENTS.md motion rule. ~600ms, treated as a reveal.
- Range switches crossfade in ≤200ms — feedback, so it obeys the feedback budget.
- Story-rail highlights are opacity and transform only.
- `prefers-reduced-motion` renders everything static. Already global in `app.css`.

## Performance

The full series is ~5,800 points × 2 variants — roughly 200KB of JSON if shipped
raw. It is not shipped raw:

- `1W` and `1M` ship their exact points.
- `1Y`, `5Y` and `All` are downsampled at build time to ≤400 points each, which is
  more than the pixel width of the chart can resolve anyway.
- Only the emitted SVG paths and the scrub lookup tables reach the client.

Target: under 40KB of price data on the wire.

## Accessibility

- The chart is `role="img"` with an `aria-label` stating the range, variant and the
  change across it.
- A visually-hidden `<table>` carries the windowed data for screen readers.
- Range pills are real buttons in a `role="tablist"`, reachable and operable by
  keyboard; arrow keys step the scrub cursor.
- Colour is never the sole carrier of meaning — direction is stated in text, not
  only by the delta's colour.

## Design constraints

From `AGENTS.md` and `DESIGN.md`, binding on this work:

- No gradients, including under the chart line. No drop-shadows.
- No pure black or white. Tokens only: `ink`, `ivory`, `rule`, `azure`.
- `azure` is the single accent. No red, including for a falling price — direction is
  carried by the arrow glyph and the word, not by a second hue.
- `tabular-nums` on every figure.
- Square geometry. Hairline separation, not cards. Cards never nest.
- Letter-spacing only on uppercase Latin eyebrows, never on Malayalam.

## Testing

- Pure functions in `price-series.ts` get unit tests: windowing boundaries,
  downsampling preserving min/max, Indian digit grouping, unit conversion.
- The scraper gets a fixture test against a saved month page, so a change in the
  source site's markup fails loudly rather than silently writing empty data.
- Visual check of the built page in light and dark, at mobile and desktop widths.

## Error handling

- Scraper: a month page that fails to parse aborts with the URL and reason rather
  than writing partial data. Network failures retry with backoff, then abort.
- Page: if a variant is missing from a point (a gap in the source), the line breaks
  rather than interpolating across it — an invented price is worse than a gap.
- Client: if `price-chart.ts` fails to load, the build-time SVG still renders the
  default range. The chart is readable without JavaScript; only interaction is lost.

## Open question

The story-rail narration (2013 import duty, 2020 pandemic spike, the 2026 record)
is placeholder unless researched. Flagged, not blocking — the page ships labelled as
prototype narration, consistent with the other feature pages.
