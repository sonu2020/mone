// ============================================================================
// Turning "how far along are we" into a camera pose.
//
// The curve is built at TRUE vertical scale. The view's exaggeration lives on
// the group holding the scenery, so every height read off the ground has to be
// multiplied by the current scale before it means anything in world space —
// but only those. Eye height and camera stand-off are real distances in the
// rendered world and are never scaled, or the traveller would sit 2 m up in one
// view and 4 m up in the other.
//
// The two views want opposite things from the same curve, and the whole design
// of this file is that disagreement. See `overview` and `firstPerson` below.
// ============================================================================

import * as THREE from 'three';
import type { CameraSpec, RoutePoint, VerticalScale, ViewMode } from '../types';
import type { LocalFrame } from '../geo/frame';

/** True-metre ground elevation at a point, for keeping out of the hill. */
export type GroundSampler = (x: number, z: number) => number;

export class CameraRig {
  readonly curve: THREE.CatmullRomCurve3;

  private readonly pos = new THREE.Vector3();
  private readonly aim = new THREE.Vector3();
  private readonly wantPos = new THREE.Vector3();
  private readonly wantAim = new THREE.Vector3();
  private readonly here = new THREE.Vector3();
  private readonly ahead = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();
  private readonly side = new THREE.Vector3();
  private static readonly UP = new THREE.Vector3(0, 1, 0);

  private settled = false;
  /** Filtered eye height, so DEM noise underfoot does not read as a stagger. */
  private eyeY = 0;
  private mode: ViewMode = 'overview';
  private scaleY: number;

  constructor(
    route: RoutePoint[],
    frame: LocalFrame,
    private readonly spec: CameraSpec,
    private readonly length: number,
    private readonly lift: number,
    private readonly scale: VerticalScale,
  ) {
    this.scaleY = scale.overview;
    const pts = route.map(([lng, lat, ele]) => {
      const [x, z] = frame.toLocal(lng, lat);
      return new THREE.Vector3(x, ele, z);
    });
    // Centripetal parameterisation, because a uniform Catmull-Rom overshoots
    // badly at tight bends — the curve swings wide of the line it should be on.
    this.curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    // The default arc-length table is 200 divisions, which over a long route is
    // tens of metres per division and makes getPointAt step rather than glide.
    // One table build at startup, nothing per frame.
    this.curve.arcLengthDivisions = 4000;
  }

  /** Switching view re-snaps, so the camera does not sail across the valley
   *  from wherever the other mode left it. */
  setMode(m: ViewMode) {
    this.scaleY = this.scale[m];
    if (m === this.mode) return;
    this.mode = m;
    this.settled = false;
  }

  /** Where the traveller is at `p`, in true metres. */
  pointAt(p: number, out = new THREE.Vector3()): THREE.Vector3 {
    return this.curve.getPointAt(clamp01(p), out);
  }

  /** Deck height in world units: over whichever surface is higher, scaled. */
  private deck(at: THREE.Vector3, ground?: GroundSampler): number {
    const g = ground ? ground(at.x, at.z) : -Infinity;
    return (Math.max(at.y, g) + this.lift) * this.scaleY;
  }

  /**
   * The averaged forward direction at `p`: the chord across the next `metres`
   * of route, backing off near the end so it never collapses.
   */
  private forward(p: number, metres: number): THREE.Vector3 {
    const span = metres / this.length;
    let a = clamp01(p);
    const b = clamp01(p + span);
    if (b - a < span * 0.5) a = clamp01(b - span);
    this.curve.getPointAt(a, this.here);
    this.curve.getPointAt(b, this.ahead);
    this.dir.subVectors(this.ahead, this.here);
    if (this.dir.lengthSq() < 1e-6) this.curve.getTangentAt(a, this.dir);
    return this.dir.normalize();
  }

  /**
   * Advance the camera toward the pose for `p`.
   *
   * `dt` in seconds; smoothing is exponential and so frame-rate independent.
   * `snap` arrives instantly, for the first frame and for reduced motion.
   */
  update(
    camera: THREE.PerspectiveCamera,
    p: number,
    dt: number,
    ground?: GroundSampler,
    snap = false,
    bob = 0,
  ) {
    if (this.mode === 'firstPerson') this.firstPerson(camera, p, dt, snap, ground, bob);
    else this.overview(camera, p, dt, snap, ground);
  }

  /**
   * Outside, behind and above, aimed down the AVERAGED tangent.
   *
   * That averaging is the single idea this view turns on. Aimed down the
   * instantaneous tangent the camera whips through 170° at every hairpin —
   * nauseating, and it hides the very thing worth showing. Averaged, the
   * heading barely moves through a switchback while the traveller sweeps the
   * full turn beneath it, so the bend unrolls as a shape.
   */
  private overview(
    camera: THREE.PerspectiveCamera,
    p: number,
    dt: number,
    snap: boolean,
    ground?: GroundSampler,
  ) {
    const at = this.pointAt(p, new THREE.Vector3());
    const fwd = this.forward(p, this.spec.overviewLookAhead);
    const base = at.y * this.scaleY;

    this.wantPos
      .copy(at)
      .addScaledVector(fwd, -this.spec.overviewBack)
      .setY(base + this.spec.overviewHeight);

    this.wantAim.copy(at).addScaledVector(fwd, this.spec.overviewTarget).setY(base);

    // Clear the ground between the camera and what it is aiming at, not merely
    // the ground under the camera.
    //
    // Checking only underfoot is what the first version did, and it fails in
    // two different ways. On a ghat the camera burrows into the hillside it is
    // cut into. On a river it does the opposite: trailing 760 m back puts it up
    // a valley side, the check is satisfied, and the hill it is now standing on
    // sits squarely between it and the water — so the journey is a green field
    // with the line nowhere in it.
    //
    // Sampling the whole span and rising above the highest point fixes both. It
    // costs a handful of bilinear lookups per frame.
    if (ground) {
      // Solve for the camera height that keeps the SIGHTLINE above the ground,
      // rather than merely keeping the camera above it.
      //
      // Two weaker versions failed first. Clearing only the ground underfoot
      // let the camera burrow into a ghat's hillside. Clearing the highest
      // point between camera and target fixed that and still lost a river
      // entirely: the camera stood on a valley side 120 m above its own peak,
      // but the sightline down to the water dipped back into that same ridge
      // within a couple of hundred metres, so the journey was a green field
      // with nothing in it.
      //
      // For a sample at fraction t along the line, the ray is at
      //   y(t) = camY + (aimY − camY)·t
      // and must clear g(t). Rearranged for camY, the binding sample wins.
      // The segment to clear ends at the TRAVELLER, not at the aim point: the
      // aim sits `overviewTarget` metres further on, so its ray is shallower,
      // and clearing that one leaves the steeper ray to the traveller cutting
      // through the ridge.
      //
      // Solving y(t) = camY + (targetY − camY)·t ≥ g(t) + margin for camY gives
      // a 1/(1−t) term, which is a trap: sampled near the target it multiplies
      // the margin by twenty and flings the camera kilometres up — the ghat
      // looked fine and the river turned into a green field seen from orbit.
      //
      // So only the near two-thirds of the ray is solved this way, where the
      // amplification stays under 3×. Ground nearer the traveller than that is
      // handled by the plain underfoot clamp below, which cannot run away.
      const targetY = at.y * this.scaleY;
      const margin = this.spec.overviewClearance;
      const STEPS = 8;
      for (let i = 1; i <= STEPS; i++) {
        const t = (i / STEPS) * 0.66;
        const g =
          ground(
            this.wantPos.x + (at.x - this.wantPos.x) * t,
            this.wantPos.z + (at.z - this.wantPos.z) * t,
          ) * this.scaleY;
        const needed = (g + margin - targetY * t) / (1 - t);
        if (needed > this.wantPos.y) this.wantPos.y = needed;
      }

      // Never inside the hill the camera stands on.
      const underfoot =
        ground(this.wantPos.x, this.wantPos.z) * this.scaleY + margin;
      if (this.wantPos.y < underfoot) this.wantPos.y = underfoot;

      // And never so high the journey becomes a map. Whatever the terrain
      // does, the overview stays an overview.
      const ceiling = targetY + this.spec.overviewHeight * 3;
      if (this.wantPos.y > ceiling) this.wantPos.y = ceiling;
    }

    if (snap || !this.settled) {
      this.pos.copy(this.wantPos);
      this.aim.copy(this.wantAim);
      this.settled = true;
    } else {
      const k = 1 - Math.exp(-this.spec.overviewDamping * dt);
      this.pos.lerp(this.wantPos, k);
      this.aim.lerp(this.wantAim, k);
    }

    camera.position.copy(this.pos);
    camera.lookAt(this.aim);
  }

  /**
   * On the line, offset into a lane, looking at a point a short way ahead.
   *
   * The position is exact every frame — never smoothed. Damping the position
   * looks harmless on a straight and then cuts the corner at a hairpin and puts
   * the viewpoint out over the drop, which reads as a bug rather than as
   * motion. Only the aim is damped, and that is what supplies the feeling of
   * steering into a bend rather than snapping to it.
   */
  private firstPerson(
    camera: THREE.PerspectiveCamera,
    p: number,
    dt: number,
    snap: boolean,
    ground?: GroundSampler,
    bob = 0,
  ) {
    const at = this.pointAt(p, new THREE.Vector3());

    // Which way is sideways comes from the tangent right here, not from the
    // look-ahead — that is what keeps the traveller in one lane all the way
    // round a bend instead of drifting across the middle.
    this.curve.getTangentAt(clamp01(p), this.dir);
    this.side.crossVectors(this.dir, CameraRig.UP).normalize();
    if (this.side.lengthSq() < 0.5) this.side.set(1, 0, 0);

    // x and z are exact; only the height is filtered. A DEM sampled every 19 m
    // is noisy underfoot and on a footpath that noise reads as a stagger, but
    // damping the whole position would cut the corner at a switchback and put
    // the viewpoint out over the drop.
    const wantY = this.deck(at, ground) + this.spec.firstPersonEye;
    if (snap || !this.settled) this.eyeY = wantY;
    else this.eyeY += (wantY - this.eyeY) * (1 - Math.exp(-this.spec.firstPersonHeightDamping * dt));

    this.pos
      .copy(at)
      .addScaledVector(this.side, this.spec.firstPersonLateral)
      .setY(this.eyeY + bob);

    // The aim point rides the curve itself, so it goes round the bend with the
    // traveller rather than cutting across it.
    this.curve.getPointAt(
      clamp01(p + this.spec.firstPersonLookAhead / this.length),
      this.ahead,
    );
    this.wantAim
      .copy(this.ahead)
      .addScaledVector(this.side, this.spec.firstPersonLateral)
      .setY(this.deck(this.ahead, ground) + this.spec.firstPersonAimLift);

    if (snap || !this.settled) {
      this.aim.copy(this.wantAim);
      this.settled = true;
    } else {
      this.aim.lerp(this.wantAim, 1 - Math.exp(-this.spec.firstPersonDamping * dt));
    }

    camera.position.copy(this.pos);
    camera.lookAt(this.aim);
  }
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
