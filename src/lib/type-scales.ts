// ── Type scales — runtime toggle for testing ──────────────────────────────────
// Three swappable type scales, switched live from the fixed toolbar on
// /guided/home (no env var, no rebuild). The scale CSS files scope their
// `--text-*` overrides under .type-scale-{id}, so adding the class to a
// wrapper swaps the tokens for everything inside — the toolbar script toggles
// it on the tour's step container, and step 1 of the tour compares all three
// scales side by side in class-scoped columns.
//
//   current   — the fluid editorial scale in app.css (no class, the default).
//   tailwind  — Tailwind's default size ladder (static rem).
//   editorial — a fluid scale tuned for the Malayalam newsroom: larger small
//               sizes, a stronger display step.
//
// Only sizes swap; the --line-height / --font-weight sub-properties stay the
// system's own. Values live in src/styles/type-scales/{tailwind,editorial}.css
// (imported unconditionally by app.css, inert without the class — the same
// deal as the .mc-outline styles).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type TypeScaleId = 'current' | 'tailwind' | 'editorial';

export const TYPE_SCALE_IDS: readonly TypeScaleId[] = ['current', 'tailwind', 'editorial'];

const SCALE_FILE: Record<Exclude<TypeScaleId, 'current'>, string> = {
  tailwind: join(process.cwd(), 'src/styles/type-scales/tailwind.css'),
  editorial: join(process.cwd(), 'src/styles/type-scales/editorial.css'),
};

const APP_CSS = join(process.cwd(), 'src/styles/app.css');

/** All `--text-*` values of a scale, keyed by the full var name. */
export function scaleOverrides(id: TypeScaleId): Record<string, string> {
  if (id === 'current') {
    const theme = readFileSync(APP_CSS, 'utf8').match(/@theme\s*{([\s\S]*?)\n}/)?.[1] ?? '';
    const out: Record<string, string> = {};
    for (const m of theme.matchAll(/--(text-[a-z0-9-]+):\s*([^;]+);/g)) {
      if (!m[1].includes('--')) out[`--${m[1]}`] = m[2].trim();
    }
    return out;
  }
  const css = readFileSync(SCALE_FILE[id], 'utf8');
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    out[`--${m[1]}`] = m[2].trim();
  }
  return out;
}

/** The scale's values keyed by token name (no `--text-` prefix), for display. */
export function scaleValues(id: TypeScaleId): Record<string, string> {
  const overrides = scaleOverrides(id);
  const out: Record<string, string> = {};
  for (const [varName, value] of Object.entries(overrides)) {
    out[varName.slice(7)] = value; // strip `--text-`
  }
  return out;
}

export const SCALE_LABELS: Record<TypeScaleId, string> = {
  current: 'Current',
  tailwind: 'Tailwind',
  editorial: 'Editorial',
};
