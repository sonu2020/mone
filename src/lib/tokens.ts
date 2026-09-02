// ── Token browser data ────────────────────────────────────────────────────────
// The @theme block in src/styles/app.css is the single source of truth for the
// design system. This module parses that file at build time — every token the
// browser shows is derived, so the page can't drift from the CSS. The fluid
// named spacing scale lives in the base-layer :root blocks (deliberately NOT in
// @theme, to dodge the max-w/--spacing collision), so those are read too, as
// are the @utility blocks that define the named editorial utilities.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type TokenCategory =
  | 'color'
  | 'type'
  | 'font'
  | 'spacing'
  | 'radius'
  | 'width'
  | 'container'
  | 'breakpoint'
  | 'utility';

export interface Token {
  category: TokenCategory;
  /** Suffix after the namespace prefix, e.g. `azure` for `--color-azure`. */
  name: string;
  /** CSS custom property, e.g. `--color-azure`. */
  varName: string;
  /** Raw declared value, e.g. `oklch(0.527 0.153 253)`. */
  value: string;
  /** Utility classes the token generates (empty for spacing — plain vars). */
  classes: string[];
  /** Usage note harvested from the comment directly above the token. */
  note?: string;
  /** Colors only: the value converted to `#rrggbb`. */
  hex?: string;
  /** Type tokens only: the --line-height / --font-weight sub-properties. */
  typeSpec?: { lineHeight?: string; weight?: string };
  /** Utility tokens only: the key declarations, as a compact spec string. */
  utilitySpec?: string;
}

export interface TokenSection {
  id: string;
  label: string;
  tokens: Token[];
}

const CATEGORY_LABEL: Record<TokenCategory, string> = {
  color: 'Color',
  type: 'Type',
  font: 'Font',
  spacing: 'Spacing',
  radius: 'Radius',
  width: 'Width',
  container: 'Container',
  breakpoint: 'Breakpoint',
  utility: 'Utilities',
};

// Utility classes each namespace generates. Colors carry all three color slots.
const CLASS_FOR: Record<Exclude<TokenCategory, 'spacing' | 'utility'>, (n: string) => string[]> = {
  color: (n) => [`bg-${n}`, `text-${n}`, `border-${n}`],
  type: (n) => [`text-${n}`],
  font: (n) => [`font-${n}`],
  radius: (n) => [`rounded-${n}`],
  width: (n) => [`w-${n}`],
  container: (n) => [`max-w-${n}`],
  breakpoint: (n) => [`${n}:`],
};

// ── Source extraction ─────────────────────────────────────────────────────────

// Build-time read: prerendered chunks run from the project root, so cwd is the
// reliable anchor (import.meta.url points into dist/.prerender at render time).
const CSS_PATH = join(process.cwd(), 'src/styles/app.css');
const css = readFileSync(CSS_PATH, 'utf8');

// Blocks are single-level (no nested braces), so the first `\n}` closes one.
const themeBlocks = [...css.matchAll(/@theme\s*{([\s\S]*?)\n}/g)].map((m) => m[1]);
const rootBlocks = [...css.matchAll(/:root\s*{([\s\S]*?)\n}/g)].map((m) => m[1]);

interface RawVar {
  name: string; // full custom property name incl. `--`
  value: string;
  note?: string;
}

/** Parse `--name: value;` lines, attaching the comment block above each. */
function parseVars(src: string): RawVar[] {
  const out: RawVar[] = [];
  let pending: string[] = [];
  let inComment = false;
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (inComment) {
      pending.push(line.replace(/^\/\*/, '').replace(/\*\/$/, '').trim());
      if (line.includes('*/')) inComment = false;
      continue;
    }
    if (line.startsWith('/*')) {
      inComment = !line.includes('*/');
      pending.push(line.replace(/^\/\*/, '').replace(/\*\/$/, '').trim());
      continue;
    }
    const m = line.match(/^--([a-zA-Z0-9-]+):\s*(.*?);?\s*(?:\/\*.*\*\/)?\s*$/);
    if (m) {
      out.push({
        name: `--${m[1]}`,
        value: m[2].trim(),
        note: pending.length ? cleanNote(pending) : undefined,
      });
    }
    pending = [];
  }
  return out;
}

/** Turn a raw comment block into a one-line usage note, or undefined for
 *  structural banners (the type-scale headers, separator lines). */
function cleanNote(lines: string[]): string | undefined {
  const parts = lines
    .map((l) => l.replace(/\s*-{4,}\s*/g, ' ').trim())
    .filter((l) => l && !/^(Uses viewport|Formula:|Mobile base|Desktop base)/.test(l));
  if (!parts.length) return undefined;
  const note = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (!note || note.length > 220 || /={4,}/.test(note)) return undefined;
  return note;
}

// ── oklch → sRGB → hex (per Björn Ottosson's OKLab reference math) ──────────

function oklchToHex(value: string): string | undefined {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return undefined;
  const L = Number(m[1]);
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m3 = m_ ** 3;
  const s = s_ ** 3;

  const toLinear = (r: number) =>
    r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;

  const r = toLinear(4.0767416621 * l - 3.3077115913 * m3 + 0.2309699292 * s);
  const g = toLinear(-1.2684380046 * l + 2.6097574011 * m3 - 0.3413193965 * s);
  const b_ = toLinear(-0.0041960863 * l - 0.7034186147 * m3 + 1.707614701 * s);

  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const hex = (x: number) =>
    Math.round(clamp01(x) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b_)}`.toUpperCase();
}

// ── @utility extraction ───────────────────────────────────────────────────────

const utilityBlocks = [...css.matchAll(/@utility\s+([a-zA-Z0-9-]+)\s*{([^}]*)}/g)].map((m) => ({
  name: m[1],
  declarations: m[2],
}));

function decl(block: string, prop: string): string | undefined {
  const m = block.match(new RegExp(`${prop}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim() : undefined;
}

function utilitySpec(block: string): string {
  const parts: string[] = [];
  const size = decl(block, 'font-size');
  if (size) parts.push(`size ${size}`);
  const lh = decl(block, 'line-height');
  if (lh) parts.push(`lh ${lh}`);
  const wght = decl(block, 'font-variation-settings')?.match(/wght['"]?\s+(\d+)/)?.[1];
  if (wght) parts.push(`wght ${wght}`);
  const tracking = decl(block, 'letter-spacing');
  if (tracking) parts.push(`tracking ${tracking}`);
  const transform = decl(block, 'text-transform');
  if (transform) parts.push(transform);
  return parts.join(' · ');
}

// ── Assembly ─────────────────────────────────────────────────────────────────

function build(): TokenSection[] {
  const raw: RawVar[] = [...themeBlocks, ...rootBlocks].flatMap(parseVars);
  const colors: Token[] = [];
  const fonts: Token[] = [];
  const spacing: Token[] = [];
  const radius: Token[] = [];
  const widths: Token[] = [];
  const containers: Token[] = [];
  const breakpoints: Token[] = [];

  // Type tokens: --text-* with `--line-height` / `--font-weight` siblings. The
  // names come from the file, but the sub-property table is a fixed 17-ish set,
  // so a plain Record keeps the lookup flat.
  const typeSub: Record<string, { lineHeight?: string; weight?: string }> = {};
  for (const r of raw) {
    const sub = r.name.match(/^--text-([a-z0-9-]+)--(line-height|font-weight)$/);
    if (sub) {
      const slot = (typeSub[sub[1]] ??= {});
      if (sub[2] === 'line-height') slot.lineHeight = r.value;
      else slot.weight = r.value;
    }
  }
  const types: Token[] = raw
    .filter((r) => r.name.startsWith('--text-') && !/--(line-height|font-weight)$/.test(r.name))
    .map((r) => {
      const n = r.name.slice(7);
      return {
        category: 'type' as const,
        name: n,
        varName: r.name,
        value: r.value,
        classes: CLASS_FOR.type(n),
        typeSpec: typeSub[n],
      };
    });

  for (const r of raw) {
    if (r.name.startsWith('--color-')) {
      const n = r.name.slice(8);
      colors.push({
        category: 'color',
        name: n,
        varName: r.name,
        value: r.value,
        classes: CLASS_FOR.color(n),
        note: r.note,
        hex: r.value.startsWith('#') ? r.value.toUpperCase() : oklchToHex(r.value),
      });
    } else if (r.name.startsWith('--font-')) {
      // --font-wdth / --font-wght are variable-font axis defaults, not faces.
      if (r.name === '--font-wdth' || r.name === '--font-wght') continue;
      const n = r.name.slice(7);
      fonts.push({ category: 'font', name: n, varName: r.name, value: r.value, classes: CLASS_FOR.font(n), note: r.note });
    } else if (r.name.startsWith('--spacing-')) {
      const n = r.name.slice(10);
      spacing.push({ category: 'spacing', name: n, varName: r.name, value: r.value, classes: [], note: r.note });
    } else if (r.name.startsWith('--radius-')) {
      const n = r.name.slice(9);
      radius.push({ category: 'radius', name: n, varName: r.name, value: r.value, classes: CLASS_FOR.radius(n), note: r.note });
    } else if (r.name.startsWith('--width-')) {
      const n = r.name.slice(8);
      widths.push({ category: 'width', name: n, varName: r.name, value: r.value, classes: CLASS_FOR.width(n), note: r.note });
    } else if (r.name.startsWith('--container-')) {
      const n = r.name.slice(12);
      containers.push({ category: 'container', name: n, varName: r.name, value: r.value, classes: CLASS_FOR.container(n), note: r.note });
    } else if (r.name.startsWith('--breakpoint-')) {
      const n = r.name.slice(13);
      breakpoints.push({ category: 'breakpoint', name: n, varName: r.name, value: r.value, classes: CLASS_FOR.breakpoint(n), note: r.note });
    }
  }

  const utilities: Token[] = utilityBlocks.map((u) => ({
    category: 'utility',
    name: u.name,
    varName: `@utility ${u.name}`,
    value: utilitySpec(u.declarations),
    classes: [u.name],
  }));

  return [
    { id: 'color', label: CATEGORY_LABEL.color, tokens: colors },
    { id: 'type', label: CATEGORY_LABEL.type, tokens: types },
    { id: 'font', label: CATEGORY_LABEL.font, tokens: fonts },
    { id: 'spacing', label: CATEGORY_LABEL.spacing, tokens: spacing },
    { id: 'radius', label: CATEGORY_LABEL.radius, tokens: radius },
    { id: 'width', label: CATEGORY_LABEL.width, tokens: widths },
    { id: 'container', label: CATEGORY_LABEL.container, tokens: containers },
    { id: 'breakpoint', label: CATEGORY_LABEL.breakpoint, tokens: breakpoints },
    { id: 'utility', label: CATEGORY_LABEL.utility, tokens: utilities },
  ];
}

export const tokenSections: TokenSection[] = build();
export const tokenTotal = tokenSections.reduce((n, s) => n + s.tokens.length, 0);
