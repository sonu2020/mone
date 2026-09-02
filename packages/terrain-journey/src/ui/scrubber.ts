// ============================================================================
// Scroll position → progress, plus autoplay.
//
// The whole loop lives here so a page only has to hand over a tall section and
// a canvas.
//
// Autoplay drives the PAGE SCROLL rather than a separate progress variable.
// That is the important decision in this file: scroll position stays the single
// source of truth, so the camera, any readout and any strip cannot drift apart,
// and pausing mid-journey leaves the reader exactly where the traveller was,
// free to carry on by hand.
// ============================================================================

export interface ScrubberOptions {
  /** The tall section whose scroll range drives the journey. */
  section: HTMLElement;
  /** Called every frame while the journey owns the viewport. */
  onFrame: (progress: number, dt: number, first: boolean) => void;
  /** Called when the journey takes or releases the viewport. */
  onLive?: (live: boolean) => void;
  /** Called whenever autoplay starts or stops. */
  onPlaying?: (playing: boolean) => void;
  /** Seconds for autoplay to cover the whole journey. */
  autoplaySeconds?: number;
  /** Reduced motion: no autoplay, and the caller renders one still frame. */
  reducedMotion?: boolean;
}

export interface Scrubber {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  playing: () => boolean;
  /** Progress right now, without waiting for a frame. */
  progress: () => number;
  dispose: () => void;
}

const SCROLL_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar',
]);

export function createScrubber(opts: ScrubberOptions): Scrubber {
  const { section, onFrame, onLive, onPlaying } = opts;
  const autoSeconds = opts.autoplaySeconds ?? 110;

  let running = false;
  let playing = false;
  let first = true;
  let last = performance.now();
  let autoY = 0;
  let live = false;

  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

  function progressNow() {
    const vh = window.innerHeight;
    const r = section.getBoundingClientRect();
    const span = r.height - vh;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }

  function setPlaying(on: boolean) {
    if (on === playing) return;
    playing = on;
    autoY = window.scrollY;
    onPlaying?.(on);
    if (on && !running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
  }

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const vh = window.innerHeight;

    // Advance the scroll before measuring, so this frame renders where the
    // traveller now is rather than a frame behind.
    if (playing) {
      const box = section.getBoundingClientRect();
      const span = box.height - vh;
      const end = box.top + window.scrollY + span;
      // If anything else moved the page — a jump, an anchor, a scrollbar drag —
      // carry on from where it is now, rather than yanking the reader back.
      if (Math.abs(window.scrollY - autoY) > 4) autoY = window.scrollY;
      autoY = Math.min(autoY + (span / autoSeconds) * dt, end);
      window.scrollTo(0, autoY);
      if (autoY >= end - 0.5) setPlaying(false);
    }

    const r = section.getBoundingClientRect();
    const nowLive = r.top < vh * 0.5 && r.bottom > vh * 0.5;
    if (nowLive !== live) {
      live = nowLive;
      onLive?.(live);
    }

    if (live) {
      const span = r.height - vh;
      onFrame(span > 0 ? clamp(-r.top / span, 0, 1) : 0, dt, first);
      first = false;
    }

    requestAnimationFrame(frame);
  }

  // Only spend frames while the journey is anywhere near the viewport.
  const near = new IntersectionObserver(
    (entries) => {
      const isNear = entries.some((e) => e.isIntersecting);
      if (isNear && !running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      } else if (!isNear) {
        // Scrolling away stops the traveller too, or the reader comes back to
        // find it parked at the end.
        setPlaying(false);
        running = false;
        if (live) {
          live = false;
          onLive?.(false);
        }
      }
    },
    { rootMargin: '20% 0px 20% 0px', threshold: 0 },
  );
  near.observe(section);

  /** Any deliberate scroll takes the wheel back. */
  function yieldToReader(e: Event) {
    if (!playing) return;
    if (e instanceof KeyboardEvent) {
      if (!SCROLL_KEYS.has(e.key)) return;
      // Space on a focused control is activation, not scrolling — a keyboard
      // user would otherwise stop autoplay with the same key that started it.
      if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    }
    // Wheel and touch always pause, wherever the pointer happens to be.
    setPlaying(false);
  }

  const events = ['wheel', 'touchstart', 'keydown'];
  for (const ev of events) {
    window.addEventListener(ev, yieldToReader, { passive: true });
  }

  return {
    play: () => !opts.reducedMotion && setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying(!playing),
    playing: () => playing,
    progress: progressNow,
    dispose() {
      running = false;
      near.disconnect();
      for (const ev of events) window.removeEventListener(ev, yieldToReader);
    },
  };
}
