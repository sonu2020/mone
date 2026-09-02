// ─── The MediaOne player "brain" ────────────────────────────────────────────
// The SINGLE place that knows how MediaOne plays a video. Every surface (inline
// MediaPlayer, theater VideoModal, future embeds) calls mount() and nothing
// else. Two techs behind one API:
//   • file  → Video.js v10 (@videojs/html) behind the MediaOne skin  [lazy]
//   • youtube → a raw autoplay iframe (v10 has no YouTube provider yet)
//
// Isolating all v10 API use here means a beta bump — or swapping the iframe for
// v10's future native YouTube provider — is a one-file change.

export interface PlayerSource {
  src?: string; // mp4/hls URL — plays via Video.js v10
  youtubeId?: string; // real YouTube id — plays via raw iframe (wins over src)
  poster?: string; // poster image URL
  title?: string; // accessible title
}

export interface PlayerHandle {
  /** Stop playback and tear the player down, leaving the container empty. */
  dispose(): void;
}

export type PlayerKind = 'youtube' | 'file';

/** youtubeId wins → iframe; otherwise a file source → Video.js v10. */
export function resolveKind(s: PlayerSource): PlayerKind {
  return s.youtubeId ? 'youtube' : 'file';
}

// Lazy-load Video.js v10 exactly once per page. The import registers the custom
// elements (<video-player>, <video-skin>, media <video>) and ships the default
// skin CSS inside the JS (shadow DOM adoptedStyleSheets), so no separate CSS
// import is needed — only the tiny always-on --media-* vars in the skin file.
let v10Loading: Promise<void> | null = null;
function loadV10(): Promise<void> {
  if (!v10Loading) {
    v10Loading = import('@videojs/html/video').then(() => undefined);
  }
  return v10Loading;
}

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );

// ─── file tech: Video.js v10 ─────────────────────────────────────────────────
async function mountFile(
  container: HTMLElement,
  s: PlayerSource,
  autoplay: boolean,
): Promise<PlayerHandle> {
  await loadV10();

  // Composition per @videojs/html: provider → skin → media element. The skin
  // holds the entire (themeable) UI; the MediaOne tint lives on .mediaone-skin.
  container.innerHTML = `
    <video-player class="mediaone-skin" style="display:block;width:100%;height:100%">
      <video-skin>
        <video
          src="${esc(s.src || '')}"
          ${s.poster ? `poster="${esc(s.poster)}"` : ''}
          ${s.title ? `title="${esc(s.title)}"` : ''}
          playsinline
          controls
          ${autoplay ? 'autoplay' : ''}
        ></video>
      </video-skin>
    </video-player>`;

  // Belt-and-suspenders autoplay: we're inside the facade's click (a user
  // gesture), so play() with sound is permitted even if the attribute is missed.
  if (autoplay) {
    const video = container.querySelector('video');
    const p = video?.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  return {
    dispose() {
      // Removing <video-player> fires the elements' disconnectedCallback, which
      // tears down the store and the underlying media. Clearing is enough.
      const video = container.querySelector('video');
      try {
        video?.pause();
      } catch {
        /* ignore */
      }
      container.replaceChildren();
    },
  };
}

// ─── youtube tech: raw iframe (centralized fallback) ─────────────────────────
function mountYouTube(
  container: HTMLElement,
  s: PlayerSource,
  autoplay: boolean,
): PlayerHandle {
  if (s.poster) {
    container.style.backgroundImage = `url("${esc(s.poster)}")`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
  }
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(s.youtubeId!)}?${params}`;
  iframe.title = s.title || 'Video player';
  iframe.className = 'absolute inset-0 w-full h-full border-0';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  container.replaceChildren(iframe);

  return {
    dispose() {
      container.replaceChildren();
      container.style.backgroundImage = '';
    },
  };
}

// ─── single entry point ──────────────────────────────────────────────────────
/**
 * Play `source` inside `container`. Dispatches to Video.js v10 (file) or a raw
 * YouTube iframe. Returns a handle whose dispose() stops playback and empties
 * the container. `container` should be positioned (relative) and sized.
 */
export async function mount(
  container: HTMLElement,
  source: PlayerSource,
  opts: { autoplay?: boolean } = {},
): Promise<PlayerHandle> {
  const autoplay = opts.autoplay ?? true;
  if (resolveKind(source) === 'youtube') return mountYouTube(container, source, autoplay);
  return mountFile(container, source, autoplay);
}
