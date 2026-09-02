// ============================================================================
// Travelogue — the data behind a long-form trip feature.
//
// A trek is a set of waypoints and a set of chapters written along them. A
// chapter names its waypoint, so the map and the prose can never disagree about
// where the reader is: the chapter *is* the waypoint.
//
// A chapter is a list of blocks rather than a fixed shape. Long-form reporting
// doesn't come in one rhythm — some stretches are prose, some are a plate of
// photographs, some are a meal, and some need a map at that exact point rather
// than in the corner. StoryBlocks renders whichever the desk wrote.
//
// Three South Indian treks. Waypoint coordinates are approximate positions
// along the known ridge lines — good enough to follow, not survey data.
//
// Every photograph is a real Wikimedia Commons file of the place it is captioned
// as, carried with the author and licence it was released under. They are CC
// BY-SA, CC BY, CC0 or public domain — all of which require or invite
// attribution — so the credit travels in the block rather than in a footer
// nobody reads. Replacing one means replacing its credit with it.
// ============================================================================

export interface Waypoint {
  id: string;
  name: string;
  nameML: string;
  coords: [number, number];   // [lat, lng]
  /** Metres above sea level. */
  elevation: number;
  /** Kilometres walked from the trailhead. */
  km: number;
}

export type Block =
  /** Body copy. Malayalam is the story; English rides under it as a gloss. */
  | { kind: 'text'; ml: string; en?: string }
  /** One plate, or two frames side by side. */
  | { kind: 'photo'; src: string; src2?: string; caption?: string; wide?: boolean; credit?: string; credit2?: string }
  /** A map at this point in the reading, not in the corner. */
  | { kind: 'map'; zoom: number; captionML: string; caption?: string }
  /** What you eat here. */
  | { kind: 'food'; titleML: string; title: string; items: { ml: string; en: string; note?: string }[] }
  /** Something to stop and look at. */
  | { kind: 'sight'; titleML: string; title: string; ml: string; src?: string; credit?: string }
  /** A fact worth pulling out of the paragraph. */
  | { kind: 'note'; label: string; value: string };

export interface Chapter {
  id: string;
  waypoint: string;          // Waypoint id
  kicker: string;
  titleML: string;
  title: string;
  blocks: Block[];
}

export interface Trek {
  slug: string;
  title: string;
  titleML: string;
  standfirstML: string;
  standfirst: string;
  author: string;
  authorML: string;
  published: string;
  heroImage: string;
  heroCredit?: string;
  /** Where it is, for the collection index. */
  state: string;
  district: string;
  /** Days on the mountain, for the facts line. */
  days: number;
  /** One line for the card. */
  cardML: string;
  overview: { center: [number, number]; zoom: number };
  waypoints: Waypoint[];
  chapters: Chapter[];
}

const kumaraParvatha: Trek = {
  slug: 'kumara-parvatha',
  title: 'Kumara Parvatha',
  titleML: 'കുമാരപർവതം',
  standfirstML:
    'കുക്കെ സുബ്രഹ്മണ്യയിൽനിന്ന് പതിമൂന്ന് കിലോമീറ്റർ, 1712 മീറ്റർ ഉയരം. കർണാടകയിലെ ഏറ്റവും കഠിനമായ ട്രെക്കിലേക്ക് രണ്ട് ദിവസം.',
  standfirst:
    'Thirteen kilometres out of Kukke Subramanya and 1,712 metres up. Two days on the trek Karnataka calls its hardest.',
  author: 'MediaOne Travel Desk',
  authorML: 'മീഡിയവൺ ട്രാവൽ ഡെസ്ക്',
  published: '3 August 2026',
  heroImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kumara_parvatha%2C_Kukke_Sri_Subrahmanya%2C_Dakshina_Kananda.jpg',
  heroCredit: 'BHARATHESHA ALASANDEMAJALU · CC BY-SA 4.0 · Wikimedia Commons',
  state: 'Karnataka',
  district: 'Dakshina Kannada',
  days: 2,
  cardML: 'കുക്കെ സുബ്രഹ്മണ്യയിൽനിന്ന് 13 കിലോമീറ്റർ. കർണാടകയിലെ ഏറ്റവും കഠിനമായ കയറ്റം.',
  overview: { center: [12.6392, 75.6626], zoom: 12 },

  // Derived, not recalled — see the header of lib/journeys/kumara-parvatha.ts.
  // Every figure below is measured off OpenStreetMap relation 13650202 and the
  // terrarium DEM. What was here before was typed from memory and put the
  // summit 5.6 km from where it is, Bhattara Mane 250 m too high, and every
  // distance out by roughly a third.
  waypoints: [
    { id: 'kukke',    name: 'Kukke Subramanya', nameML: 'കുക്കെ സുബ്രഹ്മണ്യ', coords: [12.66031, 75.62108], elevation: 140,  km: 0 },
    { id: 'bhattara', name: 'Bhattara Mane',    nameML: 'ഭട്ടര മനെ',         coords: [12.66925, 75.65256], elevation: 849,  km: 3.94 },
    { id: 'mantapa',  name: 'Kallu Mantapa',    nameML: 'കല്ലു മണ്ഡപം',      coords: [12.66360, 75.66890], elevation: 1202, km: 6.07 },
    { id: 'shesha',   name: 'Sesha Parvata',    nameML: 'ശേഷ പർവതം',        coords: [12.66507, 75.67863], elevation: 1557, km: 7.44 },
    { id: 'summit',   name: 'Kumara Parvatha',  nameML: 'കുമാരപർവതം',       coords: [12.66205, 75.68648], elevation: 1716, km: 8.44 },
  ],

  chapters: [
    {
      id: 'ch-kukke',
      waypoint: 'kukke',
      kicker: 'The trailhead',
      titleML: 'ക്ഷേത്രത്തിന് പിന്നിലെ വഴി',
      title: 'The path behind the temple',
      blocks: [
        {
          kind: 'text',
          ml: 'പുലർച്ചെ അഞ്ചു മണിക്ക് കുക്കെ സുബ്രഹ്മണ്യ ഉണർന്നിട്ടില്ല. ക്ഷേത്രത്തിലെ ആദ്യത്തെ പൂജയ്ക്കുള്ള മണി മാത്രം കേൾക്കാം. ബസ് സ്റ്റാൻഡിൽനിന്ന് ഇടത്തോട്ട് തിരിഞ്ഞ്, കുമാരധാര പുഴയുടെ പാലം കടന്ന്, ഒരു ചെറിയ ബോർഡിന് അടിയിലൂടെയാണ് വഴി തുടങ്ങുന്നത് — "കുമാരപർവത ട്രെക്ക്".',
          en: 'At five in the morning Kukke Subramanya has not woken. Only the first bell of the temple carries. The path starts left of the bus stand, over the Kumaradhara bridge, under a small board that says nothing more than the name of the mountain.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kukke_Subramanya_Temple%2C_Karnataka_03.jpg/1920px-Kukke_Subramanya_Temple%2C_Karnataka_03.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/A_%22Do_not_litter%22_signboard_in_Pushpagiri_wildlife_sanctuary%2C_Subramanya%2C_Karnataka.jpg/1920px-A_%22Do_not_litter%22_signboard_in_Pushpagiri_wildlife_sanctuary%2C_Subramanya%2C_Karnataka.jpg',
          credit: 'A.Murali · CC0 · Wikimedia Commons',
          credit2: 'psubhashish · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'കുക്കെ സുബ്രഹ്മണ്യ ക്ഷേത്രം, പിന്നെ സങ്കേതത്തിലെ ബോർഡ് · The temple, and the sanctuary board',
        },
        {
          kind: 'note',
          label: 'Forest permit',
          value: '₹500',
        },
        {
          kind: 'text',
          ml: 'ഫോറസ്റ്റ് ചെക്ക്പോസ്റ്റിൽ പേരും ഫോൺ നമ്പറും എഴുതിക്കൊടുക്കണം. പ്ലാസ്റ്റിക് കുപ്പികൾ എണ്ണി രജിസ്റ്ററിൽ കുറിക്കും; തിരിച്ചിറങ്ങുമ്പോൾ അതേ എണ്ണം കാണിക്കണം. ഇത് ഒരു ഔപചാരികതയല്ല — പുഷ്പഗിരി വന്യജീവി സങ്കേതത്തിനുള്ളിലാണ് ഈ വഴി മുഴുവൻ.',
          en: 'You write your name and number at the forest checkpost. Plastic bottles are counted into a register, and the same number has to come back down. It is not a formality — the whole path runs inside the Pushpagiri sanctuary.',
        },
      ],
    },

    {
      id: 'ch-bhattara',
      waypoint: 'bhattara',
      kicker: 'Six kilometres in',
      titleML: 'ഭട്ടര മനെയിലെ ഊണ്',
      title: 'Lunch at Bhattara Mane',
      blocks: [
        {
          kind: 'text',
          ml: 'ആറു കിലോമീറ്റർ കയറ്റം കഴിയുമ്പോൾ കാട് പെട്ടെന്ന് തുറക്കും. ഒരു ഓടിട്ട വീട്, മുറ്റത്ത് കുറേ ചെരിപ്പുകൾ, പിന്നിൽ അടുക്കള. ഭട്ടര മനെ — അമ്പതു വർഷത്തിലേറെയായി ഈ മലയിലെ ഒരേയൊരു വിശ്രമകേന്ദ്രം. മുൻകൂട്ടി വിളിച്ചുപറഞ്ഞാൽ ഊണുണ്ട്; അല്ലെങ്കിൽ ഇല്ല.',
          en: 'Six kilometres up, the forest opens without warning onto a tiled house, a yard full of shoes, and a kitchen behind it. Bhattara Mane has been the only shelter on this mountain for over fifty years. Call ahead and there is a meal; do not, and there is not.',
        },
        {
          kind: 'food',
          titleML: 'ഭട്ടര മനെയിലെ ഊണ്',
          title: 'What the kitchen serves',
          items: [
            { ml: 'ചോറും സാമ്പാറും', en: 'Rice and sambar', note: 'Unlimited, served on the floor' },
            { ml: 'നീർ ദോശ', en: 'Neer dosa', note: 'Morning only' },
            { ml: 'മജ്ജിഗെ', en: 'Buttermilk', note: 'Salted, cold from the well' },
            { ml: 'ചുക്കുകാപ്പി', en: 'Dry-ginger coffee', note: 'For the cold at 1,100 m' },
          ],
        },
        {
          kind: 'text',
          ml: 'ഇവിടെയാണ് മിക്ക സംഘങ്ങളും ആദ്യ രാത്രി തങ്ങുന്നത്. കിടക്കാൻ ഹാൾ മാത്രം; കമ്പിളി വാടകയ്ക്ക് കിട്ടും. രാത്രി ഒൻപതു കഴിഞ്ഞാൽ ജനറേറ്റർ ഓഫാകും, പിന്നെ കാടിന്റെ ശബ്ദം മാത്രം.',
          en: 'Most groups spend the first night here. There is a hall to sleep in and blankets to rent. The generator goes off after nine, and after that there is only the forest.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Inside_Forest_%40Pushpagiri_Wildlife_Sanctuary.jpg/1920px-Inside_Forest_%40Pushpagiri_Wildlife_Sanctuary.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Tents_on_a_view_point_in_Pushpagiri_wildlife_sanctuary.jpg/1920px-Tents_on_a_view_point_in_Pushpagiri_wildlife_sanctuary.jpg',
          credit: 'Manamohana Holla K · CC BY-SA 4.0 · Wikimedia Commons',
          credit2: 'psubhashish · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'കാടിനുള്ളിൽ, പിന്നെ മുകളിലെ ടെന്റുകൾ · Inside the forest, and camp above it',
        },
        {
          kind: 'map',
          zoom: 13,
          captionML: 'ഭട്ടര മനെ — കയറ്റത്തിന്റെ പകുതി, 1100 മീറ്റർ',
          caption: 'Bhattara Mane sits at the halfway mark, 1,100 m',
        },
      ],
    },

    {
      id: 'ch-mantapa',
      waypoint: 'mantapa',
      kicker: 'Above the treeline',
      titleML: 'കല്ലു മണ്ഡപവും പുൽമേടും',
      title: 'Kallu Mantapa and the grassland',
      blocks: [
        {
          kind: 'text',
          ml: 'ഭട്ടര മനെ കഴിഞ്ഞാൽ കാട് തീരും, പുല്ല് തുടങ്ങും. ഷോലാ പുൽമേടുകൾ — പശ്ചിമഘട്ടത്തിന്റെ ഈ ഉയരത്തിൽ മാത്രം കാണുന്ന ഭൂപ്രകൃതി. കാറ്റ് ഇവിടെ മറയില്ലാതെ അടിക്കും. കല്ലു മണ്ഡപം എന്നത് ഒരു കൽക്കൂട്ടം മാത്രമാണ്, പക്ഷേ മഴ വന്നാൽ അതിനടിയിൽ ഒളിക്കാം.',
          en: 'Past Bhattara Mane the forest ends and the grass begins — shola grassland, which exists at this altitude in the Western Ghats and almost nowhere else. The wind arrives unobstructed. Kallu Mantapa is a heap of stone and nothing more, but it is somewhere to get under when the rain comes.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Pushpagiri_WildlifeSanctuary-Coorg.jpg/1920px-Pushpagiri_WildlifeSanctuary-Coorg.jpg',
          credit: 'Uajith · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'പുൽമേട്ടിലെ വഴി · The path through shola grassland',
          wide: true,
        },
        {
          kind: 'sight',
          titleML: 'ഷോലാ പുൽമേട്',
          title: 'Shola grassland',
          ml: 'താഴ്വരകളിൽ ഇടതൂർന്ന കാട്, മുകളിൽ തുറന്ന പുല്ല് — പതിനായിരക്കണക്കിന് വർഷത്തെ കാലാവസ്ഥ ഉണ്ടാക്കിയ ഈ മൊസൈക് പശ്ചിമഘട്ടത്തിന്റെ മാത്രം സവിശേഷതയാണ്. ഇവിടത്തെ പുല്ല് വേരുകളിലാണ് മഴവെള്ളം സംഭരിക്കപ്പെടുന്നത്; അതാണ് താഴെ പുഴയാകുന്നത്.',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/A_magnificent_tree_in_Pushpagiri_WLS_P1110992.jpg/1920px-A_magnificent_tree_in_Pushpagiri_WLS_P1110992.jpg',
          credit: 'Ajtjohnsingh · CC BY-SA 4.0 · Wikimedia Commons',
        },
      ],
    },

    {
      id: 'ch-shesha',
      waypoint: 'shesha',
      kicker: 'The false summit',
      titleML: 'ശേഷ പർവതം — കയറ്റത്തിലെ ചതി',
      title: 'Shesha Parvatha, which is not the top',
      blocks: [
        {
          kind: 'text',
          ml: 'ശേഷ പർവതം കണ്ടാൽ അതാണ് കൊടുമുടി എന്ന് തോന്നും. അല്ല. അതിന് മുകളിൽ കയറി, പിന്നെ ഇറങ്ങി, വീണ്ടും കയറണം — ഈ അവസാനത്തെ രണ്ട് കിലോമീറ്ററാണ് ഈ ട്രെക്കിനെ കർണാടകയിലെ ഏറ്റവും കഠിനമെന്ന് വിളിക്കുന്നത്.',
          en: 'Shesha Parvatha looks like the summit. It is not. You climb it, drop off the back, and climb again — and it is this last two kilometres that earns the trek its reputation.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kumara_Parvatha_cliff.JPG/1920px-Kumara_Parvatha_cliff.JPG',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/On_the_Cliff.jpg/1920px-On_the_Cliff.jpg',
          credit: 'Vivekvaibhavroy · CC BY-SA 3.0 · Wikimedia Commons',
          credit2: 'Charananasam · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'ശേഷ പർവതത്തിലെ പാറ · The cliff on Shesha Parvatha',
        },
        {
          kind: 'note',
          label: 'Last water',
          value: 'Bhattara Mane',
        },
        {
          kind: 'text',
          ml: 'ശേഷ പർവതത്തിന് ശേഷം വെള്ളമില്ല. ഒരാൾക്ക് കുറഞ്ഞത് മൂന്ന് ലിറ്റർ കൊണ്ടുപോകണം. ഉച്ചയ്ക്ക് ശേഷം മൂടൽമഞ്ഞ് വരും, ദൃശ്യപരിധി ഇരുപത് മീറ്ററായി ചുരുങ്ങും.',
          en: 'There is no water after Shesha Parvatha. Carry three litres a head. The mist comes in after noon and visibility drops to twenty metres.',
        },
      ],
    },

    {
      id: 'ch-summit',
      waypoint: 'summit',
      kicker: '1,712 metres',
      titleML: 'മുകളിൽ',
      title: 'The top',
      blocks: [
        {
          kind: 'text',
          ml: 'ആറര മണിക്ക് സൂര്യൻ വരുമ്പോൾ താഴെ മുഴുവൻ മേഘമാണ്. കൊടുമുടികൾ മാത്രം അതിന് മുകളിൽ ദ്വീപുകൾ പോലെ. പടിഞ്ഞാറ് തെളിഞ്ഞാൽ അറബിക്കടൽ കാണാം എന്ന് പറയും; ഞങ്ങൾക്ക് കണ്ടില്ല. കിഴക്ക് കുടകിന്റെ മലനിരകൾ.',
          en: 'When the sun comes at half past six the whole valley is cloud, with the peaks standing out of it like islands. They say you can see the Arabian Sea to the west on a clear day. We did not. To the east, the hills of Kodagu.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Clouds_at_sunrise_in_Kumaraparvatha%2C_India_20_December_2015.jpg/1920px-Clouds_at_sunrise_in_Kumaraparvatha%2C_India_20_December_2015.jpg',
          credit: 'Gaurav Kapatia · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'കൊടുമുടിയിൽനിന്ന് സൂര്യോദയം — താഴെ മുഴുവൻ മേഘം · Sunrise from the summit, the valley under cloud',
          wide: true,
        },
        {
          kind: 'map',
          zoom: 14,
          captionML: 'കുമാരപർവതം — 1712 മീറ്റർ, പതിമൂന്നാം കിലോമീറ്റർ',
          caption: 'The summit — 1,712 m, thirteen kilometres in',
        },
        {
          kind: 'text',
          ml: 'ഇറക്കം കയറ്റത്തേക്കാൾ എളുപ്പമല്ല. കാൽമുട്ടിന് ട്രെക്കിങ് പോൾ ഉപയോഗിക്കുന്നത് നല്ലതാണ്. ഉച്ചയ്ക്ക് മുൻപ് ഭട്ടര മനെയിൽ എത്തിയാൽ ഒരു ഊണുകൂടി കിട്ടും — അതിനുവേണ്ടി മാത്രം വേഗത്തിൽ ഇറങ്ങുന്നവരുണ്ട്.',
          en: 'Going down is not easier than coming up. Use poles if your knees have an opinion. Reach Bhattara Mane before noon and there is one more meal waiting, which is reason enough for some people to hurry.',
        },
      ],
    },
  ],
};


const agasthyakoodam: Trek = {
  slug: 'agasthyakoodam',
  title: 'Agasthyakoodam',
  titleML: 'അഗസ്ത്യകൂടം',
  standfirstML:
    'നെയ്യാർ വന്യജീവി സങ്കേതത്തിലൂടെ 28 കിലോമീറ്റർ, 1868 മീറ്റർ. അനുമതിയില്ലാതെ ഒരടി പോലും വയ്ക്കാനാവാത്ത മല.',
  standfirst:
    'Twenty-eight kilometres through the Neyyar sanctuary to 1,868 metres — a mountain you cannot take a step on without a permit.',
  author: 'MediaOne Travel Desk',
  authorML: 'മീഡിയവൺ ട്രാവൽ ഡെസ്ക്',
  published: '3 August 2026',
  heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Agasthyarkoodam.JPG/1920px-Agasthyarkoodam.JPG',
  heroCredit: 'Unbound Rover · CC BY-SA 4.0 · Wikimedia Commons',
  state: 'Kerala',
  district: 'Thiruvananthapuram',
  days: 2,
  cardML: 'നെയ്യാറിലൂടെ അതിരുമലയിലേക്ക്, പിന്നെ കൊടുമുടിയിലേക്ക്. സീസൺ ജനുവരി മുതൽ മാർച്ച് വരെ മാത്രം.',
  overview: { center: [8.6200, 77.2200], zoom: 11 },

  waypoints: [
    { id: 'bonacaud',  name: 'Bonacaud',    nameML: 'ബോണക്കാട്',  coords: [8.6742, 77.1461], elevation: 450,  km: 0 },
    { id: 'vazhavara', name: 'Vazhavara',   nameML: 'വഴവറ',      coords: [8.6480, 77.1830], elevation: 900,  km: 8 },
    { id: 'athirumala', name: 'Athirumala', nameML: 'അതിരുമല',   coords: [8.6280, 77.2050], elevation: 1200, km: 14 },
    { id: 'peak',      name: 'Agasthyakoodam', nameML: 'അഗസ്ത്യകൂടം', coords: [8.6178, 77.2264], elevation: 1868, km: 20 },
  ],

  chapters: [
    {
      id: 'ag-bonacaud',
      waypoint: 'bonacaud',
      kicker: 'The permit',
      titleML: 'അനുമതിയില്ലാതെ ഒരടി പോലും',
      title: 'Not one step without a permit',
      blocks: [
        {
          kind: 'text',
          ml: 'അഗസ്ത്യകൂടത്തിലേക്ക് ആർക്കും എപ്പോൾ വേണമെങ്കിലും കയറാനാവില്ല. വനംവകുപ്പിന്റെ ഓൺലൈൻ ബുക്കിങ് തുറക്കുന്നത് ഡിസംബറിലാണ്; സീസൺ ജനുവരി പകുതി മുതൽ മാർച്ച് ആദ്യം വരെ മാത്രം. ഒരു ദിവസം നൂറ് പേർ. ബാക്കിയുള്ള ഒൻപത് മാസം ഈ മല അടച്ചിട്ടിരിക്കും.',
          en: 'You cannot simply walk up Agasthyakoodam. Forest department booking opens in December, the season runs from mid-January to early March, and a hundred people are allowed a day. For the other nine months the mountain is closed.',
        },
        {
          kind: 'note',
          label: 'Season',
          value: 'Jan – Mar',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Agasthyakoodamtrek.jpg/1920px-Agasthyakoodamtrek.jpg',
          credit: 'Varkey Parakkal · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'ബോണക്കാട്ടിൽനിന്ന് വഴി തുടങ്ങുന്നു · The path out of Bonacaud',
          wide: true,
        },
        {
          kind: 'text',
          ml: 'ബോണക്കാട് പിക്കറ്റ് സ്റ്റേഷനിൽനിന്നാണ് തുടക്കം. പഴയ തേയിലത്തോട്ടത്തിന്റെ അവശിഷ്ടങ്ങൾ കടന്ന്, കാട് കട്ടിയാകുന്നു. വഴികാട്ടിയായി കാണി വിഭാഗത്തിൽപ്പെട്ട ഒരാൾ ഒപ്പമുണ്ടാകും — ഈ കാട് അവരുടേതാണ്, അവർക്കറിയാം.',
          en: 'It starts at the Bonacaud picket station, past the ruins of an old tea estate, and the forest closes in. A guide from the Kani community walks with you — this is their forest, and they know it.',
        },
      ],
    },
    {
      id: 'ag-athirumala',
      waypoint: 'athirumala',
      kicker: 'Base camp',
      titleML: 'അതിരുമലയിലെ രാത്രി',
      title: 'A night at Athirumala',
      blocks: [
        {
          kind: 'text',
          ml: 'പതിനാല് കിലോമീറ്റർ കഴിഞ്ഞാൽ അതിരുമല. വനംവകുപ്പിന്റെ ഷെഡുകൾ, ഒരു അടുക്കള, ഒരു ചെറിയ അരുവി. എല്ലാവരും ഇവിടെ രാത്രി തങ്ങും — കൊടുമുടിയിലേക്ക് ഇനി ആറ് കിലോമീറ്റർ കൂടിയേയുള്ളൂ, പക്ഷേ അത് ഇരുട്ടത്ത് കയറാവുന്ന വഴിയല്ല.',
          en: 'Fourteen kilometres in is Athirumala: forest department sheds, a kitchen, a small stream. Everyone stops here. The summit is only six kilometres further, but it is not a path to take in the dark.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Athirumala_Base_Station_in_Agastya_Mala.jpg/1920px-Athirumala_Base_Station_in_Agastya_Mala.jpg',
          credit: 'Aniprasanth · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'അതിരുമല ബേസ് ക്യാമ്പ് · The base station at Athirumala',
        },
        {
          kind: 'food',
          titleML: 'ക്യാമ്പിലെ ഭക്ഷണം',
          title: 'What the camp gives you',
          items: [
            { ml: 'കഞ്ഞിയും പയറും', en: 'Rice gruel and green gram', note: 'Evening, after you arrive' },
            { ml: 'ചപ്പാത്തിയും കറിയും', en: 'Chapati and curry', note: 'Morning, before the summit push' },
            { ml: 'കട്ടൻ ചായ', en: 'Black tea', note: 'All night, from the kitchen shed' },
          ],
        },
        {
          kind: 'map',
          zoom: 13,
          captionML: 'അതിരുമല — 1200 മീറ്റർ, പതിനാലാം കിലോമീറ്റർ',
          caption: 'Athirumala, 1,200 m and fourteen kilometres in',
        },
      ],
    },
    {
      id: 'ag-peak',
      waypoint: 'peak',
      kicker: '1,868 metres',
      titleML: 'അഗസ്ത്യമുനിയുടെ മുകളിൽ',
      title: 'At the sage',
      blocks: [
        {
          kind: 'text',
          ml: 'അവസാനത്തെ രണ്ട് കിലോമീറ്റർ കയറ്റമല്ല, പാറകയറ്റമാണ്. കയറുകൾ കെട്ടിയിട്ടുണ്ട്. മുകളിൽ അഗസ്ത്യമുനിയുടെ പ്രതിഷ്ഠ — ഇത് ഒരു തീർഥാടനം കൂടിയാണ്, പലർക്കും ട്രെക്കിനേക്കാൾ അതാണ്.',
          en: 'The last two kilometres are not a climb but a scramble, with ropes fixed on the rock. At the top there is an idol of the sage Agastya. For many people this is a pilgrimage first and a trek second.',
        },
        {
          kind: 'sight',
          titleML: 'അഗസ്ത്യമല ജൈവമണ്ഡലം',
          title: 'Agasthyamala Biosphere Reserve',
          ml: 'യുനെസ്കോ അംഗീകരിച്ച ജൈവമണ്ഡല കരുതൽ മേഖലയാണിത്. രണ്ടായിരത്തിലധികം സസ്യയിനങ്ങൾ, അതിൽ നൂറുകണക്കിന് ഔഷധസസ്യങ്ങൾ. കാണി വിഭാഗത്തിന്റെ പരമ്പരാഗത അറിവാണ് ഇവിടത്തെ ഔഷധച്ചെടികളെക്കുറിച്ചുള്ള പഠനങ്ങളുടെ അടിസ്ഥാനം.',
          src: 'https://upload.wikimedia.org/wikipedia/commons/8/80/A_view_of_the_Agasthyamalai_range_from_Upper_Kodayar.jpg',
          credit: 'Seshadri.K.S · CC BY-SA 3.0 · Wikimedia Commons',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/An_old_rock_broken_apart_by_nature_in_Agasthyamala_before_reaching_Agasthya_muni_idol.jpg/1920px-An_old_rock_broken_apart_by_nature_in_Agasthyamala_before_reaching_Agasthya_muni_idol.jpg',
          credit: 'Arun Gopi · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'കൊടുമുടിക്ക് തൊട്ടുതാഴെ · Just below the summit',
        },
      ],
    },
  ],
};

const meesapulimala: Trek = {
  slug: 'meesapulimala',
  title: 'Meesapulimala',
  titleML: 'മീശപ്പുലിമല',
  standfirstML:
    'മൂന്നാറിൽനിന്ന് എട്ട് കിലോമീറ്റർ, 2640 മീറ്റർ. ദക്ഷിണേന്ത്യയിലെ രണ്ടാമത്തെ ഏറ്റവും ഉയരമുള്ള കൊടുമുടി.',
  standfirst:
    'Eight kilometres out of Munnar to 2,640 metres — the second-highest peak in South India, walked in a morning.',
  author: 'MediaOne Travel Desk',
  authorML: 'മീഡിയവൺ ട്രാവൽ ഡെസ്ക്',
  published: '3 August 2026',
  heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Meeahapullimala.jpg/1920px-Meeahapullimala.jpg',
  heroCredit: 'Sarathgks92 · CC BY-SA 4.0 · Wikimedia Commons',
  state: 'Kerala',
  district: 'Idukki',
  days: 1,
  cardML: 'റോഡോഡെൻഡ്രോൺ ചോലക്കാടുകളിലൂടെ എട്ട് കിലോമീറ്റർ. ഒരു പകൽകൊണ്ട് തീരും.',
  overview: { center: [10.1300, 77.1200], zoom: 12 },

  // Derived, not recalled — see the header of lib/journeys/meesapulimala.ts.
  // What was here put the summit at 10.1258, 77.1289; OpenStreetMap has it at
  // 10.08756, 77.20443, some 9 km away. The intermediate waypoints named places
  // OSM does not carry at all, so they are replaced by points that are on the
  // mapped trail and can be pointed at.
  waypoints: [
    { id: 'silent',  name: 'Silent Valley side', nameML: 'സൈലന്റ് വാലി', coords: [10.12711, 77.19509], elevation: 1915, km: 0 },
    { id: 'ridge',   name: 'The ridge',      nameML: 'മലനിര',       coords: [10.11061, 77.19276], elevation: 2556, km: 5.83 },
    { id: 'manna',   name: 'Manna Malai',    nameML: 'മന്ന മല',     coords: [10.09845, 77.20283], elevation: 2497, km: 10.3 },
    { id: 'peak',    name: 'Meesapulimala', nameML: 'മീശപ്പുലിമല', coords: [10.08756, 77.20443], elevation: 2615, km: 10.97 },
  ],

  chapters: [
    {
      id: 'mp-silent',
      waypoint: 'silent',
      kicker: 'From the estate',
      titleML: 'തേയിലത്തോട്ടം കഴിഞ്ഞാൽ',
      title: 'Where the tea ends',
      blocks: [
        {
          kind: 'text',
          ml: 'മൂന്നാറിൽനിന്ന് ജീപ്പിൽ സൈലന്റ് വാലി എസ്റ്റേറ്റ് വരെ. അവിടെ വച്ച് തേയില തീരുന്നു, പുല്ല് തുടങ്ങുന്നു. കെഎഫ്ഡിസിയുടെ അനുമതിയോടെ മാത്രമേ ഇനി മുന്നോട്ട് പോകാനാവൂ; ഗൈഡ് നിർബന്ധമാണ്.',
          en: 'A jeep from Munnar as far as the Silent Valley estate. That is where the tea stops and the grass begins. Beyond it you need KFDC permission, and a guide is not optional.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Munnar_-_Tea_Plantations.jpg/1920px-Munnar_-_Tea_Plantations.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/1920px-Munnar_Overview.jpg',
          credit: 'Ingo Mehling · CC BY-SA 4.0 · Wikimedia Commons',
          credit2: 'Kondephy · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'മൂന്നാറിലെ തേയിലത്തോട്ടങ്ങൾ · The estates below the trailhead',
        },
      ],
    },
    {
      id: 'mp-rhodo',
      // Rhodo Valley is not in OpenStreetMap, so this chapter is anchored to
      // the high point of the mapped ridge rather than to coordinates nobody
      // can source. The prose is unchanged; only the figures in the header now
      // belong to a point that exists.
      waypoint: 'ridge',
      kicker: 'On the ridge',
      titleML: 'റോഡോഡെൻഡ്രോൺ താഴ്വര',
      title: 'The rhododendron valley',
      blocks: [
        {
          kind: 'text',
          ml: 'ഈ ഉയരത്തിൽ റോഡോഡെൻഡ്രോൺ വളരും — ഹിമാലയത്തിൽ കാണുന്ന അതേ ചെടി, പശ്ചിമഘട്ടത്തിലെ ഏറ്റവും ഉയർന്ന ചോലക്കാടുകളിൽ ഒറ്റപ്പെട്ടുനിൽക്കുന്ന ഒരു കൂട്ടം. ഏപ്രിൽ-മേയ് മാസങ്ങളിൽ പൂക്കും.',
          en: 'Rhododendron grows at this height — the same plant as the Himalaya, marooned here in the highest shola of the Western Ghats. It flowers in April and May.',
        },
        {
          kind: 'sight',
          titleML: 'വരയാട്',
          title: 'The Nilgiri tahr',
          ml: 'ഈ പുൽമേടുകളിലാണ് വരയാടുകൾ. ലോകത്ത് വേറെയെവിടെയും ഇല്ലാത്ത ജീവി; ഏറ്റവും വലിയ കൂട്ടം ഇരവികുളത്താണ്. രാവിലെ നേരത്തെ പോയാൽ പാറക്കെട്ടുകളിൽ കാണാം.',
          src: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Varayadu.JPG',
          credit: 'Vethalam at ml.wikipedia · Public domain · Wikimedia Commons',
        },
        {
          kind: 'map',
          zoom: 13,
          captionML: 'റോഡോ വാലി — 2200 മീറ്റർ',
          caption: 'Rhodo Valley, 2,200 m',
        },
      ],
    },
    {
      id: 'mp-peak',
      waypoint: 'peak',
      kicker: 'The summit',
      titleML: 'രണ്ട് സംസ്ഥാനങ്ങൾക്കിടയിൽ',
      title: 'Between two states',
      blocks: [
        {
          kind: 'text',
          ml: 'കൊടുമുടിയിൽ നിന്നാൽ ഇടതുവശത്ത് കേരളം, വലതുവശത്ത് തമിഴ്നാട്. താഴെ കൊളുക്കുമല, അതിനപ്പുറം തേനി. ആനമുടി വടക്ക് കാണാം — ദക്ഷിണേന്ത്യയിലെ ഏറ്റവും ഉയരമുള്ള കൊടുമുടി, ഇതിനേക്കാൾ വെറും അമ്പത് മീറ്റർ കൂടുതൽ.',
          en: 'Stand on the top and Kerala is on your left, Tamil Nadu on your right. Kolukkumalai below, Theni beyond it. Anamudi is visible to the north — the highest peak in South India, and only fifty metres taller than this one.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/The_View_towards_Tamil_Nadu_from_Meesapulimala_Peak.jpg/1920px-The_View_towards_Tamil_Nadu_from_Meesapulimala_Peak.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Naikolli_Mala_near_Anamudi.jpg/1920px-Naikolli_Mala_near_Anamudi.jpg',
          credit: 'Jan J George · CC BY-SA 4.0 · Wikimedia Commons',
          credit2: 'Arunguy2002 · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'കൊടുമുടിയിൽനിന്ന് തമിഴ്നാട്ടിലേക്ക് · Looking into Tamil Nadu',
        },
        {
          kind: 'map',
          zoom: 14,
          captionML: 'മീശപ്പുലിമല — 2640 മീറ്റർ',
          caption: 'Meesapulimala, 2,640 m',
        },
      ],
    },
  ],
};

const kodachadri: Trek = {
  slug: 'kodachadri',
  title: 'Kodachadri',
  titleML: 'കുടജാദ്രി',
  standfirstML:
    'കൊല്ലൂരിൽനിന്ന് പതിന്നാല് കിലോമീറ്റർ, 1343 മീറ്റർ. വെള്ളച്ചാട്ടത്തിലൂടെ കയറി ശങ്കരാചാര്യരുടെ പീഠത്തിലേക്ക്.',
  standfirst:
    'Fourteen kilometres out of Kollur to 1,343 metres — up through a waterfall to a stone shrine on the ridge.',
  author: 'MediaOne Travel Desk',
  authorML: 'മീഡിയവൺ ട്രാവൽ ഡെസ്ക്',
  published: '3 August 2026',
  heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Colors_of_Sunrise_at_Kodachadri_Peak_2.jpg',
  heroCredit: 'Narotham.r · CC BY-SA 4.0 · Wikimedia Commons',
  state: 'Karnataka',
  district: 'Shivamogga',
  days: 1,
  cardML: 'കൊല്ലൂർ മൂകാംബികയിൽനിന്ന് ഹിഡ്ലുമനെ വെള്ളച്ചാട്ടത്തിലൂടെ സർവജ്ഞപീഠത്തിലേക്ക്.',
  overview: { center: [13.8670, 74.8400], zoom: 11 },

  waypoints: [
    { id: 'kollur',    name: 'Kollur',           nameML: 'കൊല്ലൂർ',        coords: [13.8639, 74.8069], elevation: 90,   km: 0 },
    { id: 'nittur',    name: 'Nittur',           nameML: 'നിട്ടൂർ',        coords: [13.8680, 74.8300], elevation: 260,  km: 5 },
    { id: 'hidlumane', name: 'Hidlumane Falls',  nameML: 'ഹിഡ്ലുമനെ വെള്ളച്ചാട്ടം', coords: [13.8700, 74.8480], elevation: 720,  km: 8 },
    { id: 'peetha',    name: 'Sarvajna Peetha',  nameML: 'സർവജ്ഞപീഠം',     coords: [13.8667, 74.8650], elevation: 1320, km: 13 },
    { id: 'summit',    name: 'Kodachadri',       nameML: 'കുടജാദ്രി',      coords: [13.8660, 74.8680], elevation: 1343, km: 14 },
  ],

  chapters: [
    {
      id: 'kd-kollur',
      waypoint: 'kollur',
      kicker: 'The base',
      titleML: 'മൂകാംബികയുടെ താഴെ',
      title: 'Below Mookambika',
      blocks: [
        {
          kind: 'text',
          ml: 'കുടജാദ്രിയിലേക്ക് പോകുന്ന മിക്ക മലയാളികളും ആദ്യം കൊല്ലൂരിലാണ് എത്തുന്നത്. മൂകാംബിക ക്ഷേത്രം — കേരളത്തിൽനിന്ന് ഏറ്റവുമധികം പേർ പോകുന്ന കർണാടക ക്ഷേത്രം. ട്രെക്ക് ഇവിടെനിന്നല്ല തുടങ്ങുന്നത്, പക്ഷേ യാത്ര ഇവിടെനിന്നാണ്.',
          en: 'Most Malayalis who go up Kodachadri arrive first at Kollur, and the Mookambika temple — the Karnataka temple that draws more people from Kerala than any other. The trek does not begin here. The journey does.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Sri_Mookambika_Temple%2C_Kollur%2C_Karnataka_02.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Kollur_Mookambika_temple_entrance_gate.jpg',
          credit: 'A.Murali · CC0 · Wikimedia Commons',
          credit2: 'Starstuffseyyon · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'കൊല്ലൂർ മൂകാംബിക ക്ഷേത്രം · The temple at Kollur',
        },
        {
          kind: 'food',
          titleML: 'കൊല്ലൂരിലെ ഊണ്',
          title: 'What Kollur feeds you',
          items: [
            { ml: 'അന്നദാനം', en: 'Temple annadanam', note: 'Free, served to everyone, twice a day' },
            { ml: 'നീർ ദോശ', en: 'Neer dosa', note: 'The local breakfast, thin as cloth' },
            { ml: 'കടുബു', en: 'Kadubu', note: 'Steamed in jackfruit leaf' },
            { ml: 'ഗോളിബജെ', en: 'Goli baje', note: 'For the bus, or the climb' },
          ],
        },
        {
          kind: 'note',
          label: 'Best season',
          value: 'Oct – Feb',
        },
      ],
    },

    {
      id: 'kd-nittur',
      waypoint: 'nittur',
      kicker: 'Where the walking starts',
      titleML: 'നിട്ടൂരിൽ ജീപ്പ് നിർത്തുന്നു',
      title: 'The jeep stops at Nittur',
      blocks: [
        {
          kind: 'text',
          ml: 'കുടജാദ്രിയിലേക്ക് രണ്ട് വഴിയുണ്ട്. ഒന്ന് ജീപ്പ്: കൊല്ലൂരിൽനിന്ന് കുലുങ്ങുന്ന മൺപാതയിലൂടെ മുകളിലേക്ക്. മറ്റേത് നടത്തം — നിട്ടൂരിൽനിന്ന് കാടിനുള്ളിലൂടെ. ജീപ്പ് ഒരു മണിക്കൂർ, നടത്തം അഞ്ച്. നടക്കുന്നവരാണ് ഹിഡ്ലുമനെ കാണുന്നത്.',
          en: 'There are two ways up Kodachadri. One is the jeep, grinding up a dirt track from Kollur. The other is on foot from Nittur, through the forest. The jeep takes an hour and the walk takes five, and only the walk goes past Hidlumane.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Drive_from_Kodachadri_Peak_%288321033695%29.jpg',
          credit: 'Ashwin Kumar · CC BY-SA 2.0 · Wikimedia Commons',
          caption: 'മുകളിലേക്കുള്ള ജീപ്പ് പാത · The track the jeeps take',
          wide: true,
        },
        {
          kind: 'text',
          ml: 'ഈ വഴി മുഴുവൻ മൂകാംബിക വന്യജീവി സങ്കേതത്തിനുള്ളിലാണ്. ഗൈഡില്ലാതെ പോകരുത് — അടയാളങ്ങൾ കുറവാണ്, വഴി പലയിടത്തും പിരിയുന്നു. മഴക്കാലത്ത് അട്ടയുണ്ട്, ധാരാളം.',
          en: 'The whole path runs inside the Mookambika sanctuary. Do not go without a guide: the markings are few and the trail forks more than once. In the monsoon there are leeches, and there are many.',
        },
        {
          kind: 'note',
          label: 'Guide',
          value: 'Essential',
        },
      ],
    },

    {
      id: 'kd-hidlumane',
      waypoint: 'hidlumane',
      kicker: 'Eight kilometres in',
      titleML: 'വെള്ളച്ചാട്ടത്തിലൂടെ കയറുന്നു',
      title: 'You climb up the waterfall',
      blocks: [
        {
          kind: 'text',
          ml: 'ഹിഡ്ലുമനെ ഒരു കാഴ്ചയല്ല, വഴിയാണ്. വെള്ളച്ചാട്ടത്തിന്റെ പാറകളിലൂടെ തന്നെ കയറണം — ഏഴ് നിലകളായി വീഴുന്ന വെള്ളം, പായൽ പിടിച്ച കല്ലുകൾ, കൈകൊണ്ട് പിടിച്ചുകയറാൻ വേരുകൾ. ഈ ട്രെക്കിന്റെ ഏറ്റവും നല്ലതും ഏറ്റവും അപകടകരവുമായ ഭാഗം ഇതാണ്.',
          en: 'Hidlumane is not a viewpoint; it is the route. You climb the falls themselves — seven tiers of water, mossed rock, roots to pull on. It is the best part of this trek and the part that hurts people.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Hidlumane_falls.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Hidlumane_Waterfalls.JPG',
          credit: 'Shrikanth n · CC BY-SA 3.0 · Wikimedia Commons',
          credit2: 'Chinmayahd · CC BY-SA 3.0 · Wikimedia Commons',
          caption: 'ഹിഡ്ലുമനെ — ഏഴ് നിലകൾ · Hidlumane, in seven tiers',
        },
        {
          kind: 'note',
          label: 'Footwear',
          value: 'Grip, not comfort',
        },
        {
          kind: 'text',
          ml: 'മഴയ്ക്ക് തൊട്ടുപിന്നാലെ വെള്ളം കൂടും, പാറ വഴുക്കും. ഒക്ടോബർ-ഫെബ്രുവരിയാണ് ശരിയായ സമയം — വെള്ളമുണ്ട്, പക്ഷേ കയറാവുന്നത്ര മാത്രം.',
          en: 'Just after the rains the water is high and the rock is glass. October to February is the window: enough water to be worth it, little enough to climb.',
        },
        {
          kind: 'map',
          zoom: 13,
          captionML: 'ഹിഡ്ലുമനെ — 720 മീറ്റർ, എട്ടാം കിലോമീറ്റർ',
          caption: 'Hidlumane, 720 m and eight kilometres in',
        },
      ],
    },

    {
      id: 'kd-peetha',
      waypoint: 'peetha',
      kicker: 'On the ridge',
      titleML: 'സർവജ്ഞപീഠം',
      title: 'The seat of all knowing',
      blocks: [
        {
          kind: 'text',
          ml: 'വെള്ളച്ചാട്ടം കഴിഞ്ഞാൽ കാട് കുറയും, പുല്ല് തുടങ്ങും. മലനിരയിൽ ഒറ്റയ്ക്ക് നിൽക്കുന്ന ഒരു ചെറിയ കൽമണ്ഡപം — സർവജ്ഞപീഠം. ശങ്കരാചാര്യർ ഇവിടെയിരുന്ന് ധ്യാനിച്ചു എന്നാണ് വിശ്വാസം. ചുറ്റും ഒന്നുമില്ല, കാറ്റല്ലാതെ.',
          en: 'Past the falls the forest thins into grass, and a small stone mantapa stands alone on the ridge: the Sarvajna Peetha, where Adi Shankara is held to have sat. There is nothing around it but wind.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/%E0%B4%B8%E0%B4%B0%E0%B5%8D%E0%B4%B5%E0%B5%8D%E0%B4%B5%E0%B4%9C%E0%B5%8D%E0%B4%9E_%E0%B4%AA%E0%B5%80%E0%B4%A0%E0%B4%82.jpg',
          credit: 'George Muttathil Pulikurumba · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'സർവജ്ഞപീഠം · The stone mantapa on the ridge',
          wide: true,
        },
        {
          kind: 'sight',
          titleML: 'മൂകാംബിക വന്യജീവി സങ്കേതം',
          title: 'Mookambika Wildlife Sanctuary',
          ml: 'ഈ മല മുഴുവൻ സങ്കേതത്തിനുള്ളിലാണ്. ഷോലാ കാടും പുൽമേടും ഇടകലർന്ന ഈ ഭൂപ്രകൃതി പശ്ചിമഘട്ടത്തിന്റെ മാത്രം സവിശേഷതയാണ്. കുടജാദ്രിയെ കർണാടക പ്രകൃതി പൈതൃക കേന്ദ്രമായി പ്രഖ്യാപിച്ചിട്ടുണ്ട്.',
          src: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/%E0%B4%95%E0%B5%81%E0%B4%9F%E0%B4%9C%E0%B4%BE%E0%B4%A6%E0%B5%8D%E0%B4%B0%E0%B4%BF_%28Kodachadri_%29.jpg',
          credit: 'George Muttathil Pulikurumba · CC BY-SA 4.0 · Wikimedia Commons',
        },
      ],
    },

    {
      id: 'kd-summit',
      waypoint: 'summit',
      kicker: '1,343 metres',
      titleML: 'പടിഞ്ഞാറ് കടൽ',
      title: 'The sea, to the west',
      blocks: [
        {
          kind: 'text',
          ml: 'കൊടുമുടിയിൽനിന്ന് പടിഞ്ഞാറോട്ട് നോക്കിയാൽ, തെളിഞ്ഞ ദിവസമാണെങ്കിൽ, അറബിക്കടൽ കാണാം. ഇവിടെ അസ്തമയം കാണാനാണ് മിക്കവരും കയറുന്നത് — സൂര്യൻ കടലിലേക്ക് ഇറങ്ങുന്നത് 1343 മീറ്ററിൽനിന്ന്.',
          en: 'Look west from the top on a clear day and the Arabian Sea is there. Most people climb this mountain for the sunset — the sun going down into the sea, watched from 1,343 metres.',
        },
        {
          kind: 'photo',
          src: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Kodachadri_Peak.jpg',
          src2: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Mountain_Peak_-_Kodachadri.jpg',
          credit: 'Rayabhari · CC BY-SA 3.0 · Wikimedia Commons',
          credit2: 'Akshaya govindasamy · CC BY-SA 4.0 · Wikimedia Commons',
          caption: 'കുടജാദ്രിയുടെ മുകൾ · The top of Kodachadri',
        },
        {
          kind: 'text',
          ml: 'മുകളിൽ തങ്ങാൻ വനംവകുപ്പിന്റെ അനുമതി വേണം. ജീപ്പുകൾ ഇരുട്ടുന്നതിന് മുൻപ് മടങ്ങും; അസ്തമയം കണ്ടിട്ട് ഇറങ്ങാമെന്ന് കരുതുന്നവർ ജീപ്പുകാരനോട് നേരത്തേ പറഞ്ഞുവയ്ക്കണം. ഇല്ലെങ്കിൽ പതിന്നാല് കിലോമീറ്റർ ഇരുട്ടത്ത് നടക്കേണ്ടിവരും.',
          en: 'Staying the night on top needs forest department permission. The jeeps turn back before dark, so anyone planning to watch the sunset should settle it with their driver first — otherwise it is fourteen kilometres down in the dark.',
        },
        {
          kind: 'map',
          zoom: 14,
          captionML: 'കുടജാദ്രി — 1343 മീറ്റർ',
          caption: 'Kodachadri, 1,343 m',
        },
      ],
    },
  ],
};

/* ── The collection ────────────────────────────────────────────────────── */
export const treks: Trek[] = [kumaraParvatha, agasthyakoodam, meesapulimala, kodachadri];

export const trekBySlug = (slug: string): Trek | undefined =>
  treks.find((t) => t.slug === slug);

/** Longest distance on the route — the last waypoint's kilometre mark. */
export const totalKm = (t: Trek): number =>
  Math.max(...t.waypoints.map((w) => w.km));

export const highestPoint = (t: Trek): number =>
  Math.max(...t.waypoints.map((w) => w.elevation));

export const waypointOf = (t: Trek, id: string): Waypoint => {
  const found = t.waypoints.find((w) => w.id === id);
  if (!found) throw new Error(`Unknown waypoint: ${id}`);
  return found;
};
