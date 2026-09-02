// ── The article document model ───────────────────────────────────────────────
// The "Artical Page v6" wireframe (mone.pen) is a *content* spec, not a layout
// spec: a story is a headline, a dek, a byline, a hero, and then an ordered run
// of blocks — paragraphs interrupted by read-alsos, ads, images and video. Four
// page layouts render that same run differently, so the model lives here and
// the layouts stay presentational.

import { getArticleImage } from './images';

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'subhead'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'highlights'; title?: string; items: string[] }
  | { type: 'readAlso'; title: string; href: string; image?: string }
  | { type: 'ad'; format?: 'leaderboard' | 'rectangle'; slot?: string }
  | { type: 'image'; src?: string; caption?: string; ratio?: string }
  | { type: 'video'; title: string; src?: string; duration?: string };

export interface RailStory {
  title: string;
  href: string;
  image?: string;
  date?: string;
  category?: string;
}

export interface SponsoredItem {
  label: string;
  title: string;
  href: string;
  image?: string;
  date?: string;
}

export interface ArticleDoc {
  section: string;
  sectionML: string;
  sectionHref: string;
  badge?: string;
  title: string;
  dek: string;
  image: string;
  caption: string;
  author: { name: string; role?: string; avatar?: string };
  published: string;
  updated?: string;
  blocks: ArticleBlock[];
  tags: string[];
  readMore: RailStory[];
  sponsored: SponsoredItem;
  video: { title: string; image?: string; duration: string };
  /** The paid-content notice that closes the wireframe. */
  disclaimer: string;
}

// ── Copy ─────────────────────────────────────────────────────────────────────
// Verbatim from the wireframe, so the layouts are judged on the same measure,
// the same line counts and the same Malayalam conjunct density as the design.

const P = {
  lead: 'കോൺഗ്രസിന്‍റെ നിയമസഭാ തെരഞ്ഞെടുപ്പ് നീക്കങ്ങളിൽ സജീവമായി എ കെ ആന്‍റണി ഉണ്ടാകും. പ്രചാരണത്തിന് നേതൃത്വം നൽകിയേക്കും. സീറ്റ് വിഭജനം മാനദണ്ഡങ്ങൾ തകർത്തുള്ള ഗ്രൂപ്പ് വീതം വെപ്പ് ആകരുതെന്ന നിർദേശം രാഹുൽ ഗാന്ധി നൽകിയിട്ടുണ്ട്. ഇരട്ട പദവി വഹിക്കുന്ന അധ്യക്ഷൻമാരുള്ള ഡിസിസികളിൽ മാത്രമാണ് അഴിച്ചു പണി.',
  committee: 'തെരഞ്ഞെടുപ്പ് മേൽനോട്ട സമിതി ചെയർമാനായി ഉമ്മൻചാണ്ടിയെ നിയമിക്കുന്നത് കേരളത്തിലെ പ്രത്യേക സാഹചര്യം പരിഗണിച്ചാണെന്നാണ് വിശദീകരണം. ഇത് സംബന്ധിച്ച ഔദ്യോഗിക പ്രഖ്യാപനം ഹൈക്കമാന്‍ഡ് ഇന്ന് നടത്തും. അതോടൊപ്പം എ കെ ആന്‍റണിയെ കൂടി രംഗത്ത് ഇറക്കുകയാണ് ഹൈക്കമാൻഡ്. കൂട്ടായ നേതൃത്വത്തിലൂടെ ഭരണം പിടിക്കുകയാണ് ലക്ഷ്യം. തെരഞ്ഞെടുപ്പ് പ്രക്രിയകളിൽ ഹൈക്കമാന്‍ഡ് ഇടപെടൽ ഉറപ്പാക്കാനുമാകും. പ്രചാരണത്തിന്‍റെ അവസാന ഒരു മാസം കേരളത്തിൽ ആന്‍റണി സജീവമായുണ്ടാകും.',
  seats: 'സ്ഥാനാർഥി നിർണയം ഗ്രൂപ്പ് വീതം വെപ്പ് ആകാതെ മാനദണ്ഡങ്ങൾ പാലിച്ചാകണമെന്നാണ് രാഹുൽ ഗാന്ധി നൽകിയ നിർദേശം. നേതാക്കളുടെ പിന്തുണ ഇല്ലാത്തവരെ വെട്ടുന്ന അവസ്ഥ പാടില്ല. പൊതുസമ്മതരായ പുതുമുഖങ്ങളെ കൊണ്ടുവരാം. പാര്‍ലമെന്‍റ് സമ്മേളനത്തിനിടെ കേരള എംപിമാരുമായി രാഹുൽ ഗാന്ധി ചർച്ച നടത്തും.',
  observers: 'കേന്ദ്ര നിരീക്ഷകർ സംസ്ഥാനത്ത് എത്തുന്നതോടെ പ്രചാരണ തന്ത്രങ്ങളിൽ പ്രാഥമിക ചർച്ചകൾക്ക് തുടക്കമിടും. ഡിസിസികളിൽ വിപുലമായ അഴിച്ചുപണി വേണ്ടെന്നും ഹൈക്കമാൻഡ് തീരുമാനിച്ചു. ഇരട്ട പദവി വഹിക്കുന്ന എറണാകുളം, വയനാട്, പാലക്കാട് അധ്യക്ഷന്മാരെ മാറ്റും.',
  reaction: 'സർക്കാർ നടപടിക്കെതിരെ പ്രതിപക്ഷ നേതാക്കൾ രംഗത്തെത്തി. തെരഞ്ഞെടുപ്പ് അടുത്ത ഘട്ടത്തിൽ വിഷയം സജീവമായി ഉയർത്തുമെന്നാണ് സൂചന. ബന്ധപ്പെട്ട രേഖകൾ പരിശോധിച്ച ശേഷമാകും തുടർ നടപടികൾ.',
};

export const article: ArticleDoc = {
  section: 'Kerala',
  sectionML: 'കേരളം',
  sectionHref: '/kerala',
  badge: 'Exclusive',
  title: 'സോളാര്‍ കേസുകള്‍ സി.ബി.ഐയ്ക്ക് വിട്ടത് തെരഞ്ഞെടുപ്പ് സ്റ്റണ്ടെന്ന് ചെന്നിത്തല; സര്‍ക്കാര്‍ നടപടിക്കെതിരെ കോണ്‍ഗ്രസ് നേതാക്കള്‍',
  dek: 'കോൺഗ്രസിന്‍റെ നിയമസഭാ തെരഞ്ഞെടുപ്പ് നീക്കങ്ങളിൽ സജീവമായി എ കെ ആന്‍റണി ഉണ്ടാകും. പ്രചാരണത്തിന് നേതൃത്വം നൽകിയേക്കും.',
  image: getArticleImage('hero'),
  caption: 'പ്രചാരണത്തിന്‍റെ അവസാന ഒരു മാസം കേരളത്തിൽ ആന്‍റണി സജീവമായുണ്ടാകും. · MediaOne',
  author: { name: 'Web Desk', role: 'MediaOne Newsroom' },
  published: '24 Dec, 2020 at 04:12 PM',
  updated: '24 Dec, 2020 at 04:29 PM',
  tags: ['US Israel War on Iran', 'Donald Trump', 'Iran'],
  disclaimer:
    'ഇത് പരസ്യ ഫീച്ചറാണ്. മീഡിയവൺ ഈ പരസ്യത്തിലെ അവകാശവാദങ്ങളെ ഏറ്റെടുക്കുന്നില്ല. പരസ്യത്തിൽ ഉന്നയിക്കുന്ന അവകാശവാദങ്ങൾക്ക് ഉപോദ്ബലകമായ വസ്തുതകൾ പരസ്യദാതാക്കളുമായി ബന്ധപ്പെട്ട് പരിശോധിച്ചു ബോധ്യപ്പെട്ട ശേഷം മാത്രം ഇടപാടുകൾ നടത്തുക. പരാതികൾ ഉണ്ടെങ്കിൽ ഇവിടെ രേഖപ്പെടുത്താവുന്നതാണ്. (feedback@mediaoneonline.com)',

  blocks: [
    { type: 'p', text: P.lead },
    { type: 'p', text: P.committee },
    {
      type: 'readAlso',
      title: 'മന്ത്രിസഭ തീരുമാനം അംഗീകരിക്കുന്നതാണ് ജനാധിപത്യത്തിന്‍റെ അന്തസത്ത; ഗവർണറോട് ശ്രീരാമകൃഷ്ണൻ',
      href: '/story/kozhikode-bridge',
      image: getArticleImage('kl-2'),
    },
    { type: 'p', text: P.seats },
    { type: 'p', text: P.observers },
    { type: 'ad', format: 'rectangle', slot: 'story-inline-1' },
    {
      type: 'highlights',
      title: 'Story Highlights',
      items: [
        'എ കെ ആന്‍റണി പ്രചാരണത്തിന് നേതൃത്വം നൽകും',
        'സീറ്റ് വിഭജനത്തിൽ മാനദണ്ഡങ്ങൾ പാലിക്കണമെന്ന് രാഹുൽ ഗാന്ധി',
        'ഇരട്ട പദവിയുള്ള ഡിസിസി അധ്യക്ഷന്മാരെ മാറ്റും',
      ],
    },
    { type: 'p', text: P.committee },
    {
      type: 'quote',
      text: 'കൂട്ടായ നേതൃത്വത്തിലൂടെ ഭരണം പിടിക്കുകയാണ് ലക്ഷ്യം.',
      cite: 'ഹൈക്കമാൻഡ് വൃത്തങ്ങൾ',
    },
    { type: 'p', text: P.reaction },
    {
      type: 'image',
      src: getArticleImage('kl-4'),
      caption: 'കേന്ദ്ര നിരീക്ഷകർ സംസ്ഥാനത്ത് എത്തുന്നതോടെ പ്രാഥമിക ചർച്ചകൾക്ക് തുടക്കമിടും.',
      ratio: '16/9',
    },
    { type: 'subhead', text: 'തുടർ നടപടികൾ' },
    { type: 'p', text: P.seats },
    { type: 'ad', format: 'leaderboard', slot: 'story-inline-2' },
    { type: 'p', text: P.observers },
    {
      type: 'video',
      title: 'ചെന്നിത്തലയുടെ പ്രതികരണം | MediaOne News',
      src: getArticleImage('kl-5'),
      duration: '3:24',
    },
  ],

  readMore: [
    {
      title: 'അർണബിന്‍റെ ആ ചാറ്റുകളെ അവഗണിക്കരുത്',
      href: '/story/idukki-coffee',
      image: getArticleImage('kl-1'),
      date: '24 Dec, 2020',
      category: 'India',
    },
    {
      title: "'പഴഞ്ചൻ ബൂട്ടും കുറ്റിമീശയുമായി പുരുഷവേഷമണിഞ്ഞ സ്​ത്രീയായിരുന്നു",
      href: '/story/malappuram-career',
      image: getArticleImage('kl-3'),
      date: '24 Dec, 2020',
      category: 'Kerala',
    },
    {
      title: 'വാഹനങ്ങളിലെ കർട്ടൻ നീക്കാതെ മന്ത്രിമാരും ഉദ്യോഗസ്​ഥരും; കണ്ണടച്ച് അധികൃതർ',
      href: '/story/thrissur-temple',
      image: getArticleImage('kl-6'),
      date: '23 Dec, 2020',
      category: 'Kerala',
    },
    {
      title: 'പാലാ ഉപതെരഞ്ഞെടുപ്പ്: യു ഡി എഫ് സ്ഥാനാര്‍ഥി പ്രഖ്യാപനം നാളെ',
      href: '/story/pala-election',
      image: getArticleImage('pala'),
      date: '23 Dec, 2020',
      category: 'Kerala',
    },
    {
      title: 'കൊച്ചിയില്‍ മെട്രോ റെയില്‍ പദ്ധതി രണ്ടാം ഘട്ടത്തിന് അനുമതി',
      href: '/story/kochi-metro',
      image: getArticleImage('rain'),
      date: '22 Dec, 2020',
      category: 'Kerala',
    },
  ],

  sponsored: {
    label: 'Marketing Feature',
    title: 'നഴ്‌സിങ്ങിൽ അന്താരാഷ്ട്ര കരിയർ ആഗ്രഹിക്കുന്നവർക്കായി 9 വിദേശ രാജ്യങ്ങളിലെ നഴ്‌സിങ് പഠനത്തെക്കുറിച്ച്',
    href: '#',
    image: getArticleImage('hospital'),
    date: '24 Dec, 2020',
  },

  video: {
    title: 'MediaOne Live · കേരള രാഷ്ട്രീയം',
    image: getArticleImage('reshuffle-top'),
    duration: '12:08',
  },
};

/** Measured, not asserted: 200wpm over the words actually in the block run, so
 *  the figure moves when the copy does. */
export function readingTime(doc: ArticleDoc): number {
  const WORDS_PER_MINUTE = 200;
  const words = [
    doc.dek,
    ...doc.blocks.flatMap((b) =>
      b.type === 'p' || b.type === 'subhead' || b.type === 'quote'
        ? [b.text]
        : b.type === 'highlights'
          ? b.items
          : []
    ),
  ]
    .join(' ')
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

// ── The variant registry ─────────────────────────────────────────────────────
// Mirrors src/lib/home-layouts.ts: one entry per page under /article/<id>,
// with the one-line rationale the switcher shows on hover.

export interface ArticleLayout {
  id: string;
  label: string;
  signature: string;
}

export const articleLayouts: ArticleLayout[] = [
  {
    id: 'classic',
    label: 'Classic',
    signature: 'The wireframe as drawn — tool rail, reading column, sponsor rail, inline ad breaks',
  },
  {
    id: 'focus',
    label: 'Focus',
    signature: 'One centred measure, rails deferred to the end — the least chrome per paragraph',
  },
  {
    id: 'ready',
    label: 'Ready',
    signature: "Focus's centred measure inside Classic's frame — the rails carry the commerce so the prose stays clean",
  },
  {
    id: 'immersive',
    label: 'Immersive',
    signature: 'Full-bleed hero carrying the headline, then the narrow measure beneath',
  },
  {
    id: 'magazine',
    label: 'Magazine',
    signature: 'Asymmetric opener — headline beside the art, dropped cap, marginal notes',
  },
];

export const defaultArticleLayout = articleLayouts[0].id;
