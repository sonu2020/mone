import shelfData from './shelf-data.json';

export interface ShelfArticle {
  slug: string;
  title: string;
  category: string;
  shelfCategory?: string;
  author: string;
  authorSlug: string;
  image: string;
  href: string;
  date: string;
}

export interface ShelfSection {
  id: string;
  title: string;
  titleML: string;
  href: string;
  articles: ShelfArticle[];
}

export const shelfMeta = shelfData.meta;
export const shelfNavigation = shelfData.navigation;
export const shelfFeatured = shelfData.featured as ShelfArticle[];
export const shelfSections = shelfData.sections as ShelfSection[];

export const allShelfArticles: ShelfArticle[] = shelfSections.flatMap((s) => s.articles);

// Ensure every category referenced in navigation has a section page, even if empty
const extraShelfSections: ShelfSection[] = [
  { id: 'podcast', title: 'Podcast', titleML: 'പോഡ്‌കാസ്റ്റ്', href: '/shelf/podcast', articles: [] },
  { id: 'videos', title: 'Videos', titleML: 'വീഡിയോകൾ', href: '/shelf/videos', articles: [] },
];

export const allShelfSections: ShelfSection[] = [
  ...shelfSections,
  ...extraShelfSections.filter((e) => !shelfSections.some((s) => s.id === e.id)),
];

export function getShelfArticle(slug: string): ShelfArticle | undefined {
  return allShelfArticles.find((a) => a.slug === slug);
}

export function getRelatedShelfArticles(slug: string, limit = 4): ShelfArticle[] {
  const article = getShelfArticle(slug);
  if (!article) return [];
  return allShelfArticles
    .filter((a) => a.slug !== slug && a.shelfCategory === article.shelfCategory)
    .slice(0, limit);
}

export function getArticlesByCategory(categoryId: string): ShelfArticle[] {
  const section = shelfSections.find((s) => s.id === categoryId);
  return section?.articles ?? [];
}

// The five collections with a dedicated layout (see ShelfCollection), in the
// spine order the contents page walks them. A collection outside this list
// falls back to a plain index of rows. Shared here so the contents page and
// each collection's own page number themselves identically.
export const SHELF_COLLECTION_ORDER = [
  'analysis',
  'interview',
  'column',
  'art-and-literature',
  'life-story',
] as const;

export const SHELF_COLLECTION_NOTES: Record<string, string> = {
  analysis: 'The argument, at length.',
  interview: 'Conversations, in full.',
  column: 'Regular voices.',
  'art-and-literature': 'Criticism, art and the written word.',
  'life-story': 'Lives, told at their own pace.',
};

/** 1-based spine position for a collection — the ordinal shown as 01, 02 …
 *  Undefined for a collection outside the five with a dedicated layout. */
export function shelfCollectionIndex(id: string): number | undefined {
  const i = SHELF_COLLECTION_ORDER.indexOf(id as (typeof SHELF_COLLECTION_ORDER)[number]);
  return i === -1 ? undefined : i + 1;
}
