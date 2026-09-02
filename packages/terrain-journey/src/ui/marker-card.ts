// ============================================================================
// The reveal card: what the traveller is passing, and which way it lies.
//
// Sticky, but positionally aware. It appears when a marker becomes the nearest
// one, holds while that stays true, and hands over to the next — so on a long
// journey there is always something on screen naming where you are.
//
// The positional part matters more than it sounds. A card that just sits in a
// corner is a caption; a card that moves to the side the place is actually on,
// tracks its height, and points at it, tells you where to look. When the place
// goes behind the camera the caret swings round rather than the card vanishing,
// because "you have just passed it" is information too.
//
// Markers without a `title` get no card. A hairpin's number already says
// everything there is to say about it.
//
// ── Where it lives ──────────────────────────────────────────────────────────
//
// If a marker carries `image` or `more`, the card is INTERACTIVE, and it cannot
// then live inside the stage: that is `position: fixed` at `z-index: 0` with
// `pointer-events: none`, so it is both its own stacking context beneath the
// page and deaf to clicks. Hosts that want the expandable variant pass a `host`
// element of their own, outside the stage. Without one the card still renders,
// still moves, and simply never opens.
// ============================================================================

import * as THREE from 'three';
import type { Journey } from '../types';
import type { Stage } from '../scene/stage';

/** Pixels of margin from the viewport edges. */
const EDGE = 24;
/** Pixels the card's centre is kept clear of the top edge. */
const TOP_MARGIN = 130;
/**
 * And of the bottom — larger, because hosts put an elevation strip down there
 * and a card that slides under it is worse than one that stops short.
 */
const BOTTOM_MARGIN = 230;

export interface MarkerCard {
  update: () => void;
  dispose: () => void;
}

export interface MarkerCardOptions {
  /** Interactive container outside the stage. Omit for a read-only card. */
  host?: HTMLElement | null;
}

export function createMarkerCard(
  overlay: HTMLElement,
  stage: Stage,
  journey: Journey,
  opts: MarkerCardOptions = {},
): MarkerCard {
  const host = opts.host ?? overlay;
  const interactive = Boolean(opts.host);

  const el = document.createElement('aside');
  el.className = interactive ? 'tj-card is-interactive' : 'tj-card';
  el.setAttribute('aria-live', 'polite');
  host.appendChild(el);

  const caret = document.createElement('span');
  caret.className = 'tj-card__caret';
  caret.setAttribute('aria-hidden', 'true');

  const body = document.createElement('div');
  body.className = 'tj-card__body';

  el.append(caret, body);

  const ndc = new THREE.Vector3();
  let shown = -1;
  let side: 'left' | 'right' = 'right';
  /** Reset on every hand-over: an expander left open would carry a previous
   *  place's disclosure state onto the next one. */
  let open = false;

  function render(i: number) {
    const m = journey.markers[i];
    const img = m.image;
    const canOpen = interactive && Boolean(m.more);

    body.innerHTML =
      (img
        ? `<figure class="tj-card__figure">
             <img src="${img.src}" alt="${escapeAttr(img.alt)}" loading="lazy" decoding="async">
             ${img.credit ? `<figcaption>${img.href
               ? `<a href="${img.href}" target="_blank" rel="noopener">${img.credit}</a>`
               : img.credit}</figcaption>` : ''}
           </figure>`
        : '') +
      `<div class="tj-card__text">` +
      `<p class="tj-card__index">${m.n} / ${journey.markers.length}</p>` +
      (m.titleLocal ? `<p class="tj-card__local">${m.titleLocal}</p>` : '') +
      `<h3 class="tj-card__title">${m.title}</h3>` +
      (m.detail ? `<p class="tj-card__detail">${m.detail}</p>` : '') +
      (m.note ? `<p class="tj-card__note">${m.note}</p>` : '') +
      (canOpen
        ? `<button type="button" class="tj-card__toggle" aria-expanded="false">
             <span class="tj-card__toggle-label">Read more</span>
             <i class="tj-card__chev" aria-hidden="true"></i>
           </button>
           <div class="tj-card__more" hidden><p>${m.more}</p></div>`
        : '') +
      `</div>`;

    open = false;
    if (canOpen) wireToggle();
  }

  function wireToggle() {
    const btn = body.querySelector<HTMLButtonElement>('.tj-card__toggle');
    const more = body.querySelector<HTMLElement>('.tj-card__more');
    const label = body.querySelector<HTMLElement>('.tj-card__toggle-label');
    if (!btn || !more) return;

    btn.addEventListener('click', () => {
      open = !open;
      more.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close' : 'Read more';
      el.classList.toggle('is-open', open);
    });

    // The card sits over a scroll-driven scene. A wheel gesture that starts on
    // an open card should scroll the page as usual — it must not be swallowed
    // by the card — but a click inside it must not fall through to anything
    // underneath either.
    btn.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  function update() {
    const active = stage.activeMarker();
    const m = active >= 0 ? journey.markers[active] : null;

    if (!m || !m.title) {
      el.classList.remove('is-visible', 'is-open');
      shown = -1;
      return;
    }

    if (active !== shown) {
      render(active);
      shown = active;
      el.classList.remove('is-open');
    }
    el.classList.add('is-visible');

    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    stage.markerScreen(active, ndc);

    // Behind the camera, three projects to a mirrored position that looks
    // entirely plausible and is exactly wrong — so flip it back by hand.
    const behind = ndc.z > 1;
    const x = behind ? -ndc.x : ndc.x;
    const y = behind ? -ndc.y : ndc.y;

    // Sit on the side the place is on, so the card never covers it.
    const nextSide = x < 0 ? 'right' : 'left';
    if (nextSide !== side) {
      side = nextSide;
      el.classList.toggle('is-left', side === 'left');
      el.classList.toggle('is-right', side === 'right');
    }

    const px = (x * 0.5 + 0.5) * w;
    // An open card is taller and would otherwise drift off the bottom, so it
    // parks higher while it is open.
    const bottom = open ? BOTTOM_MARGIN + 140 : BOTTOM_MARGIN;
    const py = Math.min(
      Math.max(TOP_MARGIN, h - bottom),
      Math.max(TOP_MARGIN, (-y * 0.5 + 0.5) * h),
    );
    el.style.top = `${Math.round(py)}px`;
    el.style.left = side === 'left' ? `${EDGE}px` : '';
    el.style.right = side === 'right' ? `${EDGE}px` : '';

    // The caret points from the card toward the place. Once it is behind the
    // camera it swings back down the journey, which reads as "passed".
    const cardX = side === 'left' ? EDGE + el.offsetWidth : w - EDGE - el.offsetWidth;
    const angle = Math.atan2(
      (-y * 0.5 + 0.5) * h - py,
      behind ? (side === 'left' ? -1 : 1) * w : px - cardX,
    );
    caret.style.transform = `rotate(${angle}rad)`;
    el.classList.toggle('is-behind', behind);
  }

  return {
    update,
    dispose() {
      el.remove();
    },
  };
}

function escapeAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
