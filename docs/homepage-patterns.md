# Homepage Band Patterns

*The band set the MediaOne homepage (`/`) is composed from — the composition,
shared anatomy, per-band API, and the rules every band obeys. This is the
"Paper" direction: a single 12-column grid, hairline-separated bands, one
accent.*

---

## The Composition

The homepage is a thin conductor: it imports bands from `src/components/home4/`,
passes data from `src/lib/home4-data.ts`, and inserts ad slots between them. The
band order tracks the live mediaoneonline.com site.

| # | Band | Component | Data |
|---|------|-----------|------|
| 1 | Lead | `LeadPackage` | `leadStories`, `latest`, `feed` |
| — | *ad `home4-1` (leaderboard)* | — | — |
| 2 | Shelf | `ShelfBand` | `shelf` |
| 3 | Video | `VideoBand` | `allVideos`, `featuredFromPrograms` |
| 4 | Kerala | `SplitBand` | `section('kerala')` |
| 5 | Magazine | `OpinionBand` | `magazine` |
| 6 | Entertainment | `ShelfBand` | `section('entertainment')` |
| 7 | Sports | `FeatureBand` | `section('sports')` |
| 8 | Gulf | `FeatureBand` | `section('gulf')` |
| 9 | National | `SplitBand` | `section('national')` |
| 10 | World | `SplitBand` | `section('world')` |

### Container facts

- Every band except Video runs inside `w-full max-w-site mx-auto bg-bg-card`
  (`bg-bg-card` is the page's card surface over the `bg-bg-page` canvas).
- Gutter rhythm: `px-4 sm:px-6 lg:px-8`.
- Bands stack with `py-6` breathing and close on `border-b border-rule
  dark:border-ivory/10` hairlines — the page reads as ruled columns, not cards.
- Ad slots are full-width leaderboards (`home4-1/2/3`, lazy) between bands,
  plus one rectangle (`home4-shelf-rail`) inside the Shelf rail.
- The Video band breaks the container: full-bleed, near-black
  (`bg-header-bg-deep`), bordered `border-y border-white/10` — a player surface,
  not a paper column.

---

## Shared Anatomy

Every labelled band is `BandHeading + content + border-b`:

```
BAND LABEL ───────────────────────────── View all →
<content grid, 12 columns, gap-8 (lg:gap-x-6)>
```

- **BandHeading** (`home4/BandHeading.astro`): uppercase Latin `band-label`,
  a flex hairline (`h-px flex-1 bg-rule`) that always ends where the link
  begins, optional azure `badge`, and an azure "View all →".
- **Type scale inside bands**: `headline-feature` for leads, `headline-deck`
  for cards/rows, `caption-text` + `tabular-nums` for metadata.
- **Surfaces**: tinted panels are `bg-light-gray dark:bg-brand-elevated`;
  text on navy is `text-text-navy-deep dark:text-ivory`; hover is always
  `hover:text-azure dark:hover:text-azure-light`.
- **Images**: `Art` with aspect ratios — `8/5` features, `16/9` promos,
  `1/1` thumbnails. Missing art holds a neutral tint; it never borrows an
  unrelated photo.
- **Hover = azure, motion ≤ 200ms, transform/opacity only.** No gradients,
  no shadows, square corners.

---

## The Band Set

### LeadPackage — the hero band

The day's top story, the headline stack and the live rail on one 12-col grid:

```
col-span-5 (lead)   col-span-4 (stack)   col-span-3 (rail)
```

Props: `lead`, `rows` (4), `feed` (timestamped wire), `topics?`, `onAir?`,
`flushTop?`, `class`. The topics strip and on-air unit live in the masthead by
default (`TOPICS_IN_HEADER`/`LIVE_IN_HEADER` on `/`); pass them here instead
only when the header is absent.

### ShelfBand — editorial lead + promo cards

A wide tinted lead (`8/9` cols), a rule, three promo cards, and a rail of
`ThumbRow`s closed by a rectangle ad (`adSlot`). Used for Shelf and
Entertainment.

### OpinionBand — text-forward opinion strip

No art at all: a column rule (`border-l-2 border-rule`), a kicker, and the
headline, four-up. Type is the entire surface.

### FeatureBand — one tall feature

A tall `8/5` feature over a tinted caption panel (`5` cols), two stacked promos
(`3`), a deep rail of five thumbed rows (`4`). Used for Sports, Gulf.

### SplitBand — mirrored split + four-up cards

Text-left/image-right mirrored lead, a four-up row of bordered cards, and an
optional rail (`rail` + `authors` as `ThumbRow` with `metaBelow`). Omitting
`label` runs the band on as a continuation of the one above. Used for Kerala,
National, World.

### VideoBand — the navy player surface

Full-bleed `bg-header-bg-deep`: four lead stills (2×2), three compact rows, and
a "From the Shows" programme column (`picks`). Tabs (`Latest · Live ·
Explainers · Programmes`) swap via the shared `VideoModal`; every tile opens
the player.

---

## Pattern Rules

1. **Hierarchy is density, not chrome.** Size of type and image, then space —
   never borders, shadows, or decorative color.
2. **Cards are not the default.** Prefer hairline-separated rows and bands;
   cards only where a grid of promos earns them.
3. **One accent, used as a verb.** Azure for links, hover, labels, live state.
   No red in the chrome — red is data semantics (election fronts) only.
4. **Tokens over literals.** Colors from the `@theme` block in
   `src/styles/app.css`; type from the named scale; never raw hex.
5. **Dark mode is a twin, not a tint.** Every band carries `dark:` variants
   (`brand-elevated` surfaces, `ivory` text, `white/10` borders).
6. **A band is data + props.** A new section is a new data slice and a
   `BandHeading` label, not a new component.

---

## Related

- `/design/newo` — this page, rendered with the components themselves
- `/guided/home` — the homepage as a guided tour (first three bands)
- `docs/design-system.md` — the system these bands are built on
- `src/lib/home4-data.ts` — the snapshot data behind every band

---

*Last updated: August 2026*
