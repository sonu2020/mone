// Desk channels — MediaOne's topic-specific YouTube channels, mapped to the
// section pages they belong on.
//
// Business, ShowMall, Gulf, Sports, Destinations and Health publish alongside
// the main channel, and their uploads are the freshest thing a reader on the
// matching desk could be shown. Captured by scripts/scrape-channel.py into
// src/data/channels/<desk>.json — name, handle, avatar, subscriber count, the
// recent uploads, and the channel's own playlists.
//
// Drop a new <desk>.json in and the matching section page picks it up — the
// glob is the registry, so there is no second list to keep in step.

import { formatDuration, formatPublishDate, formatViews } from './program-episodes';

export interface ChannelVideo {
  youtubeId: string;
  title: string;
  /** As shown on the channel tab: "3:33", "346 views", "19 hours ago". */
  durationText: string | null;
  viewsText: string | null;
  publishedText: string | null;
  thumbnail: { small: string; large: string };
  href: string;
  /** Present on featured videos only — read from the watch page, so exact. */
  durationSeconds?: number;
  viewCount?: number;
  publishedAt?: string;
}

/**
 * One of a channel's playlists — a show, as the channel itself groups its work.
 *
 * Captured as a link and a count rather than an episode list. The embed plays
 * the whole run in order, which is what a show is, so the modal can offer it
 * without the sweep having to read every playlist's contents.
 */
export interface ChannelShow {
  playlistId: string;
  title: string;
  videoCountText: string | null;
  href: string;
  embedUrl: string;
  thumbnail: string | null;
}

export interface DeskChannel {
  desk: string;
  label: string;
  blurb: string;
  handle: string;
  channelUrl: string;
  /** Site-hosted copy of the channel picture — see scrape-channel.py's
   *  download_avatar(). The yt3 URL it came from is in avatarSource, for
   *  provenance only; never render that one, its sizing token expires. */
  avatar?: string;
  avatarSource?: string;
  /** As YouTube abbreviates them: "147K subscribers", "4.2K videos". Text,
   *  because the exact numbers aren't published and rounding them ourselves
   *  would invent precision. */
  subscribersText?: string;
  videoCountText?: string;
  social: { network: string; handle: string; href: string }[];
  /** The channel's playlists, in the order the channel lists them. */
  shows: ChannelShow[];
  capturedAt: string;
  /** Enriched and dated — safe to sort and to show a date against. */
  featured: ChannelVideo[];
  /** The rest of the listing, relative dates only. Counts, not ordering. */
  more: ChannelVideo[];
}

const modules = import.meta.glob<DeskChannel>('../data/channels/*.json', {
  eager: true,
  import: 'default',
});

export const deskChannels: Record<string, DeskChannel> = Object.fromEntries(
  Object.values(modules).map((c) => [c.desk, c]),
);

export function channelForDesk(desk: string): DeskChannel | undefined {
  return deskChannels[desk];
}

/**
 * Every desk channel, biggest first, with one desk's own channel pulled to the
 * front when a page names it.
 *
 * The video modal lists all of them wherever it appears, so a reader who opens
 * a Gulf clip can cross to Sports without going back to a section page. Order
 * is by subscriber count so the list reads the same on every page — except for
 * the current desk, which leads because that is the channel the reader is
 * already standing in front of.
 */
export function allDeskChannels(currentDesk?: string): DeskChannel[] {
  return Object.values(deskChannels).sort((a, b) => {
    if (a.desk === currentDesk) return -1;
    if (b.desk === currentDesk) return 1;
    return subscriberRank(b) - subscriberRank(a);
  });
}

/** "147K subscribers" → 147000. Sorting only; never shown as a number. */
const SUFFIXES: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

export function subscriberRank(channel: DeskChannel): number {
  const m = /^([\d.]+)([KMB]?)/.exec(channel.subscribersText ?? '');
  if (!m) return 0;
  return Number(m[1]) * (SUFFIXES[m[2]] ?? 1);
}

export interface DisplayVideo {
  video: ChannelVideo;
  duration: string;
  views: string;
  published: string;
}

/**
 * Featured videos, presentation-ready.
 *
 * Only the featured run is offered. The rest of the capture carries relative
 * dates that were true on the capture day and drift silently afterwards, so
 * showing them next to exact ones would put two different kinds of claim in
 * the same row.
 */
export function channelVideos(desk: string, limit = 4): DisplayVideo[] {
  const channel = deskChannels[desk];
  if (!channel) return [];

  return channel.featured.slice(0, limit).map((video) => ({
    video,
    duration: video.durationSeconds ? formatDuration(video.durationSeconds) : (video.durationText ?? ''),
    views: video.viewCount != null ? formatViews(video.viewCount) : (video.viewsText ?? ''),
    published: video.publishedAt ? formatPublishDate(video.publishedAt) : (video.publishedText ?? ''),
  }));
}

/** How many uploads the capture saw in total — featured plus the tail. */
export function channelUploadCount(desk: string): number {
  const channel = deskChannels[desk];
  return channel ? channel.featured.length + channel.more.length : 0;
}
