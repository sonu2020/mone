/**
 * Mega-nav IA — the typed source the header reads.
 * Agreed structure lives in docs/navigation-ia.md; keep the two in step.
 *
 * `columns` splits a panel's links into vertical boxes. A single column renders
 * as one box; several render side by side, which is what the wider desks
 * (Politics, Business, Health) want.
 */

export interface NavLink {
  label: string;
  href: string;
  note?: string;        // optional one-liner under the link
}

export interface NavColumn {
  title?: string;       // box heading, omitted for single-box panels
  links: NavLink[];
}

export interface NavItem {
  label: string;
  /**
   * The desk's landing page. Optional: 'More' is a menu, not a place — it
   * groups the desks that have no shared index, so pointing it at one of its
   * own children (it used to alias /shelf) claimed a page it does not own.
   * With no href the header renders it as a menu button instead of a link.
   */
  href?: string;
  columns?: NavColumn[]; // absent → plain link, no panel
  feature?: {            // optional promo rail inside the panel
    kicker: string;
    title: string;
    href: string;
    cta?: string;        // defaults to 'Watch' — the rail began as a video promo
  };
  /**
   * Opt a desk into a drop-down on the flat header (HeaderBar), which is
   * otherwise a plain link rail.
   *
   * Only 'More' takes one today, and the reason is structural rather than
   * cosmetic: every other desk owns a real section page, so its children
   * surface in that page's sub-nav once you arrive. More is a catch-all with
   * no page of its own to do that, so without a panel its children are
   * reachable only from the footer. Declared here rather than matched by label
   * in the header, so opting another desk in is a data change.
   */
  panel?: 'mini';
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },

  {
    label: 'News',
    href: '/latest-news',
    columns: [
      {
        links: [
          { label: 'Kerala', href: '/kerala' },
          { label: 'National', href: '/india' },
          { label: 'International', href: '/world' },
          { label: 'Fact Check', href: '/fact-check' },
        ],
      },
    ],
    feature: { kicker: 'Live', title: 'Assembly session — rolling coverage', href: '/live' },
  },

  {
    label: 'Politics',
    href: '/politics',
    columns: [
      {
        title: 'Desks',
        links: [
          { label: 'Kerala Politics', href: '/politics/kerala' },
          { label: 'National Politics', href: '/politics/national' },
          { label: 'Political Analysis & Opinion', href: '/analysis' },
        ],
      },
      {
        title: 'Institutions',
        links: [
          { label: 'Elections & Poll Watch', href: '/politics/elections' },
          { label: 'Assembly & Parliament', href: '/politics/assembly' },
          { label: 'Policy & Governance', href: '/politics/policy' },
        ],
      },
    ],
  },

  {
    label: 'Gulf',
    href: '/gulf',
    columns: [
      {
        links: [
          { label: 'UAE', href: '/gulf/uae' },
          { label: 'Saudi Arabia', href: '/gulf/saudi-arabia' },
          { label: 'Qatar', href: '/gulf/qatar' },
        ],
      },
      {
        links: [
          { label: 'Kuwait', href: '/gulf/kuwait' },
          { label: 'Oman', href: '/gulf/oman' },
          { label: 'Bahrain', href: '/gulf/bahrain' },
        ],
      },
    ],
  },

  {
    label: 'Business',
    href: '/business',
    columns: [
      {
        title: 'Markets',
        links: [
          { label: 'Markets & Stocks', href: '/business/markets', note: 'Sensex, Nifty' },
          { label: 'Gold Rates & Currency', href: '/business/gold-rates' },
          { label: 'Personal Finance & Mutual Funds', href: '/business/personal-finance' },
        ],
      },
      {
        title: 'Enterprise',
        links: [
          { label: 'Gulf Business & Real Estate', href: '/business/gulf' },
          { label: 'Startups & Entrepreneurship', href: '/business/startups' },
          { label: 'SMEs & Business Guides', href: '/business/sme' },
        ],
      },
    ],
  },

  {
    label: 'Health',
    href: '/health',
    columns: [
      {
        title: 'Reporting',
        links: [
          { label: 'Medical News & Research', href: '/health/medical-news' },
          { label: 'Doctor’s Corner & Expert Columns', href: '/health/doctors-corner' },
        ],
      },
      {
        title: 'Everyday',
        links: [
          { label: 'Lifestyle & Preventive Care', href: '/health/preventive-care' },
          { label: 'Pediatrics & Family Health', href: '/health/family-health' },
          { label: 'Nutrition & Fitness', href: '/health/nutrition' },
        ],
      },
    ],
  },

  {
    label: 'Entertainment',
    href: '/entertainment',
    columns: [
      {
        title: 'Screen',
        links: [
          { label: 'Mollywood', href: '/entertainment/mollywood' },
          { label: 'Movie Reviews', href: '/entertainment/reviews' },
          { label: 'Box Office & Other Languages', href: '/entertainment/box-office' },
        ],
      },
      {
        title: 'Streaming & People',
        links: [
          { label: 'OTT Releases', href: '/entertainment/ott' },
          { label: 'Celebrity Interviews & Features', href: '/face-to-face' },
        ],
      },
    ],
  },

  {
    label: 'Sports',
    href: '/sports',
    columns: [
      {
        links: [
          { label: 'Football', href: '/sports/football' },
          { label: 'Cricket', href: '/sports/cricket' },
          { label: 'ISL & IPL', href: '/sports/isl-ipl' },
          { label: 'World Sports', href: '/sports/world' },
        ],
      },
    ],
  },

  {
    label: 'Travel',
    href: '/travel',
    columns: [
      {
        links: [
          { label: 'Travel Guides & Spots', href: '/travel/guides' },
          { label: 'Destination Stories', href: '/travel/stories' },
          { label: 'Travel Vlogs & Visuals', href: '/travel/vlogs' },
          { label: 'Budget Travel & Tips', href: '/travel/budget' },
        ],
      },
    ],
  },

  {
    label: 'Shows',
    href: '/videos',
    columns: [
      {
        links: [
          { label: 'Programmes', href: '/programs' },
          { label: 'Live TV', href: '/live' },
        ],
      },
    ],
    feature: { kicker: 'On air', title: 'MediaOne Live — 24×7 news', href: '/live' },
  },

  // Shelf is its own desk now rather than the thing More pointed at — it is a
  // real section with a real page, and burying it in a catch-all undersold it.
  { label: 'Shelf', href: '/shelf' },

  {
    label: 'More',
    panel: 'mini',
    // Last in the rail, and genuinely a menu: the desks here share no index
    // page, which is the whole reason they need one. Grouped rather than run
    // flat, and every href is a page that exists — a catch-all is exactly
    // where dead links hide.
    columns: [
      {
        title: 'Desks',
        links: [
          { label: 'Tech & Gadgets', href: '/tech' },
          { label: 'Automobile', href: '/auto' },
          { label: 'Education & Career', href: '/education' },
          { label: 'Agriculture', href: '/agriculture' },
        ],
      },
      {
        title: 'Life',
        links: [
          { label: 'Health', href: '/health' },
          { label: 'Lifestyle', href: '/lifestyle' },
          { label: 'Food Map', href: '/food-map' },
          { label: 'Crime', href: '/crime' },
        ],
      },
    ],
    feature: { kicker: 'Magazine', title: 'The long read, collected', href: '/magazine', cta: 'Read' },
  },
];

/* ── Contextual sub-nav ─────────────────────────────────────────────────────
   HeaderFlat carries no dropdowns, so a desk's sub-links surface on the desk's
   own pages instead. Given a path, find the desk that owns it and flatten its
   panel columns into the strip that page should render. Longest href wins, so
   /videos/watch/x resolves to Videos rather than to Home's "/".             */

export interface SubNav {
  item: NavItem;
  links: NavLink[];
}

export function subNavFor(pathname: string): SubNav | null {
  const path = pathname.replace(/\/+$/, '') || '/';

  const owns = (item: NavItem) =>
    (!!item.href && item.href !== '/' && (path === item.href || path.startsWith(`${item.href}/`))) ||
    (item.columns ?? []).some((c) => c.links.some((l) => path === l.href || path.startsWith(`${l.href}/`)));

  // Longest href wins. A menu-only desk has none, so it sorts last and only
  // claims a page when no desk with a real section owns it — which is right:
  // /health belongs to the Health desk, not to More, even though More lists it.
  const desk = navItems
    .filter(owns)
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];

  if (!desk?.columns) return null;

  const links = desk.columns.flatMap((c) => c.links);
  return links.length ? { item: desk, links } : null;
}

/* ── Trending strip ────────────────────────────────────────────────── */
export const trendingTopics: NavLink[] = [
  { label: 'AssemblySession', href: '/politics/assembly' },
  { label: 'IranConflict', href: '/world' },
  { label: 'Fact Check', href: '/fact-check' },
  { label: 'Health Tips', href: '/health' },
];
