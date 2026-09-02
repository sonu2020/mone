// ============================================================================
// mediaoneonline.com snapshot — captured 2 Aug 2026 for the /home4 client
// preview. Band order, headlines, links and artwork mirror the live homepage
// so the new layout can be reviewed on the real editorial mix.
// Live band order: Lead → Latest → Shelf → Videos → Kerala → Magazine →
// Entertainment → Sports → Gulf → National → World.
// Every image URL is the one the live page pairs with that story; the Videos
// band is served from the repo's real YouTube catalogue (src/lib/videos.ts).
// Regenerate against the live page when the preview needs refreshing.
// ============================================================================

export interface LiveStory {
  title: string;
  href: string;
  image?: string;       // absolute URL on the live CDN
  category?: string;
  date?: string;        // IST clock, only where the live page publishes one
  excerpt?: string;
}

export interface FeedItem extends LiveStory {
  time: string;
}

export interface LiveSection {
  id: string;
  label: string;
  href: string;
  stories: LiveStory[];
}

export const SOURCE = { url: 'https://www.mediaoneonline.com/', capturedAt: '2026-08-02' } as const;

// Hero package — the live masthead lead plus its two companion stories.
export const leadStories: LiveStory[] = [
  { title: "സംസ്ഥാനത്തെ മുഴുവന്‍ ജില്ലകളിലും മഴ മുന്നറിയിപ്പ്; 12 ജില്ലകളില്‍ ഓറഞ്ച് അലര്‍ട്ട്,...", href: "/story/rain-alert", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1432284-untitled-1.webp", category: "Kerala", date: "6:00 PM", excerpt: "പത്തനംതിട്ട, കണ്ണൂർ ജില്ലകളിലെ വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾക്കും ആലപ്പുഴ ജില്ലയിലെ രണ്ട് താലൂക്കുകളിലെ വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾക്കും തിങ്കളാഴ്ച അവധി പ്രഖ്യാപിച്ചിട്ടുണ്ട്." },
  { title: "'തുടർഭരണം അപകടമാണെന്ന് സാനുമാഷിന് തോന്നിയില്ല'; എൽഡിഎഫ് സർക്കാരിനെ വിമർശിച്ച സാഹിത്യകാരൻമാരെ...", href: "/story/kozhikode-bridge", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566378-pv-1.webp", category: "Kerala" },
  { title: "'കാലവർഷക്കെടുതിയിൽ സംസ്ഥാനത്തിന്റെ സാഹചര്യം മനസ്സിലാക്കി ഇടപെടണം'; മുഖ്യമന്ത്രിക്കെതിരെ സിപിഎം", href: "/story/idukki-coffee", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566376-cpm.webp", category: "Kerala" },
];

// Latest News feed.
export const latest: LiveStory[] = [
  { title: "ചിപ്സ് പാക്കറ്റിലെ കളിപ്പാട്ടം വിഴുങ്ങിയ അഞ്ചുവയസുകാരന് ദാരുണാന്ത്യം", href: "/story/parliament-session", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566377-death.webp", category: "India" },
  { title: "'ഇന്ത്യൻ ടീമിലേക്ക് പരിഗണിക്കാത്തതിൽ നിരാശയുണ്ടോ'; പ്രതികരണവുമായി ഭുവി", href: "/story/ipl-2026-final", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566372-bhuvi.webp", category: "Sports" },
  { title: "'അച്ഛന്റെ പണം തട്ടി, ആർത്തവ സമയത്തും അടിവയറ്റിൽ ഇടിച്ചു'; വിവാഹത്തിന് പിന്നാലെ ദുരനുഭവം തുറന്ന്...", href: "/story/sleep-health", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566373-death.jfif", category: "Lifestyle" },
  { title: "ഇറാനെതിരായ നീക്കത്തിൽ നിന്ന് ട്രംപിനെ പിന്നോട്ട് വലിച്ചതെന്ത്? ആ രഹസ്യകരാർ എന്താണ്?", href: "/story/g7-summit", image: "https://www.mediaoneonline.com/h-upload/2026/07/22/500x300_1563985-rtrtr.webp", category: "World" },
  { title: "ആറു വയസ്സുകാരൻ ലോറി ഇടിച്ച് മരിച്ച സംഭവത്തിൽ 30 വർഷത്തിനുശേഷം ലോറി ഡ്രൈവർ അറസ്റ്റിൽ", href: "/story/ernakulam-accident", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566370-lorry-1.webp", category: "Kerala" },
  { title: "വീടൊഴിപ്പിക്കാനെത്തിയ വീട്ടുടമസ്ഥയ്ക്ക് നേരെ വെടിയുതിർത്ത് അഭിഭാഷകൻ", href: "/story/gst-collection", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566364-chandiha.webp", category: "India" },
  { title: "മലപ്പുറം മഞ്ചേരിയിൽ അമ്പലക്കുളത്തിൽ നീന്തുന്നതിനിടെ വിദ്യാർഥി മുങ്ങിമരിച്ചു", href: "/story/malappuram-career", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566366-kuuu.webp", category: "Kerala" },
  { title: "'തീമഴപെയ്ത വഴികളിൽ പ്രതീക്ഷയുടെ വെളിച്ചം'; സ്‌കൂൾ ഫൈനൽ പരീക്ഷയിൽ മികച്ച വിജയം നേടി ഗസ്സയിലെ കുട്ടികൾ", href: "/story/korea-peace", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566363-gaza-sweets.webp", category: "World" },
  { title: "മോദി ഇന്ത്യയെ മാറ്റിയെങ്കിൽ പിന്നെന്തിനാണ് ദുബൈയിൽ ജീവിക്കുന്നത്?; വിവേക് ഒബ്റോയിയെയും ആർ. മാധവനെയും...", href: "/story/isro-venus", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566353-raj-takere.webp", category: "India" },
];

// Shelf — the long-form / opinion desk.
export const shelf: LiveStory[] = [
  { title: "ജാതി സംവരണത്തിനെതിരെ മുറവിളി ഉയരുന്ന കാലത്ത് ഒരു ജാതി പടം", href: "/story/dam-siltation", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1565834-or.webp", category: "Shelf" },
  { title: "സർക്കാരിന് മനസ്സില്ല, കോടതിക്ക് സമയമില്ല, മാധ്യമങ്ങൾക്ക് വയ്യേവയ്യ; ലോകകപ്പിൽ നിന്ന് മൂന്ന് വാചാല...", href: "/story/ips-shrikumar", image: "https://www.mediaoneonline.com/h-upload/2026/07/30/500x300_1565674-mmmm.webp", category: "Shelf" },
  { title: "കടലിനടിയിൽ ചരിത്രമെഴുതിയ അതുല്യയുടെ ആഴക്കടൽ വിശേഷങ്ങൾ", href: "/story/alternative-education", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1565952-untitled-1.webp", category: "Shelf" },
  { title: "ദ യമാൽ എഫക്റ്റ്", href: "/story/sabarimala-traffic", image: "https://www.mediaoneonline.com/h-upload/2026/07/26/500x300_1564756-l.webp", category: "Shelf" },
  { title: "നെതന്യാഹുവിന്റെ അർജന്റീന പ്രണയം", href: "/story/kasargod-tourism", image: "https://www.mediaoneonline.com/h-upload/2026/07/21/500x300_1563667-edfddg.webp", category: "Shelf" },
  { title: "പട്ടയമില്ല, വീടില്ല, റോഡില്ല; നിയമയുദ്ധത്തിൽ പെട്ട് വയനാട്...", href: "/story/kannur-food", image: "https://www.mediaoneonline.com/h-upload/2026/07/17/500x300_1562922-r.webp", category: "Shelf" },
  { title: "സതീശന്‍ ആള് മാറിയോ?", href: "/story/malayali-students-abroad", image: "https://www.mediaoneonline.com/h-upload/2026/07/15/500x300_1562402-vds-vds.webp", category: "Shelf" },
];
// Magazine — curated long-form from the live /magazine page.
export const magazine: LiveStory[] = [
  {
    title: "നേതാ സമസ്താ സുഖിനോ ഭവന്തു!",
    href: "/magazine/ayodhya-ram-mandir-donation-scam-329589",
    image: "https://www.mediaoneonline.com/h-upload/2026/07/08/500x300_1560756-untitled-1.webp",
    category: "Analysis",
    date: "8 July 2026",
    excerpt: "അയോധ്യയിലെ രാമക്ഷേത്രക്കൊള്ള സംഘംപരിവാറിന്റെ പിരിയിളക്കി...",
  },
  {
    title: "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
    href: "/magazine/voters-list-and-passport-328638",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/29/500x300_1558738-untitled-1.webp",
    category: "Analysis",
    date: "29 Jun 2026",
    excerpt: "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
  },
  {
    title: "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക വിരിച്ചപ്പോൾ",
    href: "/magazine/mediascan-latest-issue-328205",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/25/500x300_1557773-untitled-1.webp",
    category: "Analysis",
    date: "25 Jun 2026",
    excerpt: "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക...",
  },
  {
    title: "കെഎസ്ആർടിസിയിലെ സൗജന്യ യാത്ര: ട്രോളുകൾക്കപ്പുറമുള്ള സാമൂഹിക യാഥാർഥ്യം",
    href: "/magazine/article-ksrtc-free-travel-326957",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/13/500x300_1555241-ksrtc.webp",
    category: "Magazine",
    date: "13 Jun 2026",
    excerpt: "കെഎസ്ആർടിസി ഓർഡിനറി ബസുകളിൽ സ്ത്രീകൾക്ക് സൗജന്യ യാത്ര അനുവദിക്കുന്നതിനെക്കുറിച്ചുള്ള ചർച്ചകൾ...",
  },
  {
    title: "ഓളമുണ്ടാക്കാൻ പാറ്റ മതി; മാറ്റമുണ്ടാക്കാൻ മനുഷ്യർ വേണം.",
    href: "/magazine/cockroach-janta-political-partys-rise-reflects-youth-anger-in-india-325709",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/02/500x300_1552590-untitled-1.webp",
    category: "Magazine",
    date: "2 Jun 2026",
    excerpt: "കോക്രോച്ച് ജനതാ പാർട്ടി (സിജെപി) എന്താണ്? അത് എന്തല്ല എന്ന് പറയാനാണ് എളുപ്പം...",
  },
  {
    title: "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
    href: "/magazine/buddha-purnima-analysis-322500",
    image: "https://www.mediaoneonline.com/h-upload/2026/05/01/500x300_1544995-untitled-1.webp",
    category: "Analysis",
    date: "1 May 2026",
    excerpt: "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
  },
];

// Live rail — the only timestamps the homepage renders server-side.
export const feed: FeedItem[] = [
  { time: "18:18", title: "'തുടർഭരണം അപകടമാണെന്ന് സാനുമാഷിന് തോന്നിയില്ല'; എൽഡിഎഫ് സർക്കാരിനെ...", href: "/story/thrissur-temple", category: "Kerala" },
  { time: "18:00", title: "സംസ്ഥാനത്തെ മുഴുവന്‍ ജില്ലകളിലും മഴ മുന്നറിയിപ്പ്; 12 ജില്ലകളില്‍ ഓറഞ്ച് അലര്‍ട്ട്,...", href: "/story/rain-alert", category: "Kerala" },
  { time: "17:56", title: "'കാലവർഷക്കെടുതിയിൽ സംസ്ഥാനത്തിന്റെ സാഹചര്യം മനസ്സിലാക്കി ഇടപെടണം'; ...", href: "/story/pathanamthitta-hospital", category: "Kerala" },
  { time: "17:52", title: "പ്രതിഷേധക്കാർ പേടിക്കണം, ഡൽഹി പൊലീസിൻറെമെറ്റ ഗ്ളാസിനെ", href: "/story/kochi-crime", category: "Videos" },
];

// Section bands, in live homepage order.
export const sections: LiveSection[] = [
  {
    id: "kerala", label: "Kerala", href: "/kerala",
    stories: [
      { title: "ആറു വയസ്സുകാരൻ ലോറി ഇടിച്ച് മരിച്ച സംഭവത്തിൽ 30 വർഷത്തിനുശേഷം ലോറി ഡ്രൈവർ അറസ്റ്റിൽ", href: "/story/ernakulam-accident", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566370-lorry-1.webp", category: "Kerala" },
      { title: "മലപ്പുറം മഞ്ചേരിയിൽ അമ്പലക്കുളത്തിൽ നീന്തുന്നതിനിടെ വിദ്യാർഥി മുങ്ങിമരിച്ചു", href: "/story/palakkad-hospital", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566366-kuuu.webp", category: "Kerala" },
      { title: "'പത്മഭൂഷൺ മഹാന്മാർക്ക് നൽകാനുള്ളതാണ്; ദുഷ്ടരാജാവായ വെള്ളാപ്പള്ളിക്ക് നൽകി വിലയില്ലാതാക്കി'; രൂക്ഷ...", href: "/story/pala-election", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566357-gokulam-gopalan-1.webp", category: "Kerala" },
      { title: "മലബാറിൽ ടോക്സികോളജി ചികിത്സാ കേന്ദ്രത്തിന്റെ അഭാവം പരിഹരിക്കപ്പെടണം: മന്ത്രി ടി.സിദ്ദീഖ്", href: "/story/vote-buying", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566346-iqraa.webp", category: "Kerala" },
      { title: "മഞ്ചേരി നഗരസഭ കൗൺസിലറുടെ കൊലപാതകം; മുങ്ങിയ ഒന്നാം പ്രതി പിടിയിൽ", href: "/story/kochi-metro", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566343-majeri-murder-1.webp", category: "Kerala" },
      { title: "പൂനെയിൽ മലയാളി കുടുംബം ജീവനൊടുക്കിയ നിലയിൽ", href: "/story/trivandrum-water", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566349-vinod.webp", category: "Kerala" },
      { title: "മാധ്യമപ്രവർത്തകൻ എൻ. മാധവൻകുട്ടിക്ക് ആശ്വാസം; ഫേസ്ബുക്ക് അക്കൗണ്ട്...", href: "/story/gold-smuggling", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566334-hc.webp", category: "Kerala" },
      { title: "ഒരു നിലയും വിലയും കല്‍പിക്കുന്നുണ്ടോ? കോൺഗ്രസിന് ലീഗിനെ പാലം...", href: "/story/temple-theft", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566326-iuml.webp", category: "Kerala" },
    ],
  },
  {
    id: "entertainment", label: "Entertainment", href: "/entertainment",
    stories: [
      { title: "'എന്റെ ജീവിതത്തെക്കുറിച്ച് നിങ്ങൾക്ക് എന്തറിയാം?, എനിക്ക് ഇഷ്ടമുള്ളത് ഞാൻ പോസ്റ്റ് ചെയ്യും';...", href: "/story/mammootty-film", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566350-anu.webp", category: "Entertainment" },
      { title: "സോഷ്യൽ മീഡിയയിൽ തരംഗമായി ‘തൂവെള്ള തട്ടം’; ആർദ്ര മധുര സംഗീതവുമായി ഷെമീർ മടത്തറയിൽ", href: "/story/mohanlal-jeethu", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566230-ca15e4e9-5957-45f2-b616-0114259d0e96.webp", category: "Entertainment" },
      { title: "പോയസ് ഗാര്‍ഡനിൽ വരെ വീടുണ്ടായിരുന്ന നടൻ, നടി ലക്ഷ്മിയുടെ മുൻ ഭര്‍ത്താവ്'; മരുന്നിന് പോലും...", href: "/story/ott-release", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566201-mohan-sharma.avif", category: "Entertainment" },
      { title: "കൊച്ചിൻ ഹനീഫയുടെ പുതിയ വീട്ടിൽ സുൽഫത്തിനൊപ്പം മമ്മൂട്ടി; വൈറലായി ചിത്രങ്ങൾ", href: "/story/dileesh-pothan", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566181-sb03235jpg.webp", category: "Entertainment" },
      { title: "കുമ്പളങ്ങി നൈറ്റ്സിന് ശേഷം മധു സി നാരായണൻ; നസ്‌ലൻ നായകൻ", href: "/story/gopi-sundar", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566110-whatsapp-image-2026-08-01-at-23932-pm.webp", category: "Entertainment" },
      { title: "സൂര്യയും മമിതയും തമ്മിൽ 20 വയസിന്‍റെ പ്രായവ്യത്യാസം; 42കാരനും...", href: "/story/aamir-khan-film", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1565908-1784981559-2984.webp", category: "Entertainment" },
      { title: "'മോഹൻലാലിന്‍റെ മകളായതുകൊണ്ട് ആളുകൾ ജഡ്‍ജ് ചെയ്യും, കമന്‍റുകൾ...", href: "/story/alappuzha-boat", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1565826-screenshot-2026-07-31-101318.webp", category: "Entertainment" },
    ],
  },
  {
    id: "sports", label: "Sports", href: "/sports",
    stories: [
      { title: "വിരമിച്ച അജിങ്ക്യ രഹാനെക്ക് എത്ര രൂപ പെന്‍ഷന്‍ കിട്ടും? ബിസിസിഐയുടെ...", href: "/story/fifa-2026-india", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566291-ajinkya.webp", category: "Sports" },
      { title: "ലോകകപ്പിനായൊരുങ്ങി റിയാദ് കിങ് ഫഹദ് സ്പോർട്സ് സിറ്റി സ്റ്റേഡിയം;...", href: "/story/qatar-labour-law", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566212-king-fahad.webp", category: "Gulf" },
      { title: "'വാർത്തകൾ അടിസ്ഥാന രഹിതം' കേരള ബ്ലാസ്റ്റേഴ്സ് ഏറ്റെടുക്കാൻ ചർച്ച...", href: "/story/saudi-visa-policy", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566165-blaster.webp", category: "Gulf" },
      { title: "കെസിഎൽ മൂന്നാം സീസണ് കൗണ്ട്ഡൗൺ തുടങ്ങി; ആവേശത്തിന്റെ ക്രിക്കറ്റ്...", href: "/story/pv-sindhu-ranking", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1566022-whatsapp-image-2026-07-31-at-161243.webp", category: "Sports" },
      { title: "'സാമ്പത്തികച്ചട്ടങ്ങൾ ലംഘിച്ചു'; ചെൽസിക്ക് 108 കോടി രൂപ പിഴയും...", href: "/story/kerala-blasters", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x300_1566010-whatsapp-image-2026-07-31-at-195213.webp", category: "Sports" },
    ],
  },
  {
    id: "gulf", label: "Gulf", href: "/gulf",
    stories: [
      { title: "ഇസ്രായേൽ കുടിയേറ്റ കേന്ദ്രങ്ങളിൽ നിന്നുള്ള ഉൽപന്ന ഇറക്കുമതി നിരോധനം; അയർലൻഡ്​ നടപടി സ്വാഗതം ചെയ്ത്​...", href: "/story/kuwait-construction", image: "https://www.mediaoneonline.com/h-upload/2026/06/15/500x300_1555653-qatar.webp", category: "Gulf" },
      { title: "ജലീബ്​ അൽ ഷുയൂഖിലെ സുരക്ഷ പരി​ശോധന തുടരുന്നു: അറസ്റ്റിലായത്​ 1253 പേർ", href: "/story/uae-flights", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566275-whatsapp-image-2026-08-02-at-103218-am.webp", category: "Gulf" },
      { title: "കൊളസ്‌ട്രോൾ ചികിത്സക്ക് ലിപ്‌ഫെൻഡ്ര; അമേരിക്കക്ക് പിന്നാലെ അനുമതി നൽകി യുഎഇ", href: "/story/saudi-visa", image: "https://www.mediaoneonline.com/h-upload/2026/08/01/500x300_1566238-lip.webp", category: "Gulf" },
      { title: "ഹൗ വല്ലാത്ത ചൂട്... യുഎഇയിൽ 50°C പിന്നിട്ട് വേനൽചൂട്", href: "/story/bahrain-malayali", image: "https://www.mediaoneonline.com/h-upload/2026/07/16/500x300_1562740-hot.webp", category: "Gulf" },
      { title: "ബാബുൽ മന്ദബിൽ കപ്പലുകൾക്ക് ഫീസ് ഏർപ്പെടുത്താൻ പദ്ധതിയില്ല; വാർത്തകൾ തള്ളി യമനിലെ ഹൂതി ഭരണകൂടം", href: "/story/qatar-development", image: "https://www.mediaoneonline.com/h-upload/2026/07/21/500x300_1563782-babal-mandab.webp", category: "Gulf" },
      { title: "ഹൃദയാഘാതം; മലപ്പുറം മമ്പാട് സ്വദേശി മുഹമ്മദ് ഷാജി (49) ജിദ്ദയിൽ...", href: "/story/oman-investment", category: "Gulf" },
      { title: "ബഹ്റൈനിൽ നിന്ന് കേരളത്തിലേക്ക്​ സർവീസുകൾ റദ്ദാക്കൽ തുടർന്ന് ഈ...", href: "/story/popular-travel-destinations", category: "Gulf" },
      { title: "കയറിവാടാ മക്കളേ... 14 ദിവസത്തെ സൗജന്യ ടൂറിസ്റ്റ് വിസ പ്രഖ്യാപിച്ച്...", href: "/story/flight-fares-drop", category: "Gulf" },
    ],
  },
  {
    id: "national", label: "National", href: "/india",
    stories: [
      { title: "ചിപ്സ് പാക്കറ്റിലെ കളിപ്പാട്ടം വിഴുങ്ങിയ അഞ്ചുവയസുകാരന് ദാരുണാന്ത്യം", href: "/story/farmer-protest", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566377-death.webp", category: "India" },
      { title: "വീടൊഴിപ്പിക്കാനെത്തിയ വീട്ടുടമസ്ഥയ്ക്ക് നേരെ വെടിയുതിർത്ത് അഭിഭാഷകൻ", href: "/story/railway-budget", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566364-chandiha.webp", category: "India" },
      { title: "52 വർഷങ്ങൾക്ക് ശേഷം കുടുംബത്തിൽ പെൺകുഞ്ഞ് ജനിച്ചു; ആഘോഷനിമിഷങ്ങൾ സോഷ്യൽ മീഡിയയിൽ വൈറൽ", href: "/story/gold-price-record", image: "https://www.mediaoneonline.com/h-upload/2026/07/31/500x500_1565965-girl-birth.webp", category: "India" },
      { title: "മോദി ഇന്ത്യയെ മാറ്റിയെങ്കിൽ പിന്നെന്തിനാണ് ദുബൈയിൽ ജീവിക്കുന്നത്?; വിവേക് ഒബ്റോയിയെയും ആർ. മാധവനെയും...", href: "/story/india-uae-trade", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566353-raj-takere.webp", category: "India" },
      { title: "സിജെപി പ്രതിഷേധം: 180 ഇൻഫ്ലുവന്‍സര്‍മാര്‍ ഡല്‍ഹി പൊലീസിൻ്റെ നിരീക്ഷണത്തില്‍", href: "/story/india-ireland-odi", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566338-cjp-protest-8u.webp", category: "India" },
      { title: "ഇന്ത്യയിൽ ഈ പാമ്പുകളെ നിസാരമായി കാണരുത്", href: "/story/agriculture-drone", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566330-sefs.webp", category: "India" },
      { title: "65,000 രൂപ ശമ്പളത്തിൽ മകന് യുഎസ് വിദ്യാഭ്യാസം; അഭിജീത് ദീപ്കെയുടെ പിതാവിനെതിരെ അന്വേഷണം...", href: "/story/farmer-subsidy", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x500_1566318-abh.webp", category: "India" },
      { title: "33 വർഷത്തെ നിയമപോരാട്ടത്തിന് അന്ത്യം; രാജ്യദ്രോഹക്കേസിൽ 78കാരനായ...", href: "/story/crop-disease-alert", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566319-sdfg.webp", category: "India" },
      { title: "45 മിനിറ്റില്‍ കഴിച്ചുതീര്‍ത്തത് അഞ്ച് പ്ലേറ്റ് മട്ടണ്‍ ബിരിയാണി!...", href: "/story/electric-car-sales", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566314-mttb.webp", category: "India" },
      { title: "ഇ20 പെട്രോള്‍: പ്രധാനമന്ത്രിയുടെ വസതിയിലേക്ക് മാർച്ച് പ്രഖ്യാപിച്ച്...", href: "/story/motor-vehicle-act", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566256-20.webp", category: "India" },
    ],
  },
  {
    id: "world", label: "World", href: "/world",
    stories: [
      { title: "'തീമഴപെയ്ത വഴികളിൽ പ്രതീക്ഷയുടെ വെളിച്ചം'; സ്‌കൂൾ ഫൈനൽ പരീക്ഷയിൽ...", href: "/story/eu-climate", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566363-gaza-sweets.webp", category: "World" },
      { title: "ചന്ദ്രനില്‍ ഇടിച്ചിറങ്ങി ഇല്ലാതാകാന്‍ സ്‌പേസ് എക്സ് റോക്കറ്റ്", href: "/story/africa-food-crisis", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566295-space-x-89768.webp", category: "World" },
      { title: "16 വയസ്സില്‍ താഴെയുള്ളവര്‍ക്ക് സമൂഹമാധ്യമങ്ങള്‍ വിലക്കിയത്...", href: "/story/china-taiwan", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566283-sm-ban.webp", category: "World" },
      { title: "നിംസ്‌ദായ് ഇനി ഓർമ! ലോകപ്രശസ്ത പർവ്വതാരോഹകൻ നിർമൽ പുർജ അപകടത്തിൽ...", href: "/story/australia-floods", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566281-sdt.webp", category: "World" },
      { title: "ആയുധം താഴെ വെക്കാൻ ഹമാസ് സമ്മതിച്ചിട്ടും ഗസ്സയിൽ ആക്രമണം നിർത്താതെ...", href: "/story/australia-wins", image: "https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1566271-degdfgd.webp", category: "World" },
    ],
  },
];

export const section = (id: string): LiveSection => {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown live section: ${id}`);
  return found;
};
