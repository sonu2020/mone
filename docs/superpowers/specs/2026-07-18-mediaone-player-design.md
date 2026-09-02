# MediaOne Branded Player System — Design

> Date: 2026-07-18 · Status: approved, implementing v0

## Goal

One reusable, on-brand media player for the MediaOne (Malayalam news) site, built on
**Video.js v10**. It plays MP4/HLS behind the MediaOne skin and plays YouTube via a raw
iframe fallback, behind a single API. Consolidates the three ad-hoc playback mechanisms
that exist today into one path.

## Current state (what we're replacing)

Video.js was pinned (`video.js@^8`) but **never actually used**. Three independent
mechanisms play video today:

- `VideoModal.astro` — raw autoplay YouTube iframe + native `<video>` fallback (comment
  wrongly claims "Video.js player").
- `VideoEmbed.astro` — YouTube facade → raw iframe on click.
- `news/VideoPlayer.astro` — native `<video>` with a poster cover.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | **Full consolidation** | One playback path across all surfaces. |
| Load strategy | **Facade + lazy v10** | Poster + play button on load; player JS (`await import`) only on first click. Near-zero page cost. |
| YouTube | **Raw iframe fallback** | v10 has no YouTube provider yet (see Version note); YouTube stays a raw iframe until v10 ships one. |
| Version | **Video.js v10 (`@videojs/html@10.0.0-beta.25`)** | Latest. Beta — accepted risk, isolated behind `player.ts`. |

### Version note (feasibility)

- v10 latest published is `@videojs/core@10.0.0-beta.25` — **beta**, a ground-up rewrite.
- The usable no-React player is **`@videojs/html`** — composable Web Components, ships
  presets (`@videojs/html/video`, `/audio`, `/live-video`…) + a programmatic
  `createPlayer()`. Each preset ships its own CSS; skin via CSS custom props / `::part()`.
- Core bundles `hls.js`, `dashjs`, `@vimeo/player`, `mux-embed` — **no YouTube**. The
  legacy `videojs-youtube` plugin (v3) targets v7/v8 only. Hence the iframe fallback.

## Architecture

Three layers. Every surface talks only to `player.ts`.

```
src/lib/player.ts              ← the "brain": resolve source, lazy-mount, dispose
src/styles/videojs-mediaone.css ← MediaOne skin over the v10 preset (imported once)
src/components/MediaPlayer.astro ← reusable inline player (facade + delegated mount)
src/components/VideoModal.astro  ← theater; mounts via player.ts (refactor)
```

### `src/lib/player.ts`

- `resolveSource(v)` → `'youtube'` when `youtubeId` present, else `'file'`.
- `mountFilePlayer(el, {src, poster, autoplay})` → `await import('@videojs/html/video')`,
  mount the v10 preset, set source, return a handle `{ dispose() }`.
- `mountYouTube(el, {youtubeId, poster})` → the centralized raw autoplay iframe.
- `mount(el, source)` → dispatches to the right one. Single entry point.

### Components

- **`MediaPlayer.astro`** — the one inline player. Renders the facade (poster + azure play
  button, current look) with `data-*` describing the source. One delegated click listener
  (per today's `__ytFacadeBound` pattern) calls `player.ts` and mounts in place. Replaces
  `VideoEmbed.astro` and `news/VideoPlayer.astro`.
- **`VideoModal.astro`** — theater stage calls the same `player.ts`; reco-click disposes +
  remounts; sidebar/branding unchanged.

### Skin

Global CSS block overriding the v10 `/video` preset's custom properties / `::part()` to the
brand tokens: `--color-azure` for progress + big-play, `brand-dark` control bar, `ivory`
text/icons. Big-play matches the existing azure circle so facade→player is seamless. CSS is
loaded eagerly (cheap); only the JS is lazy.

## Data model

One shape drives everything (already close to `ModalVideo`):

```ts
{ id, title, poster, youtubeId?, src?, category?, duration?, meta? }
```

`youtubeId` wins → iframe; else `src` → v10 file player.

## Risks & testing

- **Beta risk** (accepted): pin exact `10.0.0-beta.25`; isolate all v10 API use in
  `player.ts` so a beta bump — or the future v10-native-YouTube swap — is a one-file change.
- **Testing** (static site): `astro build` passes; browser-verify — facade renders with
  zero player JS, click lazy-loads v10 and MP4 plays under the azure skin, YouTube click
  plays the iframe, modal reco-swap disposes cleanly (audio stops), no CLS. A demo page
  showcases both variants.

## v0 scope (first slice)

1. Install `@videojs/html@10.0.0-beta.25`; remove legacy `video.js` + `@types/video.js`.
2. `src/lib/player.ts` (the brain).
3. `src/styles/videojs-mediaone.css` (skin) imported once.
4. `src/components/MediaPlayer.astro` (reusable inline player).
5. Demo page; verify with `astro build` + browser.

Then "take it from there": wire `VideoModal.astro`, replace `VideoEmbed` /
`news/VideoPlayer` call sites.
