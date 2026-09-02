import { allVideos, SAMPLE_YOUTUBE_IDS } from './videos';
import {
  formatDuration,
  formatPublishDate,
  formatViews,
  getRealEpisodes,
  programFeeds,
} from './program-episodes';
import { catalogueProgram, catalogueProgams } from './program-catalogue';

export interface Program {
  slug: string;
  title: string;
  titleML: string;
  category: 'tv' | 'digital';
  description: string;
  schedule?: string;
  thumbnail: string;
  host?: string;
  hostTitle?: string;
  /** ISO 8601 — when this programme last published, from the catalogue. */
  lastPublishedAt?: string;
}

export interface ProgramEpisode {
  slug: string;
  title: string;
  youtubeId: string;
  duration: string;
  publishDate: string;
  views: string;
  seed: string;          // DummyImage poster seed
  thumbnailUrl?: string; // real poster frame of the video that plays (playlist size)
  posterUrl?: string;    // same frame at player size
}

const authoredPrograms: Program[] = [
  // TV Shows
  {
    slug: 'special-edition',
    title: 'Special Edition',
    titleML: 'സ്പെഷ്യൽ എഡിഷൻ',
    category: 'tv',
    description: 'പ്രധാന ദേശീയ-അന്താരാഷ്ട്ര വിഷയങ്ങളിൽ മീഡിയവൺ നടത്തുന്ന വിശദമായ പ്രത്യേക അവതരണം.',
    schedule: 'Special telecast',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp',
  },
  {
    slug: 'news-at-1',
    title: 'News @ 1',
    titleML: 'ന്യൂസ് @ 1',
    category: 'tv',
    description: 'ഉച്ചകഴിഞ്ഞ് ഒരു മണിക്ക് പ്രസാരം ചെയ്യുന്ന മുഴുവൻ വാർത്തകളുടെയും സമഗ്ര സమാഹാരം.',
    schedule: 'Daily, 1:00 PM',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp',
  },
  {
    slug: 'mid-east-hour',
    title: 'Mid East Hour',
    titleML: 'മിഡ് ഈസ്റ്റ് അവർ',
    category: 'tv',
    description: 'ഗൾഫ് രാജ്യങ്ങളിലെ വാർത്തകൾ, പ്രവാസി ജീവിതം, നിയമങ്ങൾ എന്നിവയിൽ കേന്ദ്രീകരിച്ച പരിപാടി.',
    schedule: 'Daily',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp',
  },
  {
    slug: 'media-scan',
    title: 'Media Scan',
    titleML: 'മീഡിയ സ്കാൻ',
    category: 'tv',
    description: 'മാധ്യമ ലോകത്തെ പ്രധാന സംഭവങ്ങളും വിശകലനങ്ങളും അവതരിപ്പിക്കുന്ന പരിപാടി.',
    schedule: 'Daily',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp',
  },
  {
    slug: 'nilapadu',
    title: 'Nilapadu',
    titleML: 'നിലപാട്',
    category: 'tv',
    description: 'സാമൂഹിക-രാഷ്ട്രീയ വിഷയങ്ങളിൽ സമഗ്രമായ ചർച്ചകളും നിലപാടുകളും അവതരിപ്പിക്കുന്നു.',
    schedule: 'Weekdays',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp',
  },
  {
    slug: 'saudi-story',
    title: 'Saudi Story',
    titleML: 'സൗദി സ്റ്റോറി',
    category: 'tv',
    description: 'സൗദി അറേബ്യയിലെ വാർത്തകൾ, സംസ്കാരം, പ്രവാസി ജീവിതം എന്നിവ ആവരണം ചെയ്യുന്നു.',
    schedule: 'Weekly',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp',
  },
  {
    slug: 'weekend-arabia',
    title: 'Weekend Arabia',
    titleML: 'വീക്കൻഡ് അറേബ്യ',
    category: 'tv',
    description: 'വാരാന്ത്യങ്ങളിൽ ഗൾഫിലെ വിനോദ-സാംസ്കാരിക വാർത്തകൾ അവതരിപ്പിക്കുന്നു.',
    schedule: 'Weekends',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp',
  },
  {
    slug: 'world-with-us',
    title: 'World With Us',
    titleML: 'വേൾഡ് വിത്ത് അസ്',
    category: 'tv',
    description: 'അന്താരാഷ്ട്ര വിഷയങ്ങളിൽ ആഴത്തിലുള്ള റിപ്പോർട്ടിംഗും വിശകലനവും.',
    schedule: 'Weekly',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557623-untitled-1-recovered.webp',
  },
  {
    slug: 'stethoscope',
    title: 'Stethoscope',
    titleML: 'സ്റ്റെതസ്കോപ്പ്',
    category: 'tv',
    description: 'ആരോഗ്യ വിഷയങ്ങൾ, രോഗപ്രതിരോധം, മെഡിക്കൽ പുതുമകൾ എന്നിവ അവതരിപ്പിക്കുന്നു.',
    schedule: 'Weekly',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp',
  },
  // Digital Shows
  {
    slug: 'out-of-focus',
    title: 'Out Of Focus',
    titleML: 'ഔട്ട് ഓഫ് ഫോക്കസ്',
    category: 'digital',
    description: 'മുഖ്യധാരയിൽ നിന്ന് വ്യത്യസ്തമായ കോണുകളിൽ നിന്നുള്ള വിശകലനങ്ങൾ.',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp',
  },
  {
    slug: 'editorstake',
    title: "Editor's Take",
    titleML: 'എഡിറ്റേഴ്സ് ടേക്ക്',
    category: 'digital',
    description: 'മീഡിയവൺ പത്രാധിപരുടെ പ്രത്യേക വിലയിരുത്തൽ.',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp',
  },
  {
    slug: 'ajimshow',
    title: 'AjimShow',
    titleML: 'അജിംഷോ',
    category: 'digital',
    description: 'സാമൂഹിക-രാഷ്ട്രീയ വിഷയങ്ങളിൽ ആഴത്തിലുള്ള ചർച്ചകൾ.',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp',
  },
  {
    slug: 'deshantharam',
    title: 'Deshantharam',
    titleML: 'ദേശാന്തരം',
    category: 'digital',
    description: 'ഭൂമി-ഭരണം-ജനങ്ങൾ എന്നിവയിൽ കേന്ദ്രീകരിച്ച പരിപാടി.',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp',
  },
  {
    slug: 'film-interview',
    title: 'Film Interview',
    titleML: 'ഫിലിം അഭിമുഖം',
    category: 'digital',
    description: 'സിനിമാ-സംസ്കാര രംഗത്തെ പ്രമുഖരുമായി നടത്തുന്ന അഭിമുഖങ്ങൾ.',
    thumbnail: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp',
  },
];

// Merge the authored entries with the catalogue. The catalogue is real — it is
// swept from the live site — so it wins on identity, poster and recency. The
// authored record keeps what the site does not publish: the Malayalam blurb,
// the schedule and the presenter. Programmes are ordered freshest first, the
// order the catalogue already stores them in.
//
// A programme in the catalogue but not authored here still appears, using the
// catalogue's own title, so a newly discovered show is never silently dropped.
const authoredBySlug = new Map(authoredPrograms.map((p) => [p.slug, p]));

export const programs: Program[] = catalogueProgams.map((c) => {
  const authored = authoredBySlug.get(c.slug);
  const feed = programFeeds[c.slug];
  return {
    ...authored,
    slug: c.slug,
    title: c.title,
    titleML: c.titleML || authored?.titleML || '',
    category: c.group,
    description: authored?.description ?? '',
    // The newest real episode's frame, from the deep feed when there is one and
    // the catalogue otherwise — either way, a frame from a video in the playlist.
    thumbnail: (feed?.episodes[0]?.thumbnail ?? c.poster).site,
    lastPublishedAt: c.lastPublishedAt,
  };
});

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getProgramsByCategory(category: 'tv' | 'digital'): Program[] {
  return programs.filter((p) => p.category === category);
}

// Presenter pool — used to give host-less programs a stable, plausible anchor
// so the show-viewer's "About" panel is always informative.
const PRESENTERS: { name: string; title: string }[] = [
  { name: 'Sabu Joseph', title: 'Executive Editor' },
  { name: 'Renu Prasad', title: 'Anchor' },
  { name: 'George Abraham', title: 'Political Editor' },
  { name: 'Shihabuddin P.', title: 'Gulf Correspondent' },
  { name: 'Dr. Sosamma Isaac', title: 'Senior Editor' },
  { name: 'Sreejith Nair', title: 'Special Correspondent' },
];

export function getProgramHost(program: Program): { name: string; title: string } {
  if (program.host) return { name: program.host, title: program.hostTitle || 'Presenter' };
  return PRESENTERS[hashString(program.slug) % PRESENTERS.length];
}

// Deterministic string hash (stable across builds) for seeding playlists.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Build a per-programme episode playlist, in three tiers.
//
//   1. A deep feed (src/data/programs/episodes/<slug>.json) — every episode the
//      listing carries. Best, but one file per programme to maintain.
//   2. The catalogue's recent episodes — a handful per programme, swept across
//      the whole slate. Real, just shallower.
//   3. A synthesized playlist, for a programme in neither. Rather than
//      hand-authoring episodes, draw Malayalam titles from the shared
//      `allVideos` pool (reuse, not duplication) so the show viewer has
//      plausible content. Same slug → same playlist every build.
//
// `count` caps the playlist. Left undefined it means "everything real we have"
// for tiers 1–2 and DEFAULT_EPISODE_COUNT for tier 3, so a programme page shows
// every real episode without inflating the synthesized ones.
const DEFAULT_EPISODE_COUNT = 8;

export function getProgramEpisodes(program: Program, count?: number): ProgramEpisode[] {
  const real = getRealEpisodes(program.slug) ?? catalogueEpisodesAsPlaylist(program.slug);
  if (real?.length) return count ? real.slice(0, count) : real;

  return synthesizeEpisodes(program, count ?? DEFAULT_EPISODE_COUNT);
}

/** The catalogue's recent episodes in the playlist shape the show viewer wants. */
function catalogueEpisodesAsPlaylist(slug: string): ProgramEpisode[] | undefined {
  return catalogueProgram(slug)?.recentEpisodes.map((ep) => ({
    slug: ep.slug,
    title: ep.title,
    youtubeId: ep.youtubeId,
    duration: formatDuration(ep.durationSeconds),
    publishDate: formatPublishDate(ep.publishedAt),
    views: formatViews(ep.viewCount),
    seed: ep.youtubeId,
    thumbnailUrl: ep.thumbnail.small,
    posterUrl: ep.thumbnail.large,
  }));
}

function synthesizeEpisodes(program: Program, count: number): ProgramEpisode[] {
  const base = hashString(program.slug);
  const durations = ['12:40', '18:05', '22:30', '9:14', '27:52', '15:20', '31:08', '7:45'];
  const views = ['1.2L', '86K', '2.4L', '54K', '99K', '3.1L', '42K', '1.8L'];
  const dates = [
    'Jun 12, 2026', 'Jun 8, 2026', 'Jun 3, 2026', 'May 28, 2026',
    'May 22, 2026', 'May 15, 2026', 'May 9, 2026', 'May 2, 2026',
  ];

  return Array.from({ length: count }, (_, i) => {
    const pick = allVideos[(base + i * 7) % allVideos.length];
    // Play the drawn video itself rather than a sample clip, so the title, the
    // poster frame and what actually plays are the same MediaOne upload.
    return {
      slug: `${program.slug}-ep-${count - i}`,
      title: pick.title,
      youtubeId: pick.youtubeId ?? SAMPLE_YOUTUBE_IDS[(base + i) % SAMPLE_YOUTUBE_IDS.length],
      duration: durations[i % durations.length],
      publishDate: dates[i % dates.length],
      views: views[(base + i) % views.length],
      seed: `${program.slug}-${i}`,
      thumbnailUrl: pick.thumbnailUrl,
    };
  });
}
