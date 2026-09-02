# Design Tokens

Single source of truth: **`tokens/*.json`**. Everything else — CSS variables,
Tailwind's `@theme`, the `/design/tokens` browser page — is generated or
derived from it. Never hand-edit generated output.

```
tokens/
  color.json        ── all --color-* (58 tokens)
  typography.json    ── --font-* families + the fluid --text-* type scale
  spacing.json        ── fluid --spacing-* (named, not numeric p-4/gap-6)
  radius.json          ── --radius-*
  dimension.json        ── --breakpoint-*, --width-*, --container-*
        │
        │  bun run tokens:build   (Style Dictionary, scripts/build-tokens.mjs)
        ▼
src/styles/tokens.generated.css   ── @theme { ... } + :root { --spacing-* }
        │  @import'd by src/styles/app.css
        ▼
Tailwind v4 reads @theme → generates bg-azure, text-headline, rounded-lg, etc.
        │
        ▼
src/lib/tokens.ts parses app.css at build time → powers /design/tokens
```

## Editing a primitive

1. Edit the value in `tokens/*.json`.
2. Run `bun run tokens:build` (also runs automatically before `dev` and `build`
   via `predev`/`prebuild`).
3. Every Tailwind utility (`bg-azure`, `text-title`, `rounded-xl`, `max-w-site`…)
   and every raw `var(--color-azure)` picks up the new value — nothing else to
   touch.

`tokens.generated.css` is gitignored — it's build output, regenerated on every
`dev`/`build`, the same way `dist/` is.

## Token shapes

Most tokens are a plain CSS value (`"oklch(0.527 0.153 253)"`, `"640px"`,
`"80rem"`). Two categories use a structured `fluidSize`/`fluidText` shape
instead, because they're `clamp(min, preferred, max)` — a fluid value between
a measured mobile (390px) and desktop (1280px) size:

```json
"display": { "$value": {
  "min": "2rem", "mid": "1.636rem + 1.87vw", "max": "3.5rem",
  "lineHeight": "1.06", "fontWeight": "700"
} }
```

`min`/`max` are the two measured endpoints; `mid` is the hand-tuned
interpolation between them (`min-px/16rem` + a `vw` slope). Each token's slope
was tuned individually against the original 1280-wide Pencil canvas, so it is
*not* a single reusable formula across tokens — the JSON captures the exact
tuned curve losslessly rather than re-deriving an approximation. The build
script (`scripts/build-tokens.mjs`) assembles these into
`clamp(min, mid, max)`; `fluidText` additionally emits the paired
`--text-name--line-height` / `--text-name--font-weight` vars that the
`@utility` blocks in `app.css` (eyebrow, headline-deck, body-small, …) read.

## What's generated vs. hand-written

| Generated (from `tokens/*.json`) | Still hand-written in `app.css` |
|---|---|
| All `--color-*` | `.dark` overrides (semantic remapping, not a primitive) |
| `--font-sans` / `-malayalam` / `-serif` / `-mono` | `--font-wdth` / `--font-wght` variable-font axis defaults (stateful, media-query driven) |
| `--text-*` fluid type scale + line-height/weight | `@utility` blocks (`eyebrow`, `article-title`, `headline-deck`, …) — these *consume* the type-scale tokens, they aren't primitives themselves |
| `--radius-*` | Base layer, keyframes, container queries, `.mc-outline` debug marker |
| `--breakpoint-*`, `--width-*`, `--container-*` | |
| `--spacing-*` (fluid, named) | |

## Out-of-scope color usage (documented, not migrated)

A few literal colors can't route through the token pipeline and are left as-is
intentionally:

- **`theme-color` meta tags** (`Layout.astro`, `alt.astro`) — `#f8f9fa` /
  `#0d1017`. Browser chrome color; the spec requires a static value, no
  `var()` support.
- **WebGL / Three.js uniforms** (`TerrainStage.astro`, `JourneyStage.astro`) —
  numeric/hex colors passed to shader uniforms and materials. These are JS
  values consumed by the GPU pipeline, not CSS custom properties.
- **Leaflet / MapLibre paint layers** (`RouteMap.astro`, `MapBase.astro`) —
  `L.polyline({ color: '#0b2e5d' })` etc. Vector-tile paint expressions take
  JS values at layer-creation time; `#0b2e5d` = `--color-nav-bg` and
  `#a72626` = `--color-accent-red` by value, just not by reference.
- **Tailwind arbitrary-value classes** `bg-[#000813]` (`MustWatchShelf.astro`)
  and `bg-[#0a2e5c]` (`TopVideosShelf.astro`) — `#000813` is exactly
  `--color-header-bg`; **`#0a2e5c` is *not* an exact match for
  `--color-nav-bg` (`#0b2e5d`)** — worth a follow-up look, may be drift.
- **`::selection` in `app.css`** — `oklch(0.527 0.153 253 / 0.18)`, an alpha
  variant of `--color-azure`. Pre-existing; not moved into the token file
  since it's a one-off alpha blend, not a reusable primitive.
- **IAB standard ad sizes** in `AdSlot.astro` (`320×100`, `728×90`,
  `970×250`, `300×250`, `336×280`, `160×600`, `320×50`…) — fixed pixel
  dimensions mandated by the ad network, not design primitives.
- **`theme-color` meta tags, `env(safe-area-inset-*)`, viewport-relative
  maxes** (`max-h-[82vh]`, dropdown `min-w-[15rem]`/`max-w-[min(34rem,…)]`,
  fixed columns like `w-[3.75rem]`) — browser/OS-driven or one-off component
  geometry, not primitives.

### Resolved during the `/new` page audit

- `VideoModal.astro`'s `.vitem.is-playing` background (`rgb(255 255 255 /
  0.06)`) and `MegaPanel.astro`'s panel shadow (`rgba(2,30,18,0.45)`, exactly
  `--color-text-primary`) now read `color-mix(in oklch, var(--color-*) N%,
  transparent)` — the same alpha-blend pattern already used in
  `McInspector.astro`/`Logo.astro` — so they track the token if it changes.
- `VideoModal.astro` used a static `10px`/`0.625rem` for duration/episode/
  live badges over video thumbnails, five times, below the type scale's
  11px floor. Promoted to a real token — `--text-micro` (`0.625rem`,
  line-height `1.2`, weight `400`) in `tokens/typography.json` — rather than
  left as scattered arbitrary values. `text-micro` is now a normal Tailwind
  utility, same as `text-caption`/`text-eyebrow`.

### Resolved during the `/story/[slug]` page audit

Full tree checked beyond what `/new` already covered: `SectionSubNav`,
`SubNavBar`, `StickyFooterAd`, `StoryArticle`, `Placeholder`, `ArticleCard`,
`SectionHeading`, `ArticleBreadcrumb`, `ArticleHeadline`, `Badge`,
`ArticleByline`, `ArticleToolRail`, `TopicChips`, `ShareBar`. No hardcoded
colors and no raw `clamp()` anywhere in this tree.

- `text-[17px]` was duplicated 4× — the Play Store / App Store / bookmark
  icon glyphs in `ArticleToolRail.astro`, and the share icons in
  `ShareBar.astro`. Promoted to `--text-icon` (`1.0625rem`, line-height `1`,
  weight `400`) in `tokens/typography.json`, same treatment as `text-micro`.
- `Placeholder.astro`'s `text-[32px]` empty-state photo icon — single use,
  no duplication found elsewhere. Left as a one-off, not promoted; promote
  if a second use turns up.
- `StickyFooterAd.astro`'s `IntersectionObserver` `rootMargin: '0px 0px
  -20% 0px'` — a behavioral scroll-trigger parameter, not a design value.
  Out of scope by nature, same category as `env(safe-area-inset-*)` above.

## Superseded files

`tokens.css` and `tokens.json` at the repo root are stale, hand-maintained
duplicates from before this pipeline — unreferenced anywhere in `src/`, and
already drifted from `app.css` (e.g. `--font-size-body: 14px` vs. the real
`17px` desktop value). Safe to delete; left in place pending confirmation.
