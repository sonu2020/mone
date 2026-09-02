// ============================================================================
// /home5 — the scroll-centric stream.
//
// The homepage at / groups everything below the shelf into labelled section
// bands: Kerala, Magazine, Entertainment, Sports, Gulf, National, World. This
// module builds the opposite arrangement, in the manner of mathrubhumi.com —
// one continuous run of news blocks, newest first, with the desk shown as a
// kicker on each item rather than as a heading over a group of them. The
// reader scrolls a feed instead of stepping through departments.
//
// It reads from the same live snapshot the homepage does (home4-data.ts) and
// writes nothing back: /home5 is a parallel arrangement of the same editorial
// mix, so the two can be compared on identical stories.
// ============================================================================

import { sections, magazine, leadStories, latest, shelf, type LiveStory } from './home4-data';
import { allVideos } from './videos';

// ── Stream blocks ───────────────────────────────────────────────────────────
// A block is one thing the page renders in sequence. Most are stories; the
// rest are the punctuation that keeps a 45-item run from reading as a wall —
// an occasional wide item, a sideways strip, an ad. None of them group the
// stories around them: the feed continues straight through.

export interface StreamStory extends LiveStory {
  /** Synthetic IST clock — see STREAM_START. */
  time: string;
}

export type StreamBlock =
  | { kind: 'row'; story: StreamStory }
  | { kind: 'feature'; story: StreamStory }
  | { kind: 'strip'; label: string; href: string; stories: LiveStory[] }
  | { kind: 'videos'; label: string; href: string; videos: StreamVideo[] }
  | { kind: 'ad'; slot: string }
  | { kind: 'marker'; label: string };

export interface StreamVideo {
  title: string;
  href: string;
  category: string;
  duration?: string;
  seed: string;
  imageUrl?: string;
  modalId: string;
}

// ── Timestamps ──────────────────────────────────────────────────────────────
// The snapshot publishes a clock for the live rail and almost nothing else, but
// a feed without times reads as an undated pile. These are generated, not
// captured: the run starts one minute above the live rail's newest item and
// steps back at a steady interval, so the order the page shows is the order the
// times claim. A real CMS supplies the real stamps; this is a preview.
const STREAM_START_MINUTES = 18 * 60 + 19;   // 18:19 IST, just above the rail
const STREAM_STEP_MINUTES = 7;

const clockAt = (index: number): string => {
  const total = (STREAM_START_MINUTES - index * STREAM_STEP_MINUTES + 24 * 60) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
};

// ── Interleave ──────────────────────────────────────────────────────────────
/**
 * Round-robin across the desks so no two neighbours share one, which is what
 * stops the feed re-forming into the section blocks it exists to replace. Runs
 * of unequal length simply drop out as they empty.
 */
const interleave = (runs: LiveStory[][]): LiveStory[] => {
  const out: LiveStory[] = [];
  const longest = Math.max(0, ...runs.map((r) => r.length));
  for (let i = 0; i < longest; i++) {
    for (const run of runs) {
      if (run[i]) out.push(run[i]);
    }
  }
  return out;
};

/**
 * Titles already spent above the stream — the lead package's hero and rows,
 * and the shelf band. The snapshot files a handful of stories on two desks at
 * once, so the same headline reaches both. On the homepage that is harmless:
 * the copies land in bands several screens apart with different treatments.
 * In one continuous run it is a reader meeting the same headline twice within
 * a minute of scrolling, which reads as a bug in the page. Matched on title
 * rather than href because the snapshot gives the duplicates different slugs.
 */
const spentAbove = new Set(
  [...leadStories, ...latest, ...shelf].map((s) => s.title),
);

/**
 * Every desk below the shelf, as one dated run.
 *
 * The magazine stays out of it: it is long-form on its own clock, and dating
 * a June essay to 4:12 this afternoon to keep the sequence tidy would be a
 * lie the rest of the feed does not tell. It appears further down as a strip,
 * where its own dates can show.
 */
const deskRuns: LiveStory[][] = sections.map((s) =>
  s.stories.filter((story) => !spentAbove.has(story.title)),
);

export const streamStories: StreamStory[] = interleave(deskRuns).map((story, i) => ({
  ...story,
  time: clockAt(i),
}));

// ── Punctuation ─────────────────────────────────────────────────────────────
// Where the run changes shape. Keyed by position in the story sequence, so the
// story order stays the single thing that drives the page.

/** Every Nth story runs wide, with its artwork above the headline. */
const FEATURE_EVERY = 6;

/** Blocks spliced in *after* the story at this index. */
const INTERRUPTS: Record<number, StreamBlock[]> = {
  3: [{ kind: 'ad', slot: 'home5-1' }],
  9: [{ kind: 'videos', label: 'Watch', href: '/videos', videos: [] }],
  15: [{ kind: 'marker', label: 'More news' }],
  21: [{ kind: 'ad', slot: 'home5-2' }],
  27: [{ kind: 'strip', label: 'From the Magazine', href: '/magazine', stories: magazine }],
  33: [{ kind: 'marker', label: 'Still going' }],
  36: [{ kind: 'ad', slot: 'home5-3' }],
};

const stripVideos: StreamVideo[] = allVideos.slice(0, 10).map((v) => ({
  title: v.title,
  href: '/videos',
  category: v.category,
  duration: v.duration,
  seed: v.thumbnail,
  imageUrl: v.thumbnailUrl,
  modalId: v.slug,
}));

/** The page's whole below-the-shelf sequence, in render order. */
export const buildStream = (): StreamBlock[] => {
  const blocks: StreamBlock[] = [];

  streamStories.forEach((story, i) => {
    blocks.push({ kind: i > 0 && i % FEATURE_EVERY === 0 ? 'feature' : 'row', story });

    for (const block of INTERRUPTS[i] ?? []) {
      // The video catalogue is read at module scope rather than written into
      // INTERRUPTS, so the table stays a list of positions.
      blocks.push(block.kind === 'videos' ? { ...block, videos: stripVideos } : block);
    }
  });

  return blocks;
};

/**
 * The sticky rail beside the stream: the most-read column. A static preview
 * cannot measure what is actually being read, so this takes one story from the
 * tail of each desk — deliberately the far end of the run rather than the
 * head, because the head is what the first six rows of the feed already show,
 * and a rail that mirrors the column beside it is worth nothing.
 */
export const mostRead: LiveStory[] = deskRuns
  .map((run) => run[run.length - 1])
  .filter(Boolean)
  .slice(0, 6);

/**
 * How many blocks render expanded before the reveal script takes over. Chosen
 * to fill roughly two screens, so the first reveal happens after the reader
 * has committed to scrolling rather than immediately on load.
 */
export const STREAM_INITIAL = 14;

/** How many more blocks each reveal adds. */
export const STREAM_BATCH = 10;
