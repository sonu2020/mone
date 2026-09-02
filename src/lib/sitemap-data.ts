// ── Sitemap inventory ────────────────────────────────────────────────────────
// The stock of every page the site builds, assembled from the same data
// sources the routes read so the sitemap can't drift from what exists.
// Consumed by /sitemap (src/pages/sitemap.astro); the audit trail behind the
// remaps lives in docs/sitemap-inventory.md.
//
// Each entry carries tags so the page can filter with plain JS. `group` names
// the heading it sits under.

import { sections } from './sections';
import { subDeskPaths } from './desk';
import { shows, allVideos } from './videos';
import { programs } from './programs';
import { treks } from './travelogue';
import { magazineArticles } from './magazine';
import { allShelfArticles, allShelfSections } from './shelf';

export interface SitemapEntry {
  href: string;
  title: string;
  tags: string[];
}

export interface SitemapGroup {
  id: string;
  label: string;
  entries: SitemapEntry[];
}

const entry = (href: string, title: string, ...tags: string[]): SitemapEntry => ({
  href,
  title,
  tags,
});

export function sitemapGroups(): SitemapGroup[] {
  // Sections — desks, sub-desks and gulf countries.
  const sectionEntries: SitemapEntry[] = sections.map((s) =>
    entry(`/${s.id}`, `${s.name} — ${s.nameML}`, s.name, 'Section'),
  );
  for (const c of ['uae', 'saudi-arabia', 'qatar', 'bahrain', 'kuwait', 'oman']) {
    sectionEntries.push(entry(`/gulf/${c}`, `Gulf — ${c}`, 'Gulf', 'Country'));
  }
  const subEntries: SitemapEntry[] = subDeskPaths().map(({ section, link }) =>
    entry(`/${section}/${link.href.split('/').pop()}`, `${link.label} — ${section}`, 'Sub-section'),
  );

  // Stories — the article pages under /story, one per section.
  const storyEntries: SitemapEntry[] = sections.flatMap((s) =>
    s.articles.map((a) => entry(a.href, a.title, s.name, 'Story')),
  );

  // Videos — shows plus watch pages.
  const videoEntries: SitemapEntry[] = shows.map((s) =>
    entry(`/videos/shows/${s.slug}`, s.titleML || s.title, 'Video', 'Show'),
  );
  for (const v of allVideos) {
    videoEntries.push(entry(`/videos/watch/${v.slug}`, v.title, 'Video', 'Watch'));
  }

  // Magazine.
  const magazineEntries: SitemapEntry[] = magazineArticles.map((a) =>
    entry(`/magazine/${a.slug}`, a.titleML || a.title, 'Magazine', a.category),
  );

  // Shelf — articles plus category indexes.
  const shelfEntries: SitemapEntry[] = allShelfArticles.map((a) =>
    entry(`/shelf/${a.slug}`, a.title, 'Shelf', a.shelfCategory || a.category),
  );
  for (const s of allShelfSections) {
    shelfEntries.push(entry(s.href, `Shelf — ${s.title}`, 'Shelf', 'Category'));
  }

  // Programs.
  const programEntries: SitemapEntry[] = programs.map((p) =>
    entry(`/programs/${p.slug}`, p.titleML || p.title, 'Program', p.category === 'tv' ? 'TV' : 'Digital'),
  );

  // Travel — treks only; the /travel sub-desks are already in subEntries.
  const travelEntries: SitemapEntry[] = treks.map((t) =>
    entry(`/travel/${t.slug}`, t.title, 'Travel'),
  );

  // Features.
  const featureEntries: SitemapEntry[] = [
    entry('/features/gold-price', 'Gold Price — live desk', 'Feature', 'Markets'),
    entry('/features/kerala-floods-2018', 'Kerala Floods 2018 — recall', 'Feature'),
    entry('/features/lsg-elections-2025', 'LSG 2025 — election explorer', 'Feature'),
    entry('/features/rivers-of-kerala', 'Rivers of Kerala', 'Feature'),
    entry('/features/thamarassery-churam', 'Thamarassery Churam', 'Feature'),
    entry('/features/wayanad-slide', 'Wayanad Slide', 'Feature'),
  ];

  // Utility / static.
  const utilityEntries: SitemapEntry[] = [
    entry('/', 'Home', 'Utility'),
    entry('/latest-news', 'Latest News', 'Utility'),
    entry('/breaking', 'Breaking', 'Utility'),
    entry('/live', 'Live TV', 'Utility'),
    entry('/videos', 'Videos', 'Utility', 'Video'),
    entry('/videos/shows', 'Video Shows', 'Utility', 'Video', 'Show'),
    entry('/programs', 'Programs', 'Utility', 'Program'),
    entry('/shelf', 'Shelf', 'Utility', 'Shelf'),
    entry('/magazine', 'Magazine', 'Utility', 'Magazine'),
    entry('/tech', 'Tech', 'Utility'),
    entry('/food-map', 'Food Map', 'Utility'),
    entry('/travel', 'Travel', 'Utility', 'Travel'),
    entry('/about-us', 'About Us', 'Utility'),
    entry('/our-team', 'Our Team', 'Utility'),
    entry('/investor-care', 'Investor Care', 'Utility'),
    entry('/contact-us', 'Contact Us', 'Utility'),
    entry('/privacy-policy', 'Privacy Policy', 'Utility'),
    entry('/terms-and-conditions', 'Terms & Conditions', 'Utility'),
  ];

  // Archive — superseded page shells kept for continuity.
  const archiveEntries: SitemapEntry[] = [
    entry('/old-home', 'Old Home', 'Archive'),
    entry('/old-latest-news', 'Old Latest News', 'Archive'),
    entry('/old-shelf', 'Old Shelf', 'Archive'),
    ...sections.map((s) => entry(`/old-section/${s.id}`, `Old Section — ${s.name}`, 'Archive')),
  ];

  // Lab — layout experiments and design-system pages (all noindex).
  const labEntries: SitemapEntry[] = [
    entry('/article/classic', 'Article Lab — Classic', 'Lab'),
    entry('/article/focus', 'Article Lab — Focus', 'Lab'),
    entry('/article/immersive', 'Article Lab — Immersive', 'Lab'),
    entry('/article/magazine', 'Article Lab — Magazine', 'Lab'),
    entry('/player-lab', 'Player Lab', 'Lab'),
    entry('/design', 'Design System', 'Lab'),
    entry('/design/system', 'Design System — /system', 'Lab'),
    entry('/design/tokens', 'Design System — Token Browser', 'Lab'),
    entry('/design/components', 'Design System — Components', 'Lab'),
    entry('/design/archive', 'Design Archive', 'Lab'),
    entry('/design/kitchen', 'Design Kitchen', 'Lab'),
    entry('/design/layout', 'Design Layout', 'Lab'),
    entry('/design/terrain-journey', 'Terrain Journey', 'Lab'),
    entry('/design/newo', 'Design — newo patterns', 'Lab'),
    entry('/demo/fonts', 'Demo — Fonts', 'Lab'),
    entry('/v3', 'V3 Home', 'Lab'),
    entry('/alt', 'Alt Home', 'Lab'),
    entry('/blah', 'Blah', 'Lab'),
    entry('/new', 'New', 'Lab'),
    entry('/slide', 'Slide', 'Lab'),
    entry('/guided/home', 'Guided Tour — Homepage', 'Lab'),
  ];

  // Home-layout labs live under /home/<id> — the layout variants.
  const homeVariants = ['modular', 'magazine', 'ideal', 'nyt', 'guardian', 'bbc', 'bbc-3col', 'aljazeera', 'sky'];
  labEntries.push(...homeVariants.map((id) => entry(`/home/${id}`, `Home Lab — ${id}`, 'Lab')));

  // De-duplicate (the same href can appear from two sources) and sort each
  // group alphabetically.
  const dedupe = (list: SitemapEntry[]) => {
    const seen = new Set<string>();
    return list.filter((e) => (seen.has(e.href) ? false : (seen.add(e.href), true))).sort((a, b) => a.title.localeCompare(b.title));
  };

  return [
    { id: 'section', label: 'Sections & Desks', entries: dedupe([...sectionEntries, ...subEntries]) },
    { id: 'story', label: 'Stories', entries: dedupe(storyEntries) },
    { id: 'video', label: 'Videos', entries: dedupe(videoEntries) },
    { id: 'magazine', label: 'Magazine', entries: dedupe(magazineEntries) },
    { id: 'shelf', label: 'Shelf', entries: dedupe(shelfEntries) },
    { id: 'program', label: 'Programs', entries: dedupe(programEntries) },
    { id: 'travel', label: 'Travel & Features', entries: dedupe([...travelEntries, ...featureEntries]) },
    { id: 'utility', label: 'Utility', entries: dedupe(utilityEntries) },
    { id: 'archive', label: 'Archive', entries: dedupe(archiveEntries) },
    { id: 'lab', label: 'Lab', entries: dedupe(labEntries) },
  ];
}

/** All tags across the inventory, most-used first, for the filter chips. */
export function sitemapTags(): string[] {
  const counts = new Map<string, number>();
  for (const g of sitemapGroups()) {
    for (const e of g.entries) {
      for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}
