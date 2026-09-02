# AGENTS.md

Guidance for AI agents working in this repo. Read this before touching UI.

## What this is

**MediaOne** — a Malayalam news website. Astro 6 (static), Tailwind CSS v4, deployed
to Cloudflare Pages. Content is primarily Malayalam with Latin (English) interspersed.

```
npm run dev      # local dev (http://localhost:4321)
npm run build    # static build → dist/
npm run preview  # preview the build
```

## Design source of truth (read in this order)

1. **`DESIGN.md`** — the design language: an editorial, Wired-style magazine system.
   Strict restraint, hairline dividers, square geometry, no decorative chrome.
2. **`/system`** (`src/pages/system.astro`) — the living standards page. Type scale,
   color tokens, spacing, and the core news components, rendered. When you change a
   standard, change it here first, then propagate.
3. **`src/styles/app.css`** — the `@theme` block is the **single source of truth** for
   tokens (color, type scale, fonts, container). Never hardcode a value that exists
   as a token. Add new tokens here, not inline.

### The synthesis (how DESIGN.md is applied here)

DESIGN.md analyzes Wired (black/white, serif display, Latin-only). We render its
*discipline* for a Malayalam newsroom — do not copy it literally:

- **Type** — Anek Latin + Anek Malayalam (a metrically matched superfamily). Latin
  leads the stack; Malayalam falls through per-glyph. No serif display face (Playfair
  et al. have no Malayalam). Scale, line-heights, and weights live in `app.css` tokens.
- **Color** — cool navy/slate neutrals sampled from the live site (mediaoneonline.com):
  `ink` is the MediaOne navy `#2e4164` (headlines, body, footer fill), the canvas a clean
  cool white, `rule` hairlines. **The MediaOne blue `#166bc0` is the single reserved accent**
  (eyebrows, masthead rule, links, hover), exposed as the `azure` token. No red anywhere.
  Never pure `#000`/`#fff`.
- **Geometry** — square corners by default. No gradients. No drop-shadows; hairline
  borders and surface contrast carry hierarchy.

## Non-negotiable UI rules (baseline)

- **No gradients.** No `bg-gradient-*`, no `background-clip: text`. (Image placeholders
  are flat tinted blocks, not rainbow gradients.)
- **No pure black/white.** Use `ink` / `ivory` / `rule` tokens, which are tinted.
- **Tokens over literals.** Use `text-ink`, `bg-ivory`, `border-rule`, `text-azure`,
  `max-w-site`, and the named type sizes (`text-hero`, `text-section`, `text-body`,
  `text-meta`, `text-eyebrow`, …). Don't reach for raw hex or `gray-*` on new work.
- **Type.** `text-balance` on headings, `text-pretty` on body (baked into base for
  `h1–h4`/`p`). `tabular-nums` for data. Letter-spacing only on uppercase Latin
  eyebrows (use the `eyebrow` utility) — never on Malayalam text.
- **Cards are not the default.** Prefer hairline-separated rows and bands. Never nest cards.
- **Motion.** Don't animate layout properties; transform/opacity only, ease-out,
  ≤200ms for feedback. `prefers-reduced-motion` is respected globally in `app.css`.
- **Square + flat.** No arbitrary `z-[…]`; use the standard z scale. `size-*` for squares.
- **Accessibility.** `aria-label` on icon-only buttons; `h-dvh` not `h-screen`.

## Conventions

- Single brand identity (MediaOne). The legacy multi-theme switcher
  (`lib/themes.ts`, `components/ThemeSelector.astro`) is **archived, not imported** —
  do not re-wire it without a decision.
- Dark mode is a `.dark` class on `<html>`, set pre-paint in `Layout.astro` and toggled
  in the header. Style dark variants with tokens (`dark:bg-brand-dark`, etc.).
- Page data lives in `src/lib/*` (`sections.ts`, `videos.ts`); pages stay presentational.

## Type-scale testing

Three type scales — `current` (app.css `@theme`), `tailwind` (Tailwind's size
ladder), `editorial` (a Malayalam-tuned fluid scale) — and three spacing
scenarios — `medium` (default), `tight`, `spacious` — switchable **live**, no
env var, no rebuild. `ui/TypeScaleSwitch` / `ui/SpacingSwitch` flip the
class-scoped overrides (`src/styles/type-scales/*.css`, `src/styles/spacing-scales/*.css`)
on the target element; the homepage carries them in the tabbed floating
`ui/TestUiPanel` (bottom-left, Type | Space tabs) — **only when
`PUBLIC_MC_OUTLINE=true`**, the same switch that gates every other inspection
visual, so no deploy ships the panel and its scripts stay out of the bundle.
Its ✕ hides the whole test UI: it drops `.mc-outline` (which gates every
inspection visual — McInspector, `.mc` outlines, the lead-package inspection),
hides the panel, and offers a restore button. The guided tour (`/guided/home`) still carries the
type switch in its bar, scoped to its step container, with step 1 comparing all
three scales side by side. See `src/lib/type-scales.ts`.
