// ============================================================================
// The Food Map — what Kerala eats, and where you go to eat it.
//
// Three entities and one join. A Place `serves` dish ids; a Dish has an
// `origin`. Those are different facts and the file keeps them apart: Thalassery
// biryani comes from Kannur and is served in Kozhikode and Ernakulam too, and
// collapsing the two would make the district filter assert something false.
//
// Coordinates are approximate — town-level positions good enough to find the
// place on a map, not surveyed doorways. Same convention travelogue.ts states
// for its waypoints.
//
// EDITORIAL NOTE: this is a seed, written from general knowledge of well-known
// Kerala eateries. Before this ships as journalism the desk must verify every
// name, town and claim — restaurants close, move, and change hands, and a
// confidently wrong address is worse than no map. Treat `note` as a draft line,
// not a published one.
// ============================================================================

export type DistrictId =
  | 'kasaragod' | 'kannur' | 'wayanad' | 'kozhikode' | 'malappuram'
  | 'palakkad' | 'thrissur' | 'ernakulam' | 'idukki' | 'kottayam'
  | 'alappuzha' | 'pathanamthitta' | 'kollam' | 'thiruvananthapuram';

export interface District {
  id: DistrictId;
  name: string;
  nameML: string;
  /** Where the map settles when this district is the filter. */
  center: [number, number];
  zoom: number;
}

export interface Dish {
  id: string;
  name: string;
  nameML: string;
  /** One line: what it is. */
  blurb: string;
  blurbML: string;
  kind: 'breakfast' | 'rice' | 'bread' | 'seafood' | 'snack' | 'sweet' | 'drink';
  /** Where the dish is *from* — not where it is served. */
  origin: DistrictId[];
  /**
   * A Wikimedia Commons file of the dish. Optional, and left empty rather than
   * filled with something approximate: a photograph of a different dish is
   * worse than no photograph. `credit` travels with it — replacing one means
   * replacing the other.
   */
  image?: string;
  credit?: string;
}

export interface Place {
  id: string;
  name: string;
  nameML: string;
  /** Town or locality, not a postal address. */
  town: string;
  townML: string;
  district: DistrictId;
  coords: [number, number];
  /** Dish ids this place is known for. The join. */
  serves: string[];
  note: string;
  noteML: string;
  since?: number;
}

/* ── Districts ──────────────────────────────────────────────────────────── */
// North to south, the way Kerala is usually read.

export const districts: District[] = [
  { id: 'kasaragod',          name: 'Kasaragod',          nameML: 'കാസർകോട്',      center: [12.4996, 74.9869], zoom: 10 },
  { id: 'kannur',             name: 'Kannur',             nameML: 'കണ്ണൂർ',        center: [11.8745, 75.3704], zoom: 10 },
  { id: 'wayanad',            name: 'Wayanad',            nameML: 'വയനാട്',        center: [11.6854, 76.1320], zoom: 10 },
  { id: 'kozhikode',          name: 'Kozhikode',          nameML: 'കോഴിക്കോട്',     center: [11.2588, 75.7804], zoom: 10 },
  { id: 'malappuram',         name: 'Malappuram',         nameML: 'മലപ്പുറം',       center: [11.0510, 76.0711], zoom: 10 },
  { id: 'palakkad',           name: 'Palakkad',           nameML: 'പാലക്കാട്',      center: [10.7867, 76.6548], zoom: 10 },
  { id: 'thrissur',           name: 'Thrissur',           nameML: 'തൃശ്ശൂർ',        center: [10.5276, 76.2144], zoom: 10 },
  { id: 'ernakulam',          name: 'Ernakulam',          nameML: 'എറണാകുളം',      center: [9.9816, 76.2999],  zoom: 10 },
  { id: 'idukki',             name: 'Idukki',             nameML: 'ഇടുക്കി',        center: [9.8497, 76.9681],  zoom: 10 },
  { id: 'kottayam',           name: 'Kottayam',           nameML: 'കോട്ടയം',        center: [9.5916, 76.5222],  zoom: 10 },
  { id: 'alappuzha',          name: 'Alappuzha',          nameML: 'ആലപ്പുഴ',        center: [9.4981, 76.3388],  zoom: 10 },
  { id: 'pathanamthitta',     name: 'Pathanamthitta',     nameML: 'പത്തനംതിട്ട',    center: [9.2648, 76.7870],  zoom: 10 },
  { id: 'kollam',             name: 'Kollam',             nameML: 'കൊല്ലം',        center: [8.8932, 76.6141],  zoom: 10 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', nameML: 'തിരുവനന്തപുരം', center: [8.5241, 76.9366],  zoom: 10 },
];

/** Default map view — the whole state in one frame. */
export const KERALA_EXTENT: { center: [number, number]; zoom: number } = {
  center: [10.4, 76.2],
  zoom: 7,
};

/* ── Dishes ─────────────────────────────────────────────────────────────── */

export const dishes: Dish[] = [
  {
    id: 'thalassery-biryani',
    name: 'Thalassery Biryani',
    nameML: 'തലശ്ശേരി ബിരിയാണി',
    kind: 'rice',
    origin: ['kannur'],
    blurb: 'Short-grain kaima rice, never basmati, cooked apart from the masala and married over dum.',
    blurbML: 'ബസ്മതിയല്ല, കൈമ അരി. മസാലയും ചോറും വെവ്വേറെ വേവിച്ച് ദമ്മിൽ ചേർക്കുന്നു.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Thalassery_biryani_-1.jpg',
    credit: 'Sheetal · CC BY 2.5 · Wikimedia Commons',
  },
  {
    id: 'kozhikodan-halwa',
    name: 'Kozhikodan Halwa',
    nameML: 'കോഴിക്കോടൻ ഹൽവ',
    kind: 'sweet',
    origin: ['kozhikode'],
    blurb: 'Coconut oil, maida and jaggery worked until it turns glassy. The reason SM Street is called Sweetmeat Street.',
    blurbML: 'വെളിച്ചെണ്ണയും മൈദയും ശർക്കരയും ചേർത്ത് ഇളക്കിയുണ്ടാക്കുന്നത്. എസ്എം സ്ട്രീറ്റിന് ആ പേര് വന്നത് ഇതിൽനിന്നാണ്.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Kozhikode_Halwa.jpg',
    credit: 'Abilngeorge · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'kallummakkaya',
    name: 'Kallummakkaya Nirachathu',
    nameML: 'കല്ലുമ്മക്കായ നിറച്ചത്',
    kind: 'seafood',
    origin: ['kozhikode', 'kannur'],
    blurb: 'Mussels stuffed with spiced rice paste, steamed in the shell, then fried.',
    blurbML: 'കക്കയുടെ തോടിനുള്ളിൽ അരിമാവ് നിറച്ച് ആവിയിൽ വേവിച്ച് പൊരിച്ചെടുക്കുന്നു.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Kallumakayi_Nirachatu.jpg',
    credit: 'Nkthefseer · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'pathiri-meen',
    name: 'Pathiri and Fish Curry',
    nameML: 'പത്തിരിയും മീൻ കറിയും',
    kind: 'bread',
    origin: ['malappuram', 'kozhikode'],
    blurb: 'A soft rice flatbread with no crust, made to carry a coconut-thick fish curry.',
    blurbML: 'അരിമാവുകൊണ്ടുള്ള മൃദുവായ പത്തിരി — തേങ്ങയരച്ച മീൻ കറിക്കൊപ്പം.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Pathiri.jpg',
    credit: 'cl3m · CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 'sulaimani',
    name: 'Sulaimani',
    nameML: 'സുലൈമാനി',
    kind: 'drink',
    origin: ['kozhikode', 'malappuram'],
    blurb: 'Black tea with lemon and a bruised mint leaf. What a Malabar meal ends on.',
    blurbML: 'നാരങ്ങയും പുതിനയും ചേർത്ത കട്ടൻ ചായ. മലബാറിലെ ഊണ് അവസാനിക്കുന്നത് ഇതിലാണ്.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/KERALA_SULAIMANI.jpg',
    credit: 'Shajahan.kps · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'arikkadukka',
    name: 'Arikkadukka',
    nameML: 'അരിക്കടുക്ക',
    kind: 'snack',
    origin: ['kasaragod'],
    blurb: 'Kasaragod’s stuffed mussel — rice batter inside the shell, masala outside, fried hard.',
    blurbML: 'കാസർകോടിന്റെ സ്വന്തം കടുക്ക. തോടിനുള്ളിൽ അരിമാവ്, പുറത്ത് മസാല.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Rice_Stuffed_Fried_Mussels.jpg',
    credit: 'Thouseef · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'ramassery-idli',
    name: 'Ramassery Idli',
    nameML: 'രാമശ്ശേരി ഇഡ്ഡലി',
    kind: 'breakfast',
    origin: ['palakkad'],
    blurb: 'Flat, wide and steamed over cloth rather than in moulds. Four families in one village still make it.',
    blurbML: 'അച്ചിലല്ല, തുണിയിൽ ആവിയിൽ വേവിക്കുന്ന പരന്ന ഇഡ്ഡലി. ഒരു ഗ്രാമത്തിലെ നാല് കുടുംബങ്ങൾ മാത്രം.',
  },
  {
    id: 'ela-ada',
    name: 'Ela Ada',
    nameML: 'ഇലയട',
    kind: 'sweet',
    origin: ['thrissur', 'palakkad'],
    blurb: 'Rice dough folded over jaggery and coconut in a banana leaf and steamed. The leaf is the pan.',
    blurbML: 'വാഴയിലയിൽ അരിമാവ് പരത്തി ശർക്കരയും തേങ്ങയും വച്ച് ആവിയിൽ വേവിക്കുന്നു.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Ela_Ada.jpg',
    credit: 'Samphotography · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'appam-stew',
    name: 'Appam and Stew',
    nameML: 'അപ്പവും സ്റ്റ്യൂവും',
    kind: 'breakfast',
    origin: ['ernakulam', 'kottayam'],
    blurb: 'Lace-edged fermented appam with a white stew barely coloured by pepper.',
    blurbML: 'വക്കുകൾ നേർത്ത അപ്പം, കുരുമുളക് മാത്രം ചേർത്ത വെളുത്ത സ്റ്റ്യൂ.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Aapam-Stew.jpg',
    credit: 'Triv.rao · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'karimeen-pollichathu',
    name: 'Karimeen Pollichathu',
    nameML: 'കരിമീൻ പൊള്ളിച്ചത്',
    kind: 'seafood',
    origin: ['alappuzha', 'kottayam'],
    blurb: 'Pearl spot scored, masala-packed, wrapped in banana leaf and cooked till the leaf chars.',
    blurbML: 'കരിമീൻ മസാല പുരട്ടി വാഴയിലയിൽ പൊതിഞ്ഞ് ഇല കരിയുന്നതുവരെ ചുടുന്നു.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Karimeen_Pollichathu.jpg',
    credit: 'Anupama1002 · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'kappa-meen',
    name: 'Kappa and Fish Curry',
    nameML: 'കപ്പയും മീൻ കറിയും',
    kind: 'rice',
    origin: ['kottayam', 'idukki'],
    blurb: 'Boiled tapioca broken into a red, sour fish curry sharp with kudampuli.',
    blurbML: 'പുഴുങ്ങിയ കപ്പ, കുടംപുളി ചേർത്ത ചുവന്ന മീൻ കറിയിൽ.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Kappa_boiled_kerala_style.jpg',
    credit: 'Ramesh NG · CC BY-SA 2.0 · Wikimedia Commons',
  },
  {
    id: 'beef-ularthiyathu',
    name: 'Beef Ularthiyathu',
    nameML: 'ബീഫ് ഉലർത്തിയത്',
    kind: 'rice',
    origin: ['kottayam', 'ernakulam'],
    blurb: 'Beef dry-roasted with coconut slivers and curry leaf until the masala clings and blackens.',
    blurbML: 'തേങ്ങാക്കൊത്തും കറിവേപ്പിലയും ചേർത്ത് മസാല പിടിക്കുന്നതുവരെ ഉലർത്തിയെടുക്കുന്നു.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Kerala_Beef_Fry.jpg',
    credit: 'Solowomanwalks · CC BY-SA 3.0 · Wikimedia Commons',
  },
  {
    id: 'porotta-beef',
    name: 'Porotta and Beef',
    nameML: 'പൊറോട്ടയും ബീഫും',
    kind: 'bread',
    origin: ['thrissur', 'ernakulam'],
    blurb: 'The layered maida flatbread every roadside kada in Kerala closes the night on.',
    blurbML: 'കേരളത്തിലെ ഏത് തട്ടുകടയും രാത്രി അവസാനിപ്പിക്കുന്നത് ഇതിലാണ്.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Parotta_and_Beef.jpg',
    credit: 'AthulKumar · CC BY-SA 4.0 · Wikimedia Commons',
  },
  {
    id: 'ada-pradhaman',
    name: 'Ada Pradhaman',
    nameML: 'അട പ്രഥമൻ',
    kind: 'sweet',
    origin: ['pathanamthitta', 'alappuzha'],
    blurb: 'Rice ada simmered in jaggery and thick coconut milk. The payasam a sadya is judged on.',
    blurbML: 'ശർക്കരയും ഒന്നാം പാലും ചേർത്ത അട പായസം. സദ്യ അളക്കുന്നത് ഇതിലാണ്.',
  },
  {
    id: 'pothichoru',
    name: 'Pothichoru',
    nameML: 'പൊതിച്ചോറ്',
    kind: 'rice',
    origin: ['thiruvananthapuram', 'kollam'],
    blurb: 'Rice, a fry, a pickle and a thoran tied in banana leaf. The leaf does something to the rice.',
    blurbML: 'ചോറും മീൻ വറുത്തതും അച്ചാറും തോരനും വാഴയിലയിൽ. ഇല ചോറിനോട് എന്തോ ചെയ്യുന്നുണ്ട്.',
  },
  {
    id: 'mulayari-kanji',
    name: 'Mulayari Kanji',
    nameML: 'മുളയരി കഞ്ഞി',
    kind: 'breakfast',
    origin: ['wayanad'],
    blurb: 'Porridge of bamboo seed rice, gathered only in the years the bamboo flowers.',
    blurbML: 'മുള പൂക്കുന്ന വർഷങ്ങളിൽ മാത്രം കിട്ടുന്ന മുളയരികൊണ്ടുള്ള കഞ്ഞി.',
  },
  {
    id: 'thalassery-cake',
    name: 'Thalassery Cake',
    nameML: 'തലശ്ശേരി കേക്ക്',
    kind: 'sweet',
    origin: ['kannur'],
    blurb: 'India’s first baked Christmas cake came out of a Thalassery oven in 1883, and the recipe stayed.',
    blurbML: '1883-ൽ ഇന്ത്യയിലെ ആദ്യത്തെ ക്രിസ്മസ് കേക്ക് ചുട്ടത് തലശ്ശേരിയിലാണ്.',
  },
];

/* ── Places ─────────────────────────────────────────────────────────────── */
// North to south. Every district carries at least one place, so no filter is
// ever a dead end.

export const places: Place[] = [
  /* Kasaragod */
  {
    id: 'nileshwar-kadukka',
    name: 'Nileshwar kadukka stalls',
    nameML: 'നീലേശ്വരം കടുക്ക കടകൾ',
    town: 'Nileshwar', townML: 'നീലേശ്വരം',
    district: 'kasaragod', coords: [12.2586, 75.1370],
    serves: ['arikkadukka'],
    note: 'Evening carts along the main road. Mussel season runs roughly September to April; out of it, there is nothing to sell.',
    noteML: 'വൈകുന്നേരങ്ങളിൽ മെയിൻ റോഡിലെ വണ്ടികൾ. കടുക്ക സീസൺ സെപ്റ്റംബർ മുതൽ ഏപ്രിൽ വരെ.',
  },
  {
    id: 'kasaragod-town-pathiri',
    name: 'Kasaragod town kadas',
    nameML: 'കാസർകോട് ടൗണിലെ കടകൾ',
    town: 'Kasaragod', townML: 'കാസർകോട്',
    district: 'kasaragod', coords: [12.4996, 74.9869],
    serves: ['pathiri-meen', 'sulaimani'],
    note: 'The Malabar table this far north picks up Tulu and Konkani habits — the fish curry runs hotter and thinner.',
    noteML: 'ഇത്ര വടക്കെത്തുമ്പോൾ തുളു-കൊങ്കണി രുചികൾ കൂടി കലരും. മീൻ കറി എരിവ് കൂടിയതും നേർത്തതുമാകും.',
  },

  /* Kannur */
  {
    id: 'paris-thalassery',
    name: 'Paris Hotel',
    nameML: 'പാരീസ് ഹോട്ടൽ',
    town: 'Thalassery', townML: 'തലശ്ശേരി',
    district: 'kannur', coords: [11.7480, 75.4929],
    serves: ['thalassery-biryani', 'kallummakkaya'],
    note: 'One of the names Thalassery gives when asked about biryani. Kaima rice, dum finished, and it runs out by early afternoon.',
    noteML: 'ബിരിയാണി ചോദിച്ചാൽ തലശ്ശേരി പറയുന്ന പേരുകളിലൊന്ന്. ഉച്ചയോടെ തീരും.',
  },
  {
    id: 'mambally-thalassery',
    name: 'Mambally’s Royal Biscuit Factory',
    nameML: 'മമ്പള്ളി റോയൽ ബിസ്കറ്റ് ഫാക്ടറി',
    town: 'Thalassery', townML: 'തലശ്ശേരി',
    district: 'kannur', coords: [11.7502, 75.4915],
    serves: ['thalassery-cake'],
    note: 'Mambally Bapu baked what is generally held to be India’s first Christmas cake here in 1883. The family kept baking.',
    noteML: '1883-ൽ മമ്പള്ളി ബാപ്പു ഇന്ത്യയിലെ ആദ്യ ക്രിസ്മസ് കേക്ക് ചുട്ടത് ഇവിടെ. കുടുംബം ഇന്നും തുടരുന്നു.',
    since: 1883,
  },
  {
    id: 'kannur-town-hotels',
    name: 'Kannur town hotels',
    nameML: 'കണ്ണൂർ ടൗൺ ഹോട്ടലുകൾ',
    town: 'Kannur', townML: 'കണ്ണൂർ',
    district: 'kannur', coords: [11.8745, 75.3704],
    serves: ['pathiri-meen', 'kallummakkaya', 'sulaimani'],
    note: 'Kannur eats the Malabar menu without the crowds Kozhikode draws for it.',
    noteML: 'കോഴിക്കോട്ടെ തിരക്കില്ലാതെ അതേ മലബാർ മെനു.',
  },

  /* Wayanad */
  {
    id: 'kalpetta-kanji',
    name: 'Kalpetta town kitchens',
    nameML: 'കൽപ്പറ്റയിലെ അടുക്കളകൾ',
    town: 'Kalpetta', townML: 'കൽപ്പറ്റ',
    district: 'wayanad', coords: [11.6085, 76.0838],
    serves: ['mulayari-kanji', 'kappa-meen'],
    note: 'Bamboo rice appears only in the years the bamboo flowers, which is once in decades. Ask before travelling for it.',
    noteML: 'മുള പൂക്കുന്ന വർഷം മാത്രമേ മുളയരി കിട്ടൂ — പതിറ്റാണ്ടിലൊരിക്കൽ. പോകുംമുൻപ് ചോദിക്കുക.',
  },
  {
    id: 'sulthan-bathery-stalls',
    name: 'Sulthan Bathery roadside kadas',
    nameML: 'സുൽത്താൻ ബത്തേരി തട്ടുകടകൾ',
    town: 'Sulthan Bathery', townML: 'സുൽത്താൻ ബത്തേരി',
    district: 'wayanad', coords: [11.6653, 76.2593],
    serves: ['kappa-meen', 'porotta-beef'],
    note: 'The ghat road crowd stops here. Tapioca is the staple this high up, not rice.',
    noteML: 'ചുരം കയറുന്നവർ നിർത്തുന്നിടം. ഈ ഉയരത്തിൽ ചോറല്ല, കപ്പയാണ് പ്രധാനം.',
  },

  /* Kozhikode */
  {
    id: 'paragon-kozhikode',
    name: 'Paragon Restaurant',
    nameML: 'പാരഗൺ റെസ്റ്റോറന്റ്',
    town: 'Kozhikode', townML: 'കോഴിക്കോട്',
    district: 'kozhikode', coords: [11.2497, 75.7804],
    serves: ['thalassery-biryani', 'pathiri-meen', 'kallummakkaya'],
    note: 'Running since 1939 and the reference point most Malayalis argue against when they argue about Malabar food.',
    noteML: '1939 മുതൽ. മലബാർ ഭക്ഷണത്തെക്കുറിച്ചുള്ള തർക്കങ്ങൾ തുടങ്ങുന്നത് ഇവിടെനിന്നാണ്.',
    since: 1939,
  },
  {
    id: 'sm-street-halwa',
    name: 'SM Street halwa shops',
    nameML: 'എസ്എം സ്ട്രീറ്റ് ഹൽവ കടകൾ',
    town: 'Kozhikode', townML: 'കോഴിക്കോട്',
    district: 'kozhikode', coords: [11.2519, 75.7793],
    serves: ['kozhikodan-halwa'],
    note: 'Sweetmeat Street, named by the British for exactly this. Trays of it in every colour, sold by weight.',
    noteML: 'സ്വീറ്റ്മീറ്റ് സ്ട്രീറ്റ് എന്ന പേര് വന്നത് ഈ ഹൽവയിൽനിന്നാണ്. തൂക്കി വിൽക്കുന്നു.',
  },
  {
    id: 'kuttichira-kozhikode',
    name: 'Kuttichira kitchens',
    nameML: 'കുറ്റിച്ചിറയിലെ അടുക്കളകൾ',
    town: 'Kozhikode', townML: 'കോഴിക്കോട്',
    district: 'kozhikode', coords: [11.2456, 75.7752],
    serves: ['kallummakkaya', 'pathiri-meen'],
    note: 'The old Mappila quarter, where the stuffed-mussel and pathiri repertoire is a household one before it is a restaurant one.',
    noteML: 'പഴയ മാപ്പിള തെരുവ്. കല്ലുമ്മക്കായയും പത്തിരിയും ഹോട്ടലിലെത്തുംമുൻപ് വീട്ടിലുള്ളതാണ്.',
  },
  {
    id: 'kozhikode-beach-sulaimani',
    name: 'Kozhikode beach tea shops',
    nameML: 'കോഴിക്കോട് ബീച്ചിലെ ചായക്കടകൾ',
    town: 'Kozhikode', townML: 'കോഴിക്കോട്',
    district: 'kozhikode', coords: [11.2588, 75.7695],
    serves: ['sulaimani', 'kozhikodan-halwa'],
    note: 'Sunset, a glass of sulaimani, and a slab of halwa. The order is not negotiable.',
    noteML: 'അസ്തമയം, ഒരു ഗ്ലാസ് സുലൈമാനി, ഒരു കഷണം ഹൽവ.',
  },

  /* Malappuram */
  {
    id: 'tirur-pathiri',
    name: 'Tirur town hotels',
    nameML: 'തിരൂർ ടൗൺ ഹോട്ടലുകൾ',
    town: 'Tirur', townML: 'തിരൂർ',
    district: 'malappuram', coords: [10.9139, 75.9227],
    serves: ['pathiri-meen', 'sulaimani'],
    note: 'Pathiri country. The bread is pressed thin enough to see light through and eaten the same hour it is made.',
    noteML: 'പത്തിരിയുടെ നാട്. വെളിച്ചം കാണുന്നത്ര നേർത്തത്, ഉണ്ടാക്കിയ അതേ നേരത്ത് കഴിക്കണം.',
  },
  {
    id: 'ponnani-fish',
    name: 'Ponnani harbour stalls',
    nameML: 'പൊന്നാനി ഹാർബർ കടകൾ',
    town: 'Ponnani', townML: 'പൊന്നാനി',
    district: 'malappuram', coords: [10.7679, 75.9250],
    serves: ['pathiri-meen', 'kallummakkaya'],
    note: 'An old port town. What the boats bring in at dawn is on the plate by noon.',
    noteML: 'പഴയ തുറമുഖം. പുലർച്ചെ വള്ളം കൊണ്ടുവരുന്നത് ഉച്ചയ്ക്ക് പാത്രത്തിൽ.',
  },

  /* Palakkad */
  {
    id: 'ramassery-village',
    name: 'Ramassery idli houses',
    nameML: 'രാമശ്ശേരി ഇഡ്ഡലി വീടുകൾ',
    town: 'Ramassery', townML: 'രാമശ്ശേരി',
    district: 'palakkad', coords: [10.7594, 76.6100],
    serves: ['ramassery-idli'],
    note: 'A handful of families in one village, steaming over cloth on clay. The technique did not spread and they did not franchise it.',
    noteML: 'ഒരു ഗ്രാമത്തിലെ ചുരുക്കം കുടുംബങ്ങൾ. മൺകലത്തിൽ തുണിയിൽ ആവിയിൽ. ഈ വിദ്യ പുറത്തുപോയില്ല.',
  },
  {
    id: 'palakkad-town-ada',
    name: 'Palakkad town shops',
    nameML: 'പാലക്കാട് ടൗണിലെ കടകൾ',
    town: 'Palakkad', townML: 'പാലക്കാട്',
    district: 'palakkad', coords: [10.7867, 76.6548],
    serves: ['ela-ada', 'ramassery-idli'],
    note: 'The gap in the Ghats let Tamil habits in. The coffee is filter and the idli is not the coastal one.',
    noteML: 'ചുരത്തിലെ വിടവിലൂടെ തമിഴ് ശീലങ്ങൾ കടന്നുവന്നു. കാപ്പി ഫിൽട്ടർ, ഇഡ്ഡലി തീരദേശത്തേതല്ല.',
  },

  /* Thrissur */
  {
    id: 'ich-thrissur',
    name: 'Indian Coffee House, Round',
    nameML: 'ഇന്ത്യൻ കോഫി ഹൗസ്, റൗണ്ട്',
    town: 'Thrissur', townML: 'തൃശ്ശൂർ',
    district: 'thrissur', coords: [10.5276, 76.2144],
    serves: ['ela-ada', 'porotta-beef'],
    note: 'The worker-run chain that has outlived most things around it. Turbaned waiters, unchanged menu boards.',
    noteML: 'തൊഴിലാളികൾ നടത്തുന്ന ശൃംഖല. തലപ്പാവ് വച്ച വെയിറ്റർമാർ, മാറാത്ത മെനു.',
  },
  {
    id: 'thrissur-thattukada',
    name: 'Thrissur Round thattukadas',
    nameML: 'തൃശ്ശൂർ റൗണ്ടിലെ തട്ടുകടകൾ',
    town: 'Thrissur', townML: 'തൃശ്ശൂർ',
    district: 'thrissur', coords: [10.5259, 76.2137],
    serves: ['porotta-beef'],
    note: 'They open when the shops shut. Porotta slapped on the tawa to order, beef already dark in the pot.',
    noteML: 'കടകൾ അടയ്ക്കുമ്പോൾ ഇവ തുറക്കും. പൊറോട്ട അപ്പോൾ ചുടും, ബീഫ് നേരത്തേ തയ്യാർ.',
  },
  {
    id: 'guruvayur-ada',
    name: 'Guruvayur temple town shops',
    nameML: 'ഗുരുവായൂർ ക്ഷേത്രനഗരിയിലെ കടകൾ',
    town: 'Guruvayur', townML: 'ഗുരുവായൂർ',
    district: 'thrissur', coords: [10.5949, 76.0400],
    serves: ['ela-ada', 'ada-pradhaman'],
    note: 'Temple-town sweets, made in quantity for people who arrived hungry and leaving with a parcel.',
    noteML: 'ക്ഷേത്രനഗരിയിലെ മധുരം. വിശന്നെത്തുന്നവർക്കായി, മടങ്ങുമ്പോൾ ഒരു പൊതിയും.',
  },

  /* Ernakulam */
  {
    id: 'kayees-mattancherry',
    name: 'Kayees Rahmathulla Hotel',
    nameML: 'കായീസ് റഹ്മത്തുള്ള ഹോട്ടൽ',
    town: 'Mattancherry', townML: 'മട്ടാഞ്ചേരി',
    district: 'ernakulam', coords: [9.9581, 76.2593],
    serves: ['thalassery-biryani'],
    note: 'A Mattancherry institution for mutton biryani. Lunch only, and the queue knows it.',
    noteML: 'മട്ടാഞ്ചേരിയിലെ മട്ടൻ ബിരിയാണി. ഉച്ചയ്ക്ക് മാത്രം, ക്യൂ അത് അറിയാം.',
  },
  {
    id: 'fort-kochi-appam',
    name: 'Fort Kochi breakfast houses',
    nameML: 'ഫോർട്ട് കൊച്ചി പ്രാതൽ കടകൾ',
    town: 'Fort Kochi', townML: 'ഫോർട്ട് കൊച്ചി',
    district: 'ernakulam', coords: [9.9658, 76.2422],
    serves: ['appam-stew', 'beef-ularthiyathu'],
    note: 'Portuguese, Dutch and Syrian Christian kitchens left their layers here. Appam and stew is the one everyone kept.',
    noteML: 'പോർച്ചുഗീസ്, ഡച്ച്, സുറിയാനി അടുക്കളകളുടെ അടരുകൾ. എല്ലാവരും നിലനിർത്തിയത് അപ്പവും സ്റ്റ്യൂവും.',
  },
  {
    id: 'ich-ernakulam',
    name: 'Indian Coffee House, Jos Junction',
    nameML: 'ഇന്ത്യൻ കോഫി ഹൗസ്, ജോസ് ജംഗ്ഷൻ',
    town: 'Ernakulam', townML: 'എറണാകുളം',
    district: 'ernakulam', coords: [9.9694, 76.2825],
    serves: ['porotta-beef', 'appam-stew'],
    note: 'Reliable rather than remarkable, which after a day of traffic is the point.',
    noteML: 'അസാധാരണമല്ല, പക്ഷേ ഉറപ്പാണ്. തിരക്കുള്ള ദിവസത്തിനൊടുവിൽ അതുതന്നെ വേണ്ടത്.',
  },

  /* Idukki */
  {
    id: 'kattappana-kappa',
    name: 'Kattappana town kitchens',
    nameML: 'കട്ടപ്പനയിലെ അടുക്കളകൾ',
    town: 'Kattappana', townML: 'കട്ടപ്പന',
    district: 'idukki', coords: [9.7500, 77.1167],
    serves: ['kappa-meen', 'beef-ularthiyathu'],
    note: 'High-range settler cooking: tapioca, beef, and black pepper from the vine outside.',
    noteML: 'ഹൈറേഞ്ചിലെ കുടിയേറ്റ പാചകം — കപ്പ, ബീഫ്, മുറ്റത്തെ വള്ളിയിലെ കുരുമുളക്.',
  },
  {
    id: 'munnar-town',
    name: 'Munnar town hotels',
    nameML: 'മൂന്നാർ ടൗൺ ഹോട്ടലുകൾ',
    town: 'Munnar', townML: 'മൂന്നാർ',
    district: 'idukki', coords: [10.0889, 77.0595],
    serves: ['kappa-meen', 'porotta-beef'],
    note: 'Estate-worker food that tourism has priced but not much changed.',
    noteML: 'തോട്ടം തൊഴിലാളികളുടെ ഭക്ഷണം. വില ടൂറിസം മാറ്റി, രുചി അധികം മാറിയില്ല.',
  },

  /* Kottayam */
  {
    id: 'kottayam-toddy-shops',
    name: 'Kumarakom toddy shops',
    nameML: 'കുമരകത്തെ ഷാപ്പുകൾ',
    town: 'Kumarakom', townML: 'കുമരകം',
    district: 'kottayam', coords: [9.6178, 76.4300],
    serves: ['karimeen-pollichathu', 'kappa-meen', 'beef-ularthiyathu'],
    note: 'The shaap is where Kerala’s hardest cooking happens — karimeen off the backwater outside, curry sour with kudampuli.',
    noteML: 'കേരളത്തിലെ ഏറ്റവും കടുപ്പമുള്ള പാചകം ഷാപ്പിലാണ്. പുറത്തെ കായലിലെ കരിമീൻ, കുടംപുളി കറി.',
  },
  {
    id: 'kottayam-town-beef',
    name: 'Kottayam town kadas',
    nameML: 'കോട്ടയം ടൗണിലെ കടകൾ',
    town: 'Kottayam', townML: 'കോട്ടയം',
    district: 'kottayam', coords: [9.5916, 76.5222],
    serves: ['beef-ularthiyathu', 'appam-stew', 'kappa-meen'],
    note: 'Syrian Christian home cooking sold over a counter. Beef ularthiyathu here is the benchmark others are measured against.',
    noteML: 'സുറിയാനി ക്രിസ്ത്യൻ വീട്ടുപാചകം കടയിൽ. ബീഫ് ഉലർത്തിയതിന്റെ അളവുകോൽ ഇവിടെയാണ്.',
  },

  /* Alappuzha */
  {
    id: 'punnamada-karimeen',
    name: 'Punnamada backwater kitchens',
    nameML: 'പുന്നമട കായലോര അടുക്കളകൾ',
    town: 'Alappuzha', townML: 'ആലപ്പുഴ',
    district: 'alappuzha', coords: [9.4900, 76.3600],
    serves: ['karimeen-pollichathu'],
    note: 'Pearl spot from the lake it is named after, wrapped and charred in the leaf. Order it an hour ahead.',
    noteML: 'പേരുള്ള അതേ കായലിലെ കരിമീൻ, ഇലയിൽ പൊതിഞ്ഞ് ചുട്ടത്. ഒരു മണിക്കൂർ മുൻപ് പറയണം.',
  },
  {
    id: 'alappuzha-sadya',
    name: 'Alappuzha sadya kitchens',
    nameML: 'ആലപ്പുഴ സദ്യ അടുക്കളകൾ',
    town: 'Alappuzha', townML: 'ആലപ്പുഴ',
    district: 'alappuzha', coords: [9.4981, 76.3388],
    serves: ['ada-pradhaman', 'karimeen-pollichathu'],
    note: 'Onam sadya country. The ada pradhaman comes last and is the course people remember.',
    noteML: 'ഓണസദ്യയുടെ നാട്. അട പ്രഥമൻ അവസാനം വരും, ഓർമയിൽ നിൽക്കുന്നതും അതാണ്.',
  },

  /* Pathanamthitta */
  {
    id: 'pathanamthitta-sadya',
    name: 'Pathanamthitta sadya kitchens',
    nameML: 'പത്തനംതിട്ട സദ്യ അടുക്കളകൾ',
    town: 'Pathanamthitta', townML: 'പത്തനംതിട്ട',
    district: 'pathanamthitta', coords: [9.2648, 76.7870],
    serves: ['ada-pradhaman', 'appam-stew'],
    note: 'Payasam is taken seriously in this district in a way that is hard to overstate.',
    noteML: 'ഈ ജില്ലയിൽ പായസം എത്ര ഗൗരവമായാണ് എടുക്കുന്നതെന്ന് പറഞ്ഞറിയിക്കാനാവില്ല.',
  },
  {
    id: 'aranmula-vallasadya',
    name: 'Aranmula vallasadya kitchens',
    nameML: 'ആറന്മുള വള്ളസദ്യ',
    town: 'Aranmula', townML: 'ആറന്മുള',
    district: 'pathanamthitta', coords: [9.3167, 76.6833],
    serves: ['ada-pradhaman'],
    note: 'The boat-race feast, where the oarsmen ask for each dish in song and the kitchen answers.',
    noteML: 'വള്ളംകളി സദ്യ — തുഴച്ചിൽക്കാർ പാട്ടിലൂടെ വിഭവം ചോദിക്കും, അടുക്കള മറുപടി പറയും.',
  },

  /* Kollam */
  {
    id: 'kollam-pothichoru',
    name: 'Kollam town meals shops',
    nameML: 'കൊല്ലം ടൗൺ ഊണ് കടകൾ',
    town: 'Kollam', townML: 'കൊല്ലം',
    district: 'kollam', coords: [8.8932, 76.6141],
    serves: ['pothichoru'],
    note: 'Parcelled in banana leaf for the boat or the bus. The leaf is not packaging; it is an ingredient.',
    noteML: 'ബോട്ടിലേക്കോ ബസിലേക്കോ വാഴയിലയിൽ പൊതിഞ്ഞ്. ഇല പൊതിയല്ല, ചേരുവയാണ്.',
  },
  {
    id: 'ashtamudi-fish',
    name: 'Ashtamudi lakeside stalls',
    nameML: 'അഷ്ടമുടി കായലോര കടകൾ',
    town: 'Ashtamudi', townML: 'അഷ്ടമുടി',
    district: 'kollam', coords: [8.9333, 76.5833],
    serves: ['karimeen-pollichathu', 'pothichoru'],
    note: 'The lake supplies the kitchen directly, which shortens the argument about freshness.',
    noteML: 'കായൽ നേരിട്ട് അടുക്കളയിലേക്ക്. പുതുമയെക്കുറിച്ചുള്ള തർക്കം അവിടെ തീരും.',
  },

  /* Thiruvananthapuram */
  {
    id: 'aryaas-tvm',
    name: 'Hotel Aryaas',
    nameML: 'ഹോട്ടൽ ആര്യാസ്',
    town: 'Thiruvananthapuram', townML: 'തിരുവനന്തപുരം',
    district: 'thiruvananthapuram', coords: [8.4875, 76.9525],
    serves: ['appam-stew', 'ela-ada'],
    note: 'Vegetarian, near the fort, and busiest at breakfast. Appam from six in the morning.',
    noteML: 'കോട്ടയ്ക്കടുത്ത്, സസ്യാഹാരം. പ്രാതലിനാണ് തിരക്ക്. ആറ് മണി മുതൽ അപ്പം.',
  },
  {
    id: 'ich-tvm',
    name: 'Indian Coffee House, Thampanoor',
    nameML: 'ഇന്ത്യൻ കോഫി ഹൗസ്, തമ്പാനൂർ',
    town: 'Thiruvananthapuram', townML: 'തിരുവനന്തപുരം',
    district: 'thiruvananthapuram', coords: [8.4877, 76.9520],
    serves: ['porotta-beef', 'pothichoru'],
    note: 'The red spiral tower by the bus station, built by Laurie Baker. You climb to your table.',
    noteML: 'ബസ് സ്റ്റാൻഡിനടുത്ത് ലോറി ബേക്കർ പണിത ചുവന്ന ഗോപുരം. മേശയിലേക്ക് കയറിപ്പോകണം.',
  },
  {
    id: 'kovalam-fish',
    name: 'Kovalam beach shacks',
    nameML: 'കോവളം ബീച്ചിലെ കടകൾ',
    town: 'Kovalam', townML: 'കോവളം',
    district: 'thiruvananthapuram', coords: [8.4004, 76.9787],
    serves: ['pothichoru', 'karimeen-pollichathu'],
    note: 'You pick the fish off the ice and they weigh it in front of you. Confirm the rate before it goes on the grill.',
    noteML: 'ഐസിൽനിന്ന് മീൻ തിരഞ്ഞെടുക്കാം, മുന്നിൽവച്ച് തൂക്കും. ഗ്രില്ലിൽ വയ്ക്കുംമുൻപ് വില ഉറപ്പിക്കുക.',
  },
];

/* ── Lookups ────────────────────────────────────────────────────────────── */
// Every derivation lives here so pages stay presentational.

export const dishById = (id: string): Dish | undefined =>
  dishes.find((d) => d.id === id);

export const districtById = (id: string): District | undefined =>
  districts.find((d) => d.id === id);

export const placeById = (id: string): Place | undefined =>
  places.find((p) => p.id === id);

/** Places serving a dish, optionally within one district. */
export const placesServing = (dishId: string, district?: DistrictId): Place[] =>
  places.filter(
    (p) => p.serves.includes(dishId) && (!district || p.district === district),
  );

/**
 * Dishes available in a district — or everywhere — each with the number of
 * places serving it there.
 *
 * The count is what keeps the index honest: the page renders this list, so a
 * dish can never appear in it without somewhere to eat it. The empty result is
 * designed out rather than handled.
 */
export const dishesIn = (district?: DistrictId): { dish: Dish; count: number }[] =>
  dishes
    .map((dish) => ({ dish, count: placesServing(dish.id, district).length }))
    .filter((row) => row.count > 0);

/** Only districts that have at least one place — never offer a dead filter. */
export const activeDistricts = (): District[] =>
  districts.filter((d) => places.some((p) => p.district === d.id));

/** Every place, for the unfiltered view. */
export const allPlaces = (district?: DistrictId): Place[] =>
  district ? places.filter((p) => p.district === district) : places;

/**
 * A Commons file URL rewritten to ask for a thumbnail.
 *
 * The originals stored above are what the search API hands back, and some are
 * enormous — a 4,928px photograph behind a 52px square is not a page anyone
 * should have to download.
 *
 *   /commons/a/a2/File.jpg  →  /commons/thumb/a/a2/File.jpg/250px-File.jpg
 *
 * IMPORTANT: Commons does not serve arbitrary widths. It snaps requests to a
 * set of buckets and returns 400 for anything else — 640 and 800 both fail
 * where 250 and 960 succeed. So the width is a union of the two buckets that
 * were checked against every file in this list, not a free number. Adding a
 * size means verifying it against the Commons API first (`iiurlwidth` returns
 * the bucket it actually snapped to), otherwise the images silently 400.
 */
export type ThumbWidth = 250 | 960;

export const commonsThumb = (url: string, width: ThumbWidth): string => {
  if (!url.includes('/wikipedia/commons/') || url.includes('/commons/thumb/')) return url;
  const file = url.slice(url.lastIndexOf('/') + 1);
  return url.replace('/commons/', '/commons/thumb/') + `/${width}px-${file}`;
};

/**
 * One Tabler glyph per kind of food, so a pin says what sort of thing is served
 * there before anything is clicked. Kept beside the labels because the two are
 * read together — a legend prints the pair, and a marker prints the glyph.
 */
export const dishKindIcon: Record<Dish['kind'], string> = {
  breakfast: 'ti-egg-fried',
  rice:      'ti-bowl',
  bread:     'ti-bread',
  seafood:   'ti-fish',
  snack:     'ti-cookie',
  sweet:     'ti-candy',
  drink:     'ti-cup',
};

/**
 * The kind a place is pinned as. A place serves several dishes, so the pin
 * takes whichever kind it serves most of, and the first of its dishes settles
 * a tie — that is the order the desk wrote them in, which is the order they
 * meant.
 */
export const primaryKind = (place: Place): Dish['kind'] => {
  const tally = new Map<Dish['kind'], number>();
  for (const id of place.serves) {
    const d = dishById(id);
    if (d) tally.set(d.kind, (tally.get(d.kind) ?? 0) + 1);
  }
  let best: Dish['kind'] | null = null;
  for (const id of place.serves) {
    const d = dishById(id);
    if (!d) continue;
    if (best === null || (tally.get(d.kind) ?? 0) > (tally.get(best) ?? 0)) best = d.kind;
  }
  return best ?? 'rice';
};

export const dishKindLabel: Record<Dish['kind'], { en: string; ml: string }> = {
  breakfast: { en: 'Breakfast', ml: 'പ്രാതൽ' },
  rice:      { en: 'Rice',      ml: 'ചോറ്' },
  bread:     { en: 'Bread',     ml: 'പലഹാരം' },
  seafood:   { en: 'Seafood',   ml: 'കടൽ വിഭവം' },
  snack:     { en: 'Snack',     ml: 'ലഘുഭക്ഷണം' },
  sweet:     { en: 'Sweet',     ml: 'മധുരം' },
  drink:     { en: 'Drink',     ml: 'പാനീയം' },
};
