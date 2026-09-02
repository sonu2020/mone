// ============================================================================
// Defaults every journey starts from, and the merge that applies its overrides.
//
// Colours are named by role rather than left as hex scattered through the
// modules, so a journey can retune the whole scene from one object.
//
// The ramp is read off photographs of the Western Ghats: farmed green on the
// plain, deep evergreen up the slopes, laterite showing only in cuttings, and
// everything distant dissolving into haze rather than getting bluer. Aerial
// perspective is most of what makes a tropical range look like one.
// ============================================================================

import type { CameraSpec, Palette, Scenery } from './types';

export const PALETTE: Palette = {
  skyZenith: '#3f7ea8',
  skyHaze: '#c8d6d2',
  fog: '#b9cac8',

  groundLow: '#5d7a45',
  groundMid: '#2f5233',
  groundHigh: '#37564a',
  groundSteep: '#7d5a41',

  treeDark: '#24422c',
  treeLight: '#3c6337',

  surface: '#2b2f33',
  edge: '#d8e4e6',
  centreline: '#e8b552',
  post: '#dfe6e4',

  wireLow: '#2e6274',
  wireHigh: '#7ff8e8',
  routeAhead: '#38505c',
  routeDone: '#ffb648',
  marker: '#ff6b4a',
  markerActive: '#fff2b0',
};

export const SCENERY: Scenery = {
  /** The DEM under this is about 19 m per pixel, so there is little point
   *  going finer. At 45 m — where this started — the ground within a few
   *  metres of a first-person camera was two enormous quads. */
  facet: 26,
  /** Coarser than the mesh on purpose: the overlay should read as a grid, not
   *  as a second surface. */
  wire: 52,

  treeSpacing: 58,
  treeRouteClearance: 16,
  /**
   * Above this fraction of the height range nothing is planted. Close to 1 by
   * default: the Western Ghats are forested to the crest, and 0.86 stripped
   * everything above about 670 m and left the tops looking like moorland.
   * Lower it for ranges that genuinely have a tree line.
   */
  treeMaxHeightFraction: 0.98,
  treeMinHeight: 9,
  treeMaxHeight: 19,
  treeMaxSlope: 1.15,

  /** Generous on purpose. A tighter figure paints whole hillsides brown, which
   *  is what a dry range looks like, not a wet one. */
  steepFrom: 0.66,
  steepAt: 1.25,
  steepMix: 0.55,

  trees: true,
};

export const CAMERA: CameraSpec = {
  overviewLookAhead: 420,
  overviewBack: 760,
  overviewHeight: 620,
  overviewTarget: 240,
  overviewClearance: 120,
  overviewDamping: 2.6,
  overviewFov: 55,

  firstPersonLookAhead: 26,
  firstPersonEye: 2.2,
  firstPersonLateral: -2.4,
  firstPersonAimLift: 1.1,
  firstPersonDamping: 5.5,
  firstPersonFov: 62,
  firstPersonNear: 0.6,
  firstPersonHeightDamping: 7,
  bobAmplitude: 0.09,
  bobHz: 1.1,
  bobFullSpeed: 16,
};

export const VERTICAL_SCALE = { overview: 2, firstPerson: 1 };

export function resolve<T extends object>(base: T, over?: Partial<T>): T {
  return over ? { ...base, ...over } : base;
}
