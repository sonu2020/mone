# terrain-journey

Scroll-driven 3D journeys over real terrain.

Give it a line through the world — a road, a river, a trek — with real
coordinates and elevations, and it renders a low-poly landscape you can travel
along two ways: an **overview** that watches from outside, and a **first-person**
view that rides it.

Framework-agnostic. Three.js is the only runtime dependency, and it is a peer.
Nothing here knows about Astro, React, or any build tool.

```ts
import { mountJourney } from 'terrain-journey';
import 'terrain-journey/style.css';

const journey = await mountJourney({
  canvas,          // <canvas> filling a fixed stage
  overlay,         // positioned <div> the DOM labels go in
  section,         // the tall element whose scroll range drives it
  journey: churam, // your data
  onProgress: ({ elevation, metres, marker }) => { /* readouts */ },
});

journey.setView('firstPerson');
journey.scrubber.toggle();   // autoplay
```

## What a journey is

One shape describes a road climbing a ghat and a river running to the sea:

```ts
interface Journey {
  id: string;
  bbox: [west, south, east, north];   // pad it well beyond the line
  route: [lng, lat, metresASL, metresFromStart][];
  markers: Marker[];                  // hairpins, towns, confluences
  places: Place[];                    // named, labelled, beside the line
  ribbon: { kind: 'road' | 'river' | 'trail'; width; lift; tubeRadius };
  verticalScale: { overview: number; firstPerson: number };
  length: number; lowest: number; highest: number;
  palette?: Partial<Palette>;         // colours by role
  scenery?: Partial<Scenery>;         // facets, trees
  camera?: Partial<CameraSpec>;       // per-journey framing
  markerRadius?: number;
}
```

Everything after `highest` is optional. The defaults are tuned for a wet
tropical range; see `defaults.ts`, which documents why each number is what it is.

## The rule

> **Geography is derived, not recalled.**

Coordinates, names and elevations come from OpenStreetMap and a DEM, through a
build script. This is not a style preference. A first draft of one journey was
typed from memory and put a village four kilometres from where it is, on a ridge,
a thousand metres above the valley floor it actually sits on. Another dataset
labelled a river's *headwater vertex* with the name of a town 25 km downstream.
Both looked completely plausible on screen.

If a figure cannot be traced to a query, it does not go in.

## The two views disagree on purpose

|  | overview | first person |
|---|---|---|
| look-ahead | **long** (hundreds of m) | **short** (tens of m) |
| position smoothing | damped | **none** |
| vertical scale | exaggerated | true |

**Look-ahead.** The overview aims down the tangent *averaged* over a few hundred
metres. Aimed down the instantaneous tangent it whips through 170° at every
hairpin — nauseating, and it hides the very thing worth showing. Averaged, the
heading barely moves through a switchback while the traveller sweeps the full
turn beneath it, so the bend unrolls as a shape.

First person wants the opposite: the turning *is* the experience. Set its
look-ahead long and the aim point at a hairpin apex sits most of the way back
round the loop, so the camera stares across the gap at the road it just left.

**Position smoothing.** Damping the first-person position looks harmless on a
straight, then cuts the corner at a hairpin and puts the viewpoint out over the
drop. Only the aim is damped — that is what supplies the feeling of steering
into a bend rather than snapping to it.

**Vertical scale.** Geometry is built at true scale and exaggeration is a Y
scale on the group holding it, so the two views can disagree without rebuilding
a vertex. From hundreds of metres up, real relief is a gentle ramp and
exaggeration is what makes it legible; from inside, that same factor doubles
every gradient the body reads. Whichever is in force **must be stated on
screen** — an unstated exaggeration is a quiet lie about the ground.

## Things that cost real time

Each of these was a bug, found by looking at the screen rather than by reasoning.

**Reading back a WebGL canvas with `drawImage` returns black.** Without
`preserveDrawingBuffer` the buffer is gone by the time you read it. It looks
exactly like a scene that is failing to render. Screenshot the page instead.

**Eye height is measured from the surface, not the route.** Measuring from the
route put the viewpoint 0.7 m over the tarmac and the road filled the lower half
of the screen.

**The line must ride over whichever surface is higher.** The route carries
per-point DEM samples; the terrain mesh is a coarser grid over the same DEM, and
in a valley the mesh averages the floor upward. Drawn at its own elevation the
line runs *underneath* its own landscape. A 105 km river was invisible from
directly above it for exactly this reason.

**Clear the sightline, not the ground.** Keeping the camera above the ground
underfoot lets it burrow into a hillside; keeping it above the highest point
between it and its target still fails, because the ray dips back into that ridge.
Solve `camY + (targetY − camY)·t ≥ g(t) + margin` for `camY` — but only over the
near two-thirds, because the `1/(1−t)` term sampled near the target multiplies
the margin twentyfold and flings the camera kilometres up.

**Aim the clearance at the traveller, not the aim point.** The aim sits further
down the line, so its ray is shallower. Clearing it leaves the steeper ray to
the traveller cutting through the ridge.

**The stage publishes `.tj-live` on `<html>`.** Hosts with their own fixed
furniture — a corner map, a floating player — use it to stand down while the
journey owns the viewport. A plain class rather than `body:has(...)`, which lost
a specificity argument with utility CSS.

**Controls cannot live inside the stage.** A `position: fixed` element at
`z-index: 0` is its own stacking context — nothing inside it rises above
`z-index: 10` page content, so buttons in there are unclickable. The stage is
also `aria-hidden`, which is no place for interactive controls.

**Zoom, facets and tree spacing all scale with the bbox.** A 6 km ghat needs six
DEM tiles at zoom 13; a 105 km river covers the same ground in 143. Zoom is
chosen against a tile budget, and facet size then follows it down — asking for
detail finer than the DEM carries buys triangles and nothing else.

**A distance-driven bob aliases into noise.** Tying footfall to metres
travelled is the obvious model and is unusable: a trek covers ~2.5 m of ground
per pixel of scroll, so a stride-length wavelength meant one wheel notch
advanced ~70 bob cycles and the camera shook instead of walking. Drive the phase
with **time**, gate the amplitude by **speed** — a real gait at any scroll
granularity, decaying to nothing when the reader stops.

**Filter the eye's height, never its x or z.** A DEM sampled every 19 m is noisy
underfoot and on a footpath that noise reads as a stagger. Damping the whole
position instead cuts the corner at a switchback and puts the viewpoint out over
the drop.

**Cones read as spruce.** Which puts an alpine forest on a tropical ghat. A
faceted icosahedron is truer for broadleaf canopy, and canopy should be about
half as wide as the tree is tall — wider turns every tree into a hedge.

## The reveal card

A marker carrying a `title` gets a card that appears as the traveller reaches
it, holds while it is the nearest marker, and hands over to the next — so on a
long journey there is always something on screen naming where you are.

Sticky, but **positionally aware**: it moves to whichever side the place is
actually on so it never covers it, tracks the place's height, and points at it
with a caret. When the place goes behind the camera the caret swings round
rather than the card vanishing, because *you have just passed it* is information
too.

Markers with no `title` get no card — a hairpin's number already says everything
there is to say about it.

`note` is the one field in the whole format where a fabrication would be least
visible. Only ever write there what a source actually says; six of the Chaliyar's
ten towns have no note, and the card is better for it.

## Autoplay drives the page scroll

Not a separate progress variable. Scroll position stays the single source of
truth, so the camera, readouts and elevation strip cannot drift apart, and
pausing mid-journey leaves the reader exactly where the traveller was. Wheel and
touch always take control back; scroll keys do too, but not when focus is inside
a control, or a keyboard user would stop it with the same Space that started it.

## Degradation

WebGL is required — this is not progressive enhancement. Everything is lazy, so
a page that is never scrolled to never pays for Three.js or the DEM.

- Import, WebGL, or DEM failure → `mountJourney` rejects; the caller falls back
  to whatever it server-rendered.
- A single DEM tile 404 is survivable: that patch is interpolated from its
  neighbours.
- **Reduced motion** → one still frame at the halfway point, no autoplay, and
  the host should collapse the tall section to `100vh` so the dead scroll goes
  with it.

## Building a new journey

1. Query the line from OSM (Overpass), stitched and oriented in travel order.
2. Sample a DEM per point. Thin to a few hundred points, keeping every marker.
3. Look up places — **never** reuse rounded coordinates from another dataset.
4. Emit a module exporting a `Journey`, with a header comment recording every
   source and every judgement call.
5. Verify: markers land where the source says, the line is visible in both
   views, reduced motion holds one frame, and the server-rendered fallback lists
   everything.

Detection thresholds should be **calibrated against known anchors, not tuned
until they agree with a number you already believed.** On the churam, OSM names
only two of nine hairpins; every parameter set that placed those two at ordinals
7 and 8 was kept, and nine was the majority outcome of a constraint that never
mentioned nine.

## Status

`0.1.0`, in-repo. Known gaps before publishing:

- **Ships TypeScript source**, not a build. Fine for a workspace consumed by
  Vite; a `tsc`/`tsup` step is needed before this is usable from plain JS.
- No automated tests of its own — it is currently verified through the two pages
  that consume it.
- No terrain occlusion for labels: a label behind a ridge still shows.
- Tested at 1440×900 only.
