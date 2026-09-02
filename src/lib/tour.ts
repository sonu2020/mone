// Tour controller for /guided/* pages — one step at a time, next/prev.
//
// Generic on purpose: the page renders every step as a [data-tour-step]
// section (exact copies of the sections being toured) and this module shows
// one at a time. The bar binds through [data-tour-*] hooks, so any page can
// mount a tour with the same markup; the next tour adds steps, not code.
//
//   step → bar   data-tour-label / -label-ml / -blurb   read at init
//   bar hooks    data-tour-prev / -next / -counter / -dots / -exit
//
// Navigation: buttons, dots, ←/→/Home/End keys, and #step-N hashes (deep
// links and back/forward both land on a step). Esc leaves the tour. Nothing
// animates layout — steps swap with `hidden`, and the optional fade is
// transform/opacity only, skipped under prefers-reduced-motion.

interface TourStep {
  el: HTMLElement;
  label: string;
  labelML: string;
  blurb: string;
}

export function initTour(root: HTMLElement): void {
  if (root.dataset.tourInit) return;
  root.dataset.tourInit = '1';

  const stepEls = [...root.querySelectorAll<HTMLElement>('[data-tour-step]')];
  if (!stepEls.length) return;

  const steps: TourStep[] = stepEls.map((el) => ({
    el,
    label: el.dataset.tourLabel ?? '',
    labelML: el.dataset.tourLabelMl ?? '',
    blurb: el.dataset.tourBlurb ?? '',
  }));

  const prevBtn = root.querySelector<HTMLButtonElement>('[data-tour-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-tour-next]');
  const counter = root.querySelector<HTMLElement>('[data-tour-counter]');
  const labelEl = root.querySelector<HTMLElement>('[data-tour-label]');
  const labelMlEl = root.querySelector<HTMLElement>('[data-tour-label-ml]');
  const blurbEl = root.querySelector<HTMLElement>('[data-tour-blurb]');
  const dotsEl = root.querySelector<HTMLElement>('[data-tour-dots]');
  const exitHref = root.dataset.tourExit ?? '/';
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const dotEls: HTMLElement[] = [];
  if (dotsEl) {
    steps.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'size-2.5 border-0 p-0 transition-colors';
      dot.setAttribute('aria-label', `Step ${i + 1}`);
      dot.addEventListener('click', () => go(i));
      dotsEl.appendChild(dot);
      dotEls.push(dot);
    });
  }

  const indexFromHash = (): number => {
    const m = location.hash.match(/#step-(\d+)/);
    if (!m) return 0;
    return Math.min(steps.length - 1, Math.max(0, parseInt(m[1], 10) - 1));
  };

  function render(i: number): void {
    steps.forEach((s, j) => {
      s.el.hidden = j !== i;
      s.el.classList.toggle('tour-step-fade', j === i);
    });
    const s = steps[i];
    if (labelEl) labelEl.textContent = s.label;
    if (labelMlEl) labelMlEl.textContent = s.labelML;
    if (blurbEl) blurbEl.textContent = s.blurb;
    if (counter) counter.textContent = `${i + 1} / ${steps.length}`;
    dotEls.forEach((d, j) => {
      const on = j === i;
      d.classList.toggle('bg-azure', on);
      d.classList.toggle('bg-rule', !on);
      d.setAttribute('aria-current', on ? 'step' : 'false');
    });
    if (prevBtn) prevBtn.setAttribute('aria-disabled', String(i === 0));
    if (nextBtn) nextBtn.setAttribute('aria-disabled', String(i === steps.length - 1));
  }

  let current = 0;
  function go(i: number, scroll = true): void {
    current = Math.min(steps.length - 1, Math.max(0, i));
    render(current);
    history.replaceState(null, '', `#step-${current + 1}`);
    // Move the reader to the step and announce it. Programmatic focus after a
    // key press must not draw an outline ring around the whole section.
    const el = steps[current].el;
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    if (scroll) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  prevBtn?.addEventListener('click', () => {
    if (current > 0) go(current - 1);
  });
  nextBtn?.addEventListener('click', () => {
    if (current < steps.length - 1) go(current + 1);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(current + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(current - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(steps.length - 1);
    else if (e.key === 'Escape') window.location.href = exitHref;
  });
  window.addEventListener('hashchange', () => go(indexFromHash(), false));
  go(indexFromHash(), false);
}
