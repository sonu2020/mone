// ─── MediaOne Player · /video-alt data ─────────────────────────────────────
// Typed view over the flat YouTube record in src/data/youtube-videos.json.
// The JSON is the source of truth (captured from YouTube via yt-dlp); this
// module only adds types and selects what the showcase can actually play —
// entries with a `local` media path (downloaded into public/videos/).
import raw from '../data/youtube-videos.json';

export interface AltVideo {
  youtubeId: string;
  title: string;
  category: string;
  durationSeconds: number | null;
  durationText: string | null;
  viewCount: number | null;
  viewsText: string | null;
  uploadDate: string | null;
  channel: string;
  channelId: string;
  watchUrl: string;
  embedUrl: string;
  thumbnail: { small: string; large: string };
  sitePublishDate: string | null;
  isFeatured: boolean;
  available: boolean;
  /** Set only when the video was downloaded as MP4 into public/videos/. */
  local?: { src: string; poster: string };
}

export interface YoutubeFlatFile {
  capturedAt: string;
  source: string;
  channelId: string;
  note: string;
  videos: AltVideo[];
}

/** The full flat record — every YouTube video referenced by the site. */
export const youtubeRecord = raw as unknown as YoutubeFlatFile;

/** Subset with a local MP4 — what /video-alt can actually play. */
export const altVideos: AltVideo[] = youtubeRecord.videos.filter(
  (v) => v.available && !!v.local,
);

/** Hero pick: the site's featured video, else the newest local one. */
export function featuredVideo(): AltVideo {
  return altVideos.find((v) => v.isFeatured) ?? altVideos[0];
}
