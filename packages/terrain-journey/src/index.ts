// ============================================================================
// terrain-journey — scroll-driven 3D journeys over real terrain.
//
// Give it a line through the world (a road, a river, a trek) with real
// coordinates and elevations, and it renders a low-poly landscape you can
// travel along in two ways: an overview that watches from outside, and a
// first-person view that rides it.
//
// Framework-agnostic. Three.js is the only runtime dependency, and it is a
// peer — nothing here knows about Astro, React or any build tool.
//
//   const journey = await mountJourney({ canvas, overlay, section, journey })
//
// See README.md for the full contract and the pitfalls that cost real time.
// ============================================================================

export type {
  BBox,
  CameraSpec,
  Journey,
  LngLat,
  Marker,
  Palette,
  Place,
  Ribbon,
  RibbonKind,
  RoutePoint,
  Scenery,
  VerticalScale,
  ViewMode,
} from './types';

export { CAMERA, PALETTE, SCENERY, VERTICAL_SCALE, resolve } from './defaults';

export { LocalFrame, haversineish } from './geo/frame';
export {
  loadHeightField,
  TERRAIN_ATTRIBUTION,
  TERRAIN_TILES,
  type HeightField,
} from './geo/heightfield';

export { createStage, type Stage } from './scene/stage';
export { CameraRig, type GroundSampler } from './camera/rig';
export { createLabels, type Labels } from './ui/labels';
export { createMarkerCard, type MarkerCard } from './ui/marker-card';
export { createProfile, type Profile } from './ui/profile';
export { createScrubber, type Scrubber, type ScrubberOptions } from './ui/scrubber';

export { mountJourney, type MountOptions, type MountedJourney } from './mount';
