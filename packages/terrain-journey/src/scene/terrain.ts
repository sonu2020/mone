// ============================================================================
// The ground, as low-poly scenery.
//
// Three things, all built once at TRUE vertical scale — the view's exaggeration
// is a Y scale on the group that holds them, applied later:
//
//   the mesh       flat-shaded facets, coloured by height and steepness
//   the wireframe  the analytical overlay the overview keeps
//   the trees      one instanced mesh, thousands of instances
//
// The sky is built here too but must NOT join that group: scaling a sky sphere
// vertically turns the horizon into an ellipse.
// ============================================================================

import * as THREE from 'three';
import type { HeightField } from '../geo/heightfield';
import type { Palette, Scenery } from '../types';

/** Corners of the field in local metres: west/north and east/south. */
export interface Extent {
  wx: number;
  nz: number;
  ex: number;
  sz: number;
}

export interface Terrain {
  mesh: THREE.Mesh;
  wire: THREE.LineSegments;
  dispose: () => void;
}

/** Deterministic noise, so scenery lands identically on every reload and a
 *  screenshot means something. */
export function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Sampler over the heightfield in local metres, plus the local slope. */
export class Field {
  constructor(
    readonly hf: HeightField,
    readonly ext: Extent,
  ) {}

  get cellX() {
    return Math.abs(this.ext.ex - this.ext.wx) / (this.hf.cols - 1);
  }
  get cellZ() {
    return Math.abs(this.ext.sz - this.ext.nz) / (this.hf.rows - 1);
  }

  x(col: number) {
    return this.ext.wx + ((this.ext.ex - this.ext.wx) * col) / (this.hf.cols - 1);
  }
  z(row: number) {
    return this.ext.nz + ((this.ext.sz - this.ext.nz) * row) / (this.hf.rows - 1);
  }
  at(col: number, row: number) {
    const c = Math.max(0, Math.min(this.hf.cols - 1, col));
    const r = Math.max(0, Math.min(this.hf.rows - 1, row));
    return this.hf.data[r * this.hf.cols + c];
  }

  /** Rise over run, from central differences. Dimensionless. */
  slope(col: number, row: number) {
    const dx = (this.at(col + 1, row) - this.at(col - 1, row)) / (2 * this.cellX);
    const dz = (this.at(col, row + 1) - this.at(col, row - 1)) / (2 * this.cellZ);
    return Math.hypot(dx, dz);
  }

  /** Bilinear elevation at a point in local metres. */
  sample(x: number, z: number): number {
    const fc = ((x - this.ext.wx) / (this.ext.ex - this.ext.wx)) * (this.hf.cols - 1);
    const fr = ((z - this.ext.nz) / (this.ext.sz - this.ext.nz)) * (this.hf.rows - 1);
    const c = Math.max(0, Math.min(this.hf.cols - 2, Math.floor(fc)));
    const r = Math.max(0, Math.min(this.hf.rows - 2, Math.floor(fr)));
    const tx = Math.max(0, Math.min(1, fc - c));
    const tz = Math.max(0, Math.min(1, fr - r));
    const a = this.at(c, r);
    const b = this.at(c + 1, r);
    const d = this.at(c, r + 1);
    const e = this.at(c + 1, r + 1);
    return (a * (1 - tx) + b * tx) * (1 - tz) + (d * (1 - tx) + e * tx) * tz;
  }
}

export function buildTerrain(
  hf: HeightField,
  ext: Extent,
  palette: Palette,
  scenery: Scenery,
): Terrain {
  const field = new Field(hf, ext);
  const stepC = Math.max(1, Math.round(scenery.facet / field.cellX));
  const stepR = Math.max(1, Math.round(scenery.facet / field.cellZ));

  const cols: number[] = [];
  for (let c = 0; c < hf.cols; c += stepC) cols.push(c);
  const rows: number[] = [];
  for (let r = 0; r < hf.rows; r += stepR) rows.push(r);

  const nx = cols.length;
  const ny = rows.length;
  const span = Math.max(1, hf.max - hf.min);

  const pos = new Float32Array(nx * ny * 3);
  const col = new Float32Array(nx * ny * 3);

  const LOW = new THREE.Color(palette.groundLow);
  const MID = new THREE.Color(palette.groundMid);
  const HIGH = new THREE.Color(palette.groundHigh);
  const STEEP = new THREE.Color(palette.groundSteep);
  const tmp = new THREE.Color();

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const e = field.at(cols[i], rows[j]);
      const o = (j * nx + i) * 3;
      pos[o] = field.x(cols[i]);
      pos[o + 1] = e;
      pos[o + 2] = field.z(rows[j]);

      const t = (e - hf.min) / span;
      tmp.copy(LOW).lerp(MID, smoothstep(0.06, 0.34, t));
      tmp.lerp(HIGH, smoothstep(0.52, 0.95, t));
      // Laterite shows in cuttings and scars, not across whole hillsides.
      tmp.lerp(
        STEEP,
        smoothstep(scenery.steepFrom, scenery.steepAt, field.slope(cols[i], rows[j])) *
          scenery.steepMix,
      );
      col[o] = tmp.r;
      col[o + 1] = tmp.g;
      col[o + 2] = tmp.b;
    }
  }

  // Indexed, with flatShading doing the faceting in the shader. Non-indexed
  // gives crisper per-face colour but triples the buffers for a mesh this wide,
  // and the facet lighting is what the eye actually reads.
  const idx: number[] = [];
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i;
      idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }),
  );
  mesh.renderOrder = -10;

  const wire = buildWire(field, hf, span, palette, scenery);

  return {
    mesh,
    wire,
    dispose() {
      geo.dispose();
      (mesh.material as THREE.Material).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
    },
  };
}

/** The overview's grid overlay. */
function buildWire(
  field: Field,
  hf: HeightField,
  span: number,
  palette: Palette,
  scenery: Scenery,
): THREE.LineSegments {
  const stepC = Math.max(1, Math.round(scenery.wire / field.cellX));
  const stepR = Math.max(1, Math.round(scenery.wire / field.cellZ));

  const cs: number[] = [];
  for (let c = 0; c < hf.cols; c += stepC) cs.push(c);
  const rs: number[] = [];
  for (let r = 0; r < hf.rows; r += stepR) rs.push(r);

  const nx = cs.length;
  const ny = rs.length;
  const segs = ny * (nx - 1) + nx * (ny - 1);
  const pos = new Float32Array(segs * 6);
  const col = new Float32Array(segs * 6);

  const low = new THREE.Color(palette.wireLow);
  const high = new THREE.Color(palette.wireHigh);
  const tmp = new THREE.Color();

  let o = 0;
  const put = (i: number, j: number) => {
    const e = field.at(cs[i], rs[j]);
    pos[o] = field.x(cs[i]);
    // Lifted a little so the lines sit on the facets rather than inside them.
    pos[o + 1] = e + 4;
    pos[o + 2] = field.z(rs[j]);
    tmp.copy(low).lerp(high, Math.pow(Math.max(0, Math.min(1, (e - hf.min) / span)), 0.75));
    col[o] = tmp.r;
    col[o + 1] = tmp.g;
    col[o + 2] = tmp.b;
    o += 3;
  };

  for (let j = 0; j < ny; j++) for (let i = 0; i < nx - 1; i++) { put(i, j); put(i + 1, j); }
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny - 1; j++) { put(i, j); put(i, j + 1); }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  return new THREE.LineSegments(
    geo,
    // An overlay on lit ground, not the only thing drawn — at 0.55 it competed
    // with the terrain it is supposed to be annotating.
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.34 }),
  );
}

/**
 * Trees, as one instanced icosahedron.
 *
 * Planted on a jittered grid and rejected where the ground is too steep, too
 * high, or too close to the route — a tree standing in the carriageway is the
 * one mistake that breaks the whole illusion from inside the journey.
 */
export function buildTrees(
  hf: HeightField,
  ext: Extent,
  routeXZ: Array<[number, number]>,
  palette: Palette,
  scenery: Scenery,
): THREE.InstancedMesh | null {
  if (!scenery.trees) return null;

  const field = new Field(hf, ext);
  const rand = mulberry32(0x0c4b0a);
  const span = Math.max(1, hf.max - hf.min);

  const nx = Math.floor(Math.abs(ext.ex - ext.wx) / scenery.treeSpacing);
  const ny = Math.floor(Math.abs(ext.sz - ext.nz) / scenery.treeSpacing);
  const clearSq = scenery.treeRouteClearance ** 2;
  const sx = Math.sign(ext.ex - ext.wx);
  const sz = Math.sign(ext.sz - ext.nz);

  const placed: Array<{ x: number; y: number; z: number; s: number; light: number }> = [];

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const x = ext.wx + (i + 0.5 + (rand() - 0.5) * 0.85) * scenery.treeSpacing * sx;
      const z = ext.nz + (j + 0.5 + (rand() - 0.5) * 0.85) * scenery.treeSpacing * sz;

      const c = Math.round(((x - ext.wx) / (ext.ex - ext.wx)) * (hf.cols - 1));
      const r = Math.round(((z - ext.nz) / (ext.sz - ext.nz)) * (hf.rows - 1));
      if (c < 1 || r < 1 || c >= hf.cols - 1 || r >= hf.rows - 1) continue;

      const e = field.at(c, r);
      if ((e - hf.min) / span > scenery.treeMaxHeightFraction) continue;
      if (field.slope(c, r) > scenery.treeMaxSlope) continue;

      let near = false;
      for (const [rx, rz] of routeXZ) {
        if ((rx - x) ** 2 + (rz - z) ** 2 < clearSq) { near = true; break; }
      }
      if (near) continue;

      placed.push({
        x, y: e, z,
        s: scenery.treeMinHeight + rand() * (scenery.treeMaxHeight - scenery.treeMinHeight),
        light: rand(),
      });
    }
  }

  if (!placed.length) return null;

  // A twenty-face icosahedron, not a cone. Cones read as spruce, which puts an
  // alpine forest on a tropical range; a faceted ball is both truer for
  // broadleaf canopy and better low-poly. Unit height, base at the origin.
  const geo = new THREE.IcosahedronGeometry(0.46, 0);
  geo.translate(0, 0.5, 0);

  const mesh = new THREE.InstancedMesh(
    geo,
    new THREE.MeshLambertMaterial({ flatShading: true }),
    placed.length,
  );

  const m = new THREE.Matrix4();
  const dark = new THREE.Color(palette.treeDark);
  const light = new THREE.Color(palette.treeLight);
  const tint = new THREE.Color();

  placed.forEach((t, i) => {
    // Canopy about half as wide as the tree is tall. Spreading it wider than
    // tall — the first attempt — turned every tree into a hedge.
    m.makeScale(t.s * 0.55, t.s, t.s * 0.55);
    m.setPosition(t.x, t.y, t.z);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, tint.copy(dark).lerp(light, t.light));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;

  return mesh;
}

/**
 * The sky: a big inverted sphere with a vertical colour ramp baked into its
 * vertices. Technique from BrickerP's Beijing night drive.
 *
 * Belongs to the scene, never to the vertically-scaled group.
 */
export function buildSky(radius: number, palette: Palette): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 32, 16);
  const p = geo.getAttribute('position');
  const col = new Float32Array(p.count * 3);

  const haze = new THREE.Color(palette.skyHaze);
  const zenith = new THREE.Color(palette.skyZenith);
  const tmp = new THREE.Color();

  for (let i = 0; i < p.count; i++) {
    // Haze is thickest just above the horizon and thins with height.
    tmp.copy(haze).lerp(zenith, smoothstep(0, 0.42, p.getY(i) / radius));
    col[i * 3] = tmp.r;
    col[i * 3 + 1] = tmp.g;
    col[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const sky = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    }),
  );
  sky.renderOrder = -100;
  sky.frustumCulled = false;
  return sky;
}
