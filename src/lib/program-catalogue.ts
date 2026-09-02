// The programme catalogue — the site's single list of what MediaOne makes.
//
// Backed by src/data/programs/index.json, swept from the live site by
// scripts/scrape-catalogue.py. Programme identity, posters, episode links and
// every date/duration/view count in it are real. Group membership is ours:
// mediaoneonline.com does not group its programmes anywhere, so the TV/digital
// split is this site's editorial taxonomy.
//
// Everything that needs to know "which programmes exist" reads from here — the
// /programs page, the /videos filter row, and the video modal's browser — so
// there is one list to refresh rather than four that drift apart.

import catalogueDoc from '../data/programs/index.json';
import { formatDuration, formatPublishDate, formatViews, type RawEpisode } from './program-episodes';

export type ProgramGroupId = 'tv' | 'digital';

export interface CatalogueProgram {
  slug: string;
  title: string;
  titleML: string;
  group: ProgramGroupId;
  href: string;
  /** Episodes on page one of the live listing — not the full archive. */
  listingEpisodes: number;
  lastPublishedAt: string; // ISO 8601, UTC
  poster: RawEpisode['thumbnail'];
  recentEpisodes: RawEpisode[];
}

export interface CatalogueGroup {
  id: ProgramGroupId;
  label: string;
  labelML: string;
}

interface CatalogueDoc {
  source: {
    index: string;
    channel: string;
    channelUrl: string;
    capturedAt: string;
    note: string;
    recentPerProgram: number;
  };
  groups: CatalogueGroup[];
  programs: CatalogueProgram[];
}

const doc = catalogueDoc as unknown as CatalogueDoc;

export const catalogueSource = doc.source;

/** Every programme, freshest first. The file is stored pre-ranked. */
export const catalogueProgams: CatalogueProgram[] = doc.programs;

/** The enum: every programme slug the site knows about, freshest first. */
export const PROGRAM_SLUGS = doc.programs.map((p) => p.slug);

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number];

const bySlug = new Map(doc.programs.map((p) => [p.slug, p]));

export function catalogueProgram(slug: string): CatalogueProgram | undefined {
  return bySlug.get(slug);
}

// ─── Grouping and ranking ───────────────────────────────────────────────────

export interface RankedGroup extends CatalogueGroup {
  programs: CatalogueProgram[];
  /** The group's freshest programme — what the group is ranked on. */
  lastPublishedAt: string;
}

/**
 * Groups ranked by their freshest programme, each holding its programmes ranked
 * by last publish. A group whose every programme has gone quiet sinks below one
 * that is still shipping, which is the honest way to order a directory whose
 * members update at wildly different rates — this catalogue spans programmes
 * that published today and ones last seen over a year ago.
 */
export const programGroups: RankedGroup[] = doc.groups
  .map((g) => {
    const programs = doc.programs
      .filter((p) => p.group === g.id)
      .sort((a, b) => b.lastPublishedAt.localeCompare(a.lastPublishedAt));
    return { ...g, programs, lastPublishedAt: programs[0]?.lastPublishedAt ?? '' };
  })
  .filter((g) => g.programs.length > 0)
  .sort((a, b) => b.lastPublishedAt.localeCompare(a.lastPublishedAt));

/**
 * Days since a programme last published — the number the freshness label and
 * the ranking both read. Measured against the catalogue's capture date rather
 * than the clock, so a static build says the same thing every time it renders.
 */
export function daysSincePublish(program: CatalogueProgram): number {
  const captured = Date.parse(`${doc.source.capturedAt}T00:00:00Z`);
  const published = Date.parse(program.lastPublishedAt);
  return Math.max(0, Math.floor((captured - published) / 86_400_000));
}

const ACTIVE_WITHIN_DAYS = 30;

/** Still shipping — published within the last month of the capture. */
export function isActive(program: CatalogueProgram): boolean {
  return daysSincePublish(program) <= ACTIVE_WITHIN_DAYS;
}

/** "Today" / "3 days ago" / "Apr 25, 2026" — relative while it stays meaningful. */
export function freshnessLabel(program: CatalogueProgram): string {
  const days = daysSincePublish(program);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`;
  return formatPublishDate(program.lastPublishedAt);
}

// ─── Episodes across the catalogue ──────────────────────────────────────────

export interface CatalogueEpisode {
  episode: RawEpisode;
  program: CatalogueProgram;
  /** Presentation-ready strings, so callers don't each re-derive them. */
  duration: string;
  views: string;
  publishDate: string;
}

function decorate(episode: RawEpisode, program: CatalogueProgram): CatalogueEpisode {
  return {
    episode,
    program,
    duration: formatDuration(episode.durationSeconds),
    views: formatViews(episode.viewCount),
    publishDate: formatPublishDate(episode.publishedAt),
  };
}

/**
 * The newest episodes across every programme, newest first.
 *
 * `perProgram` caps how much any one programme can contribute, so a prolific
 * show cannot crowd out the rest of the slate — without it, Out Of Focus alone
 * would fill the whole list.
 */
export function latestEpisodes(limit = 12, perProgram = 2): CatalogueEpisode[] {
  return doc.programs
    .flatMap((p) => p.recentEpisodes.slice(0, perProgram).map((e) => decorate(e, p)))
    .sort((a, b) => b.episode.publishedAt.localeCompare(a.episode.publishedAt))
    .slice(0, limit);
}

/**
 * Every recent episode the catalogue holds, newest first — no overall cap.
 *
 * For surfaces that filter by programme rather than skim the top: a capped list
 * sorted by date silently drops the quiet programmes off the end, which would
 * leave them with no filter chip at all.
 */
export function allRecentEpisodes(perProgram = 6): CatalogueEpisode[] {
  return doc.programs
    .flatMap((p) => p.recentEpisodes.slice(0, perProgram).map((e) => decorate(e, p)))
    .sort((a, b) => b.episode.publishedAt.localeCompare(a.episode.publishedAt));
}
