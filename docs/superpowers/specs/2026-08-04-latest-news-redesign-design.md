# Latest News — design

> Status: approved · 4 August 2026
> Covers the rewrite of `/latest-news` onto the standard desk shell, the
> archive of the page it replaces, and the aggregation that feeds it.

## 1. Summary

`/latest-news` is the last page in the repo still on the pre-port design. It
renders `OldHeader`, a **gradient** `SectionHeader` — which `AGENTS.md` bans
outright — and the `ArticleCard` / `CardGrid` / `SectionBlock` set that every
other listing has moved off. It also sorts its stories **alphabetically by
title**, which is not "latest" under any reading of the word.

It is rebuilt on the shell `/` and all eleven `/<desk>` pages already share:
`HeaderBar` → `SectionSubNav` → `DeskPage` beside `DeskRail` → paginated list.
No new page components. The page becomes a desk whose stories happen to come
from every desk, which is what a site-wide river is.

The design deliberately does **not** invent a distinct instrument — no time
spine, no day dividers, no bespoke lockup. Consistency with the desk pages was
chosen over differentiation.

## 2. Scope

**In**

- `src/lib/desk.ts` — `getLatestDesk()`, a synthetic desk pooling every source.
- `src/pages/latest-news.astro` — rewritten to the standard shell (page 1).
- `src/pages/latest-news/page/[n].astro` — pages 2+.
- `src/pages/old-latest-news.astro` — the current page, archived verbatim.
- `src/components/desk/DeskPage.astro` — one new optional prop
  (`latestViewAllHref`) so the page's own list heading does not link to itself.

**Out**

- The ~10 `viewAllHref="/latest-news"` call sites across the repo. They all
  still resolve; none needs touching.
- `OldHeader`'s search form, which posts to `/latest-news`. The rewritten page
  ignores a `?q=` it never read before either — unchanged behaviour, not a
  regression, and search is its own piece of work.
- Any change to the eleven real desks.

## 3. The archive

`src/pages/latest-news.astro` moves to `src/pages/old-latest-news.astro`
**verbatim**, then gains the three things `/old-home` and `/old-section/<id>`
both carry:

- a header comment naming what it archives and why,
- `noindex` on the `Layout`,
- `— MediaOne (previous design)` appended to the document title.

It keeps its own copy of the markup rather than sharing a component, matching
`/old-home` (a page) rather than `/old-section/<id>` (which shares
`LegacyDeskPage` with a live route). Nothing else renders this composition, so
there is nothing for the archive to drift from.

Every component it imports — `OldHeader`, `SectionHeader`, `SectionBlock`,
`ArticleCard`, `ArticleList`, `CardGrid` — still exists and stays exported. The
archive is not a licence to delete them.

## 4. Data — `getLatestDesk()`

Lives in `src/lib/desk.ts`, which already owns `Desk` construction (`getDesk`,
`getSubDesk`).

```ts
export const LATEST_DESK_ID = 'latest-news';
export function getLatestDesk(): Desk
```

Returns a `Desk` with `id: 'latest-news'`, `label: 'Latest News'`,
`labelML: 'പുതിയ വാർത്തകൾ'`, and a `stories` pool built in this order, then
**deduped by `href`**, first occurrence winning:

1. `leadStories`, `latest` and `feed` from `home4-data.ts` — the live snapshot,
   already in the order the live site published them.
2. Each live `sections[].stories`, in live homepage band order.
3. The `sections.ts` fixture tail, mapped to `LiveStory` and sorted by parsed
   `date` **descending**. A `date` that does not parse sorts to the end rather
   than to 1970, so one malformed fixture cannot jump the queue.

Dedup matters: the live `latest` array and the live `sections` bands overlap —
the Palakkad lorry story appears in both — and a river that prints the same
headline twice reads as broken.

**Stated limitation.** Most live-snapshot stories carry no date at all, so the
ordering across sources is *source order*, not a true merge sort by timestamp.
The fixture tail is genuinely sorted; the live block is trusted to already be
newest-first because that is how it was captured. No timestamps are fabricated
to paper over the seam. This is recorded in a comment at the function, not left
for a reader to discover.

`feed` items are `FeedItem` (`LiveStory` plus a `time` like `"18:18"`). They
enter the pool as plain `LiveStory`; the clock time is not promoted into `date`,
because the rest of the pool's dates are calendar dates and mixing the two in
one column would print `18:18` beside `June 12, 2026`.

## 5. Rendering

`latest-news.astro` becomes a copy of the ported branch of `[section].astro`:

```
Layout (adTone="gray")
  HeaderBar isBreaking={false} showTopics={false} liveUnit
  SectionSubNav pathname="/latest-news"
  main
    DeskPage desk={getLatestDesk()} page={getDeskPage(desk, 1)}
             videos={allVideos.slice(0, 5)}
             trending={latest.slice(0, 5)}
             latest={latest.slice(5, 11)}
             latestViewAllHref={null}
  Footer
  VideoModal + ScheduleList
```

Three behaviours fall out of the existing code with no special-casing:

- **Sub-nav renders.** The `News` nav item in `mega-nav.ts` is already
  `href: '/latest-news'` with a Kerala / National / International / Fact Check
  column, so `subNavFor('/latest-news')` resolves and the strip appears.
- **Density is `rich`.** The pool clears `RICH_MIN` (20) comfortably, so
  `densityPlan` grants the three-up row, the thumbed rows, the mid-column ad
  and the sub-section slot.
- **No sub-section blocks.** `subsectionLinks('latest-news')` keeps only links
  under `/latest-news/`, and the IA has none. The desk correctly renders zero
  blocks despite `plan.subsections` being true.

`featureFor('latest-news')` returns undefined — only `travel` declares a
feature — so no promo renders.

Ad slots derive from the desk id: `latest-news-rail`, `latest-news-rail-top`,
`latest-news-inline`.

## 6. Pagination

`src/pages/latest-news/page/[n].astro`, mirroring
`src/pages/[section]/page/[n].astro`:

- `getStaticPaths` emits `2 … pageCountFor(getLatestDesk())`.
- `noindex`, because each page is a slice of one list and `/latest-news` is the
  URL worth ranking.
- `rel=prev`/`rel=next` come from `DeskPage`'s existing pagination nav.

`pageHref('latest-news', n)` already produces `/latest-news/page/N`, so the URL
shape needs no new code.

A page file and a same-named directory coexist fine in Astro — `[section].astro`
and `[section]/page/[n].astro` already do exactly this.

## 7. The `latestViewAllHref` prop

`DeskPage` hardcodes its list heading as:

```astro
<BandHeading label="Latest" href={`/${desk.id}`} viewAllHref="/latest-news" />
```

On `/latest-news` both of those point at the page being read. Special-casing
`desk.id` inside a shared component to fix it would make the component know
about one page, so instead:

```ts
/** Where the Latest heading's "View all" points. Pass null to omit the link —
 *  the site-wide river is already the page it would link to. */
latestViewAllHref?: string | null;   // default '/latest-news'
```

`null`, not `undefined`: a destructuring default fires **on** `undefined`, so
`latestViewAllHref={undefined}` would silently get `/latest-news` back and the
self-link would survive. `BandHeading` takes `viewAllHref?: string`, so the
render site passes `latestViewAllHref ?? undefined` and omits the link when
falsy.

All eleven desks are unchanged by the default. `/latest-news` passes `null`. The `href` on the label itself resolves to `/latest-news` — the page's
own canonical URL — which is correct for a heading that names the list below it.

## 8. Verification

- `npm run build` succeeds and emits `dist/latest-news/index.html`,
  `dist/latest-news/page/2/index.html`, `dist/old-latest-news/index.html`.
- No `bg-gradient-*` in the new page's output.
- The list is not alphabetical: the first story on page 1 is the live lead, not
  the story whose title sorts first.
- No headline appears twice across page 1 and page 2.
- The eleven desk pages still render their `Latest → View all` link.
- Light and dark both read correctly; the rail sticks.
