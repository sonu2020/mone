// ── Sitemap endpoint ─────────────────────────────────────────────────────────
// Generates /sitemap.xml at build time from the site's data sources.
// Base URL is the live domain the content was scraped from.

import type { APIContext } from 'astro';
import { sections } from '../lib/sections';
import { subDeskPaths } from '../lib/desk';
import { navItems } from '../lib/mega-nav';
import { shows } from '../lib/videos';
import { programs } from '../lib/programs';
import { treks } from '../lib/travelogue';
import { allShelfArticles, allShelfSections } from '../lib/shelf';

const BASE = 'https://www.mediaoneonline.com';

// Static pages: priority is relative (0.0–1.0), changefreq hints how often
// the content moves.
const staticPages = [
  { url: '/',                          priority: '1.0',  changefreq: 'daily',   lastmod: '2026-08-07' },
  { url: '/latest-news',               priority: '0.9',  changefreq: 'hourly',  lastmod: '2026-08-07' },
  { url: '/breaking',                  priority: '0.8',  changefreq: 'hourly',  lastmod: '2026-08-07' },
  { url: '/live',                      priority: '0.7',  changefreq: 'hourly',  lastmod: '2026-08-07' },
  { url: '/videos',                    priority: '0.8',  changefreq: 'daily',   lastmod: '2026-08-07' },
  { url: '/videos/shows',              priority: '0.7',  changefreq: 'weekly',  lastmod: '2026-08-07' },
  { url: '/programs',                  priority: '0.8',  changefreq: 'weekly',  lastmod: '2026-08-07' },
  { url: '/shelf',                     priority: '0.8',  changefreq: 'weekly',  lastmod: '2026-08-07' },
  { url: '/magazine',                   priority: '0.8',  changefreq: 'weekly',  lastmod: '2026-08-07' },
  { url: '/magazine/ayodhya-ram-mandir-donation-scam-329589', priority: '0.6', changefreq: 'monthly', lastmod: '2026-07-08' },
  { url: '/magazine/voters-list-and-passport-328638', priority: '0.6', changefreq: 'monthly', lastmod: '2026-06-29' },
  { url: '/magazine/mediascan-latest-issue-328205', priority: '0.6', changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/magazine/article-ksrtc-free-travel-326957', priority: '0.6', changefreq: 'monthly', lastmod: '2026-06-13' },
  { url: '/magazine/cockroach-janta-political-partys-rise-reflects-youth-anger-in-india-325709', priority: '0.6', changefreq: 'monthly', lastmod: '2026-06-02' },
  { url: '/magazine/buddha-purnima-analysis-322500', priority: '0.6', changefreq: 'monthly', lastmod: '2026-05-01' },
  { url: '/food-map',                  priority: '0.5',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/travel',                    priority: '0.7',  changefreq: 'weekly',  lastmod: '2026-08-07' },
  { url: '/about-us',                  priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/contact-us',                priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/our-team',                  priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/investor-care',             priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/privacy-policy',            priority: '0.2',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/terms-and-conditions',      priority: '0.2',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/sitemap',                   priority: '0.3',  changefreq: 'monthly', lastmod: '2026-08-12' },
  { url: '/player-lab',                priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/tech',                      priority: '0.5',  changefreq: 'weekly',  lastmod: '2026-06-25' },

  // Home variants (layout experiments)
  { url: '/home/modular',              priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/magazine',             priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/ideal',                priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/nyt',                  priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/guardian',             priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/bbc',                  priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/bbc-3col',             priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/aljazeera',            priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/home/sky',                  priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },

  // Features
  { url: '/features/kerala-floods-2018',   priority: '0.5', changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/features/rivers-of-kerala',     priority: '0.5', changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/features/thamarassery-churam',  priority: '0.5', changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/features/wayanad-slide',        priority: '0.5', changefreq: 'monthly', lastmod: '2026-06-25' },

  // Design system
  { url: '/design',                     priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/archive',             priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/components',          priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design',                      priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/kitchen',             priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/layout',              priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/system',              priority: '0.4',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/design/terrain-journey',     priority: '0.3',  changefreq: 'monthly', lastmod: '2026-06-25' },

  // Archived
  { url: '/old-home',                   priority: '0.2',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/old-latest-news',            priority: '0.2',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/old-shelf',                  priority: '0.2',  changefreq: 'monthly', lastmod: '2026-06-25' },

  // Dev / scaffolding
  { url: '/alt',                        priority: '0.1',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/blah',                       priority: '0.1',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/new',                        priority: '0.1',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/slide',                      priority: '0.1',  changefreq: 'monthly', lastmod: '2026-06-25' },
  { url: '/v3',                         priority: '0.1',  changefreq: 'monthly', lastmod: '2026-06-25' },
];

// Collect dynamic URLs from data sources.

// Section desks (from sections registry).
const sectionPages = sections
  .filter((s) => !['tech'].includes(s.id)) // tech is bespoke
  .map((s) => ({ url: `/${s.id}`, priority: '0.8', changefreq: 'daily', lastmod: '2026-08-07' }));

// Sub-section desks (from shared route).
const subPages = subDeskPaths().map(({ section, sub }) => ({
  url: `/${section}/${sub}`,
  priority: '0.6',
  changefreq: 'daily',
  lastmod: '2026-08-07',
}));

// Gulf countries (hand-built route).
const gulfCountries = ['uae', 'saudi-arabia', 'qatar', 'bahrain', 'kuwait', 'oman'];
const gulfPages = gulfCountries.map((c) => ({
  url: `/gulf/${c}`,
  priority: '0.6',
  changefreq: 'daily',
  lastmod: '2026-08-07',
}));

// Trek pages.
const trekPages = treks.map((t) => ({
  url: `/travel/${t.slug}`,
  priority: '0.6',
  changefreq: 'monthly',
  lastmod: '2026-06-25',
}));

// Video watch pages.
const videoPages = shows.flatMap((s) => s.episodes).map((ep) => ({
  url: `/videos/watch/${ep.slug}`,
  priority: '0.5',
  changefreq: 'weekly',
  lastmod: '2026-06-25',
}));

// Show pages.
const showPages = shows.map((s) => ({
  url: `/videos/shows/${s.slug}`,
  priority: '0.6',
  changefreq: 'weekly',
  lastmod: '2026-08-07',
}));

// Program pages.
const programPages = programs.map((p) => ({
  url: `/programs/${p.slug}`,
  priority: '0.7',
  changefreq: 'weekly',
  lastmod: '2026-08-07',
}));

// Story pages (from sections data).
const storySlugs = new Set<string>();
const storyPages: { url: string; priority: string; changefreq: string; lastmod: string }[] = [];
for (const s of sections) {
  for (const a of s.articles) {
    const slug = a.href.replace('/story/', '');
    if (!storySlugs.has(slug)) {
      storySlugs.add(slug);
      storyPages.push({
        url: `/story/${slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: '2026-06-25',
      });
    }
  }
}

// Shelf article pages.
const shelfArticlePages = allShelfArticles.map((a) => ({
  url: `/shelf/${a.slug}`,
  priority: '0.5',
  changefreq: 'monthly',
  lastmod: '2026-06-25',
}));

// Shelf category pages.
const shelfCategoryPages = allShelfSections.map((s) => ({
  url: s.href.replace('/mediaone-shelf', '/shelf'),
  priority: '0.5',
  changefreq: 'weekly',
  lastmod: '2026-06-25',
}));

// Old-section archive pages.
const oldSectionPages = sections.map((s) => ({
  url: `/old-section/${s.id}`,
  priority: '0.2',
  changefreq: 'monthly',
  lastmod: '2026-06-25',
}));

// Deduplicate all URLs.
const seen = new Set<string>();
const allPages: { url: string; priority: string; changefreq: string; lastmod: string }[] = [];

const add = (page: { url: string; priority: string; changefreq: string; lastmod: string }) => {
  if (!seen.has(page.url)) {
    seen.add(page.url);
    allPages.push(page);
  }
};

for (const p of staticPages) add(p);
for (const p of sectionPages) add(p);
for (const p of subPages) add(p);
for (const p of gulfPages) add(p);
for (const p of trekPages) add(p);
for (const p of videoPages) add(p);
for (const p of showPages) add(p);
for (const p of programPages) add(p);
for (const p of storyPages) add(p);
for (const p of shelfArticlePages) add(p);
for (const p of shelfCategoryPages) add(p);
for (const p of oldSectionPages) add(p);

// Build the XML.
const urlEntries = allPages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n');

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

export const GET = async () => {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
