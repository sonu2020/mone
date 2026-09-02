// ─── Section Types ──────────────────────────────────────────────────────────

export interface SectionArticle {
  title: string;
  excerpt?: string;
  href: string;
  image: string;
  date: string;
}

export interface SectionConfig {
  id: string;
  name: string;
  nameML: string;
  description: string;
  color: string;
  articles: SectionArticle[];
}

// ─── Individual Section Data ─────────────────────────────────────────────────

const keralaArticles: SectionArticle[] = [
  { title: 'കോഴിക്കോട് ജില്ലയില്‍ പുതിയ പാലം നിര്‍മ്മാണം; ഗതാഗത പ്രതിസന്ധിക്ക് പരിഹാരമാകും', href: '/story/kozhikode-bridge', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557623-untitled-1-recovered.webp', date: 'June 12, 2026' },
  { title: 'ഇടുക്കിയിലെ കാപ്പി കര്‍ഷകര്‍ക്ക് ആശ്വാസമായി പുതിയ വില', href: '/story/idukki-coffee', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 12, 2026' },
  { title: 'മലപ്പുറത്ത് വിദ്യാര്‍ത്ഥികള്‍ക്കായി പുതിയ കരിയര്‍ ഗൈഡന്‍സ് സെന്റര്‍', href: '/story/malappuram-career', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'തൃശൂരില്‍ പുരാതന ക്ഷേത്രത്തില്‍ ഉത്സവത്തിന് കൊടിയേറി', href: '/story/thrissur-temple', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp', date: 'June 11, 2026' },
  { title: 'കാസര്‍ഗോഡ് ജില്ലയില്‍ വിനോദസഞ്ചാര സാധ്യതകള്‍ ഉയര്‍ത്തിക്കാട്ടി പുതിയ പദ്ധതി', href: '/story/kasargod-tourism', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp', date: 'June 10, 2026' },
  { title: 'പത്തനംതിട്ടയില്‍ ആശുപത്രി സൗകര്യങ്ങള്‍ വിപുലീകരിക്കുന്നു', href: '/story/pathanamthitta-hospital', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557546-mammootyyyt.webp', date: 'June 10, 2026' },
  { title: 'കേരളത്തില്‍ കനത്ത മഴ; ജാഗ്രതാ നിര്‍ദേശം തുടരുന്നു', href: '/story/rain-alert', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp', date: 'June 12, 2026' },
  { title: 'പാലക്കാട് ജില്ലാ ആശുപത്രിയില്‍ പുതിയ ഓക്സിജന്‍ പ്ലാന്റ് ഉദ്ഘാടനം ചെയ്തു', href: '/story/palakkad-hospital', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557505-sanjeev-kapoor-reveals-rejecting-masterchef-india-for-not-being-paid-more-than-akshay-kumar.webp', date: 'June 12, 2026' },
  { title: 'മുംബൈ മുന്‍സിപ്പല്‍ കമ്മീഷണര്‍ ഐ പി എസ് ഐ ശ്രീകുമാറിന് കൂടുതല്‍ ചുമതല', href: '/story/ips-shrikumar', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557590-whatsapp-image-2026-06-24-at-151433.webp', date: 'June 12, 2026' },
  { title: 'പാലാ ഉപതെരഞ്ഞെടുപ്പ്: യു ഡി എഫ് സ്ഥാനാര്‍ഥി പ്രഖ്യാപനം നാളെ', href: '/story/pala-election', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557560-kldfhb.webp', date: 'June 12, 2026' },
  { title: 'വോട്ട് വാങ്ങല്‍ ആരോപണം: കേസെടുത്ത് പൊലീസ്; മുന്‍ എം എല്‍ എയുടെ പങ്ക് അന്വേഷിക്കും', href: '/story/vote-buying', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp', date: 'June 12, 2026' },
  { title: 'ശബരിമല തീര്‍ത്ഥാടന സീസണില്‍ ട്രാഫിക് ക്രമീകരണം കര്‍ശനമാക്കി ജില്ലാ ഭരണകൂടം', href: '/story/sabarimala-traffic', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp', date: 'June 11, 2026' },
  { title: 'എറണാകുളത്ത് ബൈക്ക് - ലോറി കൂട്ടിയിടിച്ച് രണ്ട് യുവാക്കള്‍ മരിച്ചു', href: '/story/ernakulam-accident', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 11, 2026' },
  { title: 'കൊച്ചിയില്‍ മെട്രോ റെയില്‍ പദ്ധതി രണ്ടാം ഘട്ടത്തിന് അനുമതി', href: '/story/kochi-metro', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
  { title: 'തിരുവനന്തപുരത്ത് ജലക്ഷാമം രൂക്ഷം; ടാങ്കര്‍ ലോറികള്‍ വിന്യസിച്ചു', href: '/story/trivandrum-water', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 11, 2026' },
];

const indiaArticles: SectionArticle[] = [
  { title: 'പാര്‍ലമെന്റ് സമ്മേളനം: സുപ്രധാന ബില്ലുകള്‍ അവതരിപ്പിക്കും', href: '/story/parliament-session', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp', date: 'June 12, 2026' },
  { title: 'ജി എസ് ടി ശേഖരണത്തില്‍ റെക്കോര്‍ഡ് വരുമാനം; ഏപ്രിലില്‍ 2.10 ലക്ഷം കോടി', href: '/story/gst-collection', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557604-sharjah.webp', date: 'June 12, 2026' },
  { title: 'ഇസ്രോയുടെ പുതിയ ദൗത്യം: ശൂക്രന്‍ പര്യവേക്ഷണ ദൗത്യത്തിന് ഒരുങ്ങുന്നു', href: '/story/isro-venus', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 11, 2026' },
  { title: 'കര്‍ഷക സമരം: കേന്ദ്ര സംസ്ഥാന ചര്‍ച്ചകള്‍ തുടങ്ങി', href: '/story/farmer-protest', image: 'https://www.mediaoneonline.com/h-upload/2026/06/01/500x300_1552422-midday-break-oman.webp', date: 'June 11, 2026' },
  { title: 'റെയില്‍വേ ബജറ്റില്‍ കേരളത്തിന് പ്രത്യേക പരിഗണന', href: '/story/railway-budget', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 10, 2026' },
  { title: 'സ്വര്‍ണ്ണ വില റെക്കോര്‍ഡില്‍; പവന്‍ 75000 രൂപ പിന്നിട്ടു', href: '/story/gold-price-record', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557645-passport1.webp', date: 'June 12, 2026' },
  { title: 'ഇന്ത്യ-യു എ ഇ വ്യാപാര കരാര്‍: കയറ്റുമതി ഇരട്ടിയാക്കാന്‍ പദ്ധതി', href: '/story/india-uae-trade', image: 'https://www.mediaoneonline.com/h-upload/2026/06/19/500x500_1556567-uddav-2.webp', date: 'June 12, 2026' },
  { title: 'അയര്‍ലണ്ടിനെതിരെ ഇന്ത്യയുടെ ഏകദിന പരമ്പര; ആദ്യ മത്സരം ഇന്ന്', href: '/story/india-ireland-odi', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557639-untitled-1.webp', date: 'June 12, 2026' },
  { title: 'കേരളത്തില്‍ സ്വര്‍ണ്ണക്കടത്ത് കേസില്‍ പുതിയ വഴിത്തിരിവ്', href: '/story/gold-smuggling', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
  { title: 'ആലപ്പുഴയില്‍ കായല്‍ കടക്കുന്നതിനിടെ ബോട്ട് മറിഞ്ഞു; 15 പേരെ രക്ഷപ്പെടുത്തി', href: '/story/alappuzha-boat', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
];

const worldArticles: SectionArticle[] = [
  { title: 'ജി 7 ഉച്ചകോടി: കാലാവസ്ഥാ വ്യതിയാനത്തിനെതിരെ ശക്തമായ നടപടിയുമായി രാജ്യങ്ങള്‍', href: '/story/g7-summit', image: 'https://www.mediaoneonline.com/h-upload/2026/06/14/500x500_1555314-ayodhya-temple.webp', date: 'June 11, 2026' },
  { title: 'ഉത്തര കൊറിയ-ദക്ഷിണ കൊറിയ ബന്ധം: സമാധാന ചര്‍ച്ചകള്‍ പുനരാരംഭിക്കുന്നു', href: '/story/korea-peace', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557601-mahuva-1.webp', date: 'June 12, 2026' },
  { title: 'യൂറോപ്യന്‍ യൂണിയനില്‍ പുതിയ കാലാവസ്ഥാ നയങ്ങള്‍ക്ക് അംഗീകാരം', href: '/story/eu-climate', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557572-bnk.webp', date: 'June 12, 2026' },
  { title: 'ആഫ്രിക്കന്‍ രാജ്യങ്ങളിലെ ഭക്ഷ്യ പ്രതിസന്ധി; ഐക്യരാഷ്ട്ര സഭയുടെ ജാഗ്രത', href: '/story/africa-food-crisis', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557569-caption.webp', date: 'June 11, 2026' },
  { title: 'ചൈനയും തായ്‌വാനും: സൈനിക നീക്കങ്ങളില്‍ പുതിയ പിരിമുറുക്കം', href: '/story/china-taiwan', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557563-john.webp', date: 'June 11, 2026' },
  { title: 'ഓസ്ട്രേലിയയില്‍ പ്രളയ ദുരിതം; രക്ഷാപ്രവര്‍ത്തനം തുടരുന്നു', href: '/story/australia-floods', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557549-fcra.webp', date: 'June 10, 2026' },
  { title: 'ഇംഗ്ലണ്ടിനെതിരെ ഓസ്ട്രേലിയക്ക് വിജയം; ലോക ടെസ്റ്റ് ചാമ്പ്യന്‍ഷിപ്പില്‍ മുന്നേറ്റം', href: '/story/australia-wins', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557670-untitled-1.webp', date: 'June 11, 2026' },
];

const factCheckArticles: SectionArticle[] = [
  { title: 'ഡെങ്കിപ്പനിക്ക് മരുന്നില്ലെന്ന പ്രചാരണം തെറ്റ്; ആരോഗ്യവകുപ്പ് വിശദീകരണം', href: '/story/fact-check-dengue', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp', date: 'June 12, 2026' },
  { title: 'പട്ടിണി മരണങ്ങൾ കുത്തനെ കൂടിയെന്ന വാദം തെറ്റ്; കണക്കുകൾ ശരിയായി വായിക്കണം', href: '/story/fact-check-starvation-deaths', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'ഉപ്പ് കൊണ്ട് കൊവിഡ് ഭേദമാകുമോ?; ശാസ്ത്രീയമായ വസ്തുതകൾ അറിയാം', href: '/story/fact-check-salt-covid', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp', date: 'June 10, 2026' },
];

const gulfArticles: SectionArticle[] = [
  { title: 'ഖത്തറില്‍ പുതിയ തൊഴില്‍ നയം പ്രഖ്യാപിച്ചു; പ്രവാസി തൊഴിലാളികള്‍ക്ക് ആശ്വാസം', href: '/story/qatar-labour-law', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557675-text-thumb.webp', date: 'June 12, 2026' },
  { title: 'സൗദിയില്‍ പ്രവാസി വിദഗ്ധര്‍ക്ക് പുതിയ വിസ നയം പ്രഖ്യാപിച്ചു', href: '/story/saudi-visa-policy', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557666-untitled-1.webp', date: 'June 12, 2026' },
  { title: 'കുവൈറ്റില്‍ നിര്‍മ്മാണ മേഖലയില്‍ പുതിയ നിയന്ത്രണങ്ങള്‍ ഏര്‍പ്പെടുത്തി', href: '/story/kuwait-construction', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557663-beef-1.webp', date: 'June 11, 2026' },
  { title: 'യു എ ഇയില്‍ നിന്നും വിദേശ രാജ്യങ്ങളിലേക്ക് കൂടുതല്‍ ഫ്ലൈറ്റുകള്‍; പ്രവാസികള്‍ക്ക് സന്തോഷ വാര്‍ത്ത', href: '/story/uae-flights', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557661-untitled-1.webp', date: 'June 12, 2026' },
  { title: 'സൗദിയില്‍ വിസ ഇളവുകള്‍ ഏര്‍പ്പെടുത്തി; ടൂറിസം മേഖലയ്ക്ക് ഉത്തേജനം', href: '/story/saudi-visa', image: 'https://www.mediaoneonline.com/h-upload/2026/06/23/500x300_1557413-untitled-1-recovered-recovered-recovered-recovered-recovered-recovered.webp', date: 'June 12, 2026' },
  { title: 'ബഹ്റൈനില്‍ മലയാളി സംഘടനകളുടെ കൂട്ടായ്മക്ക് രൂപം', href: '/story/bahrain-malayali', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557623-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'ഖത്തറില്‍ പുതിയ നഗരവികസന പദ്ധതി പ്രഖ്യാപനം; 20,000 പുതിയ വീടുകള്‍', href: '/story/qatar-development', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 11, 2026' },
  { title: 'ഒമാനില്‍ നിര്‍മ്മാണ മേഖലയില്‍ വന്‍ നിക്ഷേപം; പ്രവാസി തൊഴിലാളികള്‍ക്ക് സാധ്യത', href: '/story/oman-investment', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp', date: 'June 10, 2026' },
];

const entertainmentArticles: SectionArticle[] = [
  { title: 'മമ്മൂട്ടിയുടെ പുതിയ ചിത്രത്തിന്റെ റിലീസ് തീയതി പ്രഖ്യാപിച്ചു', href: '/story/mammootty-film', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp', date: 'June 12, 2026' },
  { title: 'മോഹന്‍ലാലും ജീത്തു ജോസഫും വീണ്ടും ഒന്നിക്കുന്നു; പുതിയ ചിത്രം പ്രഖ്യാപനം', href: '/story/mohanlal-jeethu', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp', date: 'June 12, 2026' },
  { title: 'മലയാള സിനിമയില്‍ ഓടിടി റിലീസുകള്‍ കൂടുന്നു; സിനിമാ പ്രദര്‍ശന മേഖലയില്‍ ആശങ്ക', href: '/story/ott-release', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557546-mammootyyyt.webp', date: 'June 11, 2026' },
  { title: 'ദിലീഷ് പോത്തന്റെ പുതിയ ചിത്രത്തിന് മികച്ച പ്രതികരണം', href: '/story/dileesh-pothan', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp', date: 'June 11, 2026' },
  { title: 'സംഗീത സംവിധായകന്‍ ഗോപീ സുന്ദറിന്റെ അടുത്ത പ്രൊജക്റ്റ് പ്രഖ്യാപിച്ചു', href: '/story/gopi-sundar', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557505-sanjeev-kapoor-reveals-rejecting-masterchef-india-for-not-being-paid-more-than-akshay-kumar.webp', date: 'June 10, 2026' },
  { title: 'ബോളിവുഡ് നടന്‍ ആമിര്‍ ഖാന്‍ പുതിയ ചിത്രത്തിനായി ഒരുങ്ങുന്നു', href: '/story/aamir-khan-film', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557590-whatsapp-image-2026-06-24-at-151433.webp', date: 'June 12, 2026' },
];

const sportsArticles: SectionArticle[] = [
  { title: 'ഐ പി എൽ 2026: ചാമ്പ്യന്‍മാരായി മുംബൈ ഇന്ത്യന്സ്; ആരാധകര്‍ ആഹ്ലാദത്തില്‍', href: '/story/ipl-2026-final', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557560-kldfhb.webp', date: 'June 12, 2026' },
  { title: 'ഫിഫ ലോകകപ്പ് 2026: ഇന്ത്യന്‍ ടീമിന്റെ തയ്യാറെടുപ്പ് ആരംഭിച്ചു', href: '/story/fifa-2026-india', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp', date: 'June 11, 2026' },
  { title: 'പി വി സിന്ധുവിന് ലോക ബാഡ്മിന്റണ്‍ റാങ്കിംഗില്‍ മുന്നേറ്റം', href: '/story/pv-sindhu-ranking', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp', date: 'June 11, 2026' },
  { title: 'കേരള ബ്ലാസ്റ്റേഴ്‌സ്: പുതിയ സീസണിലേക്ക് ശക്തമായ തയ്യാറെടുപ്പ്', href: '/story/kerala-blasters', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
  { title: 'ഏഷ്യന്‍ ഗെയിംസില്‍ ഇന്ത്യക്ക് വെള്ളിയും വെങ്കലവും', href: '/story/asian-games-india', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp', date: 'June 10, 2026' },
  { title: 'അയര്‍ലണ്ടിനെതിരെ ഇന്ത്യയുടെ ഏകദിന പരമ്പര; ആദ്യ മത്സരം ഇന്ന്', href: '/story/india-ireland-odi', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557639-untitled-1.webp', date: 'June 12, 2026' },
  { title: 'ഇംഗ്ലണ്ടിനെതിരെ ഓസ്ട്രേലിയക്ക് വിജയം; ലോക ടെസ്റ്റ് ചാമ്പ്യന്‍ഷിപ്പില്‍ മുന്നേറ്റം', href: '/story/australia-wins', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557670-untitled-1.webp', date: 'June 11, 2026' },
];

const analysisArticles: SectionArticle[] = [
  { title: 'കേരളത്തിലെ അണക്കെട്ടുകളിലെ ചെളി നീക്കം; പാരിസ്ഥിതിക ആഘാതം എത്രത്തോളം?', excerpt: 'അണക്കെട്ടുകളിലെ ചെളി നീക്കം ചെയ്യുന്നത് ജലസംഭരണ ശേഷി വര്‍ധിപ്പിക്കുമെങ്കിലും ഇതിന്റെ പാരിസ്ഥിതിക പ്രത്യാഘാതങ്ങള്‍ വിലയിരുത്തേണ്ടതുണ്ട്.', href: '/story/dam-siltation', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557604-sharjah.webp', date: 'June 12, 2026' },
  { title: 'ജിഎസ്ടി വരുമാനത്തിൽ റെക്കോർഡ് | സാമ്പത്തിക വിശകലനം', href: '/story/gst-collection', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557604-sharjah.webp', date: 'June 12, 2026' },
  { title: 'ഐപിഎസ് റീഷഫിൾ | ഭരണപരമായ പ്രത്യാഘാതങ്ങൾ', href: '/story/ips-shrikumar', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557590-whatsapp-image-2026-06-24-at-151433.webp', date: 'June 11, 2026' },
  { title: 'പുതിയ വിദ്യാഭ്യാസ നയം | എന്തൊക്കെ മാറ്റങ്ങൾ?', href: '/story/alternative-education', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 11, 2026' },
  { title: 'ശബരിമല വിധി | നിയമപരമായ വശങ്ങൾ', href: '/story/sabarimala-traffic', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp', date: 'June 10, 2026' },
  { title: 'കേരളത്തിലെ മലയോര മേഖലയിലെ വികസന പ്രവണതകള്‍', href: '/story/kasargod-tourism', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp', date: 'June 10, 2026' },
];

const magazineArticles: SectionArticle[] = [
  { title: 'അധ്യാപക പ്രതിസന്ധിക്ക് പരിഹാരമായി ബദല്‍ വിദ്യാഭ്യാസ സംവിധാനം; പഠനത്തിലെ പുതിയ പരീക്ഷണം', excerpt: 'പാരമ്പര്യ വിദ്യാഭ്യാസ രീതികളില്‍ നിന്ന് വ്യത്യസ്തമായി പുതിയ ബദല്‍ വിദ്യാഭ്യാസ സമ്പ്രദായം സംസ്ഥാനത്ത് പരീക്ഷിക്കുന്നു.', href: '/story/alternative-education', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 12, 2026' },
  { title: 'തെരഞ്ഞെടുപ്പ് വിശകലനം | അണിയറയിലെ രാഷ്ട്രീയം', href: '/story/pala-election', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557560-kldfhb.webp', date: 'June 12, 2026' },
  { title: 'ബജറ്റ് 2026 | കേരളത്തിന് എന്ത് കിട്ടും?', href: '/story/railway-budget', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 11, 2026' },
  { title: 'ഗൾഫ് മടക്കം | പ്രവാസികളുടെ പ്രതിസന്ധികൾ', href: '/story/qatar-labour-law', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557675-text-thumb.webp', date: 'June 11, 2026' },
  { title: 'കാലാവസ്ഥാ വ്യതിയാനവും കേരളവും | വെല്ലുവിളികൾ', href: '/story/rain-alert', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp', date: 'June 10, 2026' },
];

const lifeStoryArticles: SectionArticle[] = [
  { title: 'കണ്ണൂരിലെ രുചിയുടെ കഥ പറയുന്ന തട്ടുകടകള്‍; \'വടയും ചായയും\' എന്ന പൈതൃകവും', excerpt: 'കണ്ണൂരിലെ പഴയ തട്ടുകടകള്‍ക്ക് ഒരു പ്രത്യേക പൈതൃകമുണ്ട്. നഗരത്തിലെ ഏറ്റവും പഴക്കമുള്ള ചില തട്ടുകടകള്‍ ഇപ്പോഴും അവയുടെ പഴമ നിലനിര്‍ത്തുന്നു.', href: '/story/kannur-food', image: 'https://www.mediaoneonline.com/h-upload/2026/06/01/500x300_1552422-midday-break-oman.webp', date: 'June 12, 2026' },
  { title: 'വിദേശത്ത് പഠിക്കുന്ന മലയാളി വിദ്യാര്‍ത്ഥികളുടെ ജീവിതവും പ്രതിസന്ധികളും', excerpt: 'ഉപരിപഠനത്തിനായി വിദേശ രാജ്യങ്ങളിലേക്ക് പോകുന്ന മലയാളി വിദ്യാര്‍ത്ഥികളുടെ എണ്ണത്തില്‍ വന്‍ വര്‍ധന.', href: '/story/malayali-students-abroad', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 12, 2026' },
  { title: 'ഫോർട്ട് കൊച്ചിയിലെ ഒരു ദിവസം | ചരിത്രത്തിന്റെ നിഴലിൽ', href: '/story/kochi-metro', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557623-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'മൂന്നാറിലെ തേയില തോട്ടങ്ങൾ | പച്ചപ്പിന്റെ കഥ', href: '/story/idukki-coffee', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 11, 2026' },
];

const eyecatcherArticles: SectionArticle[] = [
  { title: 'വിദേശത്ത് പഠിക്കുന്ന മലയാളി വിദ്യാര്‍ത്ഥികളുടെ ജീവിതവും പ്രതിസന്ധികളും', excerpt: 'ഉപരിപഠനത്തിനായി വിദേശ രാജ്യങ്ങളിലേക്ക് പോകുന്ന മലയാളി വിദ്യാര്‍ത്ഥികളുടെ എണ്ണത്തില്‍ വന്‍ വര്‍ധന.', href: '/story/malayali-students-abroad', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 12, 2026' },
  { title: 'ആലപ്പുഴയില്‍ കായല്‍ കടക്കുന്നതിനിടെ ബോട്ട് മറിഞ്ഞു; 15 പേരെ രക്ഷപ്പെടുത്തി', href: '/story/alappuzha-boat', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
  { title: 'കൊച്ചിയില്‍ മെട്രോ റെയില്‍ പദ്ധതി രണ്ടാം ഘട്ടത്തിന് അനുമതി', href: '/story/kochi-metro', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
  { title: 'കേരളത്തില്‍ സ്വര്‍ണ്ണക്കടത്ത് കേസില്‍ പുതിയ വഴിത്തിരിവ്', href: '/story/gold-smuggling', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
];

const faceToFaceArticles: SectionArticle[] = [
  { title: 'ഇന്ത്യന്‍ ഫുട്ബോളിലെ ഉയര്‍ച്ച: പുതിയ തലമുറ കളിക്കാരുടെ കഥ', excerpt: 'ഇന്ത്യന്‍ ഫുട്ബോളില്‍ പുതിയൊരു തലമുറ ഉയര്‍ന്നു വരികയാണ്. യൂറോപ്യന്‍ ക്ലബ്ബുകളില്‍ കളിക്കുന്ന ഇന്ത്യന്‍ താരങ്ങളുടെ കഥ.', href: '/story/indian-football-rise', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557645-passport1.webp', date: 'June 12, 2026' },
  { title: 'ദിലീഷ് പോത്തന്റെ പുതിയ ചിത്രത്തിന് മികച്ച പ്രതികരണം', href: '/story/dileesh-pothan', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp', date: 'June 11, 2026' },
  { title: 'മോഹന്‍ലാലും ജീത്തു ജോസഫും വീണ്ടും ഒന്നിക്കുന്നു; പുതിയ ചിത്രം പ്രഖ്യാപനം', href: '/story/mohanlal-jeethu', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp', date: 'June 12, 2026' },
];

const healthArticles: SectionArticle[] = [
  { title: 'പാലക്കാട് ജില്ലാ ആശുപത്രിയില്‍ പുതിയ ഓക്സിജന്‍ പ്ലാന്റ് ഉദ്ഘാടനം ചെയ്തു', href: '/story/palakkad-hospital', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557505-sanjeev-kapoor-reveals-rejecting-masterchef-india-for-not-being-paid-more-than-akshay-kumar.webp', date: 'June 12, 2026' },
  { title: 'പത്തനംതിട്ടയില്‍ ആശുപത്രി സൗകര്യങ്ങള്‍ വിപുലീകരിക്കുന്നു', href: '/story/pathanamthitta-hospital', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557546-mammootyyyt.webp', date: 'June 10, 2026' },
  { title: 'കേരളത്തില്‍ കനത്ത മഴ; ജാഗ്രതാ നിര്‍ദേശം തുടരുന്നു', href: '/story/rain-alert', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp', date: 'June 12, 2026' },
  { title: 'എറണാകുളത്ത് ബൈക്ക് - ലോറി കൂട്ടിയിടിച്ച് രണ്ട് യുവാക്കള്‍ മരിച്ചു', href: '/story/ernakulam-accident', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 11, 2026' },
  { title: 'തിരുവനന്തപുരത്ത് ജലക്ഷാമം രൂക്ഷം; ടാങ്കര്‍ ലോറികള്‍ വിന്യസിച്ചു', href: '/story/trivandrum-water', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 11, 2026' },
];

const politicsArticles: SectionArticle[] = [
  { title: 'മുംബൈ മുന്‍സിപ്പല്‍ കമ്മീഷണര്‍ ഐ പി എസ് ഐ ശ്രീകുമാറിന് കൂടുതല്‍ ചുമതല', href: '/story/ips-shrikumar', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557590-whatsapp-image-2026-06-24-at-151433.webp', date: 'June 12, 2026' },
  { title: 'പാലാ ഉപതെരഞ്ഞെടുപ്പ്: യു ഡി എഫ് സ്ഥാനാര്‍ഥി പ്രഖ്യാപനം നാളെ', href: '/story/pala-election', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557560-kldfhb.webp', date: 'June 12, 2026' },
  { title: 'വോട്ട് വാങ്ങല്‍ ആരോപണം: കേസെടുത്ത് പൊലീസ്; മുന്‍ എം എല്‍ എയുടെ പങ്ക് അന്വേഷിക്കും', href: '/story/vote-buying', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp', date: 'June 12, 2026' },
  { title: 'പാര്‍ലമെന്റ് സമ്മേളനം: സുപ്രധാന ബില്ലുകള്‍ അവതരിപ്പിക്കും', href: '/story/parliament-session', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp', date: 'June 12, 2026' },
  { title: 'കര്‍ഷക സമരം: കേന്ദ്ര സംസ്ഥാന ചര്‍ച്ചകള്‍ തുടങ്ങി', href: '/story/farmer-protest', image: 'https://www.mediaoneonline.com/h-upload/2026/06/01/500x300_1552422-midday-break-oman.webp', date: 'June 11, 2026' },
  { title: 'ശബരിമല തീര്‍ത്ഥാടന സീസണില്‍ ട്രാഫിക് ക്രമീകരണം കര്‍ശനമാക്കി', href: '/story/sabarimala-traffic', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp', date: 'June 11, 2026' },
];

const businessArticles: SectionArticle[] = [
  { title: 'സ്വര്‍ണ്ണ വില റെക്കോര്‍ഡില്‍; പവന്‍ 75000 രൂപ പിന്നിട്ടു', href: '/story/gold-price-record', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557645-passport1.webp', date: 'June 12, 2026' },
  { title: 'ജി എസ് ടി ശേഖരണത്തില്‍ റെക്കോര്‍ഡ് വരുമാനം; ഏപ്രിലില്‍ 2.10 ലക്ഷം കോടി', href: '/story/gst-collection', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557604-sharjah.webp', date: 'June 12, 2026' },
  { title: 'ഇന്ത്യ-യു എ ഇ വ്യാപാര കരാര്‍: കയറ്റുമതി ഇരട്ടിയാക്കാന്‍ പദ്ധതി', href: '/story/india-uae-trade', image: 'https://www.mediaoneonline.com/h-upload/2026/06/19/500x500_1556567-uddav-2.webp', date: 'June 12, 2026' },
  { title: 'റെയില്‍വേ ബജറ്റില്‍ കേരളത്തിന് പ്രത്യേക പരിഗണന', href: '/story/railway-budget', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 10, 2026' },
  { title: 'ഇടുക്കിയിലെ കാപ്പി കര്‍ഷകര്‍ക്ക് ആശ്വാസമായി പുതിയ വില', href: '/story/idukki-coffee', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 12, 2026' },
];

const technologyArticles: SectionArticle[] = [
  { title: 'ഇസ്രോയുടെ പുതിയ ദൗത്യം: ശൂക്രന്‍ പര്യവേക്ഷണ ദൗത്യത്തിന് ഒരുങ്ങുന്നു', href: '/story/isro-venus', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 11, 2026' },
  { title: 'കൊച്ചിയില്‍ മെട്രോ റെയില്‍ പദ്ധതി രണ്ടാം ഘട്ടത്തിന് അനുമതി', href: '/story/kochi-metro', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
  { title: 'ഖത്തറില്‍ പുതിയ നഗരവികസന പദ്ധതി പ്രഖ്യാപനം', href: '/story/qatar-development', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 11, 2026' },
];

const educationArticles: SectionArticle[] = [
  { title: 'അധ്യാപക പ്രതിസന്ധിക്ക് പരിഹാരമായി ബദല്‍ വിദ്യാഭ്യാസ സംവിധാനം', excerpt: 'പാരമ്പര്യ വിദ്യാഭ്യാസ രീതികളില്‍ നിന്ന് വ്യത്യസ്തമായി പുതിയ ബദല്‍ വിദ്യാഭ്യാസ സമ്പ്രദായം.', href: '/story/alternative-education', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 12, 2026' },
  { title: 'മലപ്പുറത്ത് വിദ്യാര്‍ത്ഥികള്‍ക്കായി പുതിയ കരിയര്‍ ഗൈഡന്‍സ് സെന്റര്‍', href: '/story/malappuram-career', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'പുതിയ വിദ്യാഭ്യാസ നയം | എന്തൊക്കെ മാറ്റങ്ങൾ?', href: '/story/alternative-education', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 11, 2026' },
  { title: 'വിദേശത്ത് പഠിക്കുന്ന മലയാളി വിദ്യാര്‍ത്ഥികളുടെ ജീവിതവും പ്രതിസന്ധികളും', href: '/story/malayali-students-abroad', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 12, 2026' },
];

const crimeArticles: SectionArticle[] = [
  { title: 'കൊച്ചിയിൽ യുവതിയെ കാറിൽ തട്ടിക്കൊണ്ടുപോയി ബലാത്സംഗം', href: '/story/kochi-crime', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 12, 2026' },
  { title: 'സ്വര്‍ണ്ണക്കടത്ത് കേസിൽ പുതിയ വഴിത്തിരിവ്; മുഖ്യസൂത്രധാരൻ പിടിയിൽ', href: '/story/gold-smuggling', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557645-passport1.webp', date: 'June 11, 2026' },
  { title: 'വോട്ട് വാങ്ങല്‍ ആരോപണം: കേസെടുത്ത് പൊലീസ്', href: '/story/vote-buying', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp', date: 'June 10, 2026' },
  { title: 'എറണാകുളത്ത് ബൈക്ക് - ലോറി കൂട്ടിയിടിച്ച് രണ്ട് യുവാക്കള്‍ മരിച്ചു', href: '/story/ernakulam-accident', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
  { title: 'മUMENTS ൻ കവര്‍ച്ച; സിസിടിവി ദൃശ്യങ്ങൾ പരിശോധിക്കുന്നു', href: '/story/temple-theft', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 09, 2026' },
];

const agricultureArticles: SectionArticle[] = [
  { title: 'കേരളത്തിൽ കൃഷിയിൽ ഡ്രോൺ ഉപയോഗം വ്യാപകമാകുന്നു', href: '/story/agriculture-drone', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 12, 2026' },
  { title: 'കർഷകർക്ക് പുതിയ സബ്സിഡി പദ്ധതി പ്രഖ്യാപിച്ചു', href: '/story/farmer-subsidy', image: 'https://www.mediaoneonline.com/h-upload/2026/06/01/500x300_1552422-midday-break-oman.webp', date: 'June 11, 2026' },
  { title: 'പesto രോഗം കൃഷിയെ ബാധിക്കുന്നു; ജാഗ്രതാ നിർദേശം', href: '/story/crop-disease-alert', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
];

const autoArticles: SectionArticle[] = [
  { title: 'ഇന്ത്യൻ വാഹന വിപണിയിൽ ഇലക്ട്രിക് കാർ വിൽപ്പന കുതിക്കുന്നു', href: '/story/electric-car-sales', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp', date: 'June 12, 2026' },
  { title: 'പുതിയ മോട്ടോർ വാഹന നിയമം പ്രാബല്യത്തിൽ; നടപടികൾ കർശനം', href: '/story/motor-vehicle-act', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp', date: 'June 11, 2026' },
  { title: 'കൊച്ചിയിൽ പുതിയ ബസ് ടെർമിനലുകൾ തുറക്കുന്നു', href: '/story/new-bus-terminals', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp', date: 'June 10, 2026' },
];

const travelArticles: SectionArticle[] = [
  { title: 'മലയാളികളുടെ പ്രിയപ്പെട്ട പ്രവാസി കേന്ദ്രങ്ങൾ ഈ വർഷം', href: '/story/popular-travel-destinations', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp', date: 'June 12, 2026' },
  { title: 'ശബരിമല തീർത്ഥാടന സീസണിൽ ട്രാഫിക് ക്രമീകരണം കർശനമാക്കി', href: '/story/sabarimala-traffic', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp', date: 'June 11, 2026' },
  { title: 'അന്തർദേശീയ വിമാന നിരക്കുകളിൽ കുറവ് പ്രതീക്ഷിക്കുന്നു', href: '/story/flight-fares-drop', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp', date: 'June 10, 2026' },
];

const lifestyleArticles: SectionArticle[] = [
  { title: 'ഉറക്കത്തിന്റെ ആരോഗ്യം: എട്ട് മണിക്കൂർ മതിയോ?', href: '/story/sleep-health', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp', date: 'June 12, 2026' },
  { title: 'കേരളത്തിലെ പുതിയ റെസ്റ്റോറന്റുകൾ ശ്രദ്ധേയമാകുന്നു', href: '/story/new-restaurants', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp', date: 'June 11, 2026' },
  { title: 'ഫാഷൻ ലോകത്തെ പുതിയ പ്രവണതകൾ', href: '/story/fashion-trends', image: 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557505-sanjeev-kapoor-reveals-rejecting-masterchef-india-for-not-being-paid-more-than-akshay-kumar.webp', date: 'June 10, 2026' },
];

// ─── All Sections Registry ────────────────────────────────────────────────────

export const sections: SectionConfig[] = [
  {
    id: 'kerala',
    name: 'Kerala',
    nameML: 'കേരളം',
    description: 'കേരളത്തിലെ പ്രധാന വാർത്തകൾ, സംഭവവികാസങ്ങൾ, പ്രത്യേക റിപ്പോർട്ടുകൾ',
    color: 'from-green-800 to-green-600',
    articles: keralaArticles,
  },
  {
    id: 'india',
    name: 'India',
    nameML: 'ഇന്ത്യ',
    description: 'ദേശീയ വാർത്തകൾ, രാഷ്ട്രീയം, സാമ്പത്തികം, സുപ്രധാന സംഭവങ്ങൾ',
    color: 'from-orange-800 to-orange-600',
    articles: indiaArticles,
  },
  {
    id: 'world',
    name: 'World',
    nameML: 'ലോകം',
    description: 'അന്താരാഷ്ട്ര വാർത്തകൾ, ആഗോള പ്രവണതകൾ, വിദേശ ബന്ധങ്ങൾ',
    color: 'from-blue-800 to-blue-600',
    articles: worldArticles,
  },
  {
    id: 'fact-check',
    name: 'Fact Check',
    nameML: 'ഫാക്ട് ചെക്ക്',
    description: 'വ്യാജ പ്രചാരണങ്ങൾക്കെതിരെ വസ്തുതാ പരിശോധന',
    color: 'from-teal-800 to-teal-600',
    articles: factCheckArticles,
  },
  {
    id: 'gulf',
    name: 'Gulf',
    nameML: 'ഗൾഫ്',
    description: 'ഗൾഫ് രാജ്യങ്ങളിലെ വാർത്തകൾ, പ്രവാസി വിഷയങ്ങൾ, നിയമങ്ങൾ',
    color: 'from-amber-800 to-amber-600',
    articles: gulfArticles,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    nameML: 'വിനോദം',
    description: 'സിനിമ, സംഗീതം, ടെലിവിഷൻ, കലാ-സാംസ്കാരിക വാർത്തകൾ',
    color: 'from-pink-800 to-pink-600',
    articles: entertainmentArticles,
  },
  {
    id: 'sports',
    name: 'Sports',
    nameML: 'കായികം',
    description: 'കായിക വാർത്തകൾ, മത്സരഫലങ്ങൾ, റിക്കോർഡുകൾ',
    color: 'from-sky-800 to-sky-600',
    articles: sportsArticles,
  },
  {
    id: 'analysis',
    name: 'Analysis',
    nameML: 'അനാലിസിസ്',
    description: 'ആഴത്തിലുള്ള വിശകലനങ്ങൾ, വിലയിരുത്തലുകൾ, പ്രത്യേക റിപ്പോർട്ടുകൾ',
    color: 'from-blue-900 to-blue-700',
    articles: analysisArticles,
  },
  {
    id: 'magazine',
    name: 'Magazine',
    nameML: 'മാഗസിൻ',
    description: 'പ്രത്യേക ഫീച്ചറുകൾ, അഭിമുഖങ്ങൾ, ജീവിത ശൈലി',
    color: 'from-emerald-900 to-emerald-700',
    articles: magazineArticles,
  },
  {
    id: 'life-story',
    name: 'Life Story',
    nameML: 'ജീവിതം',
    description: 'മനുഷ്യരുടെ കഥകൾ, അനുഭവങ്ങൾ, പ്രചോദനങ്ങൾ',
    color: 'from-rose-900 to-rose-700',
    articles: lifeStoryArticles,
  },
  {
    id: 'eyecatcher',
    name: 'Eyecatcher',
    nameML: 'കണ്ണിൽപ്പെടുന്നവ',
    description: 'കണ്ണിൽപ്പെടുന്ന വാർത്തകൾ, പ്രത്യേക റിപ്പോർട്ടുകൾ',
    color: 'from-amber-900 to-amber-700',
    articles: eyecatcherArticles,
  },
  {
    id: 'face-to-face',
    name: 'Face to Face',
    nameML: 'മുഖാമുഖം',
    description: 'അഭിമുഖങ്ങൾ, മുഖാമുഖ കൂടിക്കാഴ്ചകൾ',
    color: 'from-violet-900 to-violet-700',
    articles: faceToFaceArticles,
  },
  {
    id: 'health',
    name: 'Health',
    nameML: 'ആരോഗ്യം',
    description: 'ആരോഗ്യ വാർത്തകൾ, ചികിത്സാ രീതികൾ, ആരോഗ്യ ടിപ്പുകൾ',
    color: 'from-emerald-800 to-emerald-600',
    articles: healthArticles,
  },
  {
    id: 'politics',
    name: 'Politics',
    nameML: 'രാഷ്ട്രീയം',
    description: 'രാഷ്ട്രീയ വാർത്തകൾ, നയങ്ങൾ, വിശകലനങ്ങൾ',
    color: 'from-red-800 to-red-600',
    articles: politicsArticles,
  },
  {
    id: 'business',
    name: 'Business',
    nameML: 'ബിസിനസ്സ്',
    description: 'ബിസിനസ്, സാമ്പത്തിക വാർത്തകൾ, വിപണി വിവരങ്ങൾ',
    color: 'from-yellow-800 to-yellow-600',
    articles: businessArticles,
  },
  {
    id: 'tech',
    name: 'Technology',
    nameML: 'ടെക്നോളജി',
    description: 'സാങ്കേതിക വാർത്തകൾ, പുതിയ കണ്ടുപിടുത്തങ്ങൾ',
    color: 'from-slate-800 to-slate-600',
    articles: technologyArticles,
  },
  {
    id: 'education',
    name: 'Education',
    nameML: 'വിദ്യാഭ്യാസം',
    description: 'വിദ്യാഭ്യാസ വാർത്തകൾ, അക്കാദമിക് വിവരങ്ങൾ',
    color: 'from-lime-800 to-lime-600',
    articles: educationArticles,
  },
  {
    id: 'crime',
    name: 'Crime',
    nameML: 'ക്രൈം',
    description: 'ക്രൈം വാർത്തകൾ, പൊലീസ്, നിയമപരമായ കാര്യങ്ങൾ',
    color: 'from-red-900 to-red-700',
    articles: crimeArticles,
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    nameML: 'കൃഷി',
    description: 'കൃഷി വാർത്തകൾ, കർഷക വിഷയങ്ങൾ, ഉത്പാദന രീതികൾ',
    color: 'from-green-700 to-green-500',
    articles: agricultureArticles,
  },
  {
    id: 'auto',
    name: 'Auto',
    nameML: 'ഓട്ടോ',
    description: 'വാഹന വാർത്തകൾ, മോട്ടോർ വ്യവസായം, ഗതാഗതം',
    color: 'from-red-700 to-red-500',
    articles: autoArticles,
  },
  {
    id: 'travel',
    name: 'Travel',
    nameML: 'യാത്ര',
    description: 'യാത്രാ വാർത്തകൾ, വിനോദസഞ്ചാരം, ലോക സഞ്ചാരം',
    color: 'from-cyan-700 to-cyan-500',
    articles: travelArticles,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameML: 'ജീവിതശൈലി',
    description: 'ജീവിതശൈലി, ഫാഷൻ, ഭക്ഷണം, സൗന്ദര്യം',
    color: 'from-purple-700 to-purple-500',
    articles: lifestyleArticles,
  },
];

// ─── Helper: get section by slug ──────────────────────────────────────────────

export function getSection(id: string): SectionConfig | undefined {
  return sections.find((s) => s.id === id);
}

// ─── Image gradient map (shared across pages) ────────────────────────────────

export const imageGradients: Record<string, string> = {
  'reshuffle-top': 'from-blue-900 to-blue-700',
  'pala': 'from-green-800 to-green-600',
  'vote-buying': 'from-red-800 to-red-600',
  'sabarimala': 'from-amber-900 to-amber-700',
  'cricket': 'from-sky-800 to-sky-600',
  'qatar': 'from-purple-800 to-purple-600',
  'gold': 'from-yellow-700 to-amber-500',
  'rain': 'from-slate-700 to-blue-600',
  'hospital': 'from-teal-800 to-teal-600',
  'trade': 'from-indigo-800 to-indigo-600',
  'g7': 'from-gray-800 to-gray-600',
  'bollywood': 'from-rose-800 to-rose-600',
  'cricket-aus': 'from-emerald-800 to-emerald-600',
  'saudi': 'from-orange-800 to-orange-600',
  'kuwait': 'from-cyan-800 to-cyan-600',
  'kl-1': 'from-lime-800 to-lime-600',
  'kl-2': 'from-amber-800 to-amber-600',
  'kl-3': 'from-violet-800 to-violet-600',
  'kl-4': 'from-fuchsia-800 to-fuchsia-600',
  'kl-5': 'from-rose-800 to-rose-600',
  'kl-6': 'from-teal-800 to-teal-600',
  'ent-1': 'from-pink-800 to-pink-600',
  'ent-2': 'from-red-800 to-red-600',
  'ent-3': 'from-rose-700 to-rose-500',
  'ent-4': 'from-fuchsia-800 to-fuchsia-600',
  'ent-5': 'from-purple-800 to-purple-600',
  'sport-1': 'from-blue-800 to-blue-600',
  'sport-2': 'from-green-800 to-green-600',
  'sport-3': 'from-yellow-800 to-yellow-600',
  'sport-4': 'from-orange-800 to-orange-600',
  'sport-5': 'from-cyan-800 to-cyan-600',
  'gulf-1': 'from-sky-800 to-sky-600',
  'gulf-2': 'from-emerald-800 to-emerald-600',
  'gulf-3': 'from-teal-800 to-teal-600',
  'gulf-4': 'from-indigo-800 to-indigo-600',
  'gulf-5': 'from-violet-800 to-violet-600',
  'ind-1': 'from-orange-800 to-orange-600',
  'ind-2': 'from-blue-800 to-blue-600',
  'ind-3': 'from-slate-800 to-slate-600',
  'ind-4': 'from-green-800 to-green-600',
  'ind-5': 'from-red-800 to-red-600',
  'world-1': 'from-gray-800 to-gray-600',
  'world-2': 'from-amber-800 to-amber-600',
  'world-3': 'from-stone-800 to-stone-600',
  'world-4': 'from-red-800 to-red-600',
  'world-5': 'from-blue-800 to-blue-600',
  'thumb': 'from-gray-700 to-gray-500',
  'magazine': 'from-emerald-900 to-emerald-700',
  'analysis': 'from-blue-900 to-blue-700',
  'life-story': 'from-rose-900 to-rose-700',
  'eyecatcher': 'from-amber-900 to-amber-700',
  'face-to-face': 'from-violet-900 to-violet-700',
};
