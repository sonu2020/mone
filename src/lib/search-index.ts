// ============================================================================
// Search index — everything the header's search sheet can find.
//
// The site is statically built, so there is no query endpoint to call: the
// index ships in the page as JSON and the sheet filters it on the client. That
// keeps search instant and offline-capable, at the cost of size — so the index
// carries labels and hrefs only, never bodies or artwork.
//
// One source, four kinds. Sections and topics come from the nav IA (the same
// list the header renders), stories from the homepage snapshot, videos from
// the YouTube catalogue. A video entry carries `videoId` so a result can open
// the shared VideoModal in place instead of navigating away.
// ============================================================================
import { navItems, trendingTopics } from './mega-nav';
import { leadStories, latest, shelf, magazine, feed, sections } from './home4-data';
import { allVideos } from './videos';

export type SearchKind = 'section' | 'topic' | 'story' | 'video';

export interface SearchEntry {
  /** What the reader reads — the headline, desk or topic name. */
  label: string;
  href: string;
  kind: SearchKind;
  /** The desk or category the entry belongs to, shown beside the label. */
  hint?: string;
  /** Present on videos: lets the result open the player rather than a page. */
  videoId?: string;
}

/** Latin + Malayalam fold: case-flattened, punctuation dropped, spaces
 *  collapsed. Malayalam has no case, so this is a no-op there — which is the
 *  point: one comparison path for both scripts. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’“”'"|,.:;!?()\[\]{}\-–—/\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupe(entries: SearchEntry[]): SearchEntry[] {
  const seen = new Set<string>();
  return entries.filter((e) => {
    const key = `${e.kind}:${normalize(e.label)}`;
    if (!e.label || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Sections — the desks and every link inside their panels ─────────────────
const sectionEntries: SearchEntry[] = navItems.flatMap((item) => [
  ...(item.href ? [{ label: item.label, href: item.href, kind: 'section' as const }] : []),
  ...(item.columns ?? [])
    .flatMap((c) => c.links)
    .map((l) => ({
      label: l.label,
      href: l.href,
      kind: 'section' as const,
      hint: item.label,
    })),
]);

const topicEntries: SearchEntry[] = trendingTopics.map((t) => ({
  label: t.label,
  href: t.href,
  kind: 'topic',
}));

// ── Stories — the homepage snapshot, deduped across bands ───────────────────
const storyEntries: SearchEntry[] = [
  ...leadStories,
  ...latest,
  ...shelf,
  ...magazine,
  ...feed,
  ...sections.flatMap((s) => s.stories),
].map((s) => ({
  label: s.title,
  href: s.href,
  kind: 'story' as const,
  hint: s.category,
}));

const videoEntries: SearchEntry[] = allVideos.map((v) => ({
  label: v.title,
  href: '/videos',
  kind: 'video' as const,
  hint: v.category,
  videoId: v.slug,
}));

/** The whole index, ordered by how specific a match is likely to be wanted:
 *  a reader typing "kerala" wants the desk before the fourteenth story that
 *  mentions it. Ranking inside a kind is left to the client. */
export const searchIndex: SearchEntry[] = dedupe([
  ...sectionEntries,
  ...topicEntries,
  ...storyEntries,
  ...videoEntries,
]);

/** What the sheet offers before a single key is pressed. Four desks a reader
 *  is most likely to want, in the order the nav states them. */
export const searchShortcuts: SearchEntry[] = sectionEntries
  .filter((e) => ['/latest-news', '/kerala', '/live', '/videos'].includes(e.href))
  .slice(0, 4);
