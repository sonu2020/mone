// ============================================================================
// Kerala 2018 — the data behind the terrain feature at
// /features/kerala-floods-2018.
//
// Four acts, same machinery as lib/wayanad.ts. The shape, the open-data
// sources and the two rules both files obey — look it up rather than recall
// it; narrate the land only — live in lib/terrain.ts.
//
// THE ARGUMENT THIS TERRAIN MAKES
//
//   Kerala is a ramp. Anamudi stands at 2,666 m; a hundred kilometres west,
//   Kochi is at 10 m and the Vembanad backwater is at 0. The Periyar runs 192 km
//   between them and does almost all of its falling in the first half: it is
//   down to 109 m with a third of its length still to go, and the last hundred
//   kilometres are effectively flat.
//
//   So the rain lands on a wall and then has to cross a plain with no gradient
//   left to carry it. That is a fact about the ground, and it was as true in
//   2017 as in 2018. The terrain is not the cause — it is the shape of the
//   question.
//
// Specific to this story:
//
//   Deliberately absent — flood extent. Which ground went under in August 2018
//   is not in any open dataset this file can cite, and shading a plausible
//   area would be inventing evidence. What is drawn is the river and the
//   elevations, both labelled as what they are.
//
//   The floods killed roughly 480 people and put over a million into relief
//   camps. Nothing in the narration below can be true or false about that —
//   only about where things are and how high they sit.
// ============================================================================

import type { Act, Interlude, LngLat, Place, TerrainStory } from './terrain';

// ─── Places ─────────────────────────────────────────────────────────────────

/**
 * Coordinates: OpenStreetMap (Nominatim). Elevations: sampled from the DEM at
 * zoom 12 (≈38 m per pixel at this latitude), rounded to the metre. Malayalam
 * names are OSM `name:ml` tags, except where noted — Vembanad and Kuttanad
 * carry no `name:ml` within 4 km of their OSM centres, so those two names are
 * the conventional spellings rather than sourced strings.
 *
 * Anamudi reads 2,666 m here against a surveyed 2,695 m. That gap is the DEM
 * smoothing a sharp summit across a 38 m cell, not an error to correct: every
 * figure on the page should come off the same surface the reader is looking at.
 */
const places: Place[] = [
  {
    id: 'anamudi',
    name: 'Anamudi',
    nameML: 'ആനമുടി',
    coords: [77.06167, 10.17002],
    elevation: 2666,
    act: 1,
  },
  {
    id: 'mullaperiyar',
    name: 'Mullaperiyar Dam',
    nameML: 'മുല്ലപ്പെരിയാർ അണക്കെട്ട്',
    coords: [77.14411, 9.52863],
    elevation: 863,
    act: 3,
  },
  {
    id: 'idukki',
    name: 'Idukki Arch Dam',
    nameML: 'ഇടുക്കി ആർച്ച് ഡാം',
    coords: [76.97624, 9.84352],
    elevation: 724,
    act: 2,
  },
  {
    id: 'chalakudy',
    name: 'Chalakudy',
    nameML: 'ചാലക്കുടി',
    coords: [76.33710, 10.30419],
    elevation: 14,
    act: 4,
  },
  {
    id: 'aluva',
    name: 'Aluva',
    nameML: 'ആലുവ',
    coords: [76.35685, 10.10777],
    elevation: 16,
    act: 3,
  },
  {
    id: 'kochi',
    name: 'Kochi',
    nameML: 'കൊച്ചി',
    coords: [76.24444, 9.96790],
    elevation: 10,
    act: 1,
  },
  {
    id: 'vembanad',
    name: 'Vembanad',
    nameML: 'വേമ്പനാട്',
    coords: [76.39421, 9.59492],
    elevation: 0,
    act: 4,
  },
  {
    id: 'kuttanad',
    name: 'Kuttanad',
    nameML: 'കുട്ടനാട്',
    coords: [76.43082, 9.45075],
    elevation: 3,
    act: 4,
  },
];

/**
 * The Periyar, as OpenStreetMap has it: the ways named for the river between
 * the Mullaperiyar and the coast, stitched end to end, oriented downhill and
 * thinned to a hundred and ten points.
 *
 * 873 m → 0 m over 192 km, passing Mullaperiyar, the Idukki arch dam and Aluva.
 * Sampled coarser it drew as a set of straight chords, because seven
 * kilometres between points is a chord, not a river. At this density it bends.
 *
 * The elevations along it are the argument: 873 m at the top, still 723 m at
 * the Idukki gorge four-tenths of the way down, 115 m by three-quarters, then
 * 66, 51, 46, 42 … 4, 1, 0 across everything that is left.
 */
const periyar: LngLat[] = [
  [77.14602, 9.53116],
  [77.14015, 9.52934],
  [77.12895, 9.52973],
  [77.12057, 9.53184],
  [77.11202, 9.52856],
  [77.10308, 9.53794],
  [77.09616, 9.54839],
  [77.09027, 9.55204],
  [77.09571, 9.55905],
  [77.08845, 9.56025],
  [77.08960, 9.56914],
  [77.08721, 9.57653],
  [77.08665, 9.58878],
  [77.08590, 9.60402],
  [77.07609, 9.60829],
  [77.07007, 9.61250],
  [77.06581, 9.61416],
  [77.06192, 9.61707],
  [77.05659, 9.61794],
  [77.05347, 9.62123],
  [77.05109, 9.62190],
  [77.04710, 9.62416],
  [77.04763, 9.62557],
  [77.04906, 9.62690],
  [77.05201, 9.63164],
  [77.05017, 9.63360],
  [77.05046, 9.63518],
  [77.05164, 9.63648],
  [77.05216, 9.63756],
  [77.05101, 9.63906],
  [77.04966, 9.63996],
  [77.04452, 9.64036],
  [77.02901, 9.64827],
  [77.01708, 9.65514],
  [77.01882, 9.65975],
  [77.02275, 9.66980],
  [77.02328, 9.67465],
  [77.02610, 9.68547],
  [77.02244, 9.69981],
  [77.02924, 9.70391],
  [77.02371, 9.72194],
  [77.01455, 9.73843],
  [77.01420, 9.76367],
  [77.03158, 9.79078],
  [76.99443, 9.81977],
  [76.97397, 9.84055],
  [76.97678, 9.84383],
  [76.97926, 9.84541],
  [76.98065, 9.84792],
  [76.98028, 9.84957],
  [76.97825, 9.85026],
  [76.97589, 9.85097],
  [76.97430, 9.85208],
  [76.97073, 9.85479],
  [76.97093, 9.85662],
  [76.96960, 9.86356],
  [76.96626, 9.86570],
  [76.96636, 9.87055],
  [76.96693, 9.87488],
  [76.96796, 9.87817],
  [76.97050, 9.87901],
  [76.97240, 9.88065],
  [76.96943, 9.88548],
  [76.97584, 9.89241],
  [76.97528, 9.89759],
  [76.97632, 9.90279],
  [76.97211, 9.91428],
  [76.97114, 9.93211],
  [76.97846, 9.94200],
  [76.97770, 9.95343],
  [76.95316, 9.96479],
  [76.94251, 9.96893],
  [76.93480, 9.97499],
  [76.91632, 9.98566],
  [76.89963, 9.99303],
  [76.88435, 10.00173],
  [76.86829, 10.01065],
  [76.85481, 10.01826],
  [76.83554, 10.02633],
  [76.82135, 10.03333],
  [76.80980, 10.03690],
  [76.79696, 10.04250],
  [76.78507, 10.05156],
  [76.78113, 10.05808],
  [76.76939, 10.05984],
  [76.75772, 10.06785],
  [76.74310, 10.08251],
  [76.72967, 10.08969],
  [76.72121, 10.09775],
  [76.70663, 10.11129],
  [76.69237, 10.12184],
  [76.66488, 10.13851],
  [76.64658, 10.15723],
  [76.62380, 10.17288],
  [76.60202, 10.17343],
  [76.56901, 10.18197],
  [76.55943, 10.19567],
  [76.53372, 10.19579],
  [76.51018, 10.18570],
  [76.47619, 10.18378],
  [76.42980, 10.15243],
  [76.45743, 10.13203],
  [76.40830, 10.11906],
  [76.36368, 10.11202],
  [76.33776, 10.13421],
  [76.32070, 10.15127],
  [76.27193, 10.15081],
  [76.22853, 10.18421],
  [76.19791, 10.19301],
  [76.16284, 10.17690],
];

// ─── The acts ───────────────────────────────────────────────────────────────

const acts: Act[] = [
  {
    id: 'ramp',
    n: 1,
    kickerML: 'ഒന്ന്',
    kicker: 'One',
    titleML: 'ചരിവ്',
    title: 'The ramp',
    keys: [
      {
        center: [75.9000, 10.0500],
        zoom: 8.0,
        pitch: 74,
        bearing: 76,
        ml: 'പടിഞ്ഞാറ് കടൽ. കിഴക്ക് ഘട്ടം.',
        en: 'The sea to the west. The ghats to the east.',
      },
      {
        center: [76.3500, 10.0800],
        zoom: 8.8,
        pitch: 72,
        bearing: 72,
        ml: 'ഇടയിൽ നൂറ് കിലോമീറ്റർ മാത്രം.',
        en: 'A hundred kilometres between them, and no more.',
      },
      {
        center: [76.9000, 10.1200],
        zoom: 9.5,
        pitch: 64,
        bearing: 66,
        ml: 'കടലിൽ നിന്ന് രണ്ടായിരത്തിലധികം മീറ്ററിലേക്ക്.',
        en: 'From sea level to over two thousand metres.',
      },
    ],
  },
  {
    id: 'catchment',
    n: 2,
    kickerML: 'രണ്ട്',
    kicker: 'Two',
    titleML: 'മഴ വീഴുന്നിടം',
    title: 'Where the rain lands',
    keys: [
      {
        center: [77.06167, 10.17002],
        zoom: 11.2,
        pitch: 62,
        bearing: 24,
        ml: 'ആനമുടി — 2,666 മീറ്റർ.',
        en: 'Anamudi — 2,666 m.',
      },
      {
        center: [77.0400, 10.0600],
        zoom: 11.4,
        pitch: 70,
        bearing: -34,
        ml: 'ഈ ഉയരങ്ങളിലാണ് മഴ ആദ്യം എത്തുന്നത്.',
        en: 'These are the heights the rain reaches first.',
      },
      {
        center: [76.9900, 9.9200],
        zoom: 11.0,
        pitch: 68,
        bearing: -84,
        ml: 'വീഴുന്നതെല്ലാം പടിഞ്ഞാറോട്ട് പോകണം.',
        en: 'Whatever falls has to go west.',
      },
    ],
  },
  {
    id: 'gorge',
    n: 3,
    kickerML: 'മൂന്ന്',
    kicker: 'Three',
    titleML: 'ഇടുങ്ങിയ താഴ്‌വര',
    title: 'The narrow place',
    keys: [
      {
        center: [76.97624, 9.84352],
        zoom: 12.2,
        pitch: 60,
        bearing: 28,
        ml: 'ഇടുക്കി — 724 മീറ്ററിൽ പെരിയാർ.',
        en: 'Idukki — the Periyar at 724 m.',
      },
      {
        center: [76.9650, 9.8800],
        zoom: 12.4,
        pitch: 68,
        bearing: -24,
        ml: 'മലകൾക്കിടയിലെ ഒരു ഇടുക്ക്.',
        en: 'A gap between hills.',
      },
      {
        center: [76.9000, 9.9700],
        zoom: 11.4,
        pitch: 62,
        bearing: -68,
        ml: 'ഇവിടെ നിന്ന് പുഴ താഴേക്ക് പതിക്കുന്നു.',
        en: 'From here the river falls away.',
      },
    ],
  },
  {
    id: 'flat',
    n: 4,
    kickerML: 'നാല്',
    kicker: 'Four',
    titleML: 'ഇറക്കം തീരുന്നിടം',
    title: 'No gradient left',
    keys: [
      {
        center: [76.5000, 10.1500],
        zoom: 10.4,
        pitch: 58,
        bearing: 280,
        ml: 'നൂറ് കിലോമീറ്ററിൽ പുഴ 109 മീറ്ററിലേക്ക് താഴ്ന്നു.',
        en: 'A hundred kilometres in, the river is down to 109 m.',
      },
      {
        center: [76.3400, 10.0500],
        zoom: 10.2,
        pitch: 48,
        bearing: 300,
        ml: 'ആലുവ 16 മീറ്റർ. കൊച്ചി 10.',
        en: 'Aluva is at 16 m. Kochi at 10.',
      },
      {
        center: [76.4000, 9.6500],
        zoom: 9.6,
        pitch: 30,
        bearing: 330,
        ml: 'വേമ്പനാട് പൂജ്യം. ഇനി താഴേക്കില്ല.',
        en: 'Vembanad is zero. There is no further down.',
      },
    ],
  },
];

// ─── Prose between the acts ─────────────────────────────────────────────────

const interludes: Interlude[] = [
  {
    before: 1,
    ml: 'കേരളം ഒരു ഇടുങ്ങിയ ഭൂപ്രദേശമാണ് — പടിഞ്ഞാറ് അറബിക്കടൽ, കിഴക്ക് പശ്ചിമഘട്ടം. ഇടയിലുള്ള ദൂരം പലയിടത്തും നൂറ് കിലോമീറ്ററിൽ താഴെ.',
    en: 'Kerala is a narrow strip — the Arabian Sea to the west, the Western Ghats to the east. In many places the distance between them is under a hundred kilometres.',
  },
  {
    before: 2,
    ml: 'ആ ഘട്ടം ഒരു ഭിത്തിയാണ്. മൺസൂൺ അതിൽ തട്ടി നിൽക്കുന്നു.',
    en: 'That wall is what the monsoon runs into.',
  },
  {
    before: 3,
    ml: 'ഉയരത്തിൽ വീഴുന്ന വെള്ളം ഇടുങ്ങിയ താഴ്‌വരകളിലൂടെയാണ് പുറത്തുവരുന്നത്.',
    en: 'Water that falls high up leaves through narrow valleys.',
  },
  {
    before: 4,
    ml: 'പക്ഷേ ഘട്ടം കഴിഞ്ഞാൽ ഇറക്കം തീരുന്നു. ബാക്കിയുള്ള ദൂരം ഏറെക്കുറെ പരന്നതാണ്.',
    en: 'But past the ghats the slope runs out. What remains is nearly level.',
  },
  {
    before: 5,
    ml: 'ഭൂപ്രകൃതി ഒരു കാരണമല്ല. അത് ചോദ്യത്തിന്റെ ആകൃതിയാണ്.',
    en: 'Terrain is not a cause. It is the shape of the question.',
  },
];

// ─── Related coverage (placeholder) ─────────────────────────────────────────

export interface ArchiveStory {
  title: string;
  titleML: string;
  kicker: string;
  href: string;
}

/**
 * Placeholder rows. About the state of the coverage, never about events — the
 * same rule lib/dummy-text.ts follows.
 */
const archive: ArchiveStory[] = [
  {
    kicker: 'Archive',
    titleML: 'ഈ പരമ്പരയിലെ മുൻ റിപ്പോർട്ടുകൾ',
    title: 'Earlier reporting in this series',
    href: '/latest-news',
  },
  {
    kicker: 'Archive',
    titleML: 'സംസ്ഥാനത്തെ അണക്കെട്ടുകൾ — വിശദീകരണം',
    title: 'The state’s reservoirs — an explainer',
    href: '/latest-news',
  },
  {
    kicker: 'Archive',
    titleML: 'നദീതടങ്ങളും ഭൂവിനിയോഗവും',
    title: 'River basins and land use',
    href: '/latest-news',
  },
  {
    kicker: 'Archive',
    titleML: 'മൺസൂൺ പ്രവചനം എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    title: 'How monsoon forecasting works',
    href: '/latest-news',
  },
];

// ─── The story ──────────────────────────────────────────────────────────────

export const keralaFloods: TerrainStory = {
  places,
  line: periyar,
  acts,
  interludes,
  // A 192 km river seen from ~150 m per pixel in act four, so the ribbon is
  // wide in metres and still slender on screen.
  ribbon: { head: 500, toe: 1600, lift: 110 },
  // The line arrives across act four, the one that follows it to the sea.
  lineAct: 4,
  maxBounds: [[74.90, 8.60], [78.10, 11.40]],
  exaggeration: 1.35,
};

export { places, archive };
