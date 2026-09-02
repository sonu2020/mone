// ============================================================================
// The stage: everything a journey draws, and the two ways of looking at it.
//
// Everything that sits on the ground lives in `world`, a group whose Y scale
// carries the view's vertical exaggeration. Building at true scale and scaling
// the group is what lets the two views disagree about it without rebuilding a
// vertex.
//
// The sky and the lights are NOT in that group. Scaling a sky sphere in Y turns
// the horizon into an ellipse, and scaling a light just moves it somewhere
// wrong.
// ============================================================================

import * as THREE from 'three';
import { CameraRig } from '../camera/rig';
import { CAMERA, PALETTE, SCENERY, VERTICAL_SCALE, resolve } from '../defaults';
import { LocalFrame } from '../geo/frame';
import { loadHeightField, type HeightField } from '../geo/heightfield';
import type { Journey, ViewMode } from '../types';
import { buildRibbon } from './ribbon';
import { Field, buildSky, buildTerrain, buildTrees, type Extent } from './terrain';

/** Fog distances, metres, per view. The first-person view sees a valley; the
 *  overview sees the whole journey and must not have it dissolve early. */
const FOG = { overview: [2600, 17000], firstPerson: [700, 9000] } as const;

/**
 * The DEM sample grid, and the facets built from it, both scale with the
 * journey.
 *
 * A 6 km ghat and a 105 km river cannot share one figure. Fixed at 280×340 the
 * river got 215 m cells, which is a landscape made of car parks; fixed at the
 * river's count the ghat would build a hundred times the triangles it needs.
 *
 * So: aim for a target ground resolution, clamp the grid to something a browser
 * will hold, and never ask for detail finer than the DEM actually carries.
 */
const TARGET_CELL_M = 22;
const MIN_FIELD = 180;
const MAX_FIELD = 460;

function fieldSize(metres: number) {
  return Math.round(Math.max(MIN_FIELD, Math.min(MAX_FIELD, metres / TARGET_CELL_M)));
}

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rig: CameraRig;
  frame: LocalFrame;
  /** True-metre ground elevation, unscaled. */
  groundAt: (x: number, z: number) => number;
  setProgress: (p: number) => void;
  setView: (mode: ViewMode) => void;
  view: () => ViewMode;
  /** Index into `journey.markers` of the nearest marker, or -1. */
  activeMarker: () => number;
  markerScreen: (n: number, out: THREE.Vector3) => THREE.Vector3;
  travellerScreen: (out: THREE.Vector3) => THREE.Vector3;
  /** Project a point given in TRUE metres; the view's scale is applied here. */
  pointScreen: (x: number, y: number, z: number, out: THREE.Vector3) => THREE.Vector3;
  resize: (w: number, h: number) => void;
  render: () => void;
  dispose: () => void;
}

export async function createStage(
  canvas: HTMLCanvasElement,
  journey: Journey,
): Promise<Stage> {
  const palette = resolve(PALETTE, journey.palette);
  const cam = resolve(CAMERA, journey.camera);
  const scale = journey.verticalScale ?? VERTICAL_SCALE;

  const frame = new LocalFrame(journey.bbox);
  const [wx, nz] = frame.toLocal(journey.bbox[0], journey.bbox[3]);
  const [ex, sz] = frame.toLocal(journey.bbox[2], journey.bbox[1]);
  const widthM = Math.abs(ex - wx);
  const depthM = Math.abs(sz - nz);

  const hf: HeightField = await loadHeightField(journey.bbox, {
    cols: fieldSize(widthM),
    rows: fieldSize(depthM),
  });

  // Never ask for facets finer than the DEM at the zoom actually fetched — that
  // buys triangles and no detail. A wide journey drops a zoom level to stay
  // inside the tile budget, and the facets have to follow it down.
  const scenery = resolve(SCENERY, {
    ...journey.scenery,
    facet: Math.max(
      journey.scenery?.facet ?? SCENERY.facet,
      hf.meta.metresPerPixel * 1.4,
    ),
    wire: Math.max(
      journey.scenery?.wire ?? SCENERY.wire,
      hf.meta.metresPerPixel * 2.8,
    ),
    treeSpacing: Math.max(
      journey.scenery?.treeSpacing ?? SCENERY.treeSpacing,
      // Trees are placed on a grid over the whole bbox, so a wide journey would
      // otherwise plant hundreds of thousands of them.
      Math.sqrt((widthM * depthM) / 14000),
    ),
  });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(palette.skyHaze), 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(palette.fog), FOG.overview[0], FOG.overview[1]);

  // Both of these have to follow the journey's size. Fixed at the figures a
  // 6 km ghat wants, a 60 km river ends up with its sky sphere buried inside
  // its own terrain and its far plane clipping the horizon.
  const diagonal = Math.hypot(widthM, depthM);
  const skyRadius = Math.max(26000, diagonal * 1.8);
  const camera = new THREE.PerspectiveCamera(
    cam.overviewFov, 1, 10, Math.max(40000, diagonal * 2.6),
  );

  const world = new THREE.Group();
  scene.add(world);

  const extent: Extent = { wx, nz, ex, sz };
  const field = new Field(hf, extent);
  const groundAt = (x: number, z: number) => field.sample(x, z);

  // ── Sky and light ─────────────────────────────────────────────────────────
  scene.add(buildSky(skyRadius, palette));
  scene.add(new THREE.HemisphereLight(palette.skyHaze, palette.groundMid, 1.55));
  const sun = new THREE.DirectionalLight('#fff3dc', 1.35);
  sun.position.set(-6000, 5200, 2400);
  scene.add(sun);

  // ── Ground ────────────────────────────────────────────────────────────────
  const terrain = buildTerrain(hf, extent, palette, scenery);
  world.add(terrain.mesh, terrain.wire);

  const rig = new CameraRig(journey.route, frame, cam, journey.length, journey.ribbon.lift, scale);

  const routeXZ = journey.route.map(([lng, lat]) => frame.toLocal(lng, lat));
  const trees = buildTrees(hf, extent, routeXZ, palette, scenery);
  if (trees) world.add(trees);

  // ── The line ──────────────────────────────────────────────────────────────
  //
  // Drawn along a DECK curve, not the raw route. The route carries per-point
  // DEM samples; the terrain mesh is a much coarser grid over the same DEM, and
  // in a valley the mesh averages the valley floor upward. Drawn at its own
  // elevation the line then runs underneath the landscape it belongs to — which
  // is how a 105 km river came to be invisible from directly above it.
  //
  // Both the overview tube and the close-up ribbon ride this, so the line is
  // above ground in both views by construction.
  // The clearance scales with the facet size, and that is the whole trick.
  // `groundAt` interpolates the heightfield bilinearly while the mesh draws
  // flat triangles between the same samples, so between vertices the drawn
  // surface can sit a metre or two above the sampled one. At the ghat's 20 m
  // facets the ribbon's own 1.5 m lift covers that; at a river's 131 m facets
  // it does not, and the line disappears under its own landscape.
  //
  // Only the overview tube needs this. The close-up ribbon builds its own deck
  // from the raw curve, because from the water a channel floating eight metres
  // over its banks is obvious.
  const tubeClearance = journey.ribbon.lift + scenery.facet * 0.08;
  const deckSamples = Math.min(2000, Math.max(200, Math.round(journey.length / 40)));
  const deckPts: THREE.Vector3[] = [];
  for (let i = 0; i <= deckSamples; i++) {
    const q = rig.curve.getPointAt(i / deckSamples);
    q.y = Math.max(q.y, groundAt(q.x, q.z)) + tubeClearance;
    deckPts.push(q);
  }
  const deckCurve = new THREE.CatmullRomCurve3(deckPts, false, 'centripetal');
  deckCurve.arcLengthDivisions = 4000;

  const tubular = Math.min(1400, journey.route.length * 5);
  const tubeGeo = new THREE.TubeGeometry(
    deckCurve, tubular, journey.ribbon.tubeRadius, 6, false,
  );
  const tubeAhead = new THREE.Mesh(
    tubeGeo,
    new THREE.MeshBasicMaterial({ color: palette.routeAhead }),
  );
  world.add(tubeAhead);

  // The travelled part is the same geometry drawn again with a growing draw
  // range. TubeGeometry emits its indices in order along the tube, so a draw
  // range is exactly "the line up to here" — one number per frame rather than
  // a vertex buffer rewrite.
  const tubeDoneGeo = tubeGeo.clone();
  const tubeDone = new THREE.Mesh(
    tubeDoneGeo,
    new THREE.MeshBasicMaterial({ color: palette.routeDone }),
  );
  tubeDone.renderOrder = 1;
  world.add(tubeDone);
  const tubeIndexCount = tubeDoneGeo.getIndex()!.count;

  const ribbon = buildRibbon(rig.curve, journey.length, journey.ribbon, palette, groundAt);
  ribbon.group.visible = false;
  world.add(ribbon.group);

  // ── Markers ───────────────────────────────────────────────────────────────
  const ringRadius = Math.max(30, journey.ribbon.tubeRadius * 4);
  const markerMeshes = journey.markers.map((m) => {
    const [x, z] = frame.toLocal(m.coords[0], m.coords[1]);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 4, 8, 40),
      new THREE.MeshBasicMaterial({ color: palette.marker, transparent: true, opacity: 0.8 }),
    );
    // Same reason as the deck curve: a ring at its own elevation sinks into a
    // coarse mesh.
    ring.position.set(x, Math.max(m.elevation, groundAt(x, z)) + tubeClearance + 12, z);
    ring.rotation.x = -Math.PI / 2;
    world.add(ring);
    return ring;
  });

  const traveller = new THREE.Mesh(
    new THREE.SphereGeometry(Math.max(10, journey.ribbon.tubeRadius), 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
  traveller.renderOrder = 2;
  world.add(traveller);

  const travellerPos = new THREE.Vector3();
  let active = -1;
  let mode: ViewMode = 'overview';

  // Half the average gap between markers, so the nearest one is nearly always
  // named and the readout hands over from one to the next. On the ghat that is
  // about 800 m — a bend, then nothing between bends. On a river with five
  // towns across a hundred kilometres it is about ten, which is the honest
  // answer to "where am I": passing Areekode.
  const markerRadius =
    journey.markerRadius ??
    Math.max(300, Math.min(12000, (journey.length / Math.max(1, journey.markers.length)) * 0.5));

  function setProgress(p: number) {
    deckCurve.getPointAt(clamp01(p), travellerPos);
    traveller.position.copy(travellerPos);
    tubeDoneGeo.setDrawRange(0, Math.round(tubeIndexCount * clamp01(p)));

    const metres = p * journey.length;
    let best = -1;
    let bestD = markerRadius;
    for (let i = 0; i < journey.markers.length; i++) {
      const d = Math.abs(journey.markers[i].km * 1000 - metres);
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best !== active) {
      for (const [i, m] of markerMeshes.entries()) {
        const mat = m.material as THREE.MeshBasicMaterial;
        const on = i === best;
        mat.color.set(on ? palette.markerActive : palette.marker);
        mat.opacity = on ? 1 : 0.8;
      }
      active = best;
    }
    markerMeshes.forEach((m, i) => m.scale.setScalar(i === active ? 1.2 : 1));
  }

  function setView(next: ViewMode) {
    mode = next;
    const inside = next === 'firstPerson';

    // `hideSurface` is a first-person concern only: from the air the route
    // still needs to be findable, so the tube below is untouched by it.
    ribbon.group.visible = inside && !journey.ribbon.hideSurface;
    tubeAhead.visible = !inside;
    tubeDone.visible = !inside;
    // Inside the journey you ARE the traveller; a white sphere around your head
    // fills the screen.
    traveller.visible = !inside;
    // The rings are sized to be legible from hundreds of metres up. At eye
    // level one is a disc across the whole windscreen, so from inside the
    // marker is announced by its label and the readout instead — and the labels
    // project from the ring positions whether or not the rings are drawn.
    markerMeshes.forEach((m) => (m.visible = !inside));
    // The wireframe is the analytical overlay. It belongs to the map, not to
    // the windscreen.
    terrain.wire.visible = !inside;

    rig.setMode(next);
    world.scale.y = scale[next];

    const [near, far] = inside ? FOG.firstPerson : FOG.overview;
    (scene.fog as THREE.Fog).near = near;
    (scene.fog as THREE.Fog).far = far;

    camera.near = inside ? cam.firstPersonNear : 10;
    camera.fov = fovFor(inside, camera.aspect);
    camera.updateProjectionMatrix();
  }

  /** A cockpit reads pinched on a tall phone, so the field widens as the
   *  viewport narrows. Idea from BrickerP's Beijing drive. */
  function fovFor(inside: boolean, aspect: number) {
    const base = inside ? cam.firstPersonFov : cam.overviewFov;
    const portrait = 1 - Math.min(1, Math.max(0, (aspect - 0.7) / 0.6));
    return base + portrait * (inside ? 16 : 10);
  }

  const tmp = new THREE.Vector3();
  const project = (v: THREE.Vector3, out: THREE.Vector3) => out.copy(v).project(camera);

  setView('overview');

  return {
    renderer,
    scene,
    camera,
    rig,
    frame,
    groundAt,
    setProgress,
    setView,
    view: () => mode,
    activeMarker: () => active,
    // Meshes live in the scaled group, so their world position already carries
    // the exaggeration.
    markerScreen: (n, out) => project(markerMeshes[n].getWorldPosition(tmp), out),
    travellerScreen: (out) => project(traveller.getWorldPosition(tmp), out),
    pointScreen: (x, y, z, out) => project(tmp.set(x, y * world.scale.y, z), out),
    resize(w, h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = fovFor(mode === 'firstPerson', camera.aspect);
      camera.updateProjectionMatrix();
    },
    render: () => renderer.render(scene, camera),
    dispose() {
      terrain.dispose();
      trees?.geometry.dispose();
      (trees?.material as THREE.Material)?.dispose();
      tubeGeo.dispose();
      tubeDoneGeo.dispose();
      ribbon.dispose();
      markerMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      traveller.geometry.dispose();
      (traveller.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
