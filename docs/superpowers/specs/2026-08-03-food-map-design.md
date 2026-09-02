# The Food Map — design

> Status: approved · 3 August 2026
> Covers `/food-map`, the extraction of a reusable map component, and the
> Kodachadri trek addition.

## 1. Summary

A new page at `/food-map` that answers one question: **where do I eat this dish?**

The reader picks a dish from an index; the map pins every place in Kerala that
serves it and a list names them. A district filter narrows both. The whole page
reads in Malayalam or English on a toggle.

Building it requires a map component that works on its own, which the site does
not currently have — `InlineMap.astro` only renders because `RouteMap.astro`
happens to be on the same page and carries the Leaflet loader and every shared
style inside itself. That extraction is part of this work, not a follow-up.

## 2. Scope

**In**

- `src/lib/food-map.ts` — districts, dishes, places, and the lookups over them.
- `src/components/map/MapBase.astro` — the Leaflet loader, tile theme and pin
  styles, extracted from `RouteMap.astro`; one copy for the whole site.
- `src/components/map/PinMap.astro` — a multi-pin map driven by page events.
- `RouteMap.astro` and `InlineMap.astro` refactored onto `MapBase`, keeping
  their own behaviour and losing only the duplicated boot.
- `src/pages/food-map.astro` — the page.
- A language toggle mechanism, set pre-paint in `Layout.astro`.
- Kodachadri added to `src/lib/travelogue.ts`.

**Out**

- Translating the rest of the site. The toggle mechanism is general, but only
  `/food-map` carries paired strings for now.
- User-submitted places, ratings, reviews, opening-hours accuracy.
- A backend. This stays a static build on Cloudflare Pages.
- Clustering. At ~40 pins across Kerala, clustering costs more than it returns;
  revisit past ~150.

**Guardrails**

Everything in `AGENTS.md` applies: tokens over literals, hairline rules over
cards, square geometry, no gradients, no pure black or white, `text-balance` on
headings, `prefers-reduced-motion` respected. The Leaflet control surface is
themed to match, as `RouteMap` already does.

## 3. Data model — `src/lib/food-map.ts`

Three entities. Bilingual fields sit side by side on the same object, the
convention `travelogue.ts` already established — the plain field is English,
the `ML` suffix is Malayalam.

```ts
export type DistrictId =
  | 'kasaragod' | 'kannur' | 'wayanad' | 'kozhikode' | 'malappuram'
  | 'palakkad' | 'thrissur' | 'ernakulam' | 'idukki' | 'kottayam'
  | 'alappuzha' | 'pathanamthitta' | 'kollam' | 'thiruvananthapuram';

export interface District {
  id: DistrictId;
  name: string;
  nameML: string;
  /** Where the map settles when this district is the filter. */
  center: [number, number];
  zoom: number;
}

export interface Dish {
  id: string;                    // slug, e.g. 'thalassery-biryani'
  name: string;
  nameML: string;
  /** One line: what it is. */
  blurb: string;
  blurbML: string;
  kind: 'breakfast' | 'rice' | 'bread' | 'seafood' | 'snack' | 'sweet' | 'drink';
  /** Where the dish is *from* — not where it is served. */
  origin: DistrictId[];
  image?: string;
  credit?: string;
}

export interface Place {
  id: string;
  name: string;
  nameML: string;
  /** Town or locality, not a full postal address. */
  town: string;
  townML: string;
  district: DistrictId;
  coords: [number, number];      // [lat, lng]
  /** Dish ids this place is known for. The join. */
  serves: string[];
  /** One editorial line. */
  note: string;
  noteML: string;
  since?: number;
  hours?: string;
}
```

### Why it is shaped this way

**`Place.serves` is a many-to-many join.** A place serves several dishes; a
dish is served in several places. Modelling it as ids on the place — rather
than nesting places inside dishes — is what makes "dish → who serves it" a
lookup instead of a duplicated list, and it lets a place appear under every
dish it deserves while existing once in the data.

**`Dish.origin` is not `Place.district`.** Thalassery biryani originates in
Kannur and is served in Kozhikode and Ernakulam. Collapsing origin into
service locations would make the district filter assert something false.

**The district filter narrows the dish index, not only the map.** Filtering to
Wayanad shows only dishes actually served in Wayanad, each with its count. A
reader can never select a dish and land on an empty result — the dead end is
designed out rather than handled with an empty state.

### Lookups

Pages stay presentational (`AGENTS.md`), so every derivation lives here:

```ts
/** Places serving a dish, optionally within one district. */
export const placesServing = (dishId: string, district?: DistrictId): Place[]

/** Dishes available in a district (or everywhere), with a count of places. */
export const dishesIn = (district?: DistrictId): { dish: Dish; count: number }[]

export const dishById = (id: string): Dish | undefined
export const districtById = (id: DistrictId): District | undefined

/** Districts that have at least one place — never offer a dead filter. */
export const activeDistricts = (): District[]

/** Default map view for "all of Kerala". */
export const KERALA_EXTENT: { center: [number, number]; zoom: number }
```

### Content

All 14 districts are defined as filters. The seed is roughly 14–18 dishes and
~40 places — real, well-known eateries with approximate real coordinates, the
same honesty convention `travelogue.ts` states for waypoints: good enough to
find the place, not survey data. Editorial notes are written, not generated
filler.

Every district referenced by `activeDistricts()` must have at least one place,
so no filter option is ever dead. Districts with no place are simply absent
from the filter rather than shown disabled.

Dish images, where used, are Wikimedia Commons files carrying their author and
licence in `credit`, matching the rule at the top of `travelogue.ts`: replacing
an image means replacing its credit with it.

## 4. Map components — `src/components/map/`

### The problem being fixed

`RouteMap.astro` currently owns four things that are not its own: the Leaflet
stylesheet link, the Leaflet script tag, the `<style is:global>` block defining
`.route-map` tile theming and `.route-pin` styling, and the `whenReady` poller.

`InlineMap.astro` uses all four and defines none of them. Its own comment says
so: *"Leaflet is loaded once by RouteMap and reused here."* An `InlineMap` on a
page without a `RouteMap` renders an empty box. A third map written the same way
would be the third independent copy of the same operation — the case the
architecture principles flag as a defect.

### `MapBase.astro`

Owns the shared substrate, and nothing about any particular map.

- **Loader.** Injects the Leaflet CSS and JS once, guarded by element id, so
  the component is safe to include any number of times per page:

  ```js
  if (!document.getElementById('leaflet-js')) { /* inject css + js */ }
  ```

  Idempotent by construction rather than by page-authoring discipline. This is
  the load-bearing change: it is what lets any map component stand alone.

- **Readiness.** Exposes `window.mapReady(fn)`, resolving when `window.L`
  exists and giving up quietly after ~10s, preserving the existing behaviour
  and the existing contract that the page is complete without a map.

- **Theme.** The tile-pane filter (light and `:root.dark`), container
  background, attribution styling, `.route-pin` / `.route-tip` /
  `.route-pointer` rules — moved verbatim from `RouteMap`. Astro bundles a
  component's styles once regardless of instance count, so these deduplicate
  without further work; only the inline loader needed the guard.

Class names stay `.route-map` / `.route-pin` to keep the refactor of the travel
components a move rather than a rewrite. They are now general map classes that
happen to be named after their first use.

### `PinMap.astro`

The new map: many pins, driven from outside.

```ts
export interface MapPin {
  id: string;
  label: string;
  labelML: string;
  coords: [number, number];
}

export interface Props {
  id?: string;
  pins: MapPin[];
  center: [number, number];
  zoom: number;
  class?: string;
}
```

It communicates through DOM events rather than exported functions, because the
filter logic lives in the page's inline script and there is no client framework
to hold a shared reference:

| Direction | Event | Payload | Effect |
|---|---|---|---|
| page → map | `map:pins` | `{ ids: string[], fit?: boolean }` | show these pins, hide the rest; refit bounds when `fit` |
| page → map | `map:focus` | `{ id: string \| null }` | highlight one pin, or clear |
| map → page | `map:select` | `{ id: string }` | a pin was clicked |

`PinMap` knows about pins and ids. It knows nothing about dishes, restaurants,
or districts, so the next page that needs a map of things — bureaus, results,
listings — mounts the same component.

Behaviour: `scrollWheelZoom` off (the page owns the wheel, as `RouteMap` has
it), zoom control top-right, unlabelled Carto basemap so place names come from
the prose, `fitBounds` with padding when the visible set changes, and no
animation under `prefers-reduced-motion`.

### Refactoring the travel components

Both keep every behaviour they have; both lose only the boot.

- **`RouteMap.astro`** — keeps the HUD, the two-line route, the travelling
  pointer, the chapter `IntersectionObserver`, the reveal-after-hero and the
  permanent dismiss. Drops the Leaflet tags, the global style block and
  `whenReady`.
- **`InlineMap.astro`** — keeps zoom-on-arrival. Drops `whenReady`. Starts
  working standalone, which is the acceptance criterion for this refactor.

`/travel/[trek]` must look and behave identically afterwards. That is the
regression risk this section accepts, and §11 says how it is checked.

## 5. The page — `/food-map`

On the standard inner-page shell, composed exactly as `/shelf/index.astro`
does: `Layout` → `HeaderBar` → `DeskMasthead` → content → `Footer`. No new
chrome, no immersive treatment — this is a tool, not an essay.

```
DeskMasthead     ഭക്ഷണ ഭൂപടം · The Food Map              [ മല | EN ]
─────────────────────────────────────────────────────────────────
Filter bar       District ▾    Search ______    N dishes · N places
─────────────────────────────────────────────────────────────────
Dish index       │  PinMap
 hairline rows   │   pins for the selected dish
 count per dish  │   (sticky on desktop)
─────────────────────────────────────────────────────────────────
Results          places serving the selected dish
                 hairline rows · hover ↔ pin highlight
```

**Desktop** — two columns, dish index left, map right and sticky within the
section. Results run full width beneath.

**Mobile** — stacked. Filter bar, then the map (sticky under the filter bar so
it stays visible while scrolling results), then the dish index, then results.

**Composition rules** — hairline-separated rows throughout, never cards, never
nested cards. The dish index is a list of rows: Malayalam name, English name,
place count in `tabular-nums`. The result list is a row per place: name, town,
district, editorial note. Selected dish row is marked with the `azure` accent,
the site's single reserved accent.

**List ↔ map coupling** — hovering or focusing a result row emits `map:focus`;
clicking a pin emits `map:select`, which highlights and scrolls to the matching
row. Keyboard focus drives the same highlight as hover, so the coupling is not
mouse-only.

## 6. URL state

State lives in the query string:

```
/food-map?dish=thalassery-biryani&district=kannur
```

Read on load, written with `history.replaceState` on every change. `replaceState`
rather than `pushState`: filtering is refinement, not navigation, and it should
not bury the previous page under a stack of back-button steps.

A dish someone found is therefore a link they can send, and the page restores
exactly. Unknown or malformed values fall back to the unfiltered view rather
than erroring — a stale link degrades to a working page.

No framework. An inline script, matching how the rest of the site handles
interactivity.

## 7. Language

A `[ മല | EN ]` toggle in the masthead.

Every bilingual string ships as a sibling pair in the HTML; a class on `<html>`
decides which is shown:

```html
<h3 data-ml lang="ml">തലശ്ശേരി ബിരിയാണി</h3>
<h3 data-en lang="en">Thalassery Biryani</h3>
```

```css
.lang-ml [data-en] { display: none; }
.lang-en [data-ml] { display: none; }
```

`Layout.astro` server-renders `<html lang="ml" dir="ltr" class="lang-ml">` —
Malayalam is the default and it is in the markup, not applied by script. The
pre-paint inline script, beside the existing theme script, then swaps the class
to `lang-en` if `localStorage.getItem('lang')` says so. Same pattern as the
dark-mode toggle, so there is no flash of the wrong language, and with
JavaScript disabled the page is simply Malayalam rather than both languages at
once.

Three details that make this real rather than cosmetic:

1. **The toggle sets `document.documentElement.lang`** as well as the class.
   `Layout.astro` currently hard-codes `lang="ml"`; leaving it wrong in English
   mode would mislead screen readers and font fallback.
2. **Hiding is CSS-only, and that is sufficient for assistive tech.**
   `display: none` already removes an element from the accessibility tree, so
   a screen reader reads one language, not both. No `hidden` attribute and no
   `aria-hidden` — and deliberately so: a server-rendered `hidden` attribute
   would have to pick a language at build time, and the other one could then
   never appear without JavaScript. Hiding must stay in the layer the toggle
   controls.
3. **Search matches both languages in either mode.** Typing "biryani" while
   reading Malayalam still finds ബിരിയാണി. Search is a lookup, not a display
   concern, so it queries `name` and `nameML` regardless of the active
   language.

The mechanism is general — the class and the pre-paint script live in
`Layout.astro` — but only `/food-map` carries paired strings in this work.

## 8. States and failure modes

| Condition | Behaviour |
|---|---|
| No dish selected | Map shows every place; results list is replaced by a written invitation to pick a dish, in both languages. |
| Search matches nothing | A written line naming what was searched, plus a clear-search action. Not a shrug or a bare "0 results". |
| District with no dishes | Cannot occur — `activeDistricts()` only offers districts that have places (§3). |
| Dish with no places | Cannot occur — the dish index is derived from `dishesIn()`, which counts places. |
| Leaflet fails to load | The dish index, filters, search and result list remain fully usable. The map area collapses rather than leaving a broken grey box. `mapReady` gives up quietly after ~10s. This is the contract `RouteMap` already honours: the page is complete without the map. |
| JavaScript disabled | The page renders in Malayalam (`class="lang-ml"` is server-rendered) with all dishes and all places listed. Filtering, the map and the language toggle are enhancements; the content is in the HTML either way. |
| `prefers-reduced-motion` | No `flyTo` animation, no fit-bounds easing — the map jumps. Consistent with `RouteMap` and `InlineMap`. |

## 9. Kodachadri

A fourth `Trek` in `src/lib/travelogue.ts`. Data only — the `Trek`, `Waypoint`
and `Block` interfaces already describe it, `/travel/[trek]` generates its page
from `getStaticPaths`, and `TrekList` picks it up on the `/travel` section page.
No new component.

- **Slug** `kodachadri`, Shimoga district, Karnataka. ~1,343 m.
- **Waypoints** — Nittur / Karakatte trailhead, Hidlumane Falls, the shola
  stretch, Sarvajna Peetha, and the summit ridge. Coordinates approximate along
  the known ridge line, per the file's stated convention.
- **Chapters** — one per waypoint, written in the existing block vocabulary
  (`text`, `photo`, `map`, `food`, `sight`, `note`).
- **One `food` block**, at the trailhead or the Moodalamane rest stop — the
  trek that connects to the food map by more than coincidence.
- **Photographs** — Wikimedia Commons only, each carrying its author and
  licence in `credit` / `credit2`, per the rule at the top of the file. Every
  image must actually depict Kodachadri; a plausible-looking Western Ghats
  photograph of somewhere else is a defect, not a placeholder.
- **Facts to state carefully** — the jeep track from Nittur, the Mookambika
  reserve forest, the monsoon leech season, and that the summit is a
  pilgrimage site as much as a trek.

## 10. Files

**New**

```
src/lib/food-map.ts
src/components/map/MapBase.astro
src/components/map/PinMap.astro
src/pages/food-map.astro
```

**Modified**

```
src/components/travel/RouteMap.astro     drop boot + global styles → MapBase
src/components/travel/InlineMap.astro    drop whenReady → MapBase
src/layouts/Layout.astro                 pre-paint lang class + .lang-* rules
src/lib/travelogue.ts                     + Kodachadri
src/lib/navigation.ts                     + /food-map entry
src/lib/site-sections.ts                  + /food-map entry
```

Navigation placement: under the Travel desk, since the map is a travel tool.
If that reads wrong once rendered, it moves — it is one line.

## 11. Verification

1. `npm run build` succeeds; `/food-map` and `/travel/kodachadri` are in
   `dist/`.
2. **Travel regression** — `/travel/kumara-parvatha` renders identically to
   before the refactor: HUD appears after the hero, chapters drive the route,
   the pointer walks each leg, inline maps zoom in on arrival, close is
   permanent. This is the risk the §4 refactor accepts.
3. **Standalone map** — `/food-map` renders its map with no `RouteMap` on the
   page. This is the acceptance criterion for the extraction; it fails today.
4. **Dish → places** — selecting a dish pins exactly the places whose `serves`
   contains it, and the result count matches the index count.
5. **District narrowing** — selecting a district reduces the dish index to
   dishes served there; no dish in the index yields zero results.
6. **URL round-trip** — filter, copy the URL, open it fresh, and the same dish
   and district are selected.
7. **Language** — toggling switches every string on the page, sets
   `<html lang>`, survives reload with no flash, and search still matches both
   languages in either mode.
8. **Degradation** — with Leaflet blocked, the page is still usable and shows
   no broken map box.
9. **Baseline rules** — no gradients, no pure black or white, no raw hex, no
   nested cards, `prefers-reduced-motion` honoured, `aria-label` on icon-only
   buttons.
