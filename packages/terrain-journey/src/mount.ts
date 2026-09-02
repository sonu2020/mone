// ============================================================================
// One call that wires the whole thing up.
//
// The parts underneath are all separately usable — a page that wants its own
// loop can build a Stage and drive it by hand. This is the path for the other
// ninety per cent: hand over a canvas, an overlay and a tall section, get back
// a running journey.
//
// Everything is lazy and everything can fail. Three.js and the DEM are only
// touched once this is called, so a page that never scrolls that far never pays
// for either; and if WebGL is missing or the tiles never arrive, this rejects
// and the caller falls back to whatever it server-rendered.
// ============================================================================

import type { Journey, ViewMode } from './types';
import { createStage, type Stage } from './scene/stage';
import { createLabels, type Labels } from './ui/labels';
import { createMarkerCard, type MarkerCard } from './ui/marker-card';
import { createProfile, type Profile } from './ui/profile';
import { createScrubber, type Scrubber } from './ui/scrubber';
import { CAMERA, resolve } from './defaults';

export interface MountOptions {
  canvas: HTMLCanvasElement;
  /** Positioned container the DOM labels are appended to. */
  overlay: HTMLElement;
  /** The tall section whose scroll range drives the journey. */
  section: HTMLElement;
  journey: Journey;
  /** Optional canvas for the elevation strip. */
  profileCanvas?: HTMLCanvasElement | null;
  /**
   * Interactive container for the reveal card, OUTSIDE the stage.
   *
   * Required only if markers carry `image` or `more`. The stage is
   * `position: fixed` at `z-index: 0` with `pointer-events: none`, so a card
   * inside it can never be clicked; without a host the card still renders and
   * still tracks, it just never opens.
   */
  cardHost?: HTMLElement | null;
  autoplaySeconds?: number;
  reducedMotion?: boolean;
  /** Fired every frame with the current state, for readouts. */
  onProgress?: (state: {
    progress: number;
    metres: number;
    elevation: number;
    marker: number;
  }) => void;
  onLive?: (live: boolean) => void;
  onPlaying?: (playing: boolean) => void;
  onViewChange?: (mode: ViewMode) => void;
}

export interface MountedJourney {
  stage: Stage;
  labels: Labels;
  card: MarkerCard;
  profile: Profile | null;
  scrubber: Scrubber;
  setView: (mode: ViewMode) => void;
  view: () => ViewMode;
  dispose: () => void;
}

export async function mountJourney(opts: MountOptions): Promise<MountedJourney> {
  const { canvas, overlay, section, journey } = opts;
  const cam = resolve(CAMERA, journey.camera);
  const reduced = opts.reducedMotion ?? false;

  const stage = await createStage(canvas, journey);
  const labels = createLabels(overlay, stage, journey);
  const card = createMarkerCard(overlay, stage, journey, { host: opts.cardHost });

  let profile: Profile | null = null;
  if (opts.profileCanvas) {
    try {
      profile = createProfile(opts.profileCanvas, journey);
    } catch (e) {
      // The strip is a convenience; the journey works without it.
      console.warn('[terrain-journey] elevation strip unavailable', e);
    }
  }

  function size() {
    stage.resize(window.innerWidth, window.innerHeight);
  }
  size();

  function elevationAt(metres: number) {
    const r = journey.route;
    for (let i = 1; i < r.length; i++) {
      if (r[i][3] >= metres) {
        const a = r[i - 1];
        const b = r[i];
        const t = (metres - a[3]) / Math.max(1e-6, b[3] - a[3]);
        return a[2] + (b[2] - a[2]) * t;
      }
    }
    return r[r.length - 1][2];
  }

  // Gait state. Phase advances with TIME, amplitude is gated by SPEED.
  //
  // The obvious model — phase as a function of distance travelled — is
  // unusable here. A trek covers metres of ground per pixel of scroll, so a
  // stride-length wavelength meant one wheel notch advanced dozens of bob
  // cycles and the camera shook instead of walking. Time-based with a speed
  // gate gives a real gait at any scroll granularity, and decays to nothing
  // when the reader stops.
  let bobPhase = 0;
  let speed = 0;
  let lastP: number | null = null;

  function drawAt(p: number, dt: number, snap: boolean) {
    stage.setProgress(p);

    const moved = lastP === null ? 0 : Math.abs(p - lastP) * journey.length;
    lastP = p;
    if (dt > 0) {
      const instant = moved / dt;
      speed += (instant - speed) * Math.min(1, dt * 6);
    }
    const gait = Math.min(1, speed / Math.max(0.1, cam.bobFullSpeed));
    bobPhase += dt * cam.bobHz * 2 * Math.PI * gait;

    const bob =
      !reduced && stage.view() === 'firstPerson'
        ? Math.sin(bobPhase) * cam.bobAmplitude * gait
        : 0;
    stage.rig.update(stage.camera, p, dt, stage.groundAt, snap, bob);
    stage.render();
    labels.update();
    card.update();
    profile?.setProgress(p);

    const metres = p * journey.length;
    opts.onProgress?.({
      progress: p,
      metres,
      elevation: elevationAt(metres),
      marker: stage.activeMarker(),
    });
  }

  const scrubber = createScrubber({
    section,
    reducedMotion: reduced,
    autoplaySeconds: opts.autoplaySeconds,
    onLive: opts.onLive,
    onPlaying: opts.onPlaying,
    // Reduced motion holds one still frame at the halfway point rather than
    // animating: the dead scroll existed only to drive a camera.
    onFrame: (p, dt, first) => drawAt(reduced ? 0.5 : p, dt, reduced || first),
  });

  function setView(mode: ViewMode) {
    stage.setView(mode);
    labels.setView(mode);
    opts.onViewChange?.(mode);
    drawAt(reduced ? 0.5 : scrubber.progress(), 0, true);
  }

  const onResize = () => {
    size();
    profile?.resize();
    drawAt(reduced ? 0.5 : scrubber.progress(), 0, true);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const onContextLost = (e: Event) => e.preventDefault();
  canvas.addEventListener('webglcontextlost', onContextLost);

  setView('overview');

  return {
    stage,
    labels,
    card,
    profile,
    scrubber,
    setView,
    view: () => stage.view(),
    dispose() {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scrubber.dispose();
      card.dispose();
      labels.dispose();
      stage.dispose();
    },
  };
}
