// ============================================================================
// The elevation strip: the whole journey as one line, with where you are on it.
//
// DPR-scaled canvas, area fill under the curve, a tick per marker and a dot
// that tracks the traveller — so "how far along am I, and how much is left"
// is answerable without leaving the viewport.
// ============================================================================

import type { Journey, Palette } from '../types';
import { PALETTE, resolve } from '../defaults';

const PAD_TOP = 10;
const PAD_BOTTOM = 18;

export interface Profile {
  setProgress: (p: number) => void;
  resize: () => void;
}

export function createProfile(canvas: HTMLCanvasElement, journey: Journey): Profile {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('terrain-journey: no 2d context for the elevation strip');

  const palette: Palette = resolve(PALETTE, journey.palette);
  const total = journey.length;
  const span = Math.max(1, journey.highest - journey.lowest);

  let w = 0;
  let h = 0;
  let progress = 0;

  const xOf = (metres: number) => (metres / total) * w;
  const yOf = (ele: number) =>
    h - PAD_BOTTOM - ((ele - journey.lowest) / span) * (h - PAD_TOP - PAD_BOTTOM);

  function tracePath() {
    ctx!.beginPath();
    journey.route.forEach((pt, i) => {
      const x = xOf(pt[3]);
      const y = yOf(pt[2]);
      if (i === 0) ctx!.moveTo(x, y);
      else ctx!.lineTo(x, y);
    });
  }

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

  function draw() {
    if (!w || !h) return;
    ctx!.clearRect(0, 0, w, h);

    tracePath();
    ctx!.lineTo(w, h - PAD_BOTTOM);
    ctx!.lineTo(0, h - PAD_BOTTOM);
    ctx!.closePath();
    ctx!.fillStyle = withAlpha(palette.wireHigh, 0.07);
    ctx!.fill();

    // The travelled part, brighter — the strip's own progress fill.
    const cut = xOf(progress * total);
    ctx!.save();
    ctx!.beginPath();
    ctx!.rect(0, 0, cut, h);
    ctx!.clip();
    tracePath();
    ctx!.lineTo(cut, h - PAD_BOTTOM);
    ctx!.lineTo(0, h - PAD_BOTTOM);
    ctx!.closePath();
    ctx!.fillStyle = withAlpha(palette.routeDone, 0.18);
    ctx!.fill();
    ctx!.restore();

    ctx!.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    ctx!.moveTo(0, h - PAD_BOTTOM + 0.5);
    ctx!.lineTo(w, h - PAD_BOTTOM + 0.5);
    ctx!.stroke();

    tracePath();
    ctx!.strokeStyle = withAlpha(palette.wireHigh, 0.85);
    ctx!.lineWidth = 1.5;
    ctx!.stroke();

    ctx!.font = '600 9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx!.textAlign = 'center';
    for (const m of journey.markers) {
      const x = xOf(m.km * 1000);
      const y = yOf(m.elevation);
      const passed = m.km * 1000 <= progress * total;
      ctx!.strokeStyle = passed ? withAlpha(palette.markerActive, 0.9) : withAlpha(palette.marker, 0.55);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(x, y);
      ctx!.lineTo(x, h - PAD_BOTTOM);
      ctx!.stroke();
      ctx!.fillStyle = passed ? withAlpha(palette.markerActive, 0.95) : withAlpha(palette.marker, 0.7);
      ctx!.fillText(String(m.n), x, h - PAD_BOTTOM + 12);
    }

    const py = yOf(elevationAt(progress * total));
    ctx!.beginPath();
    ctx!.arc(cut, py, 4, 0, Math.PI * 2);
    ctx!.fillStyle = '#ffffff';
    ctx!.fill();
    ctx!.strokeStyle = withAlpha(palette.routeDone, 0.9);
    ctx!.lineWidth = 2;
    ctx!.stroke();
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  resize();

  return {
    setProgress(p) {
      progress = Math.max(0, Math.min(1, p));
      draw();
    },
    resize,
  };
}

/** #rrggbb → rgba(). The palette is hex so it can be shared with CSS. */
function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
