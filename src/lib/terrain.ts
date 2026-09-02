// ============================================================================
// Terrain features — the shape every scroll-driven terrain story shares.
//
// TerrainStage renders a story; this file says what a story *is*. Two of them
// exist so far (lib/wayanad.ts, lib/kerala-floods.ts) and they differ only in
// data: places, a line, four acts, the prose between them.
//
// The rule both follow, and any third one must:
//
//   Geography is derived, not recalled. Coordinates and names come from
//   OpenStreetMap; elevations are sampled from the DEM below. The first draft
//   of the Wayanad file was typed from memory and put Chooralmala four
//   kilometres from where it is, on a ridge at 1,450 m rather than the valley
//   floor at 840 m. Look it up.
//
//   Narration describes the land and the view only — no casualties, timings,
//   causes or outcomes. These pages are prototypes standing over real
//   disasters, and placeholder copy that reaches for the event is one careless
//   step from reading as reporting.
// ============================================================================

/** MapLibre order: [lng, lat]. The opposite of Leaflet's. */
export type LngLat = [number, number];

// ─── Open data sources ──────────────────────────────────────────────────────

/**
 * AWS Terrain Tiles — an open aggregate of SRTM, NED and others on the Registry
 * of Open Data on AWS. Terrarium encoding, no API key.
 * Elevation = (R * 256 + G + B / 256) - 32768.
 *
 * MUST be the virtual-hosted-style host (bucket as subdomain). The path-style
 * URL — s3.amazonaws.com/elevation-tiles-prod/… — serves the same bytes but
 * sends no CORS headers, and a raster-dem source is read pixel-by-pixel rather
 * than drawn as an <img>, so it fails silently: the terrain source never
 * finishes and the map's `load` event never fires. Leaflet is unaffected by
 * this, which is exactly why it is easy to get wrong.
 */
export const TERRAIN_TILES =
  'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

export const TERRAIN_ATTRIBUTION =
  '<a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> on AWS Open Data';

/** The same unlabelled basemap every other map on the site uses. */
export const BASE_TILES =
  'https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';

export const BASE_ATTRIBUTION = '&copy; OpenStreetMap &copy; CARTO';

// ─── Story shape ────────────────────────────────────────────────────────────

export interface Place {
  id: string;
  name: string;
  nameML: string;
  coords: LngLat;
  /** Metres above sea level, sampled from the DEM. */
  elevation: number;
  /** Which act first reveals this label. */
  act: number;
}

export interface CameraKey {
  center: LngLat;
  zoom: number;
  /** Degrees from straight down. 0 = plan view, 85 = almost horizontal. */
  pitch: number;
  /** Degrees clockwise from north. */
  bearing: number;
  /** Narration shown while this key is the nearest one. Land and view only. */
  ml: string;
  en: string;
}

export interface Act {
  id: string;
  n: number;
  kickerML: string;
  kicker: string;
  titleML: string;
  title: string;
  /** At least two. Scroll interpolates between consecutive keys. */
  keys: CameraKey[];
}

export interface Interlude {
  /** Rendered before the act of this number; `acts.length + 1` = after the last. */
  before: number;
  ml: string;
  en: string;
}

/**
 * The ribbon the Three.js layer draws along a story's line.
 *
 * All three are legibility figures, not measurements. At the zooms these
 * stories use, the ground is tens of metres per pixel, so a true-width river
 * would be a pixel or two and simply would not be there.
 */
export interface Ribbon {
  /** Metres, upstream end. */
  head: number;
  /** Metres, downstream end. */
  toe: number;
  /** Metres above the ground, so it reads over the terrain rather than in it. */
  lift: number;
}

export interface TerrainStory {
  places: Place[];
  /** The watercourse the story follows, downhill. */
  line: LngLat[];
  acts: Act[];
  interludes: Interlude[];
  ribbon: Ribbon;
  /**
   * The act (by `n`) across which the line arrives. Before it the line is not
   * drawn; after it, drawn whole. Data rather than convention, because which
   * act follows the water differs per story.
   */
  lineAct: number;
  /** Bounds the camera may never leave, so a stray scroll cannot lose the story. */
  maxBounds: [LngLat, LngLat];
  /** Vertical exaggeration. The ghats are dramatic; they do not need much. */
  exaggeration: number;
}
