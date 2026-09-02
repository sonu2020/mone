# /features/thamarassery-churam — the climb, as a wireframe

> Status: designed, not built. First cut deliberately small; detail comes later.

## What it is

Nine hairpin bends is a number. What it *means* is that NH 766 spends six
kilometres on a table at 50 m and then has to reach 761 m, and the only way up
is to double back on itself nine times.

A photograph flattens that. A satellite drape flattens it too — the eye reads
green and reads jungle, not gradient. So this page draws the ground as a bare
wireframe on black: a DEM grid, the real road laid on it, nine bends lit and
numbered. Scroll drives distance along the road; a chase camera follows.

Not journalism. Real road, real ground, no narration in this cut.

## Decisions

| Question | Answer |
|---|---|
| Renderer | **Three.js wireframe mesh.** Not MapLibre — see below |
| Reading model | One continuous traverse, scroll-scrubbed |
| Camera | Chase: behind and above a marker, aimed down a *look-ahead* tangent |
| First cut | Terrain + road + 9 bends + place labels + elevation strip |
| Deferred | Malayalam narration, hero prose, interludes, article furniture |
| WebGL | **Required.** Not a progressive enhancement |

### Why not TerrainStage

`components/terrain/TerrainStage.astro` already drives MapLibre + DEM for
`/features/wayanad-slide` and `/features/kerala-floods-2018`, and reusing it was
the first thing considered. It is the wrong fit twice over:

- It is built around **acts** — discrete camera moves over static terrain, each
  owning a scroll range. This piece is one continuous traverse along a route.
- MapLibre draws a *shaded surface*. There is no way to get a visible grid out
  of it, and the grid is the entire aesthetic argument here.

It is also 914 lines. That shape is worth not repeating.

What *is* reused is every proven pattern inside it, listed under
"Reuse" below. The novelty here is the renderer and the camera, nothing else.

## Shape

```
ImmersiveBar
Hero            title, the two numbers (50 m → 761 m), prototype notice
Facts + Locator PinMap locator, figures read off the data
▸ THE DRIVE     ~600vh — one scroll range, one camera move, nine bends
Bend table      all nine, with elevation and turn direction
Attribution
Footer
```

**One canvas, one scroll range.** The `<canvas>` is `position: fixed` behind the
page; the drive section is a tall block, and while its middle is the middle of
the screen it owns the camera. Same stacking contract the Wayanad page uses:
stage at `z-index: 0`, every other block `relative z-10` with an opaque
background. No scroll-driven show/hide of page content.

**Scrubbing, not playing.** Scroll position → distance along the route → camera
pose, once per rAF. Scroll up and you descend. The reader owns the camera.

## Modules

Six small files, each with one job.

| File | Job |
|---|---|
| `lib/churam.ts` | The data: route with elevations, 9 bends, 4 places, bbox, tuning |
| `lib/churam-terrain.ts` | Fetch terrarium tiles → decode → heightfield grid |
| `components/churam/ChuramDrive.astro` | Markup, styles, scroll wiring. Thin |
| `components/churam/drive-scene.ts` | Wireframe mesh, road ribbon, bend markers |
| `components/churam/drive-camera.ts` | Distance along route → camera pose |
| `components/churam/drive-profile.ts` | The canvas elevation strip |
| `components/churam/drive-labels.ts` | Screen-space label placement |
| `pages/features/thamarassery-churam.astro` | The page |

`drive-scene`, `drive-camera`, `drive-profile` and `drive-labels` are plain
modules with no DOM assumptions beyond the element handed to them, so each can
be reasoned about — and broken — on its own.

## Data: derived, not recalled

Per the rule at the top of `lib/terrain.ts`. A build script runs this once and
bakes the result into `lib/churam.ts`; the page never calls Overpass.

1. **Overpass** → `way["ref"="NH766"]` in bbox `11.470,75.980,11.530,76.060`.
2. **Stitch** — greedy end-to-end join, 30 m snap tolerance, seeded from the
   south-west end. Verified: 24 ways → one chain, 728 points, 20.86 km, none
   left over.
3. **Trim** to km 5.0–18.5 — 1.3 km of flat plain first, so the reader feels the
   table before the wall, then the whole climb.
4. **Detect hairpins** by total turn over a sliding window (see below).
5. **Sample the DEM** per point, zoom 13 (≈19 m/px here).
6. **Thin** to ~250 points.

### Measured, already

Run during design, not recalled:

| | |
|---|---|
| Adivaram (foot) | 50 m — 11.48498, 76.01261 |
| Chippilithodu | 204 m — 11.48654, 76.02311 |
| Bend 7 (OSM-named) | 470 m — 11.50528, 76.02846 |
| Bend 8 (OSM-named) | 491 m — 11.50371, 76.02726 |
| Lakkidi viewpoint | 727 m — 11.51184, 76.01883 |
| Lakkidi (top) | 761 m — 11.52057, 76.02035 |
| Chain low / high | 34 m / 771 m |

All six place names and Malayalam names come from OSM. All elevations are
sampled from the DEM.

### The bend count is the one soft spot

The commonly cited figure is nine. **OSM names only two of them** — nodes
tagged `7Th Hair pin bend` and `8Yh Hair pin bend` (sic, both). Those two are
the only hard evidence available.

A turn-angle detector reproduces both within ~10 m, which is a genuine
validation of the method. But the *count* it returns depends on its thresholds:
a 60 m window at ≥100° gives nine over the climb; ≥110° gives six. Nine was
reachable only by tuning toward a number already known — that is fitting, not
sourcing.

So the acceptance test is **ordinal, not cardinal**:

> Calibrate the detector until the bend at 11.50528, 76.02846 comes out as #7
> and the bend at 11.50371, 76.02726 comes out as #8, counting from Adivaram.
> Whatever total that calibration yields is the total the page shows.

If it settles on eight or ten, the page says eight or ten and the discrepancy
with the popular figure is noted on the page. It must not be tuned until it
agrees with Wikipedia.

**Outcome (built).** The sweep found ten parameter sets that satisfy the
ordinal constraint. Eight of them yield nine bends; two yield ten. Nine is
therefore the majority outcome of a constraint that never mentioned nine — not
a number that was aimed at. The chosen detector (±40 m window, ≥95°, 140 m
merge) places bend 7 within **8 m** of its OSM node and bend 8 within **15 m**.
Both are asserted in the acceptance tests.

### Terrain

Not baked. The heightfield streams the **same terrarium tiles the site already
uses** (`TERRAIN_TILES` in `lib/terrain.ts`), ~9 tiles at zoom 13, decoded
through a `<canvas>` with `getImageData` and assembled into a `Float32Array`
grid. Elevation is `(R * 256 + G + B / 256) - 32768`.

The virtual-hosted S3 host is mandatory — see the CORS note in `lib/terrain.ts`.
Here it fails loudly rather than silently, because we read the pixels ourselves.

## The camera — where the motion lives

The route becomes a `THREE.CatmullRomCurve3` in a local metric frame: metres
east/north of the bbox origin, `y` = elevation × exaggeration.

Scroll progress `p ∈ [0,1]` → `curve.getPointAt(p)` for the marker.

**The naive chase camera is unwatchable.** Aim it down the instantaneous tangent
and it whips through 170° at every hairpin. The fix is the one idea this page
turns on:

> Aim down the tangent **averaged over the next ~150 m of route**, not the
> instantaneous one.

Through a switchback that averaged heading barely moves while the marker sweeps
the full turn — so the camera hangs wide and steady and the bend unrolls
beneath it. That is what makes a hairpin read as a *shape* rather than as a wall
in the windscreen. Camera position is exponentially smoothed on top, per frame,
frame-rate independent.

Roughly: camera at `point − aheadTangent × BACK + up × HEIGHT`, looking at
`point + aheadTangent × AHEAD`. `BACK`, `HEIGHT`, `AHEAD` and the averaging
distance are named constants in `lib/churam.ts`, not scattered literals.

## Two views

A toggle switches between watching the road and being on it. Both are
scroll-scrubbed; only the camera and what is drawn change.

| | Chase | Driver |
|---|---|---|
| Sits | 760 m back, 620 m up | on the road, 3.2 m up, 2.4 m left of centre |
| Aims | tangent averaged over **420 m** | a point **26 m** up the road |
| Road drawn as | 14 m tube, lit behind / dim ahead | 9 m carriageway with paint and posts |
| Marker | white sphere | none — you are it |
| Bend rings | 58 m rings, active one pulsing | hidden; number and HUD instead |
| FOV / near | 55° / 10 m | 72° / 0.6 m |

The two look-ahead figures pull in opposite directions on purpose. In chase the
long average is what stops the camera whipping at a hairpin. In the driver's
seat the turning **is** the experience, so the aim rides the curve itself at 26
m. Both were wrong first: at 75 m the driver's aim point sat most of the way
back round a switchback, so the camera stared across the gap at the road it had
just left while the tarmac slid out of frame sideways.

Position smoothing also differs. Chase damps position and aim; driver damps
**only** the aim. A damped position looks fine on a straight and then cuts the
corner at a hairpin and puts the viewpoint out over the drop.

### A road, not a pipe

From 760 m up a tube is a perfectly good road. At eye level it is a pipe you
are flying down the middle of. Driver mode therefore builds a real carriageway
(`drive-road.ts`): a flat 9 m ribbon, edge lines, dashed centreline, and
delineator posts every 26 m along both shoulders. The posts matter more than
they look — they are the only thing giving the eye something to measure speed
against, and without them a smooth untextured ribbon reads as standing still.

### The deck has to clear the ground

The route carries per-point DEM elevations; the terrain wireframe is a much
coarser 45 m grid over the same DEM. On a slope this steep the two disagree by
tens of metres, and wherever the grid won, the hillside came up through the
tarmac. `deckHeight()` in `lib/churam.ts` rides the road over whichever surface
is higher, and both the road builder and the driver camera call it — so the
deck and the eye cannot end up on opposite sides of the road. That bug arrived
in the first place because eye height was measured from the route rather than
from the deck, putting the viewpoint 0.7 m above the tarmac.

## Autoplay

A Drive button plays the climb at a fixed pace — 110 s for the full 13.8 km —
in either view.

**It drives the page scroll, not a separate progress variable.** Scroll
position stays the single source of truth, so the camera, HUD and elevation
strip cannot drift apart, and pausing mid-climb leaves the reader exactly where
the car was, free to carry on by hand.

- Wheel and touch always take the wheel back. Keys do too, but only scroll keys,
  and not when focus is inside the controls — otherwise a keyboard user pressing
  Space to start would stop it in the same breath.
- If anything else moves the page, autoplay resyncs to wherever it now is
  rather than yanking the reader back.
- Scrolling away from the drive stops it, so the reader does not return to find
  the car parked at the top.
- Hidden entirely under reduced motion — this is exactly the motion that
  preference opts out of.

## Cover photograph

The hero carries a **CC0** photograph from the Malayalam Wikipedia article
താമരശ്ശേരി ചുരം: a hairpin seen from the road above it, buses and lorries
working round the retaining wall. Its Commons description reads "National
Highway 766 as seen from the upper section of the same road" — it is this road,
which is why it beat the alternatives.

Two candidates were rejected and are worth recording. The **Nedumpoil ghat
road** series on Commons is a different pass entirely (the Kannur route) and
would have put the wrong mountain under the headline. And `File:Thamarassery.jpg`,
which a title search surfaces first, is a portrait captioned "love of mother".

CC0 requires no attribution; it is credited anyway.

## Look

- Ground near-black; no basemap, no fill, no texture.
- Terrain as **explicit grid lines** — row and column `LineSegments` built from
  the heightfield. Not `WireframeGeometry`, which draws every triangle diagonal
  and reads as noise.
- Line brightness ramps with elevation, so the wall separates from the plain.
- Road as a bright ribbon, drawn over the grid.
- Bend markers: small numbered rings; the one you are in pulses.

### Vertical exaggeration is an editorial choice

720 m of climb across 12 km of road is, at true scale, a gentle ramp. Start at
**2×**, tune by eye, and **state the factor on the page**. An unstated
exaggeration is a quiet lie about the ground.

## Reuse

Everything below already exists and works. None of it gets rewritten.

| From | What |
|---|---|
| `package.json` | `three` — already a dependency |
| `astro.config.mjs` | `optimizeDeps.include: ['three']` — already set, already commented |
| `lib/terrain.ts` | `LngLat`, `TERRAIN_TILES`, `TERRAIN_ATTRIBUTION`, `BASE_ATTRIBUTION`, and the derive-don't-recall rule |
| `TerrainStage.astro` | Boot gate: `IntersectionObserver`, `rootMargin: '100% 0px 100% 0px'` |
| `TerrainStage.astro` | Lazy `await import('three')` inside `boot()` |
| `TerrainStage.astro` | `fail(why, err)` — hide the stage, `console.warn`, never throw |
| `TerrainStage.astro` | rAF-coalesced scroll: `ticking` flag + `schedule()` + passive listeners |
| `TerrainStage.astro` | Progress from `getBoundingClientRect()`: `clamp(-r.top / (r.height - vh), 0, 1)` |
| `TerrainStage.astro` | `clamp`, `lerp`, `lerpAngle`, `ease` (smoothstep) |
| `TerrainStage.astro` | Per-frame screen-space label placement with a declutter pass |
| `TerrainStage.astro` | Stacking contract: fixed stage at `z-0`, page blocks `relative z-10` |
| `lib/wayanad.ts` | The shape and comment discipline of a story data module |
| `Layout`, `ImmersiveBar`, `Footer`, `PinMap` | Page shell and locator map |
| Tailwind tokens | `eyebrow`, `body-small`, `caption-text`, `article-title`, `text-text-primary`, `dark:text-ivory`, `bg-bg-card`, `dark:bg-brand-dark`, `border-rule` |

From `/Users/muneef/Sites/static/rivers`, for motion:

| From | What |
|---|---|
| `index.css` `poi-highlight-pulse` | 2s ease-in-out infinite — the bend you are in |
| `index.css` progress fill | `transition: width .4s cubic-bezier(.4,0,.2,1)` |
| `components/ElevationProfile.tsx` | DPR-scaled canvas profile, min/max/gain readout — the pattern for the strip |
| `index.css` `reveal` keyframes | Bend callouts entering |

## Failure and motion

WebGL is required, so this is short.

- Library import, WebGL context creation, or DEM fetch fails → `fail()`: the
  stage is hidden and the drive section collapses to a short static block
  carrying the bend table, which is server-rendered anyway.
- Individual tile 404s are survivable — that cell of the grid is dropped, logged,
  not fatal.
- **Reduced motion** → the scene renders once, as a still three-quarter view of
  the whole ghat with all bends marked, and the section shrinks to `100vh` so
  the dead scroll that existed only to drive a camera goes with it.

## Acceptance

1. Boots, arms within a viewport of the drive section, zero console errors.
2. Camera scrubs both ways; the marker tracks the route.
3. The stitched route matches OSM: starts at Adivaram, ends past Lakkidi.
4. **Bend at 11.50528, 76.02846 is numbered 7; bend at 11.50371, 76.02726 is
   numbered 8.** Counting from Adivaram.
5. Elevation strip spans 50 m → 761 m with a tick per bend and a tracking dot.
6. Place labels sit on their places at low camera angles.
7. Reduced motion: section is exactly `100vh`, scene renders one still frame.
8. Attribution for OSM and AWS Terrain Tiles present; exaggeration factor stated.

## Known rough edges, accepted for this cut

- Camera constants are eyeballed, not tuned. They moved a long way during the
  build: the first pass sat 250 m behind the marker, which filled the screen
  with road tube and showed none of the switchback shape. 760 m back and 620 m
  up is where a whole hairpin fits in frame.
- `COLOR_LOW` started at `#0b2b3a` and made the plain invisible against the
  background, so the road appeared to float in a void. The low end of the ramp
  has to stay clearly lit — half the argument is the flat part.
- Road width (14 m radius) and the bend rings (58 m) are legibility figures,
  not gauges. The real carriageway is about 10 m.
- No terrain occlusion for labels — a label behind a ridge still shows. Same
  limitation the Wayanad page carries.
- Grid resolution is uniform; no LOD. Near the camera the 45 m lines are sparse
  on screen; far away they moiré slightly. It is worst in driver mode, where the
  ground a few metres away is a couple of enormous quads.
- Vertical exaggeration is ×2 in both views, so from the driver's seat every
  gradient is twice as steep as the real one. Consistent with the chase view and
  stated on the page, but it is a stronger claim at eye level than from 760 m up.
- Autoplay's 110 s over 13.8 km is about 450 km/h. It is a reading pace, not a
  speed, and the page does not pretend otherwise — but there is no speedometer
  for exactly that reason.
- Only checked at 1440×900. Mobile framing untested, and the control cluster is
  now three buttons wide.

## Verified

Driven with Playwright against installed Chrome:

- boots, arms, zero console errors across eight scroll positions
- HUD tracks the climb 41 m → 759 m; hairpins announce in order
- **bend 7 lands 8 m from its OSM node, bend 8 lands 15 m from its** — the
  calibration test, asserted rather than eyeballed
- reduced motion: drive section is exactly 100vh, one still frame renders
- JS disabled: h1, all nine bends, the table and both attributions present
- driver mode: toggle switches, road reads as a road, hairpins pass correctly,
  chase still works after a round trip
- autoplay: advances at the configured pace (126 px vs 123 px expected over 3 s),
  pauses on wheel, stays put once paused, works in both views, stops itself at
  the top

A stacking bug worth recording: the toggle was first placed inside the stage,
which is `position: fixed` at `z-index: 0` and therefore its own stacking
context — nothing inside it can rise above the `z-10` page content, so the
buttons were simply unclickable. The stage is also `aria-hidden`, which is no
place for interactive controls. They live outside it now.

One measurement trap worth recording: reading the WebGL canvas back with
`drawImage` into a 2D context returns pure black regardless of what rendered,
because the drawing buffer is not preserved. It looked exactly like a scene
that was failing to draw. Screenshot the page instead.
