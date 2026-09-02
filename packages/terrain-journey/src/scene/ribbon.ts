// ============================================================================
// The line itself, close up.
//
// The overview gets away with a tube: from hundreds of metres up, a tube reads
// as a line on a hillside and nobody asks what its cross-section is. From
// inside the journey that same tube is a pipe you are flying down the middle
// of, and the illusion is gone instantly.
//
// So the first-person view gets a real surface: a flat ribbon of the right
// width, plus whatever that kind of line carries.
//
//   road   edge lines, a dashed centreline, delineator posts along both
//          shoulders. The posts do most of the work — they are the only thing
//          giving the eye something to measure speed against, and without them
//          a smooth untextured ribbon reads as standing still.
//   river  a water surface and a bright line where it meets each bank. No
//          markings; painting lane dashes on a river would be absurd.
//
// Built once, never touched again.
// ============================================================================

import * as THREE from 'three';
import type { Palette, Ribbon } from '../types';

/** Metres between cross-sections. Tight, or tight bends visibly polygonise
 *  from inside them. */
const STATION_SPACING = 2;

const EDGE_WIDTH = 0.35;
const CENTRE_WIDTH = 0.28;
const DASH_ON = 7;
const DASH_OFF = 9;
const POST_SPACING = 26;
const POST_HEIGHT = 1.5;

interface Station {
  p: THREE.Vector3;
  right: THREE.Vector3;
  /** Metres from the start. */
  d: number;
}

export interface RibbonBuild {
  group: THREE.Group;
  dispose: () => void;
}

export function buildRibbon(
  curve: THREE.Curve<THREE.Vector3>,
  length: number,
  spec: Ribbon,
  palette: Palette,
  /** True-metre ground elevation, for keeping the surface clear of the mesh. */
  ground: (x: number, z: number) => number,
): RibbonBuild {
  const count = Math.ceil(length / STATION_SPACING);
  const up = new THREE.Vector3(0, 1, 0);
  const stations: Station[] = [];

  for (let i = 0; i <= count; i++) {
    const u = i / count;
    const p = curve.getPointAt(u);
    // Ride over whichever surface is higher. The route's own DEM samples and
    // the terrain mesh's coarser grid disagree by tens of metres on steep
    // ground, and wherever the grid wins the hillside comes up through this.
    p.y = Math.max(p.y, ground(p.x, p.z)) + spec.lift;
    const t = curve.getTangentAt(u);
    // t × up is horizontal by construction, so the surface is level across its
    // width. Real roads are cambered and banked; this one is not.
    const right = new THREE.Vector3().crossVectors(t, up).normalize();
    if (right.lengthSq() < 0.5) right.set(1, 0, 0);
    stations.push({ p, right, d: u * length });
  }

  const group = new THREE.Group();
  const half = spec.width / 2;
  const disposables: Array<THREE.Mesh | THREE.LineSegments> = [];

  const add = (m: THREE.Mesh | THREE.LineSegments) => {
    group.add(m);
    disposables.push(m);
  };

  add(strip(stations, -half, half, 0, palette.surface, false));

  if (spec.kind === 'road') {
    add(strip(stations, -half, -half + EDGE_WIDTH, 0.06, palette.edge, true));
    add(strip(stations, half - EDGE_WIDTH, half, 0.06, palette.edge, true));
    add(strip(stations, -CENTRE_WIDTH / 2, CENTRE_WIDTH / 2, 0.08, palette.centreline, true, true));
    add(posts(stations, half, palette));
  } else if (spec.kind === 'trail') {
    // Bare ground and nothing else. A footpath has no lane markings and no
    // delineator posts, and giving it either — which the road branch did on the
    // first attempt — turns a mountain trail into a service road with a dashed
    // centreline up the middle of it.
    //
    // The only concession to legibility is a faint scuff along each edge, which
    // is what a worn path actually looks like from above.
    const scuff = Math.max(0.12, spec.width * 0.12);
    add(strip(stations, -half, -half + scuff, 0.04, palette.edge, true));
    add(strip(stations, half - scuff, half, 0.04, palette.edge, true));
  } else {
    // A river reads by its banks, so both edges get a bright line and nothing
    // else. Wider than road paint because the channel is wider.
    add(strip(stations, -half, -half + spec.width * 0.05, 0.06, palette.edge, true));
    add(strip(stations, half - spec.width * 0.05, half, 0.06, palette.edge, true));
  }

  return {
    group,
    dispose() {
      for (const m of disposables) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    },
  };
}

/**
 * A flat strip running the length of the line between two lateral offsets.
 *
 * `dashed` breaks it into painted segments; `lift` nudges it above the surface
 * so coplanar paint does not z-fight with what is under it.
 */
function strip(
  stations: Station[],
  fromOffset: number,
  toOffset: number,
  lift: number,
  color: string,
  paint: boolean,
  dashed = false,
): THREE.Mesh {
  const pos: number[] = [];
  const idx: number[] = [];
  const tmp = new THREE.Vector3();

  let v = 0;
  for (let i = 0; i < stations.length - 1; i++) {
    if (dashed && stations[i].d % (DASH_ON + DASH_OFF) > DASH_ON) continue;

    // Two cross-sections make one quad. Emitting them per-quad rather than
    // sharing vertices costs memory but makes dashing a matter of skipping.
    for (const s of [stations[i], stations[i + 1]]) {
      for (const off of [fromOffset, toOffset]) {
        tmp.copy(s.p).addScaledVector(s.right, off);
        pos.push(tmp.x, tmp.y + lift, tmp.z);
      }
    }
    idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
    v += 4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);

  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      // Paint sits fractions of a metre above the surface; depth offset stops
      // it flickering at grazing angles down the line.
      polygonOffset: paint,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
}

/** Delineator posts down both shoulders — the speed cue. */
function posts(stations: Station[], half: number, palette: Palette): THREE.LineSegments {
  const pos: number[] = [];
  const tmp = new THREE.Vector3();
  let next = 0;

  for (const s of stations) {
    if (s.d < next) continue;
    next = s.d + POST_SPACING;
    for (const off of [-half - 0.7, half + 0.7]) {
      tmp.copy(s.p).addScaledVector(s.right, off);
      pos.push(tmp.x, tmp.y, tmp.z, tmp.x, tmp.y + POST_HEIGHT, tmp.z);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({ color: palette.post, transparent: true, opacity: 0.85 }),
  );
}
