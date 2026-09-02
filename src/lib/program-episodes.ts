// Deep episode playlists — every episode a programme's listing carries,
// captured from mediaoneonline.com into src/data/programs/episodes/<slug>.json
// by scripts/scrape-program.py. Each file is one programme; drop a new file in
// and it registers itself, no code change needed.
//
// This is the deep tier. The shallow tier — every programme, a handful of
// recent episodes each — lives in src/data/programs/index.json and is read by
// program-catalogue.ts. A programme with a deep file uses it; one without falls
// back to the catalogue's recent episodes.

import type { ProgramEpisode } from './programs';

export interface RawEpisode {
  slug: string;
  articleId: string | null;
  youtubeId: string;
  title: string;
  titleML: string;
  titleEn: string;
  publishedAt: string; // ISO 8601, UTC
  durationSeconds: number;
  viewCount: number;
  thumbnail: {
    site: string;   // the poster MediaOne serves in its own listing (500x300)
    small: string;  // ytimg mqdefault, 320x180 — playlist rows
    large: string;  // ytimg maxresdefault, 1280x720 — the player poster
  };
  href: string;
}

export interface ProgramFeed {
  slug: string;
  title: string;
  titleML: string;
  category: 'tv' | 'digital';
  source: {
    program: string;
    channel: string;
    channelId: string;
    channelUrl: string;
    capturedAt: string;
    note: string;
  };
  episodes: RawEpisode[];
}

const modules = import.meta.glob<ProgramFeed>('../data/programs/episodes/*.json', {
  eager: true,
  import: 'default',
});

export const programFeeds: Record<string, ProgramFeed> = Object.fromEntries(
  Object.values(modules).map((feed) => [feed.slug, feed]),
);

// ─── Formatting ─────────────────────────────────────────────────────────────

/** 845 → "14:05"; anything over an hour gets an h:mm:ss. */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Indian short scale, matching how the site itself renders counts: 59269 → "59K", 140359 → "1.4L". */
export function formatViews(count: number): string {
  const scale = (n: number, unit: string) =>
    `${n < 10 ? n.toFixed(1).replace(/\.0$/, '') : Math.round(n)}${unit}`;
  if (count >= 1e7) return scale(count / 1e7, 'Cr');
  if (count >= 1e5) return scale(count / 1e5, 'L');
  if (count >= 1e3) return scale(count / 1e3, 'K');
  return String(count);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-08-05T14:26:33Z" → "Aug 5, 2026", in IST — the audience's clock. */
export function formatPublishDate(iso: string): string {
  const ist = new Date(new Date(iso).getTime() + 5.5 * 60 * 60 * 1000);
  return `${MONTHS[ist.getUTCMonth()]} ${ist.getUTCDate()}, ${ist.getUTCFullYear()}`;
}

// ─── Adapter ────────────────────────────────────────────────────────────────

/** Real episodes for a program slug, newest first, or undefined if none captured. */
export function getRealEpisodes(programSlug: string): ProgramEpisode[] | undefined {
  const feed = programFeeds[programSlug];
  if (!feed) return undefined;

  return feed.episodes.map((ep) => ({
    slug: ep.slug,
    title: ep.title,
    youtubeId: ep.youtubeId,
    duration: formatDuration(ep.durationSeconds),
    publishDate: formatPublishDate(ep.publishedAt),
    views: formatViews(ep.viewCount),
    seed: ep.youtubeId,
    thumbnailUrl: ep.thumbnail.small,
    posterUrl: ep.thumbnail.large,
  }));
}
