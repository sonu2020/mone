import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  server: {
    port: 4321,
    host: true,
  },
  redirects: {
    // The band composition reviewed at /home4 is now the homepage; the
    // previous one is archived at /old-home.
    '/home4': '/',
    // The design-system pages were unified under /design.
    '/system': '/design/system',
    '/components': '/design/components',
    '/kitchen': '/design/kitchen',
    '/kitchen/archive': '/design/archive',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // /wayanad imports both of these lazily, so Vite only discovers them
      // mid-session and re-optimizes — which 504s the very import that
      // triggered it. Naming them here settles that at startup instead.
      //
      // They need opposite treatment, though. maplibre-gl spawns a web worker,
      // and the optimizer rewrites the worker's URL to one it does not serve
      // (maplibre-gl-worker.mjs → ERR_FAILED), after which the map builds a
      // canvas but never fires `load`. Excluding it skips pre-bundling
      // altogether, which both keeps the worker intact and stops it being a
      // late discovery. Dev only — the production build code-splits both.
      //
      // @videojs/html/video is the same story on the player pages (/video-alt,
      // /player-lab): src/lib/player.ts loads it only when a file source is
      // actually played, so the first play re-optimizes and 504s that import.
      include: ['three', '@videojs/html/video'],
      // terrain-journey is a workspace package that ships TypeScript source
      // rather than a build. Excluding it from pre-bundling lets Vite compile
      // it as ordinary project source, which is also what makes editing the
      // package hot-reload the pages that use it.
      exclude: ['maplibre-gl', 'terrain-journey'],
    },
    ssr: {
      // Same reason, for the server build: without this, Node is handed .ts and
      // the page 500s at render rather than at build, which is a slow way to
      // find out.
      noExternal: ['terrain-journey'],
    },
  },
});
