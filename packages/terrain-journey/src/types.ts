// ============================================================================
// What a journey is.
//
// One shape describes both a road climbing a ghat and a river running to the
// sea: an ordered line through real terrain, some marked points on it, some
// named places beside it, and two ways of looking at the whole thing.
//
// The rule every journey file must follow, inherited from the pages this was
// extracted from and worth restating because it is the one that actually
// matters:
//
//   Geography is derived, not recalled. Coordinates, names and elevations come
//   from OpenStreetMap and from a DEM, via a build script. A first draft typed
//   from memory put a village four kilometres from where it is, on a ridge,
//   a thousand metres above the valley floor it actually sits on. Look it up.
// ============================================================================

/** MapLibre and GeoJSON order: [longitude, latitude]. The opposite of Leaflet. */
export type LngLat = [number, number];

/** [west, south, east, north]. */
export type BBox = [number, number, number, number];

/**
 * A point on the line.
 *
 * `[lng, lat, metresAboveSeaLevel, metresFromStart]`
 *
 * A tuple rather than an object because a journey carries a few hundred of
 * these and they are read every frame; the shape is documented here so the
 * data files do not each have to explain themselves.
 */
export type RoutePoint = [number, number, number, number];

/** A point on the route worth stopping at: a hairpin, a confluence, a bridge. */
export interface Marker {
  /** 1-based, in travel order. Shown to the reader. */
  n: number;
  /** Index into `route` of the marked point. */
  i: number;
  coords: LngLat;
  elevation: number;
  /** Distance from the start, kilometres. */
  km: number;
  /** Short label under the number, e.g. "173° left" or "43 m · 35 km down". */
  detail?: string;

  // ── The reveal card ───────────────────────────────────────────────────────
  // Optional. A marker with no `title` gets no card, which is the right default
  // for something like a hairpin that the number already explains.

  /** Heading on the card. A town's name; a bend's ordinal. */
  title?: string;
  /** The name in the local script, shown above the title. */
  titleLocal?: string;
  /**
   * A sentence or two, revealed as the traveller passes.
   *
   * Only ever write here what a source actually says. It is the most tempting
   * field in the whole format to fill from memory, and the one where doing so
   * would be least visible.
   */
  note?: string;

  /**
   * A picture of the place.
   *
   * `credit` is not optional in practice — anything worth showing here came
   * from somebody, and the card renders it under the frame.
   */
  image?: {
    src: string;
    alt: string;
    credit?: string;
    href?: string;
  };

  /**
   * Longer text, behind a disclosure.
   *
   * The card stays a card: `note` is what you read in passing, this is what you
   * open when something catches you. Present only when there is genuinely more
   * to say — an empty expander is worse than none.
   */
  more?: string;
}

/** A named place beside the route. Labelled in the scene, never on the line. */
export interface Place {
  id: string;
  name: string;
  /** Local-language name, rendered above the transliteration. */
  nameLocal?: string;
  coords: LngLat;
  elevation: number;
}

/**
 * How the line itself is drawn close up.
 *
 * A road gets a carriageway with paint and delineator posts; a river gets a
 * water surface with banks. The overview draws both as a tube either way — from
 * hundreds of metres up the difference is invisible and a tube reads better.
 */
export type RibbonKind = 'road' | 'river' | 'trail';

export interface Ribbon {
  kind: RibbonKind;
  /** Metres. For a road this is the carriageway; for a river, the channel. */
  width: number;
  /**
   * Metres the surface sits above the sampled ground.
   *
   * Not cosmetic. The route carries per-point DEM elevations while the terrain
   * mesh is a much coarser grid over the same DEM, and on steep ground the two
   * disagree by tens of metres. Without a lift the hillside comes up through
   * the surface.
   */
  lift: number;
  /** Metres. Overview tube radius — a legibility figure, not a gauge. */
  tubeRadius: number;
  /**
   * Draw no surface underfoot in the FIRST-PERSON view. The overview tube is
   * unaffected — from the air the route still has to be findable.
   *
   * For a trek. A road or a river is an object in the landscape and drawing one
   * under you is honest; a footpath is mostly the absence of one, and a ribbon
   * laid along a mountain reads as a route marker rather than as ground. With
   * this set, walking the ridge is walking on the terrain.
   */
  hideSurface?: boolean;
}

/** `overview` watches from outside; `firstPerson` rides the line. */
export type ViewMode = 'overview' | 'firstPerson';

export interface CameraSpec {
  /**
   * Metres of route to average the overview's aim over.
   *
   * The single most important number in the overview. Aim the camera down the
   * instantaneous tangent and it whips through 170° at every hairpin — unwatchable,
   * and it hides the very thing worth showing. Averaged over a few hundred
   * metres the heading barely moves through a switchback while the traveller
   * sweeps the full turn beneath it, so the bend unrolls as a shape.
   */
  overviewLookAhead: number;
  /** Metres behind and above, and how far ahead the overview points. */
  overviewBack: number;
  overviewHeight: number;
  overviewTarget: number;
  /** Metres to keep clear of the hillside by. */
  overviewClearance: number;
  overviewDamping: number;
  overviewFov: number;

  /**
   * Metres up the line the first-person view looks at — a point ON the curve,
   * short on purpose.
   *
   * The exact opposite trade to `overviewLookAhead`. Here the turning IS the
   * experience. Set this long and the aim point at a hairpin apex sits most of
   * the way back round the loop, so the camera stares across the gap at the
   * line it just left.
   */
  firstPersonLookAhead: number;
  /** Metres above the surface. True metres — first person runs at true scale. */
  firstPersonEye: number;
  /** Metres to one side of the centreline. Negative is left. */
  firstPersonLateral: number;
  /** Metres above the surface the aim point sits. Below eye height, so the
   *  view tips down the line rather than over it. */
  firstPersonAimLift: number;
  firstPersonDamping: number;
  firstPersonFov: number;
  firstPersonNear: number;

  /**
   * Vertical smoothing on the eye, per second.
   *
   * Only the height is filtered — never x or z. A DEM sampled every 19 m is
   * noisy underfoot, and on a footpath that noise is a stagger. Damping the
   * whole position instead would cut corners at a switchback and put the
   * viewpoint out over the drop, which is why this is Y alone.
   */
  firstPersonHeightDamping: number;

  /**
   * Footfall.
   *
   * Driven by TIME and gated by SPEED, not by distance travelled. Distance is
   * the obvious model and it is unusable: a trek covers 2.5 m of ground per
   * pixel of scroll, so a stride-length wavelength meant one wheel notch
   * advanced seventy bob cycles and the camera shook rather than walked.
   *
   * Time-based with a speed gate gives a real gait at any scroll granularity,
   * and settles to nothing when the reader stops.
   */
  bobAmplitude: number;
  /** Cycles per second at full speed. About 1.8 for walking. */
  bobHz: number;
  /** Speed, m/s, at which the bob reaches full amplitude. */
  bobFullSpeed: number;
}

/**
 * Vertical exaggeration, per view.
 *
 * Geometry is built at TRUE scale and exaggeration is a Y scale on the group
 * that holds it, so the two views can disagree without rebuilding a vertex.
 *
 * And they should disagree. From hundreds of metres up, real relief is a gentle
 * ramp and exaggeration is what makes it legible. From inside the journey that
 * same factor doubles every gradient the body reads, turning an emphasis you
 * would shrug at on a map into a lie you can feel. Whichever is in force must
 * be stated on screen.
 */
export interface VerticalScale {
  overview: number;
  firstPerson: number;
}

export interface Palette {
  skyZenith: string;
  skyHaze: string;
  fog: string;
  groundLow: string;
  groundMid: string;
  groundHigh: string;
  groundSteep: string;
  treeDark: string;
  treeLight: string;
  /** Ribbon surface: tarmac for a road, water for a river. */
  surface: string;
  /** Lane paint, or the bright line along a riverbank. */
  edge: string;
  centreline: string;
  post: string;
  wireLow: string;
  wireHigh: string;
  routeAhead: string;
  routeDone: string;
  marker: string;
  markerActive: string;
}

export interface Scenery {
  /** Metres between terrain facets. */
  facet: number;
  /** Metres between wireframe grid lines. */
  wire: number;
  treeSpacing: number;
  treeRouteClearance: number;
  treeMaxHeightFraction: number;
  treeMinHeight: number;
  treeMaxHeight: number;
  treeMaxSlope: number;
  steepFrom: number;
  steepAt: number;
  steepMix: number;
  /** Set false for journeys where planted trees would be a fiction. */
  trees: boolean;
}

export interface Journey {
  id: string;
  /** The ground to load. Pad it well beyond the route or the world ends in
   *  view of the traveller. */
  bbox: BBox;
  route: RoutePoint[];
  markers: Marker[];
  places: Place[];
  ribbon: Ribbon;
  verticalScale: VerticalScale;
  /** Metres. Cached from the route so consumers need not re-measure. */
  length: number;
  lowest: number;
  highest: number;
  /**
   * Metres either side of a marker within which it counts as "the one you are
   * at". Defaults to a quarter of the average spacing between markers, clamped.
   *
   * A fixed figure cannot serve both scales: 300 m is right for hairpins a
   * kilometre apart and means a river's towns, twenty kilometres apart, never
   * light at all.
   */
  markerRadius?: number;
  /** Overrides, merged over the defaults. */
  palette?: Partial<Palette>;
  scenery?: Partial<Scenery>;
  camera?: Partial<CameraSpec>;
}
