# Type-scale drift — `/` vs `/design/tokens`

Audit date: 2026-08-15 · method: rendered-DOM measurement at 1440px viewport against
probed token/utility classes, cross-checked against source. The token browser
(`/design/tokens`) is the reference: its specimens are the `text-*` classes and
`@utility` classes rendered at real size.

## Baseline — the scale at 1440px

| Token | Size | Line-height | Declared weight | Renders at |
| --- | --- | --- | --- | --- |
| `text-display` | 53.1px | 56.3 | 700 | **550** ⚠ |
| `text-hero` | 39.8px | 44.6 | 700 | **550** ⚠ |
| `text-category` | 39.0px | 35.1 | 700 | **550** ⚠ |
| `text-title` | 27.1px | 32.5 | 700 | **550** ⚠ |
| `text-lead-story` | 25.0px | 32.0 | 550 | 550 |
| `text-section` | 22.5px | 28.6 | 600 | **550** ⚠ |
| `text-feature` | 22.0px | 27.1 | 600 | **550** ⚠ |
| `text-band` | 22.0px | 25.1 | 800 | **550** ⚠ |
| `text-lead` | 17.5px | 28.4 | 400 | **550** ⚠ |
| `text-headline` | 16.8px | 22.6 | 600 | **550** ⚠ |
| `text-deck` | 16.5px | 21.1 | 550 | 550 |
| `text-nav` | 15.8px | 20.6 | 600 | **550** ⚠ |
| `text-body` | 15.6px | 26.8 | 400 | **550** ⚠ |
| `text-meta` | 13.0px | 19.5 | 500 | **550** ⚠ |
| `text-body-small` | 13.0px | 18.2 | 500 | **550** ⚠ |
| `text-eyebrow` / `text-caption` | 11.7px | 15.2 / 17.0 | 700 / 400 | **550** ⚠ |

The `@utility` classes render their declared weights correctly (`eyebrow` 700,
`band-label` 800, `headline-feature` 600, `nav-text` 600, `article-title` 525,
`row-meta` 500, …) because they set `font-variation-settings` directly.

## Root cause — weight

`body` inherits `font-variation-settings: "wdth" 95, "wght" 550` to every
element. The `text-{name}` token classes only set the `font-weight` property
(`font-weight: var(--text-{name}--font-weight)`). Per CSS Fonts 4, an effective
`font-variation-settings` (including an inherited one) takes precedence over the
`font-weight` mapping. Verified empirically at 1440px: an element with
`font-weight: 600` and inherited `wght 550` has the same glyph advance width as
one at `wght 550` — it renders at **550**, not 600.

Consequences:
- The homepage's `text-nav` (mobile-drawer nav links, HeaderBar) and `text-meta`
  (footer links) render at 550 instead of 600/500.
- `/design/tokens` itself misrepresents the scale: every Type-section specimen
  renders at wght 550 while its spec column prints 700/600/800.

## Drift findings on `/`

Measured clusters that match no token (size, weight, or line-height):

| # | Where | Rendered | Token it should be | Source |
| --- | --- | --- | --- | --- |
| 1 | Header desk links (Home, News, Kerala…) | **18px / 600** | `nav-text` (15.8px) | `HeaderBar.astro` — `nav-text text-[1.0625rem] lg:text-[1.125rem]` |
| 2 | Lead-package row titles | **14px / 550 / lh 20** | `headline-deck` (16.5px) | `LeadPackage.astro` — `text-sm leading-5` |
| 3 | Lead-package excerpt | **14px / 400 / lh 17.5** | `lead-text` (17.5px) | `LeadPackage.astro` — `text-sm leading-tight` |
| 4 | Video / programme / schedule titles | **13px / 580 / lh 16** | `meta` 13px but wght 500, lh 19.5; 580 is off-ladder | `VideoBand.astro`, `videos/ProgramFeed.astro`, `live/ScheduleList.astro` — `text-[0.8125rem] leading-4 [font-variation-settings…wght 580]` |
| 5 | "Watch Live" pill | **13px / 700 / lh 13, tracking 0.06em** | `eyebrow` (11.7px, tracking 0.11em) | `OnAirNow.astro` — `eyebrow text-[0.8125rem] leading-none tracking-[0.06em]` |
| 6 | "Videos" band label | **17px / 800** | `band-label` (22px) | `VideoBand.astro` — `band-label text-[1.0625rem]` |
| 7 | Video durations | **10px / 700** | below scale (caption 11.7px is smallest) | `VideoBand.astro`, `ProgramFeed.astro` — `text-[10px]` |
| 8 | Ad labels | **9px / 550** | below scale | `AdSlot` — `text-[9px] uppercase tracking-widest` |
| 9 | Feature/Split-band excerpt | 15px / 400 / lh 1.53 *(latent — no current data renders it: `section()` stories carry no `excerpt`, so the `<p>` never renders)* | `lead-text` (17.5px) | `FeatureBand.astro`, `SplitBand.astro` — `text-[0.9375rem]` (15px is lead's *mobile* floor, fixed on desktop) |
| 10 | Section-band Malayalam sublabel "വീഡിയോ" | 13px | `meta` ✓ size, but fixed non-fluid | `VideoBand.astro` — `text-[0.8125rem]` |

Cluster counts (text elements on `/`): 18px ×12, 14px ×5, 13px/580 ×10, 10px ×6,
9px ×6, plus ~43 `text-nav` (drawer) and ~10 `text-meta` (footer) elements hit by
the weight bug.

## Fixes

1. **Weight (systemic).** Make the `text-*` token classes carry their weight as a
   variation setting, e.g. in `app.css`:
   `@utility text-… { font-variation-settings: "wdth" var(--font-wdth), "wght" var(--text-…--font-weight) }`,
   or set `font-variation-settings: normal` on the `text-*` utilities so the
   `font-weight` property maps. Either restores every declared weight — homepage
   and `/design/tokens` specimens alike.
2. **Header desks (#1).** Drop the `text-[1.0625rem] lg:text-[1.125rem]` override —
   `nav-text` alone renders the fluid 15.8px nav size. If 18px desks are a real
   design intent, promote a token instead of an arbitrary value.
3. **Lead rows (#2, #3).** Use `headline-deck` for row titles and `lead-text` for
   the excerpt.
4. **Video titles (#4).** Use `body-small` (13px, 500) or `meta-text`; if 580 is
   deliberate, add a weight token — 580 is on no ladder step.
5. **Overrides (#5, #6).** Remove the arbitrary size overrides — `eyebrow` and
   `band-label` already define the size.
6. **Badges (#7, #8).** Below-scale sizes are defensible for durations and ad
   labels; either accept them as documented exceptions or add a
   `text-badge`/`text-legal` token so they stop being arbitrary values.
