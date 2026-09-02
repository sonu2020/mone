// Shared data model for the Video.js modal player. A page hands <VideoModal>
// a list of ModalVideo, and any trigger with data-video-open="<id>" plays it.
import { dummyImageUrl } from './images';
import type { Video } from './videos';

export interface ModalVideo {
  id: string;          // matches data-video-open on triggers
  title: string;
  category?: string;
  meta?: string;       // e.g. "Jun 12, 2026 · 45K views"
  duration?: string;
  poster: string;      // poster image URL
  src: string;         // playable video URL (mp4) — fallback when no youtubeId
  youtubeId?: string;  // real YouTube id — modal plays this via iframe when set
  embedUrl?: string;   // full embed URL used verbatim — for live_stream feeds,
                       // whose "id" isn't a video id and can't be encoded as one
  isLive?: boolean;    // continuous broadcast: no duration, badge instead
  programTitle?: string; // set when this is a programme episode — the modal
                         // header credits the show beside the brand mark
  programHref?: string;
}

// Google's public sample clips — neutral, CORS-friendly stand-ins so Video.js
// actually plays. Swap for real HLS/MP4 sources when wiring live content.
export const SAMPLE_MP4S = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

function stableIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export function sampleMp4For(seed: string): string {
  return SAMPLE_MP4S[stableIndex(seed) % SAMPLE_MP4S.length];
}

/** A programme, with the episodes the modal can actually play. */
export interface ModalProgram {
  slug: string;
  title: string;
  href: string;
  poster: string;
  /** Which shelf of the modal's picker this belongs on. A YouTube channel and
   *  a programme are both "a thing with episodes", which is why they share this
   *  type — but they are not the same kind of thing to a reader, so the picker
   *  groups them and this is what it groups by. */
  kind?: 'program' | 'channel';
  /** Channels only — the channel picture and handle, so a channel tile reads
   *  as a channel rather than as a show with an odd poster. */
  avatar?: string;
  handle?: string;
  /** Channels only — the channel's own playlists, each playable as a run.
   *  A desk channel is not a flat feed to the people who make it, so its
   *  shelf in the picker leads with the way they group it. */
  shows?: {
    id: string;
    title: string;
    poster: string;
    href: string;
    embedUrl: string;
    meta?: string;
  }[];
  /** Episodes on the live listing — more than the modal carries, so it's worth saying. */
  episodeCount?: number;
  /** Relative recency, e.g. "Today" — the modal grid shows what's still running. */
  freshness?: string;
  episodes: {
    id: string;
    title: string;
    poster: string;
    duration?: string;
    /** Lets the modal make the episode playable without the page supplying it. */
    youtubeId?: string;
    meta?: string;
  }[];
}

/** Modal id for a programme episode. Namespaced so it can't collide with a video slug. */
export function programEpisodeId(youtubeId: string): string {
  return `pe-${youtubeId}`;
}

/**
 * Programmes for the modal's browser, freshest first, each with its real
 * episodes. Defaults to the whole slate — the browser is a two-level drill, so
 * a longer grid costs a scroll rather than clutter, and truncating it would
 * hide programmes that are still publishing.
 */
export async function modalPrograms(count?: number, per = 6): Promise<ModalProgram[]> {
  const { catalogueProgams, freshnessLabel } = await import('./program-catalogue');
  const { formatDuration, formatPublishDate, formatViews } = await import('./program-episodes');

  const slate = count ? catalogueProgams.slice(0, count) : catalogueProgams;

  return slate.map((p) => ({
    slug: p.slug,
    title: p.title,
    href: p.href,
    poster: p.poster.small,
    kind: 'program' as const,
    episodeCount: p.listingEpisodes,
    freshness: freshnessLabel(p),
    episodes: p.recentEpisodes.slice(0, per).map((ep) => ({
      id: programEpisodeId(ep.youtubeId),
      title: ep.titleML || ep.title,
      poster: ep.thumbnail.small,
      duration: formatDuration(ep.durationSeconds),
      youtubeId: ep.youtubeId,
      meta: [formatPublishDate(ep.publishedAt), `${formatViews(ep.viewCount)} views`].join(' · '),
    })),
  }));
}

/** The modal id for a desk channel's shelf in the picker. */
export function channelSlug(desk: string): string {
  return `channel-${desk}`;
}

/** Modal id for a playlist, kept in its own namespace like programme episodes. */
export function playlistVideoId(playlistId: string): string {
  return `pl-${playlistId}`;
}

/**
 * A desk's YouTube channel as an entry in the modal's picker.
 *
 * The channel videos on a desk page should play in the site's own viewer rather
 * than sending the reader to youtube.com. Modelling the channel as a
 * ModalProgram gets that for free: VideoModal already folds every episode of
 * every programme it is given into its payload, so the same ids that make the
 * picker work make the cards on the page playable. One mechanism, not two.
 *
 * Only the enriched run is offered — the rest of a capture carries relative
 * dates that drift after the capture day.
 */
export async function channelAsProgram(desk: string): Promise<ModalProgram | null> {
  const { channelForDesk, channelVideos, channelUploadCount } = await import('./channels');
  const channel = channelForDesk(desk);
  if (!channel) return null;

  const videos = channelVideos(desk, 8);
  if (!videos.length) return null;

  return {
    slug: channelSlug(desk),
    title: channel.label,
    href: channel.channelUrl,
    poster: videos[0].video.thumbnail.small,
    kind: 'channel',
    avatar: channel.avatar,
    handle: channel.handle,
    shows: channel.shows.map((s) => ({
      id: playlistVideoId(s.playlistId),
      title: s.title,
      // A playlist with no readable first-video id falls back to the channel's
      // own picture rather than to a broken tile.
      poster: s.thumbnail ?? channel.avatar ?? videos[0].video.thumbnail.small,
      href: s.href,
      embedUrl: s.embedUrl,
      meta: s.videoCountText ?? undefined,
    })),
    episodeCount: channelUploadCount(desk),
    freshness: videos[0].published,
    episodes: videos.map(({ video, duration, views, published }) => ({
      id: programEpisodeId(video.youtubeId),
      title: video.title,
      poster: video.thumbnail.small,
      duration,
      youtubeId: video.youtubeId,
      meta: [published, views && `${views} views`].filter(Boolean).join(' · '),
    })),
  };
}

/** Every desk channel as a picker entry, the named desk's own channel first. */
export async function channelPrograms(currentDesk?: string): Promise<ModalProgram[]> {
  const { allDeskChannels } = await import('./channels');
  const entries = await Promise.all(
    allDeskChannels(currentDesk).map((c) => channelAsProgram(c.desk)),
  );
  return entries.filter((p): p is ModalProgram => p !== null);
}

/**
 * Everything the modal's picker browses: the desk channels, then the
 * programmes.
 *
 * Both shelves travel together because a reader watching a Gulf upload and a
 * reader watching an episode of a show are asking the same question — what else
 * is there — and answering it with only half the library depends on which page
 * they happened to open the modal from. Pass the desk to lead with its own
 * channel; the picker groups by `kind`, so order within the list is only ever
 * about prominence.
 */
export async function modalShows(currentDesk?: string): Promise<ModalProgram[]> {
  const [channels, programs] = await Promise.all([
    channelPrograms(currentDesk),
    modalPrograms(),
  ]);
  return [...channels, ...programs];
}

/** One episode, carrying the show it came from. */
export interface ProgramPick {
  id: string;            // modal id — matches data-video-open
  title: string;
  programTitle: string;
  programHref: string;
  poster: string;
  duration?: string;
}

/**
 * Featured videos drawn from across the shows, newest of each first.
 *
 * The rail beside the video grid used to be a switcher: tabs, and a two-level
 * drill into one show's run. That asked the reader to operate a control before
 * being shown anything. This is the flat answer to the same question — here are
 * things worth watching, and here is the show each came from — so the panel is
 * a list rather than an interface.
 *
 * Interleaved by rank rather than grouped by show, so the top of the list is
 * the newest thing from every show instead of one show's whole run.
 */
export async function featuredFromPrograms(perProgram = 3, count = 9): Promise<ProgramPick[]> {
  const programs = await modalPrograms(4, perProgram);

  const picks: ProgramPick[] = [];
  for (let rank = 0; rank < perProgram; rank++) {
    for (const p of programs) {
      const ep = p.episodes[rank];
      if (!ep) continue;
      picks.push({
        id: ep.id,
        title: ep.title,
        programTitle: p.title,
        programHref: p.href,
        poster: ep.poster,
        duration: ep.duration,
      });
    }
  }
  return picks.slice(0, count);
}

// Map the site's Video records into the modal shape.
export function toModalVideos(videos: Video[]): ModalVideo[] {
  return videos.map((v) => ({
    id: v.slug,
    title: v.title,
    category: v.category,
    meta: [v.publishDate, v.views ? `${v.views} views` : null].filter(Boolean).join(' · '),
    duration: v.duration,
    poster: v.thumbnailUrl || dummyImageUrl(v.slug),
    src: sampleMp4For(v.slug),
    youtubeId: v.youtubeId,
  }));
}
