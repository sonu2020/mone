// ============================================================================
// Desk pages — the data behind a section like /kerala.
//
// Shape learned from the live section page (mediaoneonline.com/kerala, read
// 3 Aug 2026), which is not the homepage's stack of full-width bands. It is:
//
//   breadcrumb → hero → a three-up featured row → a thumbed list → a long
//   "Latest News" list with a Next button, all in a main column beside a
//   sidebar (Videos, Trending) that runs the length of the page.
//
// So a desk splits into a fixed TOP block that only page 1 shows, then a
// paginated tail. Both routes (/kerala and /kerala/page/N) read this module so
// they can't disagree about which story lands where.
// ============================================================================
import {
  sections as liveSections,
  leadStories,
  latest as liveLatest,
  feed as liveFeed,
  type LiveStory,
} from './home4-data';
import { sections as fixtureSections } from './sections';
import { navItems, type NavLink } from './mega-nav';

/**
 * Every desk now renders on the standard layout, so the registry states the
 * exception rather than the rule: put an id in LEGACY_DESKS to hold it on the
 * old design. Empty is the goal state, and the old design stays reachable for
 * all of them at /old-section/<id> regardless.
 */
export const LEGACY_DESKS: string[] = [];

/**
 * Desks with a hand-built page of their own that the shared route must not
 * generate — /tech has src/pages/tech.astro.
 */
export const BESPOKE_DESKS = ['tech'];

export const isLegacy = (id: string) => LEGACY_DESKS.includes(id);
export const isBespoke = (id: string) => BESPOKE_DESKS.includes(id);
export const isPorted = (id: string) => !isLegacy(id) && !isBespoke(id);

/** Every desk the shared route serves on the standard layout. */
export function portedDeskIds(): string[] {
  return fixtureSections.map((s) => s.id).filter(isPorted);
}

/** Hero (1) + featured row (3) + thumbed list (5). Page 1 only. */
export const HERO = 1;
export const FEATURED = 3;
export const THUMBED = 5;
export const TOP = HERO + FEATURED + THUMBED;

// ── Density ─────────────────────────────────────────────────────────────────
//
// Desks are not the same size. Gulf carries a full day's file; Agriculture
// carries a handful. Rendering both through the same fixed composition means
// the thin desk shows the rich desk's skeleton with the meat missing — a
// three-up row holding one card, a "thumbed rows" block with two rows in it.
//
// So the layout is a function of how much the desk actually has. The main
// column keeps its width and its reading order in every case; what changes is
// how many blocks stand between the hero and the list. A desk earns a block by
// having enough stories to fill it, and no desk is padded out to look busier
// than it is.
//
// This is derived, not declared: a desk that grows gets the richer layout on
// its own, and nobody has to remember to promote it.

export type Density = 'lean' | 'standard' | 'rich';

/** Story counts a desk must reach to earn each layout. */
export const RICH_MIN = 20;
export const STANDARD_MIN = 10;

export function densityOf(desk: Desk): Density {
  const n = desk.stories.length;
  if (n >= RICH_MIN) return 'rich';
  if (n >= STANDARD_MIN) return 'standard';
  return 'lean';
}

/** What each density puts between the hero and the Latest list. */
export interface DensityPlan {
  density: Density;
  /** The three-up card row. */
  featured: boolean;
  /** The thumbed rows under the cards. */
  thumbed: boolean;
  /** Sub-section blocks, where the desk has real children. */
  subsections: boolean;
  /** A second ad in the main column, which only a long page has room for. */
  midAd: boolean;
}

export function densityPlan(desk: Desk): DensityPlan {
  const density = densityOf(desk);
  return {
    density,
    featured: density !== 'lean',
    thumbed: density === 'rich',
    subsections: density === 'rich',
    midAd: density === 'rich',
  };
}

/** Stories in the "Latest" list on any one page. */
export const PER_PAGE = 8;

/** A sub-section block needs at least this many stories to be worth a heading,
 *  and shows at most this many. */
export const SUB_MIN = 2;
export const SUB_MAX = 4;

export interface Desk {
  id: string;
  label: string;      // English
  labelML: string;
  description: string;
  stories: LiveStory[];
}

/**
 * Both sources the repo carries, in quality order: the live-site snapshot first
 * (real headlines, real artwork, but only for the handful of desks the homepage
 * bands needed), then the fixture set for the long tail. The fixture shape
 * predates LiveStory, so it is mapped rather than spread.
 *
 * Most desks have no snapshot — only the ones the homepage renders do. That is
 * a thinner desk, not an error, so the snapshot is optional and the fixtures
 * carry the page on their own.
 */
/** A fixture section's articles as LiveStory, which is what every page reads. */
function fixtureStories(fixture: (typeof fixtureSections)[number]): LiveStory[] {
  return fixture.articles.map((a) => ({
    title: a.title,
    href: a.href,
    image: a.image,
    category: fixture.name,
    date: a.date,
    excerpt: a.excerpt,
  }));
}

export function getDesk(id: string): Desk {
  const fixture = fixtureSections.find((s) => s.id === id);
  if (!fixture) throw new Error(`Unknown desk: ${id}`);

  const live = liveSections.find((s) => s.id === id);

  return {
    id,
    label: fixture.name,
    labelML: fixture.nameML,
    description: fixture.description,
    stories: [...(live?.stories ?? []), ...fixtureStories(fixture)],
  };
}

// ── The site-wide river ─────────────────────────────────────────────────────

/** /latest-news. Not a fixture section, so it never collides with /<section>. */
export const LATEST_DESK_ID = 'latest-news';

/**
 * Every story the repo carries, newest first, as one desk.
 *
 * /latest-news is a desk whose stories happen to come from every desk, so it
 * renders through DeskPage like the other eleven rather than inventing a second
 * listing design. What it needs that getDesk can't give is a pool spanning all
 * the sources at once.
 *
 * ORDERING, HONESTLY: the live snapshot publishes a date on only a handful of
 * its stories, so this is *source order* across the two sources, not a merge
 * sort by timestamp. The live block is trusted to already be newest-first
 * because that is how it was captured off the homepage; only the fixture tail,
 * which does carry dates, is genuinely sorted. Nothing here fabricates a
 * timestamp to make the seam invisible — a river that lies about when things
 * happened is worse than one that admits its two halves came from two places.
 *
 * The page this replaced sorted by `title.localeCompare` — alphabetically —
 * which is not "latest" under any reading of the word.
 */
export function getLatestDesk(): Desk {
  // Dedup is not optional: the live `latest` array and the live section bands
  // overlap by design (the same Palakkad lorry story is in both), and a river
  // that prints one headline twice reads as broken rather than as busy.
  const seen = new Set<string>();
  const stories: LiveStory[] = [];
  const take = (list: LiveStory[]) => {
    for (const story of list) {
      if (seen.has(story.href)) continue;
      seen.add(story.href);
      stories.push(story);
    }
  };

  // 1 · The live snapshot, in the order the live site published it. `feed`
  //     items carry a clock time ("18:18") rather than a calendar date; it is
  //     left off deliberately, because printing it in a column of "June 12,
  //     2026" dates reads as a data error rather than as a fresher story.
  take(leadStories);
  take(liveLatest);
  take(liveFeed.map(({ time: _time, ...story }) => story));

  // 2 · The live section bands, in live homepage order.
  for (const section of liveSections) take(section.stories);

  // 3 · The fixture tail, which does carry dates, newest first. An unparseable
  //     date sorts to the end rather than to 1970 — one malformed fixture
  //     should not jump the queue.
  const dated = fixtureSections
    .flatMap(fixtureStories)
    .map((story) => {
      const t = story.date ? Date.parse(story.date) : NaN;
      return { story, t: Number.isNaN(t) ? -Infinity : t };
    })
    .sort((a, b) => b.t - a.t)
    .map((d) => d.story);
  take(dated);

  return {
    id: LATEST_DESK_ID,
    label: 'Latest News',
    labelML: 'പുതിയ വാർത്തകൾ',
    description:
      'മീഡിയവണിന്റെ ഏറ്റവും പുതിയ വാർത്തകൾ — എല്ലാ ഡെസ്കുകളിൽ നിന്നും, പുതിയത് ആദ്യം.',
    stories,
  };
}

/**
 * A desk's sub-section as a desk in its own right, so /sports/cricket renders
 * on the same shell as /sports rather than 404ing out of the menu.
 *
 * Stories are the parent's, filtered to the sub-section's own path. Most are
 * thin or empty today — the IA is published ahead of the content, and an empty
 * desk that says so beats a dead link in the nav.
 */
export function getSubDesk(sectionId: string, sub: NavLink): Desk {
  const parent = getDesk(sectionId);
  return {
    id: `${sectionId}/${sub.href.split('/').pop()}`,
    label: sub.label,
    labelML: parent.labelML,
    description: `${sub.label} — ${parent.label}, MediaOne.`,
    stories: parent.stories.filter(
      (s) => s.href === sub.href || s.href.startsWith(`${sub.href}/`),
    ),
  };
}

/**
 * Desks whose children are served by a hand-built route — /gulf/<country> comes
 * from src/pages/gulf/[country].astro, so the shared route must skip them.
 */
export const BESPOKE_SUB_DESKS = ['gulf'];

/** Every /<section>/<sub> the menu points at, for desks the shared route owns. */
export function subDeskPaths(): { section: string; sub: string; link: NavLink }[] {
  return fixtureSections
    .filter((s) => isPorted(s.id) && !BESPOKE_SUB_DESKS.includes(s.id))
    .flatMap((s) =>
      subsectionLinks(s.id).map((link) => ({
        section: s.id,
        sub: link.href.split('/').pop() as string,
        link,
      })),
    );
}

export interface DeskSubsection {
  label: string;
  href: string;
  stories: LiveStory[];
}

export interface DeskPage {
  page: number;
  pageCount: number;
  /** Page 1 only — undefined on later pages, which are list-only. */
  hero?: LiveStory;
  featured: LiveStory[];
  thumbed: LiveStory[];
  /** Page 1 only. Empty for desks whose nav children aren't really theirs. */
  subsections: DeskSubsection[];
  latest: LiveStory[];
  prevHref?: string;
  nextHref?: string;
}

/**
 * A desk's real sub-sections, from the same IA the nav reads.
 *
 * The test is the URL, not the nav column: a link is a child only if it sits
 * under the desk's own path. Sports lists /sports/cricket and /sports/football
 * — children. The News desk (href /kerala) lists /india and /world in the same
 * column, but those are sibling desks, so /kerala correctly gets no blocks.
 */
export function subsectionLinks(deskId: string): NavLink[] {
  const base = `/${deskId}`;
  const item = navItems.find((i) => i.href === base);
  if (!item?.columns) return [];
  return item.columns.flatMap((c) => c.links).filter((l) => l.href.startsWith(`${base}/`));
}

/**
 * The desk's sub-section blocks — a cut by category over the whole desk.
 *
 * These deliberately overlap the chronological spine above them, which is what
 * the live sports page does: its Cricket block leads with the same match report
 * that heads the page. Two ways into the same material, not two pools. Only the
 * hero is held back, because repeating it a screen later reads as a mistake
 * rather than as a second route in.
 *
 * The flat list keeps its own no-repeat guarantee — nothing appears twice
 * inside it, and pagination is unaffected by any of this.
 */
function subsectionBlocks(desk: Desk): DeskSubsection[] {
  const body = desk.stories.slice(HERO);

  return subsectionLinks(desk.id)
    .map((link) => ({
      label: link.label,
      href: link.href,
      stories: body
        .filter((s) => s.href === link.href || s.href.startsWith(`${link.href}/`))
        .slice(0, SUB_MAX),
    }))
    .filter((sub) => sub.stories.length >= SUB_MIN);
}

/** Page 1 lives at /<desk>; the rest at /<desk>/page/N. */
export const pageHref = (id: string, n: number) => (n <= 1 ? `/${id}` : `/${id}/page/${n}`);

/**
 * How many stories the page-1 blocks actually consume at this desk's density.
 *
 * This has to track densityPlan exactly. A lean desk renders no card row and no
 * thumbed rows, so if the pool still started at TOP those stories would be
 * sliced off the front of Latest and never appear anywhere — the desk would
 * show its hero and then claim it had nothing else.
 */
export function topCount(desk: Desk): number {
  const plan = densityPlan(desk);
  return HERO + (plan.featured ? FEATURED : 0) + (plan.thumbed ? THUMBED : 0);
}

export function pageCountFor(desk: Desk): number {
  const consumed = topCount(desk);
  return Math.max(1, Math.ceil(Math.max(desk.stories.length - consumed, 0) / PER_PAGE));
}

export function getDeskPage(desk: Desk, page: number): DeskPage {
  const plan = densityPlan(desk);
  const consumed = topCount(desk);

  const pool = desk.stories.slice(consumed);
  const pageCount = pageCountFor(desk);
  const n = Math.min(Math.max(page, 1), pageCount);
  const top = desk.stories.slice(0, consumed);
  const start = (n - 1) * PER_PAGE;

  return {
    page: n,
    pageCount,
    hero: n === 1 ? top[0] : undefined,
    featured: n === 1 && plan.featured ? top.slice(HERO, HERO + FEATURED) : [],
    thumbed: n === 1 && plan.thumbed ? top.slice(HERO + FEATURED) : [],
    subsections: n === 1 && plan.subsections ? subsectionBlocks(desk) : [],
    latest: pool.slice(start, start + PER_PAGE),
    prevHref: n > 1 ? pageHref(desk.id, n - 1) : undefined,
    nextHref: n < pageCount ? pageHref(desk.id, n + 1) : undefined,
  };
}
