# /features/wayanad-slide — a scroll-driven terrain feature

> Status: built as a prototype. Design recorded after the fact, because the
> brief was "make the skeleton, immediately".

## What it is

A page about Wayanad's geography that reads as prose on paper and, four times,
hands the whole viewport to real 3D terrain while the reader scrolls through a
camera move. The terrain is the argument: Wayanad sits on top of the Western
Ghats, and the settlements the story names sit on a near-level valley floor
beneath a two-thousand-metre wall. A flat map cannot say that.

Not journalism. Real place, real ground, placeholder words.

## Decisions

| Question | Answer |
|---|---|
| Story | The 2024 Mundakkai–Chooralmala landslide, told as terrain |
| Rigor | Prototype on real terrain; narration is placeholder, marked on the page |
| Reading model | **Acts** — prose on paper, terrain takes over four times, then releases |
| Stack | Hybrid: MapLibre GL for the world, Three.js for what a map cannot draw |
| Archive band | Dummy rows, structural only |

The reading model was chosen over full-bleed-3D and split-screen because it
keeps Malayalam on clean paper and only pays the 3D cost when the terrain is
the point.

## Shape

```
ImmersiveBar
Hero              standfirst, Malayalam lead, prototype notice
Facts + Locator   figures read off the data; Leaflet locator reuses MapBase + PinMap
Interlude         paper
▸ ACT 1  Up the wall        320vh — camera scrubs
Interlude         paper
▸ ACT 2  The wall above     320vh
Interlude         paper
▸ ACT 3  The channel        320vh — the Three.js ribbon arrives along its length
Interlude         paper
▸ ACT 4  In the way         320vh
Interlude         paper
Archive band + attribution
Footer
```

**One canvas, four scroll ranges.** A single MapLibre canvas is `position:
fixed` at `opacity: 0`. Each act is a tall section; when its middle is the
middle of the screen it owns the camera and the canvas fades in. No map per
act, no re-init, no layout thrash.

**Scrubbing, not playing.** Act progress `p ∈ [0,1]` interpolates between that
act's camera keys and calls `jumpTo` once per rAF. Scroll up and the move runs
backwards. The reader owns the camera.

**Stacking.** The stage is `z-index: 0` and fixed; every other block on the
page carries `relative z-10` and an opaque background. That alone makes the
terrain show through the acts and be covered by everything else — no
scroll-driven show/hide of page content.

## Who owns what

**MapLibre** — coordinates, streamed DEM, the terrain mesh, and a camera with
pitch and bearing. Everything that has to be *true* about where things are.

**Three.js** — the channel ribbon: a body with width, lying on the valley
floor, with a lit head that travels down it as act 3 scrolls. A map layer can
draw a flat line, all of it at once; it cannot do that. It runs as a custom
layer inside MapLibre's GL context, so there is one canvas and one camera
rather than two chasing each other.

## Data: derived, not recalled

| Thing | Source |
|---|---|
| Terrain, elevations | AWS Terrain Tiles (terrarium), Registry of Open Data on AWS |
| Places, Malayalam names | OpenStreetMap — Nominatim and Overpass |
| The channel | OpenStreetMap — the four ways named Punnappuzha, stitched and oriented downhill |
| Basemap | CARTO voyager_nolabels, held back to 50% opacity |

An earlier draft had hand-typed coordinates. They put Chooralmala four
kilometres from where it is, on a ridge at 1,450 m rather than on the valley
floor at 840 m. Anything added to `lib/wayanad.ts` should be looked up.

**No landslide runout is drawn.** It is in no open dataset this page can cite,
and a plausible-looking line would be inventing evidence. What is drawn is the
river, labelled as the river.

## Narration rule

Placeholder copy over a real disaster is one step from reading as reporting, so
`lib/wayanad.ts` tightens the rule already used by `lib/dummy-text.ts`:

> Narration describes the land and the view only. No casualties, no timings, no
> causes, no outcomes, no names of people. Nothing in the file can be true or
> false about what happened — only about where it is.

A desk replacing this with reporting replaces the `ml`/`en` strings and nothing
else. The camera work is independent of the words.

## Four things that fail silently

Each cost real time; each is commented where it bites.

1. **DEM CORS.** The DEM must come from the virtual-hosted S3 host
   (`elevation-tiles-prod.s3.amazonaws.com`). The path-style URL serves
   identical bytes with no CORS headers. A `raster-dem` source is read
   pixel-wise rather than drawn as an `<img>`, so it fails with no error: the
   terrain source never finishes and `load` never fires. Leaflet is unaffected,
   which is why it is easy to get wrong.

2. **Vite and the MapLibre worker.** `maplibre-gl` must be in
   `optimizeDeps.exclude`. Pre-bundling rewrites its web worker URL to one
   nothing serves; the map builds a canvas and then never loads. `three` goes
   in `include` — both are lazily imported, and a late-discovered dep triggers a
   re-optimize that 504s the very import that caused it.

3. **The custom-layer matrix.** Use
   `options.defaultProjectionData.mainMatrix`. `modelViewProjectionMatrix` is
   right there, looks correct, and draws nothing you can find.

4. **Markers under terrain.** `maplibregl.Marker` is placed at sea level, about
   170 px from the ground it names at a low camera angle — every label ends up
   on the wrong side of the ridge. `map.project()` *is* terrain-aware, so labels
   are positioned by hand on every render, with a small declutter pass.

## Failure and motion

The page is complete without any of it. Both libraries load only when the
reader is within a viewport of act 1, so no other page on the site pays for
them.

- Library import, map construction, or GL context lost → `fail()`: the stage is
  hidden, acts collapse to short static sections, prose carries the piece.
- Tile 404s are survivable and logged, not fatal.
- The ribbon layer throwing leaves the map intact.
- **Reduced motion** → each act becomes one still view at its final key and the
  sections shrink to `100vh`, so the dead scroll that existed only to drive a
  camera goes with it.

## Verified

Driven with Playwright against installed Chrome (SwiftShader):

- boots, arms, 320vh acts, zero console errors
- camera scrubs; narration and labels track the active act
- the ribbon drapes onto terrain and reveals with act 3
- Chooralmala's label lands on the head of the channel, as the data says
- reduced motion: acts are exactly `100vh`
- JS disabled: h1, four act titles, five interludes, archive links all present;
  stage `visibility: hidden`

## Known rough edges

- Ribbon width (90→240 m) is a legibility figure, not a gauge; at this zoom a
  true-width river would be two pixels.
- No terrain occlusion for labels — a label behind a ridge still shows.
- Act pacing (320vh) and the camera keys are eyeballed, not tuned.
- Only checked at 1440×900 and 1280×800; mobile framing is untested.
