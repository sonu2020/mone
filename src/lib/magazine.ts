// ─── Magazine articles ──────────────────────────────────────────────────────
// Curated from the live /magazine page, with CDN image URLs.

export interface MagazineArticle {
  slug: string;
  title: string;
  titleML: string;
  description: string;
  image: string;
  category: string;
  date: string;
  href: string;
  body: string[];
}

export const magazineArticles: MagazineArticle[] = [
  {
    slug: "ayodhya-ram-mandir-donation-scam-329589",
    title: "നേതാ സമസ്താ സുഖിനോ ഭവന്തു!",
    titleML: "നേതാ സമസ്താ സുഖിനോ ഭവന്തു!",
    description:
      "അയോധ്യയിലെ രാമക്ഷേത്രക്കൊള്ള സംഘംപരിവാറിന്റെ പിരിയിളക്കി...",
    image: "https://www.mediaoneonline.com/h-upload/2026/07/08/500x300_1560756-untitled-1.webp",
    category: "Analysis",
    date: "8 July 2026",
    href: "/magazine/ayodhya-ram-mandir-donation-scam-329589",
    body: [
      "അയോധ്യയിലെ രാമക്ഷേത്രക്കൊള്ള സംഘംപരിവാറിന്റെ പിരിയിളക്കി...",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
  {
    slug: "voters-list-and-passport-328638",
    title: "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
    titleML: "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
    description: "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/29/500x300_1558738-untitled-1.webp",
    category: "Analysis",
    date: "29 Jun 2026",
    href: "/magazine/voters-list-and-passport-328638",
    body: [
      "വോട്ടേഴ്സ് ലിസ്റ്റില്‍ ഇല്ലെങ്കില്‍ പാസ്പോര്‍ട്ട് ഇല്ല?",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
  {
    slug: "mediascan-latest-issue-328205",
    title: "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക വിരിച്ചപ്പോൾ",
    titleML: "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം",
    description:
      "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക...",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/25/500x300_1557773-untitled-1.webp",
    category: "Analysis",
    date: "25 Jun 2026",
    href: "/magazine/mediascan-latest-issue-328205",
    body: [
      "മോദിയുടെ റെക്കോര്‍ഡിനുണ്ട്, ഒരു മറുവശം | അമേരിക്കൻ മണ്ണിൽ ഇറാൻ പതാക...",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
  {
    slug: "article-ksrtc-free-travel-326957",
    title: "കെഎസ്ആർടിസിയിലെ സൗജന്യ യാത്ര: ട്രോളുകൾക്കപ്പുറമുള്ള സാമൂഹിക യാഥാർഥ്യം",
    titleML: "കെഎസ്ആർടിസിയിലെ സൗജന്യ യാത്ര: ട്രോളുകൾക്കപ്പുറമുള്ള സാമൂഹിക യാഥാർഥ്യം",
    description:
      "കെഎസ്ആർടിസി ഓർഡിനറി ബസുകളിൽ സ്ത്രീകൾക്ക് സൗജന്യ യാത്ര അനുവദിക്കുന്നതിനെക്കുറിച്ചുള്ള ചർച്ചകൾ...",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/13/500x300_1555241-ksrtc.webp",
    category: "Magazine",
    date: "13 Jun 2026",
    href: "/magazine/article-ksrtc-free-travel-326957",
    body: [
      "കെഎസ്ആർടിസി ഓർഡിനറി ബസുകളിൽ സ്ത്രീകൾക്ക് സൗജന്യ യാത്ര അനുവദിക്കുന്നതിനെക്കുറിച്ചുള്ള ചർച്ചകൾ കേരളത്തിൽ സജീവമാണ്.",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
  {
    slug: "cockroach-janta-political-partys-rise-reflects-youth-anger-in-india-325709",
    title: "ഓളമുണ്ടാക്കാൻ പാറ്റ മതി; മാറ്റമുണ്ടാക്കാൻ മനുഷ്യർ വേണം.",
    titleML: "ഓളമുണ്ടാക്കാൻ പാറ്റ മതി; മാറ്റമുണ്ടാക്കാൻ മനുഷ്യർ വേണം.",
    description:
      "കോക്രോച്ച് ജനതാ പാർട്ടി (സിജെപി) എന്താണ്? അത് എന്തല്ല എന്ന് പറയാനാണ് എളുപ്പം...",
    image: "https://www.mediaoneonline.com/h-upload/2026/06/02/500x300_1552590-untitled-1.webp",
    category: "Magazine",
    date: "2 Jun 2026",
    href: "/magazine/cockroach-janta-political-partys-rise-reflects-youth-anger-in-india-325709",
    body: [
      "കോക്രോച്ച് ജനതാ പാർട്ടി (സിജെപി) എന്താണ്? അത് എന്തല്ല എന്ന് പറയാനാണ് എളുപ്പം.",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
  {
    slug: "buddha-purnima-analysis-322500",
    title: "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
    titleML: "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
    description: "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
    image: "https://www.mediaoneonline.com/h-upload/2026/05/01/500x300_1544995-untitled-1.webp",
    category: "Analysis",
    date: "1 May 2026",
    href: "/magazine/buddha-purnima-analysis-322500",
    body: [
      "കൊല്ലരുതേയെന്നു കാരുണ്യത്തിൻ പൂമ്പിറ, ബുദ്ധപൂർണിമ",
      "ഈ ലേഖനം വായനക്കാർക്ക് വിഷയത്തെ കുറിച്ച് കൂടുതൽ അറിയാൻ സഹായകമാകും.",
    ],
  },
];

export function getMagazineArticle(slug: string): MagazineArticle | undefined {
  return magazineArticles.find((a) => a.slug === slug);
}
