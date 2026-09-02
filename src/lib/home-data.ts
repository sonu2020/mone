// ============================================================================
// Shared homepage content — consumed by every layout variant under /home/*
// so the layouts can be compared on identical material. Lifted verbatim from
// the original index.astro fixture data. Malayalam editorial dummy copy.
// ============================================================================

export interface Story {
  title: string;
  href: string;
  date?: string;
  category?: string;
  excerpt?: string;
}

export interface SectionCluster {
  id: string;
  name: string;       // Malayalam display name
  nameEn: string;     // English label / kicker
  href: string;
  lead: Story;
  items: Story[];
}

export const hero: Story = {
  title: 'ഓപ്പറേഷൻ തൂഫാൻ; ലഹരി വില്പന നടത്തിയ കട പൊലീസ് പൊളിച്ചു നീക്കി',
  excerpt:
    'സ്ഥിരം ലഹരി വില്പനക്കാരൻ എന്ന് പൊലീസ്. ഇടുക്കിയിലെ പ്രദേശത്ത് നടത്തിയ റെയ്ഡിൽ ലഹരി വില്പന നടത്തിയ കട പൊലീസ് പൊളിച്ചു നീക്കി.',
  category: 'Kerala',
  href: '/story/ips-shrikumar',
  date: '8:48 PM IST',
};

export const topStories: Story[] = [
  { title: 'വൈദ്യുതി പ്രതിസന്ധിയിൽ കെഎസ്ഇബിയെ കുറ്റപ്പെടുത്തി റെഗുലേറ്ററി കമ്മീഷൻ', href: '/story/pala-election', date: '9:03 PM', category: 'Kerala' },
  { title: 'തിരുവനന്തപുരത്ത് ഐസ് ഫാക്ടറിയിൽ അമോണിയ വാതക ചോർച്ച', href: '/story/vote-buying', date: '8:44 PM', category: 'Kerala' },
  { title: 'ഇഡി ഉദ്യോഗസ്ഥരെ ആക്രമിച്ച കേസിൽ ആദ്യ ജാമ്യം', href: '/story/sabarimala-traffic', date: '7:30 PM', category: 'Kerala' },
  { title: 'മാസപ്പടി കേസിൽ നിർണായക രേഖകൾ ഇഡിക്ക്', href: '/story/rain-alert', date: '6:15 PM', category: 'Kerala' },
];

export const latest: Story[] = [
  { title: 'ചിക്കൻ കഴിക്കുമ്പോൾ അറിയാതെ പോലും അകത്താക്കാൻ പാടില്ലാത്ത 10 കാര്യങ്ങൾ', href: '/story/rain-alert', date: '1 hr', category: 'Health' },
  { title: 'പാസ്പോർട്ട് ഒരു യാത്രാരേഖ മാത്രമാണ്, പൗരത്വത്തിനുള്ള തെളിവല്ല', href: '/story/palakkad-hospital', date: '2 hr', category: 'India' },
  { title: 'കനത്ത മഴയില്‍ കോച്ചിന്റെ വാതില്‍ തുറന്നിട്ടതിൽ തർക്കം', href: '/story/india-uae-trade', date: '3 hr', category: 'India' },
  { title: 'സൗദിയുടെ വിവിധ ഇടങ്ങളിൽ ശക്തമായ പൊടിക്കാറ്റ് വീശും', href: '/story/gold-price-record', date: '4 hr', category: 'Gulf' },
  { title: 'ഭരണഘടനാ വ്യവസ്ഥകള്‍ ഉയര്‍ത്തിപ്പിടിക്കണം; ശിവസേന എംപിമാര്‍', href: '/story/india-ireland-odi', date: '5 hr', category: 'India' },
  { title: 'പാക് വ്യോമാതിർത്തിയിൽ പ്രവേശിച്ച് എയർ ഇന്ത്യ വിമാനം', href: '/story/qatar-labour-law', date: '6 hr', category: 'India' },
];

export const mostRead: Story[] = [
  { title: 'അസാധാരണമായ വൈദ്യുതി ഉപഭോഗത്തിൽ തോന്നിയ സംശയം; ഫ്ലാറ്റിനുള്ളിൽ 309 മലമ്പാമ്പുകളെ', href: '/story/ips-shrikumar' },
  { title: 'അന്ന് രാത്രി മുഴുവൻ ഞാൻ കരഞ്ഞു, കൂടെ നിന്നത് സുവേന്ദുവാണ്', href: '/story/pala-election' },
  { title: 'ബിജെപിക്ക് തിരിച്ചടി; തിരുവനന്തപുരം നഗരസഭയിൽ സത്യപ്രതിജ്ഞ അസാധു', href: '/story/vote-buying' },
  { title: 'ചെക്ക് കേസ്: അൽ ഹംറ ഡയറക്ടർ ജവാദ് മുസ്തഫാവിക്ക് തടവും പിഴയും', href: '/story/sabarimala-traffic' },
  { title: 'കൊച്ചിയിൽ യുവതിയെ കാറിൽ തട്ടിക്കൊണ്ടുപോയി ബലാത്സംഗം', href: '/story/india-ireland-odi' },
];

export const sectionClusters: SectionCluster[] = [
  {
    id: 'kerala', name: 'കേരളം', nameEn: 'Kerala', href: '/kerala',
    lead: { title: 'സംസ്ഥാന തെരഞ്ഞെടുപ്പ് കമ്മീഷണറായി എൻ.ശേഷാദ്രിനാഥനെ നിയമിക്കാൻ മന്ത്രിസഭാ തീരുമാനം', href: '/story/india-uae-trade', date: '5:20 PM', excerpt: 'ഗവർണറോട് ശിപാർശ ചെയ്യാൻ മന്ത്രിസഭാ യോഗം തീരുമാനിച്ചു.' },
    items: [
      { title: 'തിരുവല്ലയിലെ തോൽവിയിൽ നടപടി; ഏരിയ കമ്മിറ്റി അംഗത്തെ തരംതാഴ്ത്തി സിപിഎം', href: '/story/gold-price-record', date: '4:30 PM' },
      { title: 'സഭയിൽ ഏറ്റുമുട്ടി മുഖ്യമന്ത്രിയും പ്രതിപക്ഷ നേതാവും', href: '/story/india-ireland-odi', date: '3:45 PM' },
      { title: 'വീര്യം കുറഞ്ഞ മദ്യത്തിന്റെ നികുതി കുറക്കുന്ന കാര്യം എൽഡിഎഫ് നടപ്പിലാക്കിയിട്ടില്ല', href: '/story/qatar-labour-law', date: '2:15 PM' },
      { title: 'വീണ്ടും സത്യപ്രതിജ്ഞ ചെയ്ത് ബിജെപി കൗൺസിലർമാർ; നിയമവിരുദ്ധമെന്ന് എൽഡിഎഫ്', href: '/story/palakkad-hospital', date: '1:00 PM' },
    ],
  },
  {
    id: 'india', name: 'ഇന്ത്യ', nameEn: 'India', href: '/india',
    lead: { title: 'പാസ്പോർട്ട് ഒരു യാത്രാരേഖ മാത്രമാണ്, പൗരത്വത്തിനുള്ള തെളിവല്ല- വിദേശകാര്യ മന്ത്രാലയം', href: '/story/palakkad-hospital', date: '4:41 PM', excerpt: 'പൗരത്വം തെളിയിക്കാൻ പാസ്പോർട്ട് മാത്രം ഉപയോഗിക്കാൻ കഴിയില്ലെന്ന് കേന്ദ്ര വിദേശകാര്യ മന്ത്രാലയം വ്യക്തമാക്കി.' },
    items: [
      { title: 'കനത്ത മഴയില്‍ കോച്ചിന്റെ വാതില്‍ തുറന്നിട്ടതിൽ തർക്കം; 22കാരനെ കുത്തിക്കൊന്നു', href: '/story/india-uae-trade', date: '3:20 PM' },
      { title: 'ഭരണഘടനാ വ്യവസ്ഥകള്‍ ഉയര്‍ത്തിപ്പിടിക്കണം; ശിവസേന ഉദ്ദവ് വിഭാഗം എംപിമാര്‍', href: '/story/india-ireland-odi', date: '2:50 PM' },
      { title: 'പാക് വ്യോമാതിർത്തിയിൽ പ്രവേശിച്ച് എയർ ഇന്ത്യ വിമാനം', href: '/story/qatar-labour-law', date: '1:30 PM' },
    ],
  },
  {
    id: 'gulf', name: 'ഗൾഫ്', nameEn: 'Gulf', href: '/gulf',
    lead: { title: 'സൗദിയുടെ വിവിധ ഇടങ്ങളിൽ ശക്തമായ പൊടിക്കാറ്റ് വീശും', href: '/story/gold-price-record', date: '3:15 PM', excerpt: 'ദൃശ്യപരത കുറയുമെന്ന് മുന്നറിയിപ്പ്.' },
    items: [
      { title: 'സൗദി ബോക്സ് ഓഫീസ് പിടിച്ചടക്കി ഹോളിവുഡ് ചിത്രങ്ങൾ; ഒറ്റ ആഴ്ചയിൽ 2.2 കോടി റിയാൽ', href: '/story/india-ireland-odi', date: '2:00 PM' },
      { title: 'അനധികൃത ഡെലിവറി സർവീസുകൾക്ക് പൂട്ടിടാൻ സൗദി; ആപ്പുകൾ ബ്ലോക്ക് ചെയ്യും', href: '/story/qatar-labour-law', date: '12:30 PM' },
      { title: 'ഖത്തറിൽ പുതിയ തൊഴിൽ നിയമം; പ്രവാസികൾക്ക് ആശ്വാസം', href: '/story/qatar-labour-law', date: '11:10 AM' },
    ],
  },
  {
    id: 'entertainment', name: 'വിനോദം', nameEn: 'Entertainment', href: '/entertainment',
    lead: { title: 'തിയറ്ററുകളിലെ പോപ്കോണിന്റെ വില കുറച്ചാൽ സാധാരണക്കാര്‍ക്ക് ഉപകാരമാകും; രാം ചരൺ', href: '/story/mammootty-film', date: '4:20 PM', excerpt: 'സുഹൃത്തുക്കൾക്കും കുടുംബങ്ങൾക്കും ഒരുമിച്ച് ആസ്വദിക്കാൻ പറ്റിയ ഏറ്റവും ചെലവ് കുറഞ്ഞ മാർഗ്ഗം ഇപ്പോഴും സിനിമ തിയറ്ററുകൾ തന്നെ.' },
    items: [
      { title: 'എമ്പുരാന് ശേഷം മുരളി ഗോപിയുടെ തിരക്കഥ; അനന്തൻ കാട് നാളെ മുതൽ', href: '/story/mohanlal-jeethu', date: '3:50 PM' },
      { title: 'മിണ്ടാതിരുന്നാൽ ചോദിക്കും വായിൽ കൊഴുക്കട്ടയാണോ; രജനീകാന്ത്', href: '/story/ott-release', date: '3:10 PM' },
      { title: 'എല്ലാ പ്രശ്നങ്ങൾക്കും ഉടൻ പരിഹാരമാകും; അമ്മ വിഷയത്തിൽ മമ്മൂട്ടി', href: '/story/dileesh-pothan', date: '2:40 PM' },
    ],
  },
  {
    id: 'sports', name: 'കായികം', nameEn: 'Sports', href: '/sports',
    lead: { title: 'ഇറാന് രണ്ട് ദിവസം മുമ്പ് യുഎസിലേക്ക് പ്രവേശിക്കാം; ഭാഗിക ഇളവ് നൽകി യുഎസ്', href: '/story/india-ireland-odi', date: '5:00 PM', excerpt: 'ലോകകപ്പിൽ അവസാന ഗ്രൂപ്പ് മത്സരത്തിന് മുന്നോടിയായി ഇറാന് ഭാഗികമായ ഇളവ് നൽകി യുഎസ്.' },
    items: [
      { title: 'റോഡ്രിഗോ ഡി പോൾ: ലയണൽ മെസ്സിയുടെ നിഴൽമനുഷ്യൻ', href: '/story/australia-wins', date: '4:15 PM' },
      { title: 'വിനീഷ്യസ് ജൂനിയർ: വെറുക്കപ്പെട്ടവനിൽ നിന്നും പ്രിയപ്പെട്ടവനിലേക്കുള്ള ദൂരം', href: '/story/gold-price-record', date: 'Jun 23' },
      { title: 'എഴുതിത്തള്ളാറായിട്ടില്ല, ആ കിരീടം അയാളെ അർഹിക്കുന്നുണ്ട്', href: '/story/qatar-labour-law', date: 'Jun 22' },
    ],
  },
];

export const videos: Story[] = [
  { title: 'നൂറ്റാണ്ടുകള്‍ പഴക്കമുള്ള പള്ളി വരെ പൊളിച്ചു; ബുള്‍ഡോസര്‍ രാജ്', href: '/story/ips-shrikumar', date: '6:41 PM' },
  { title: 'മരവിപ്പിച്ച ഇറാനിയന്‍ ഫണ്ടുകള്‍ക്ക് മോചനം; നിയന്ത്രണം തുടരാന്‍ അമേരിക്ക', href: '/story/pala-election', date: '6:39 PM' },
  { title: 'ട്രംപിന്റെ കല്‍പനകള്‍ക്ക് വഴങ്ങില്ലെന്ന് നെതന്യാഹു', href: '/story/vote-buying', date: '6:37 PM' },
  { title: 'ലെബനാൻ ജനതയുടെ ചങ്കിടിപ്പേറ്റുന്ന US ഇറാൻ കരാർ', href: '/story/sabarimala-traffic', date: 'Jun 23' },
];

export const galleryItems = [
  { alt: 'G1' }, { alt: 'G2' }, { alt: 'G3' }, { alt: 'G4' }, { alt: 'G5' },
];

// Helper: find a cluster by id (layouts pick the clusters they want to feature)
export function cluster(id: string): SectionCluster {
  const c = sectionClusters.find((s) => s.id === id);
  if (!c) throw new Error(`Unknown section cluster: ${id}`);
  return c;
}

export const shelfEditorialHero: Story = {
  title: 'മോദിയുടെ റെക്കോഡിലുമുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക വിരിച്ചപ്പോൾ',
  excerpt: 'മോദി അധികാരത്തിലേറുന്നതിന്റെ രണ്ട് വർഷം മുൻപ്, 2011 നവംബറിൽ, ടൈം മാഗസിൻ യൂറോപ്പ് എഡിഷൻ ആഗോള രംഗത്ത് വരാനിരിക്കുന്ന അതിശക്തരെപ്പറ്റി ചെയ്ത കവർ സ്റ്റോറി ഇന്ത്യയെ ചിത്രീകരിച്ചത്, ചൈനക്കൊപ്പം ആഗോള സാമ്പത്തിക ശക്തിയാകാൻ പോകുന്ന രാജ്യമെന്ന നിലക്കായിരുന്നു. എന്നാൽ ആ സ്ഥാനം പിന്നീട് നഷ്ടമായി. മൂന്നു...',
  category: 'Analysis',
  href: '/shelf/analysis',
  date: '25 Jun 2026'
};

export const shelfEditorialGrid: Story[] = [
  {
    title: 'വിനീഷ്യസ് ജൂനിയർ.. വെറുക്കപ്പെട്ടവനിൽ നിന്നും പ്രിയപ്പെട്ടവനിലേക്കുള്ള ദൂരം',
    category: 'Football',
    href: '/shelf/vincius-jnior-life-story-327688'
  },
  {
    title: 'രണ്ട് ജനാധിപത്യ രാജ്യങ്ങൾ; രണ്ടുതരം മാധ്യമ വേട്ട',
    category: 'Analysis',
    href: '/shelf/media-scan-latest-episode-327683'
  },
  {
    title: 'എസ്ഐആർ ഇന്ത്യ ജീവിക്കണോ മരിക്കണോ?',
    category: 'Column',
    href: '/shelf/should-sir-india-live-or-die-327553'
  }
];

export const keralaEditorialHero: Story = {
  title: 'കെപിസിസി പ്രസിഡന്റ് സ്ഥാനം ലക്ഷ്യമിട്ട് ജോസഫ് വാഴക്കൻ',
  excerpt: 'പൂർണ്ണമായും പാർട്ടിക്ക് വേണ്ടി പ്രവർത്തിക്കാൻ കഴിയുന്ന ഒരു സമയമാണിത്. മറ്റ് ചുമതലകളൊന്നുമില്ലെന്നും ഡൽഹിയിലെത്തിയ ജോസഫ് വാഴക്കൻ പറഞ്ഞു',
  category: 'Kerala',
  href: '/kerala',
  date: '1:15 PM'
};

export const keralaEditorialGrid: Story[] = [
  {
    title: 'വീര്യം കുറഞ്ഞ മദ്യത്തിന്റെ നികുതി കുറച്ച തീരുമാനം പിൻവലിക്കണം -കാന്തപുരം',
    category: 'Kerala',
    href: '/kerala'
  },
  {
    title: 'ഫാസ്ടാഗിൽ തർക്കം; വെട്ടിച്ചിറ ടോൾപ്ലാസയിൽ ജീവനക്കാരും യാത്രക്കാരും ഏറ്റുമുട്ടി',
    category: 'Kerala',
    href: '/kerala'
  },
  {
    title: '16കാരന്റെ മുഖത്തടിച്ച സംഭവം; ഞാറക്കൽ എസ്ഐഐക്കെതിരെ കൂടുതൽ പരാതി',
    category: 'Kerala',
    href: '/kerala'
  },
  {
    title: 'സെക്രട്ടേറിയേറ്റ് മാർച്ചിനിടെ ബ്ലേഡ് കൊണ്ടുവന്ന എസ്എഫ്ഐ പ്രവർത്തകനെ തിരിച്ചറിഞ്ഞെന്ന് പോലീസ്',
    category: 'Kerala',
    href: '/kerala'
  },
  {
    title: 'മദ്യനികുതിയിൽ ചർച്ച നടത്തുകയായിരുന്നു അഭികാമ്യം -വി.എം സുധീരൻ',
    category: 'Kerala',
    href: '/kerala'
  },
  {
    title: 'നായകടിച്ച ചെരിപ്പ് നന്നാക്കി നൽകാത്ത കമ്പനിക്ക് 5000 രൂപ പിഴ',
    category: 'Kerala',
    href: '/kerala'
  }
];
