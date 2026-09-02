// ============================================================================
// DOM labels pinned to things in the scene.
//
// Names and numbers are HTML, not GL — text in a WebGL canvas is either blurry
// or expensive, and these need to be selectable and to render scripts the
// canvas has no font for.
//
// Known limitation, inherited and not yet solved: there is no terrain
// occlusion, so a label behind a ridge still shows.
// ============================================================================

import * as THREE from 'three';
import type { Journey } from '../types';
import type { Stage } from '../scene/stage';

/** Pixels. Labels closer than this to an already-placed one are dropped. */
const DECLUTTER = 34;

/** Metres above its place a label floats. */
const LABEL_LIFT = 20;

export interface Labels {
  update: () => void;
  /** From inside the journey, only the marker you are at gets a label — the
   *  rest hang in mid-air with no ring under them. */
  setView: (mode: 'overview' | 'firstPerson') => void;
  dispose: () => void;
}

interface Pinned {
  el: HTMLElement;
  project: (out: THREE.Vector3) => THREE.Vector3;
  /** Marker index, or -1 for a place. */
  marker: number;
}

export function createLabels(
  overlay: HTMLElement,
  stage: Stage,
  journey: Journey,
): Labels {
  const items: Pinned[] = [];

  for (const p of journey.places) {
    const el = document.createElement('div');
    el.className = 'tj-label tj-label--place';
    el.innerHTML =
      (p.nameLocal ? `<span class="tj-label__local">${p.nameLocal}</span>` : '') +
      `<span class="tj-label__name">${p.name}</span>` +
      `<span class="tj-label__meta">${Math.round(p.elevation)} m</span>`;
    overlay.appendChild(el);

    // True metres — pointScreen applies whatever vertical scale the current
    // view uses, so the label tracks its place through a view switch.
    const [x, z] = stage.frame.toLocal(p.coords[0], p.coords[1]);
    const v = new THREE.Vector3(x, p.elevation + LABEL_LIFT, z);
    items.push({ el, marker: -1, project: (o) => stage.pointScreen(v.x, v.y, v.z, o) });
  }

  journey.markers.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'tj-label tj-label--marker';
    el.innerHTML =
      `<span class="tj-label__n">${m.n}</span>` +
      (m.detail ? `<span class="tj-label__detail">${m.detail}</span>` : '');
    overlay.appendChild(el);
    items.push({ el, marker: i, project: (o) => stage.markerScreen(i, o) });
  });

  const ndc = new THREE.Vector3();
  const placed: { x: number; y: number }[] = [];
  let inside = false;

  function update() {
    const w = overlay.clientWidth;
    const h = overlay.clientHeight;
    const active = stage.activeMarker();
    placed.length = 0;

    // Nearest first, so when two labels collide the closer one survives.
    const order = items
      .map((it) => ({ it, n: it.project(ndc).clone() }))
      .sort((a, b) => a.n.z - b.n.z);

    for (const { it, n } of order) {
      const isActive = it.marker >= 0 && it.marker === active;

      if (inside && it.marker >= 0 && !isActive) {
        it.el.style.opacity = '0';
        continue;
      }

      // z > 1 means behind the camera; three projects those to a mirrored
      // position that looks perfectly plausible and is completely wrong.
      if (n.z > 1 || n.x < -1.1 || n.x > 1.1 || n.y < -1.1 || n.y > 1.1) {
        it.el.style.opacity = '0';
        continue;
      }

      const x = (n.x * 0.5 + 0.5) * w;
      const y = (-n.y * 0.5 + 0.5) * h;

      // The marker you are at always wins its space.
      if (!isActive && placed.some((q) => Math.hypot(q.x - x, q.y - y) < DECLUTTER)) {
        it.el.style.opacity = '0';
        continue;
      }
      placed.push({ x, y });

      it.el.style.transform =
        `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`;
      it.el.style.opacity = '1';
      it.el.classList.toggle('is-active', isActive);
    }
  }

  return {
    update,
    setView(mode) {
      inside = mode === 'firstPerson';
    },
    dispose() {
      items.forEach((i) => i.el.remove());
    },
  };
}
