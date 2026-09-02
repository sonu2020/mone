// ─── Types ──────────────────────────────────────────────────────────────────

export interface Episode {
  slug: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  views?: string;
}

export interface Show {
  slug: string;
  title: string;
  titleML: string;
  description: string;
  descriptionML: string;
  category: string;
  image: string;
  host?: string;
  hostTitle?: string;
  schedule?: string;
  episodeCount: number;
  episodes: Episode[];
}

export interface Video {
  slug: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
  publishDate: string;
  thumbnail: string;
  views: string;
  showSlug?: string;
  isFeatured?: boolean;
  youtubeId?: string;      // real YouTube video id — enables native YouTube embeds
  thumbnailUrl?: string;   // real poster image URL (YouTube thumbnail) when available
  publishTime?: string;    // IST clock, for anything published today
}

/**
 * The day this prototype is pinned to. The YouTube set was captured from the
 * live site on 2 Aug 2026, so "today" is a fixed date here rather than a call
 * to Date — a static build has no other honest answer, and a real CMS would
 * supply the timestamp.
 */
export const TODAY = 'Aug 3, 2026';

/** Published today, newest first. */
export function todaysVideos(): Video[] {
  return allVideos
    .filter((v) => v.publishDate === TODAY)
    .sort((a, b) => (b.publishTime ?? '').localeCompare(a.publishTime ?? ''));
}

// YouTube thumbnail URL for a video id. `hqdefault` is universally available
// (every upload has it) and renders clean 16:9 under object-cover cropping.
export function ytThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// ─── Shows ──────────────────────────────────────────────────────────────────

export const shows: Show[] = [
  {
    slug: 'face-to-face',
    title: 'Face to Face',
    titleML: 'ഫേസ് ടു ഫേസ്',
    description: 'In-depth one-on-one interviews with newsmakers, politicians, and cultural leaders. Hosted by seasoned journalists who ask the tough questions.',
    descriptionML: 'വാര്‍ത്തകളിലെ മുഖ്യ കഥാപാത്രങ്ങളുമായി നേരിട്ടുള്ള അഭിമുഖങ്ങള്‍. രാഷ്ട്രീയ-സാംസ്കാരിക രംഗത്തെ പ്രമുഖരുമായി സംവാദം.',
    category: 'Interview',
    image: 'face-to-face',
    host: 'Dr. Sosamma Isaac',
    hostTitle: 'Senior Editor',
    schedule: 'Every Friday 8:30 PM',
    episodeCount: 48,
    episodes: [
      { slug: 'ftf-sabu-joseph', title: 'സാബു ജോസഫുമായി മുഖാമുഖം | വിമർശനങ്ങളും പ്രതികരണങ്ങളും', description: 'വിവാദ പരാമർശങ്ങളിൽ നിറഞ്ഞ അഭിമുഖം', duration: '28:45', publishDate: 'June 10, 2026', thumbnail: 'ftf-1', views: '1.2L' },
      { slug: 'ftf-mohanlal', title: 'മോഹൻലാൽ പറയുന്നു | സിനിമയും ജീവിതവും', description: 'മോഹൻലാലുമായി വിശേഷ അഭിമുഖം', duration: '32:10', publishDate: 'June 3, 2026', thumbnail: 'ftf-2', views: '3.8L' },
      { slug: 'ftf-pinarayi', title: 'മുഖ്യമന്ത്രിയുമായി പ്രത്യേക അഭിമുഖം | ഭരണത്തിന്റെ കണക്ക്', description: 'മുഖ്യമന്ത്രി പിണറായി വിജയനുമായി പ്രത്യേക അഭിമുഖം', duration: '42:15', publishDate: 'May 27, 2026', thumbnail: 'ftf-3', views: '5.6L' },
      { slug: 'ftf-kk-shailaja', title: 'കെ.കെ. ശൈലജ ടീച്ചർ | ആരോഗ്യ രംഗത്തെ വെല്ലുവിളികൾ', description: 'മുൻ ആരോഗ്യ മന്ത്രിയുമായി അഭിമുഖം', duration: '30:20', publishDate: 'May 20, 2026', thumbnail: 'ftf-4', views: '2.1L' },
      { slug: 'ftf-mammootty', title: 'മമ്മൂട്ടി: ഒരു അഭിനേതാവിന്റെ ഓർമ്മക്കുറിപ്പുകൾ', description: 'മമ്മൂട്ടിയുമായി അഭിമുഖം', duration: '35:00', publishDate: 'May 13, 2026', thumbnail: 'ftf-5', views: '4.2L' },
      { slug: 'ftf-vs-achuthanandan', title: 'വി.എസ്സുമായി രാഷ്ട്രീയ ഭാഷ്യം | പഴയ ഓർമ്മകൾ', description: 'വി.എസ്. അച്യുതാനന്ദനുമായി അഭിമുഖം', duration: '38:30', publishDate: 'May 6, 2026', thumbnail: 'ftf-6', views: '3.4L' },
    ],
  },
  {
    slug: 'life-story',
    title: 'Life Story',
    titleML: 'ലൈഫ് സ്റ്റോറി',
    description: 'Extraordinary life journeys of ordinary people. Inspiring stories of struggle, perseverance, and triumph against all odds.',
    descriptionML: 'സാധാരണക്കാരുടെ അസാധാരണ ജീവിത കഥകൾ. പ്രതിസന്ധികളെ അതിജീവിച്ച വ്യക്തികളുടെ പ്രചോദനപരമായ യാത്രകൾ.',
    category: 'Documentary',
    image: 'life-story',
    host: 'Renu Prasad',
    hostTitle: 'Feature Producer',
    schedule: 'Every Saturday 7:00 PM',
    episodeCount: 36,
    episodes: [
      { slug: 'ls-kannur-handloom', title: 'കണ്ണൂരിലെ തറിയുടെ കഥ | നെയ്ത്ത് കലാകാരന്റെ ജീവിതം', description: 'കണ്ണൂരിലെ പരമ്പരാഗത നെയ്ത്ത് കലാകാരന്റെ ജീവിതം', duration: '22:30', publishDate: 'June 6, 2026', thumbnail: 'ls-1', views: '85K' },
      { slug: 'ls-old-age-home', title: 'വാർധക്യത്തിന്റെ നിശബ്ദ രോദനം | വൃദ്ധ സദനത്തിനുള്ളിൽ', description: 'വൃദ്ധ സദനത്തിനുള്ളിലെ ജീവിതം', duration: '26:15', publishDate: 'May 30, 2026', thumbnail: 'ls-2', views: '1.1L' },
      { slug: 'ls-fisherman-kochi', title: 'ഒരു മുക്കുവന്റെ കടൽ യാത്ര | കൊച്ചിയിലെ മത്സ്യത്തൊഴിലാളി', description: 'കൊച്ചിയിലെ ഒരു മത്സ്യത്തൊഴിലാളിയുടെ ജീവിതം', duration: '24:40', publishDate: 'May 23, 2026', thumbnail: 'ls-3', views: '72K' },
      { slug: 'ls-blind-musician', title: 'കണ്ണില്ലാതെയും സംഗീതം കൊണ്ട് ലോകം കീഴടക്കിയ യുവാവ്', description: 'അന്ധനായ ഒരു യുവ സംഗീതജ്ഞന്റെ കഥ', duration: '28:00', publishDate: 'May 16, 2026', thumbnail: 'ls-4', views: '1.8L' },
      { slug: 'ls-wayanad-tribal', title: 'വയനാട്ടിലെ ഗോത്ര വിദ്യാഭ്യാസ പോരാട്ടം', description: 'വയനാട്ടിലെ ഗോത്ര വിഭാഗത്തിലെ ആദ്യ ബിരുദധാരി', duration: '25:30', publishDate: 'May 9, 2026', thumbnail: 'ls-5', views: '95K' },
    ],
  },
  {
    slug: 'eyecatcher',
    title: 'Eyecatcher',
    titleML: 'ഐകാച്ചർ',
    description: 'Sharp visual stories and photo essays that capture the essence of news events through powerful imagery and minimal narration.',
    descriptionML: 'ശക്തമായ ചിത്രങ്ങളിലൂടെ വാർത്തകളുടെ പൊരുൾ വിളിച്ചോതുന്ന വിഷ്വൽ സ്റ്റോറികൾ.',
    category: 'Visual Story',
    image: 'eyecatcher',
    host: 'Faisal Khan',
    hostTitle: 'Photo Editor',
    schedule: 'Every Monday 6:30 PM',
    episodeCount: 52,
    episodes: [
      { slug: 'ec-sabarimala', title: 'ശബരിമല മണ്ഡലകാലം | ഭക്തിയുടെ ദൃശ്യ വിസ്മയം', description: 'ശബരിമല തീർത്ഥാടനത്തിന്റെ ദൃശ്യങ്ങൾ', duration: '12:20', publishDate: 'June 8, 2026', thumbnail: 'ec-1', views: '2.3L' },
      { slug: 'ec-monsoon-kerala', title: 'കേരളത്തിൽ മഴക്കാലം | പ്രകൃതിയുടെ നൃത്തം', description: 'കേരളത്തിലെ മഴക്കാല ദൃശ്യങ്ങൾ', duration: '10:45', publishDate: 'June 1, 2026', thumbnail: 'ec-2', views: '1.5L' },
      { slug: 'ec-fort-kochi', title: 'ഫോർട്ട് കൊച്ചിയിലെ ഒരു ദിവസം | ചരിത്രത്തിന്റെ നിഴലിൽ', description: 'ഫോർട്ട് കൊച്ചിയിലെ ജീവിതം', duration: '14:00', publishDate: 'May 25, 2026', thumbnail: 'ec-3', views: '68K' },
      { slug: 'ec-munnar-tea', title: 'മൂന്നാറിലെ തേയില തോട്ടങ്ങൾ | പച്ചപ്പിന്റെ കഥ', description: 'മൂന്നാറിലെ തേയില തോട്ടങ്ങളിലൂടെ ഒരു യാത്ര', duration: '11:30', publishDate: 'May 18, 2026', thumbnail: 'ec-4', views: '1.9L' },
    ],
  },
  {
    slug: 'magazine',
    title: 'Magazine',
    titleML: 'മാഗസിൻ',
    description: 'Weekly news magazine covering politics, social issues, culture, and current affairs with depth and perspective.',
    descriptionML: 'രാഷ്ട്രീയം, സാമൂഹിക പ്രശ്നങ്ങൾ, സംസ്കാരം എന്നിവയെക്കുറിച്ചുള്ള ആഴത്തിലുള്ള ആനുകാലിക അവലോകനം.',
    category: 'Magazine',
    image: 'magazine',
    host: 'Sabu Joseph',
    hostTitle: 'Executive Editor',
    schedule: 'Every Sunday 9:00 PM',
    episodeCount: 120,
    episodes: [
      { slug: 'mag-election-analysis', title: 'തെരഞ്ഞെടുപ്പ് വിശകലനം | അണിയറയിലെ രാഷ്ട്രീയം', description: 'ലോക്സഭാ തെരഞ്ഞെടുപ്പ് ഫല വിശകലനം', duration: '45:00', publishDate: 'June 7, 2026', thumbnail: 'mag-1', views: '4.5L' },
      { slug: 'mag-budget-2026', title: 'ബജറ്റ് 2026 | കേരളത്തിന് എന്ത് കിട്ടും?', description: 'കേരള ബജറ്റ് 2026 വിശകലനം', duration: '38:20', publishDate: 'May 31, 2026', thumbnail: 'mag-2', views: '3.2L' },
      { slug: 'mag-gulf-return', title: 'ഗൾഫ് മടക്കം | പ്രവാസികളുടെ പ്രതിസന്ധികൾ', description: 'ഗൾഫിൽ നിന്ന് മടങ്ങുന്ന പ്രവാസികളുടെ പ്രശ്നങ്ങൾ', duration: '35:15', publishDate: 'May 24, 2026', thumbnail: 'mag-3', views: '2.8L' },
      { slug: 'mag-climate-change', title: 'കാലാവസ്ഥാ വ്യതിയാനവും കേരളവും | വെല്ലുവിളികൾ', description: 'കാലാവസ്ഥാ വ്യതിയാനത്തിന്റെ കേരളത്തിലെ പ്രത്യാഘാതങ്ങൾ', duration: '40:00', publishDate: 'May 17, 2026', thumbnail: 'mag-4', views: '1.6L' },
    ],
  },
  {
    slug: 'analysis',
    title: 'Analysis',
    titleML: 'അനാലിസിസ്',
    description: 'Expert analysis and deep dives into the most important news stories, policy decisions, and political developments.',
    descriptionML: 'പ്രധാനപ്പെട്ട വാർത്തകളുടെയും നയ തീരുമാനങ്ങളുടെയും വിദഗ്ധ വിശകലനം.',
    category: 'News Analysis',
    image: 'analysis',
    host: 'George Abraham',
    hostTitle: 'Political Editor',
    schedule: 'Every Tuesday 8:00 PM',
    episodeCount: 85,
    episodes: [
      { slug: 'an-gst-analysis', title: 'ജിഎസ്ടി വരുമാനത്തിൽ റെക്കോർഡ് | സാമ്പത്തിക വിശകലനം', description: 'ജിഎസ്ടി ശേഖരണത്തിലെ റെക്കോർഡ് വരുമാനത്തിന്റെ വിശകലനം', duration: '22:10', publishDate: 'June 11, 2026', thumbnail: 'an-1', views: '94K' },
      { slug: 'an-ips-reshuffle', title: 'ഐപിഎസ് റീഷഫിൾ | ഭരണപരമായ പ്രത്യാഘാതങ്ങൾ', description: 'ഐപിഎസ് ഉദ്യോഗസ്ഥരുടെ സ്ഥലം മാറ്റത്തിന്റെ രാഷ്ട്രീയം', duration: '18:30', publishDate: 'June 9, 2026', thumbnail: 'an-2', views: '1.3L' },
      { slug: 'an-education-policy', title: 'പുതിയ വിദ്യാഭ്യാസ നയം | എന്തൊക്കെ മാറ്റങ്ങൾ?', description: 'ദേശീയ വിദ്യാഭ്യാസ നയത്തിലെ പുതിയ ഭേദഗതികൾ', duration: '25:00', publishDate: 'June 4, 2026', thumbnail: 'an-3', views: '76K' },
      { slug: 'an-sabarimala', title: 'ശബരിമല വിധി | നിയമപരമായ വശങ്ങൾ', description: 'ശബരിമല കേസിലെ സുപ്രീം കോടതി വിധിയുടെ വിശകലനം', duration: '20:45', publishDate: 'May 28, 2026', thumbnail: 'an-4', views: '2.7L' },
    ],
  },
  {
    slug: 'special-report',
    title: 'Special Report',
    titleML: 'സ്പെഷ്യൽ റിപ്പോർട്ട്',
    description: 'Investigative journalism and ground reports that uncover stories beneath the surface. Hard-hitting documentaries on critical issues.',
    descriptionML: 'അന്വേഷണാത്മക റിപ്പോർട്ടുകളും ഗ്രൗണ്ട് റിപ്പോർട്ടുകളും. നിർണായക വിഷയങ്ങളിലെ ഡോക്യുമെന്ററികൾ.',
    category: 'Investigation',
    image: 'special-report',
    schedule: 'Monthly Special',
    episodeCount: 18,
    episodes: [
      { slug: 'sr-gold-smuggling', title: 'സ്വർണക്കടത്ത് | കേരളത്തിലെ കണ്ണികൾ', description: 'കേരളത്തിലെ സ്വർണക്കടത്ത് ശൃംഖലയെക്കുറിച്ചുള്ള അന്വേഷണം', duration: '35:20', publishDate: 'June 5, 2026', thumbnail: 'sr-1', views: '5.2L' },
      { slug: 'sr-cyber-fraud', title: 'സൈബർ തട്ടിപ്പ് | മലയാളികൾ നഷ്ടപ്പെടുത്തുന്നത്', description: 'മലയാളികൾക്ക് നേരെയുള്ള സൈബർ തട്ടിപ്പുകളുടെ അന്വേഷണം', duration: '28:45', publishDate: 'May 22, 2026', thumbnail: 'sr-2', views: '3.8L' },
      { slug: 'sr-hospital-malpractice', title: 'ആശുപത്രി അനാചാരങ്ങൾ | രോഗികളുടെ പണം തട്ടുന്നത് എങ്ങനെ?', description: 'സ്വകാര്യ ആശുപത്രികളിലെ പ്രതിഫല ചൂഷണം', duration: '32:10', publishDate: 'May 8, 2026', thumbnail: 'sr-3', views: '2.9L' },
    ],
  },
  {
    slug: 'health-matters',
    title: 'Health Matters',
    titleML: 'ഹെൽത്ത് മാറ്റേഴ്സ്',
    description: 'Your weekly guide to health and wellness. Expert doctors discuss prevention, treatment, and healthy living.',
    descriptionML: 'ആരോഗ്യത്തിനും ക്ഷേമത്തിനുമുള്ള വഴികാട്ടി. വിദഗ്ധ ഡോക്ടർമാരുടെ ഉപദേശങ്ങൾ.',
    category: 'Health',
    image: 'health',
    host: 'Dr. Fathima Nizar',
    hostTitle: 'Medical Correspondent',
    schedule: 'Every Wednesday 7:30 PM',
    episodeCount: 64,
    episodes: [
      { slug: 'hm-heart-health', title: 'ഹൃദയാരോഗ്യം | ശ്രദ്ധിക്കേണ്ട ലക്ഷണങ്ങൾ', description: 'ഹൃദയ സംബന്ധമായ അസുഖങ്ങളും പ്രതിരോധ മാർഗങ്ങളും', duration: '20:15', publishDate: 'June 10, 2026', thumbnail: 'hm-1', views: '1.7L' },
      { slug: 'hm-diabetes', title: 'പ്രമേഹം നിയന്ത്രിക്കാം | ആഹാരവും ജീവിതശൈലിയും', description: 'പ്രമേഹ രോഗികൾക്കുള്ള ആഹാര നിയന്ത്രണ മാർഗങ്ങൾ', duration: '22:30', publishDate: 'June 3, 2026', thumbnail: 'hm-2', views: '2.2L' },
      { slug: 'hm-mental-health', title: 'മാനസികാരോഗ്യം | സംസാരിച്ചാൽ മാറും', description: 'മാനസിക ആരോഗ്യ പ്രശ്നങ്ങളെ കുറിച്ചുള്ള ബോധവത്കരണം', duration: '26:00', publishDate: 'May 27, 2026', thumbnail: 'hm-3', views: '95K' },
      { slug: 'hm-summer-care', title: 'വേനൽക്കാല ആരോഗ്യ ടിപ്പുകൾ | ചൂടിൽ നിന്ന് സംരക്ഷണം', description: 'വേനൽക്കാലത്ത് ശ്രദ്ധിക്കേണ്ട ആരോഗ്യ കാര്യങ്ങൾ', duration: '15:45', publishDate: 'May 20, 2026', thumbnail: 'hm-4', views: '1.3L' },
    ],
  },
  {
    slug: 'sports-review',
    title: 'Sports Review',
    titleML: 'സ്പോർട്സ് റിവ്യൂ',
    description: 'Complete coverage of the sports world. Match analysis, player interviews, and expert commentary on cricket, football, and more.',
    descriptionML: 'കായിക ലോകത്തെ സമഗ്ര വിശകലനം. മത്സര വിശകലനം, കളിക്കാരുടെ അഭിമുഖങ്ങൾ.',
    category: 'Sports',
    image: 'sports-review',
    host: 'Sreejith Nair',
    hostTitle: 'Sports Editor',
    schedule: 'Every Thursday 8:00 PM',
    episodeCount: 42,
    episodes: [
      { slug: 'spr-ipl-final', title: 'ഐപിഎൽ ഫൈനൽ വിശകലനം | മുംബൈ ചാമ്പ്യൻമാർ', description: 'ഐപിഎൽ 2026 ഫൈനലിന്റെ സമഗ്ര വിശകലനം', duration: '30:00', publishDate: 'June 11, 2026', thumbnail: 'spr-1', views: '3.6L' },
      { slug: 'spr-football-tactics', title: 'ഫുട്ബോൾ തന്ത്രങ്ങൾ | ലോകകപ്പ് തയ്യാറെടുപ്പ്', description: 'ഫിഫ ലോകകപ്പിനുള്ള ടീമുകളുടെ തയ്യാറെടുപ്പുകൾ', duration: '24:20', publishDate: 'June 4, 2026', thumbnail: 'spr-2', views: '85K' },
      { slug: 'spr-sindhu', title: 'പിവി സിന്ധു | കരിയറിലെ നാഴികക്കല്ലുകൾ', description: 'പിവി സിന്ധുവിന്റെ കരിയർ വിശകലനം', duration: '18:45', publishDate: 'May 28, 2026', thumbnail: 'spr-3', views: '1.1L' },
      { slug: 'spr-kerala-blasters', title: 'കേരള ബ്ലാസ്റ്റേഴ്സ് | പുതിയ സീസൺ പ്രതീക്ഷകൾ', description: 'കേരള ബ്ലാസ്റ്റേഴ്സിന്റെ പുതിയ സീസണിലെ പ്രതീക്ഷകൾ', duration: '22:10', publishDate: 'May 21, 2026', thumbnail: 'spr-4', views: '2.4L' },
    ],
  },
  {
    slug: 'gulf-chronicle',
    title: 'Gulf Chronicle',
    titleML: 'ഗൾഫ് ക്രോണിക്കിൾ',
    description: 'News and features from the Gulf region. Coverage of NRI issues, policy changes, and community stories from UAE, Saudi, Qatar, Kuwait, Oman, and Bahrain.',
    descriptionML: 'ഗൾഫ് രാജ്യങ്ങളിൽ നിന്നുള്ള വാർത്തകളും ഫീച്ചറുകളും. പ്രവാസി പ്രശ്നങ്ങളും സമൂഹ കഥകളും.',
    category: 'Gulf',
    image: 'gulf-chronicle',
    host: 'Shihabuddin P.',
    hostTitle: 'Gulf Correspondent',
    schedule: 'Every Saturday 9:30 PM',
    episodeCount: 55,
    episodes: [
      { slug: 'gc-uae-labour', title: 'യുഎഇയിലെ തൊഴിൽ നിയമ ഭേദഗതികൾ | പ്രവാസികൾക്ക് ഗുണം', description: 'യുഎഇയിലെ പുതിയ തൊഴിൽ നിയമ ഭേദഗതികളുടെ വിശദീകരണം', duration: '26:30', publishDate: 'June 8, 2026', thumbnail: 'gc-1', views: '2.5L' },
      { slug: 'gc-saudi-vision', title: 'സൗദി വിഷൻ 2030 | മാറുന്ന സൗദി', description: 'സൗദി അറേബ്യയിലെ മാറ്റങ്ങളും പ്രവാസികളുടെ അവസരങ്ങളും', duration: '32:00', publishDate: 'June 1, 2026', thumbnail: 'gc-2', views: '1.8L' },
      { slug: 'gc-qatar-worldcup', title: 'ഖത്തർ ലോകകപ്പിന് ശേഷം | വികസനങ്ങൾ', description: 'ഖത്തറിലെ ലോകകപ്പിന് ശേഷമുള്ള വികസനങ്ങൾ', duration: '24:15', publishDate: 'May 25, 2026', thumbnail: 'gc-3', views: '1.1L' },
      { slug: 'gc-nri-issues', title: 'എൻആർഐ പ്രതിസന്ധികൾ | പരിഹാര മാർഗങ്ങൾ', description: 'പ്രവാസികൾ നേരിടുന്ന പ്രശ്നങ്ങളും പരിഹാര മാർഗങ്ങളും', duration: '28:45', publishDate: 'May 18, 2026', thumbnail: 'gc-4', views: '2.0L' },
    ],
  },
];

// ─── Standalone Videos ───────────────────────────────────────────────────────
// Real videos from the MediaOne News YouTube channel (@MediaoneTVLive,
// channel UCpt10lzibN9Ux-tFGVAnrBw), pulled from the channel RSS feed. Each
// entry carries its real youtubeId so the modal, watch page, and embeds all
// play the genuine YouTube video; thumbnailUrl is YouTube's own poster frame.

export const allVideos: Video[] = [
  { slug: 'yt-vXi57M7Rdp0', youtubeId: 'vXi57M7Rdp0', title: 'ആരാധകരെ വിറപ്പിച്ചെങ്കിലും നിറഞ്ഞാടി മെസി; തോറ്റ് മടങ്ങാന്‍ വന്നതല്ലെന്ന് ആരാധകര്‍', description: 'പ്രീക്വർട്ടറിലേക്കുള്ള മത്സരത്തിൽ തകർപ്പൻ ജയവുമായി അർജന്റീന; കോഴിക്കോട്ടെ പുതിയപ്പാലത്ത് ആരാധകകരുടെ വലിയ ആവേശം', category: 'Sports', publishDate: 'Aug 3, 2026', publishTime: '21:10', thumbnail: 'vXi57M7Rdp0', thumbnailUrl: ytThumbnail('vXi57M7Rdp0'), views: '0', isFeatured: true },
  { slug: 'yt-lvDoIfhkJW8', youtubeId: 'lvDoIfhkJW8', title: 'ചിലര്‍ കരയുന്നു, സന്തോഷിക്കുന്നു; അര്‍ജന്റീനയുടെ കളി കണ്ട ആളുകള്‍ക്ക് അറ്റാക്ക് വരാത്തത് ഭാ​ഗ്യം', description: 'അര്‍ജന്റീനയില്‍ നിന്നും തത്സമയം; കേപ് വെർദെയുടെ ശക്തമായ പ്രകടനം കണ്ട ആളുകള്‍ക്ക് ഹാര്‍ട്ട് അറ്റാക്ക് വന്നത് പോലെ മിക്‌സ്ഡ് ഇമോഷനായി', category: 'Sports', publishDate: 'Aug 3, 2026', publishTime: '20:35', thumbnail: 'lvDoIfhkJW8', thumbnailUrl: ytThumbnail('lvDoIfhkJW8'), views: '23' },
  { slug: 'yt-189804av2W8', youtubeId: '189804av2W8', title: '\'ഹൈ ബിപിയിൽ കളി കാണേണ്ടി വന്നു; ഫാൻസിനുണ്ടായ ടെൻഷൻ അർജന്റീന ടീമിന് ഇല്ലായിരുന്നു\'....', description: 'ശക്തമായ മത്സരം കാഴ്ചവെച്ച കേപ് വെർദെയെ മൂന്ന് ​ഗോളിന് പരാജയപ്പെടുത്തി അർജന്റീന പ്രീക്വർട്ടറിൽ പ്രവേശിച്ചു', category: 'Sports', publishDate: 'Aug 3, 2026', publishTime: '19:50', thumbnail: '189804av2W8', thumbnailUrl: ytThumbnail('189804av2W8'), views: '87' },
  { slug: 'yt-Wq_RAGOgMuA', youtubeId: 'Wq_RAGOgMuA', title: 'തൃശൂരിൽ മിനി ബോട്ട് മറിഞ്ഞ് കാണാതായ രണ്ട് പേരുടെ മൃതദേഹം കണ്ടെത്തി', description: 'തൃശൂരിൽ മിനി ബോട്ട് മറിഞ്ഞ് കാണാതായ രണ്ട് പേരുടെ മൃതദേഹം കണ്ടെത്തി', category: 'News', publishDate: 'Aug 3, 2026', publishTime: '18:20', thumbnail: 'Wq_RAGOgMuA', thumbnailUrl: ytThumbnail('Wq_RAGOgMuA'), views: '113' },
  { slug: 'yt-4B9pqFW0nRM', youtubeId: '4B9pqFW0nRM', title: 'സ്‌പെയിനിനെ തളച്ചിട്ടു; അര്‍ജന്റീനയെ വിറപ്പിച്ചു! തോല്‍ക്കാൻ മനസില്ലാതെ പൊരുതി വീണ് കോപ് വെര്‍ദെ', description: 'കോപ് വെര്‍ദെയെ മൂന്ന് ​ഗോളിന് തോൽപിച്ച് ലോക ചാംപ്യന്മാരായ അർജന്റീന പ്രീക്വർട്ടറിൽ', category: 'Sports', publishDate: 'Aug 3, 2026', publishTime: '17:05', thumbnail: '4B9pqFW0nRM', thumbnailUrl: ytThumbnail('4B9pqFW0nRM'), views: '188' },
  { slug: 'yt-Tr3Wr40Z6TQ', youtubeId: 'Tr3Wr40Z6TQ', title: '\'ജീവനൊടുക്കിയത് CPM ഭരണസമിതിയുടെ സമ്മർദം മൂലം\'; സാബുവിന്റെ മരണത്തിൽ അന്വേഷണം ക്രൈംബ്രാഞ്ചിന്', description: 'ജീവനൊടുക്കിയത് CPM ഭരണസമിതിയുടെ സമ്മർദം മൂലമെന്ന് പരാതി; കട്ടപ്പനയിലെ സാബുവിന്റെ മരണത്തിൽ അന്വേഷണം ക്രൈംബ്രാഞ്ചിന്', category: 'Politics', publishDate: 'Aug 3, 2026', publishTime: '15:40', thumbnail: 'Tr3Wr40Z6TQ', thumbnailUrl: ytThumbnail('Tr3Wr40Z6TQ'), views: '32' },
  { slug: 'yt-V32YtRVB1_g', youtubeId: 'V32YtRVB1_g', title: 'വടകരയിൽ ദേശീയപാതയിൽ വീണ്ടും മണ്ണിടിച്ചിൽ; മണ്ണും കല്ലും റോഡിലേക്ക് പതിച്ചു; വലിയ അപകട സാധ്യത', description: 'വടകരയിൽ ദേശീയപാതയിൽ വീണ്ടും മണ്ണിടിച്ചിൽ; മണ്ണും കല്ലും റോഡിലേക്ക് പതിച്ചു; വലിയ അപകട സാധ്യത', category: 'News', publishDate: 'Aug 3, 2026', publishTime: '13:15', thumbnail: 'V32YtRVB1_g', thumbnailUrl: ytThumbnail('V32YtRVB1_g'), views: '92' },
  { slug: 'yt-OkF7APAHwbs', youtubeId: 'OkF7APAHwbs', title: 'ഇടിയുന്ന കെടുതി...; കനത്ത മഴയിൽ പാലക്കാട്‌ അലനല്ലൂരിൽ വീടുകളുടെ മതിൽ ഇടിഞ്ഞു; കുടുംബത്തെ മാറ്റി', description: 'ഇടിയുന്ന കെടുതി...; കനത്ത മഴയിൽ പാലക്കാട്‌ അലനല്ലൂരിൽ വീടുകളുടെ മതിൽ ഇടിഞ്ഞു; കുടുംബത്തെ മാറ്റി', category: 'News', publishDate: 'Aug 3, 2026', publishTime: '11:30', thumbnail: 'OkF7APAHwbs', thumbnailUrl: ytThumbnail('OkF7APAHwbs'), views: '114' },
  { slug: 'yt-rY1kd5wYeKQ', youtubeId: 'rY1kd5wYeKQ', title: 'നാഥനില്ലാതെ കേരള ചലച്ചിത്ര അക്കാദമി; ഭരണ സ്തംഭനം മൂലം മേളകൾ അനിശ്ചിതത്വത്തിൽ', description: 'നാഥനില്ലാതെ കേരള ചലച്ചിത്ര അക്കാദമി; ഭരണ സ്തംഭനം മൂലം മേളകൾ അനിശ്ചിതത്വത്തിൽ; അവാർഡ് ജൂറിയെയും തീരുമാനിച്ചിട്ടില്ല', category: 'Entertainment', publishDate: 'Jul 4, 2026', thumbnail: 'rY1kd5wYeKQ', thumbnailUrl: ytThumbnail('rY1kd5wYeKQ'), views: '42' },
  { slug: 'yt-jeHILGPRNJw', youtubeId: 'jeHILGPRNJw', title: 'എത്തുക നൂറിലേറെ രാജ്യങ്ങളിലെ പ്രതിനിധികൾ...; ഖാംനഈയുടെ വിലാപ യാത്രാ ചടങ്ങുകൾക്കൊരുങ്ങി തെഹ്റാൻ', description: 'എത്തുക നൂറിലേറെ രാജ്യങ്ങളിലെ പ്രതിനിധികൾ...; ഖാംനഈയുടെ വിലാപ യാത്രാ ചടങ്ങുകൾക്കൊരുങ്ങി തെഹ്റാൻ; ഇന്ത്യൻ പ്രതിനിധിയും പങ്കെടുക്കും', category: 'World', publishDate: 'Jul 4, 2026', thumbnail: 'jeHILGPRNJw', thumbnailUrl: ytThumbnail('jeHILGPRNJw'), views: '604' },
  { slug: 'yt-I_IunvAVYNk', youtubeId: 'I_IunvAVYNk', title: 'പ്രതിസന്ധി ON...; പുതിയ കരാറുമായി കമ്പനികൾ; വരുമാനം കുറഞ്ഞ് ഓൺലൈൻ ടാക്സി ഡ്രൈവർമാർ; സർക്കാർ ഇടപെടണം', description: 'പ്രതിസന്ധി ON; പുതിയ കരാറുമായി കമ്പനികൾ...; വരുമാനം കുറഞ്ഞ് ഓൺലൈൻ ടാക്സി ഡ്രൈവർമാർ; സർക്കാർ ഇടപെടണമെന്നാവശ്യം', category: 'Business', publishDate: 'Jul 4, 2026', thumbnail: 'I_IunvAVYNk', thumbnailUrl: ytThumbnail('I_IunvAVYNk'), views: '141' },
  { slug: 'yt--WGXg4-2bTk', youtubeId: '-WGXg4-2bTk', title: 'ഫേക്കിന് ആദരം..; കാഫിർ സ്ക്രീൻഷോട്ട് കേസിൽ ജാമ്യം ലഭിച്ച ജിതിന് DYFIയുടെ സ്വീകരണം', description: 'ഫേക്കിന് ആദരം..; കാഫിർ സ്ക്രീൻഷോട്ട് കേസിൽ ജാമ്യം ലഭിച്ച ജിതിന് DYFIയുടെ സ്വീകരണം', category: 'Politics', publishDate: 'Jul 4, 2026', thumbnail: '-WGXg4-2bTk', thumbnailUrl: ytThumbnail('-WGXg4-2bTk'), views: '274' },
  { slug: 'yt-rr9S8rMRsFo', youtubeId: 'rr9S8rMRsFo', title: '2 വർഷം വേട്ടയാടി; കാഫിർ സ്‌ക്രീൻഷോട്ട് കേസിൽ പ്രതിയാക്കിയതിനെതിരെ നിയമ പോരാട്ടത്തിനിറങ്ങി കാസിം', description: 'വെറുതെയങ്ങ് പോവുന്നില്ല...; കാഫിർ സ്‌ക്രീൻഷോട്ട് കേസിൽ പ്രതിയാക്കിയതിനെതിരെ നിയമ പോരാട്ടത്തിനിറങ്ങി കാസിം; 2 വർഷം ഹീനമായി വേട്ടയാടി', category: 'Politics', publishDate: 'Jul 4, 2026', thumbnail: 'rr9S8rMRsFo', thumbnailUrl: ytThumbnail('rr9S8rMRsFo'), views: '267' },
  { slug: 'yt-KCMMCvrSnzY', youtubeId: 'KCMMCvrSnzY', title: 'വിശദീകരണവുമായി അദാനി...; \'ഓഹരി കൈമാറ്റം ഉണ്ടായാലും വിഴിഞ്ഞത് MSCക്ക് കുത്തകാവകാശം ഉണ്ടാകില്ല\'', description: 'വിശദീകരണവുമായി അദാനി; ഓഹരി കൈമാറ്റം ഉണ്ടായാലും വിഴിഞ്ഞത് MSCക്ക് കുത്തകാവകാശം ഉണ്ടാകില്ല; സർക്കാരുമായി നല്ല ബന്ധം തുടരും', category: 'Business', publishDate: 'Jul 4, 2026', thumbnail: 'KCMMCvrSnzY', thumbnailUrl: ytThumbnail('KCMMCvrSnzY'), views: '164' },
  { slug: 'yt-sQJoM7RYmVE', youtubeId: 'sQJoM7RYmVE', title: 'AMMAയിൽ ത്രില്ലർ ട്വിസ്റ്റ് തുടരുന്നു; രമേഷ് പിഷാരടി രാജിവച്ചു; നടിമാരുടെ വാർത്താസമ്മേളനം ഇന്ന്', description: 'AMMAയിൽ ത്രില്ലർ ട്വിസ്റ്റ് തുടരുന്നു; അഡ്ഹോക്ക് കമ്മിറ്റിക്ക് വിലക്ക്, രമേഷ് പിഷാരടി രാജിവച്ചു; ശ്വേത മേനോനെതിരെ നടിമാരുടെ വാർത്താസമ്മേളനം ഇന്ന്', category: 'Entertainment', publishDate: 'Jul 4, 2026', thumbnail: 'sQJoM7RYmVE', thumbnailUrl: ytThumbnail('sQJoM7RYmVE'), views: '627' },
];

// ─── Video embeds ────────────────────────────────────────────────────────────

// Dummy YouTube ids (neutral, embeddable Creative-Commons clips) — stand-ins
// until real ids are wired in. Shared by shows, programs, and watch pages so
// every embed across the videos section behaves the same.
export const SAMPLE_YOUTUBE_IDS = [
  'aqz-KE-bpKQ', // Big Buck Bunny (Blender, CC)
  'YE7VzlLtp-4', // Sintel trailer (Blender, CC)
  'eRsGyueVLvQ', // Tears of Steel trailer (Blender, CC)
  'LXb3EKWsInQ', // Costa Rica sample (CC)
  'ScMzIvxBSi4', // sample
  'b7ITc0e-Dj4', // sample
];

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export function youtubeIdFor(seed: string): string {
  return SAMPLE_YOUTUBE_IDS[hashStr(seed) % SAMPLE_YOUTUBE_IDS.length];
}

// Resolve the real YouTube id for a Video: prefer the genuine id stored on the
// record (real uploads), fall back to a stable sample id (show episodes, etc.).
export function getVideoYoutubeId(video: Video): string {
  return video.youtubeId || youtubeIdFor(video.slug);
}

// Normalized playlist shape shared with the ShowViewer component. Maps a Show's
// episodes into the same structure programs use, so both render identically.
export interface ShowEpisodeItem {
  title: string;
  youtubeId: string;
  duration: string;
  publishDate: string;
  views: string;
  seed: string;
}

export function getShowEpisodes(show: Show): ShowEpisodeItem[] {
  return show.episodes.map((ep) => ({
    title: ep.title,
    youtubeId: youtubeIdFor(ep.slug),
    duration: ep.duration,
    publishDate: ep.publishDate,
    views: ep.views || '—',
    seed: ep.thumbnail,
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getShow(slug: string): Show | undefined {
  return shows.find(s => s.slug === slug);
}

export function getVideo(slug: string): Video | undefined {
  return allVideos.find(v => v.slug === slug);
}

export function getVideosByCategory(category: string): Video[] {
  return allVideos.filter(v => v.category === category);
}

export function getFeaturedVideo(): Video | undefined {
  return allVideos.find(v => v.isFeatured);
}

export function getRecentVideos(count: number = 10): Video[] {
  return allVideos.slice(0, count);
}

export const videoCategories: string[] = [
  'All', 'News', 'Politics', 'Entertainment', 'Sports', 'Gulf', 'World', 'Business', 'Health'
];

// ─── Image Gradient Map ──────────────────────────────────────────────────────

export const videoImageGradients: Record<string, string> = {
  'ftf-1': 'from-indigo-900 to-indigo-700',
  'ftf-2': 'from-purple-900 to-purple-700',
  'ftf-3': 'from-blue-900 to-blue-700',
  'ftf-4': 'from-teal-900 to-teal-700',
  'ftf-5': 'from-rose-900 to-rose-700',
  'ftf-6': 'from-gray-900 to-gray-700',
  'ls-1': 'from-amber-900 to-amber-700',
  'ls-2': 'from-stone-900 to-stone-700',
  'ls-3': 'from-cyan-900 to-cyan-700',
  'ls-4': 'from-violet-900 to-violet-700',
  'ls-5': 'from-emerald-900 to-emerald-700',
  'ec-1': 'from-orange-900 to-orange-700',
  'ec-2': 'from-sky-900 to-sky-700',
  'ec-3': 'from-lime-900 to-lime-700',
  'ec-4': 'from-green-900 to-green-700',
  'mag-1': 'from-red-900 to-red-700',
  'mag-2': 'from-blue-900 to-blue-700',
  'mag-3': 'from-yellow-900 to-amber-700',
  'mag-4': 'from-slate-900 to-slate-700',
  'an-1': 'from-fuchsia-900 to-fuchsia-700',
  'an-2': 'from-pink-900 to-pink-700',
  'an-3': 'from-indigo-900 to-indigo-700',
  'an-4': 'from-rose-900 to-rose-700',
  'sr-1': 'from-red-950 to-red-800',
  'sr-2': 'from-gray-950 to-gray-800',
  'sr-3': 'from-zinc-900 to-zinc-700',
  'hm-1': 'from-emerald-900 to-emerald-700',
  'hm-2': 'from-teal-900 to-teal-700',
  'hm-3': 'from-sky-900 to-sky-700',
  'hm-4': 'from-amber-900 to-amber-700',
  'spr-1': 'from-blue-900 to-blue-700',
  'spr-2': 'from-green-900 to-green-700',
  'spr-3': 'from-yellow-900 to-yellow-700',
  'spr-4': 'from-orange-900 to-orange-700',
  'gc-1': 'from-cyan-900 to-cyan-700',
  'gc-2': 'from-purple-900 to-purple-700',
  'gc-3': 'from-red-900 to-red-700',
  'gc-4': 'from-indigo-900 to-indigo-700',
  'v-news-1': 'from-blue-900 to-blue-700',
  'v-news-2': 'from-green-900 to-green-700',
  'v-news-3': 'from-yellow-800 to-amber-600',
  'v-news-4': 'from-sky-900 to-sky-700',
  'v-news-5': 'from-slate-800 to-blue-700',
  'v-news-6': 'from-rose-900 to-rose-700',
  'v-news-7': 'from-purple-900 to-purple-700',
  'v-news-8': 'from-emerald-900 to-emerald-700',
  'v-news-9': 'from-gray-900 to-gray-700',
  'v-news-10': 'from-orange-900 to-orange-700',
  'v-news-11': 'from-teal-900 to-teal-700',
  'v-news-12': 'from-pink-900 to-pink-700',
  'v-news-13': 'from-lime-900 to-lime-700',
  'v-news-14': 'from-indigo-900 to-indigo-700',
  'v-news-15': 'from-cyan-900 to-cyan-700',
  'face-to-face': 'from-indigo-800 via-purple-700 to-pink-600',
  'life-story': 'from-amber-800 via-orange-600 to-yellow-500',
  'eyecatcher': 'from-teal-800 via-cyan-600 to-sky-500',
  'magazine': 'from-red-800 via-rose-600 to-pink-500',
  'analysis': 'from-blue-800 via-indigo-600 to-violet-500',
  'special-report': 'from-gray-900 via-slate-800 to-zinc-700',
  'health': 'from-emerald-800 via-green-600 to-teal-500',
  'sports-review': 'from-sky-800 via-blue-600 to-indigo-500',
  'gulf-chronicle': 'from-amber-800 via-yellow-600 to-orange-500',
};
