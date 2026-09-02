// ============================================================================
// Wayanad — the data behind the terrain feature at /features/wayanad-slide.
//
// The piece is told in four ACTS. An act is a pinned stretch of scroll during
// which the camera flies one move over real 3D terrain; between acts the reader
// is back on paper. So an act is nothing but an ordered list of camera keys,
// and the page's only job is to turn scroll position into a point between two
// of them.
//
// The shape, the open-data sources and the two rules this file obeys — look it
// up rather than recall it; narrate the land only — all live in lib/terrain.ts.
//
// Specific to this story:
//
//   Deliberately absent — a landslide runout line. The 2024 debris path is not
//   in any open dataset this file can cite, and drawing a plausible-looking one
//   would be inventing evidence. What is drawn is the river, labelled as the
//   river. The terrain argument does not need more than that.
//
//   The Mundakkai–Chooralmala landslide of 30 July 2024 killed hundreds of
//   people. Nothing in the narration can be true or false about it — only about
//   where it is. A desk replacing this with reporting replaces the `ml`/`en`
//   strings and nothing else.
// ============================================================================

import type { Act, Interlude, LngLat, Place, TerrainStory } from './terrain';

// ─── Places ─────────────────────────────────────────────────────────────────

/**
 * Coordinates and Malayalam names: OpenStreetMap. Elevations: sampled from the
 * DEM at zoom 13 (≈19 m per pixel here), rounded to the metre.
 */
const places: Place[] = [
  {
    id: 'chembra',
    name: 'Chembra Peak',
    nameML: 'ചെമ്പ്ര കൊടുമുടി',
    coords: [76.08964, 11.51227],
    elevation: 2058,
    act: 1,
  },
  {
    id: 'punchirimattam',
    name: 'Punchiri Mattam',
    nameML: 'പുഞ്ചിരിമട്ടം',
    coords: [76.15160, 11.48182],
    elevation: 985,
    act: 2,
  },
  {
    id: 'mundakai',
    name: 'Mundakai',
    nameML: 'മുണ്ടക്കൈ',
    coords: [76.15572, 11.48648],
    elevation: 947,
    act: 3,
  },
  {
    id: 'chooralmala',
    name: 'Chooralmala',
    nameML: 'ചൂരല്‍മല',
    coords: [76.15987, 11.49923],
    elevation: 840,
    act: 3,
  },
  {
    id: 'attamala',
    name: 'Attamala',
    nameML: 'അട്ടമല',
    coords: [76.17561, 11.49872],
    elevation: 875,
    act: 4,
  },
  {
    id: 'puthumala',
    name: 'Puthumala',
    nameML: 'പുതുമല',
    coords: [76.14061, 11.50133],
    elevation: 929,
    act: 4,
  },
  {
    id: 'meppadi',
    name: 'Meppadi',
    nameML: 'മേപ്പാടി',
    coords: [76.13201, 11.55295],
    elevation: 879,
    act: 4,
  },
];

/**
 * The Punnappuzha, as OpenStreetMap has it: the four ways named for the river,
 * stitched end to end and oriented downhill, then thinned to twenty points.
 * This is a watercourse, not a runout — see the note at the top of this file.
 *
 * It runs 913 m → 834 m over about three kilometres, passing Punchiri Mattam,
 * Mundakai, Chooralmala and Attamala. That near-flat gradient beneath a
 * two-thousand-metre wall is the whole geographic point.
 */
const channel: LngLat[] = [
  [76.15041, 11.49230],
  [76.15248, 11.49257],
  [76.15461, 11.49315],
  [76.15611, 11.49364],
  [76.15867, 11.49461],
  [76.16046, 11.49592],
  [76.15940, 11.49657],
  [76.16013, 11.49731],
  [76.16064, 11.49854],
  [76.16020, 11.49903],
  [76.16051, 11.49987],
  [76.16134, 11.50012],
  [76.16129, 11.50098],
  [76.16021, 11.50069],
  [76.16032, 11.50135],
  [76.16163, 11.50184],
  [76.16240, 11.50206],
  [76.16338, 11.50237],
  [76.16458, 11.50222],
  [76.16386, 11.50352],
];

// ─── The acts ───────────────────────────────────────────────────────────────

const acts: Act[] = [
  {
    id: 'wall',
    n: 1,
    kickerML: 'ഒന്ന്',
    kicker: 'One',
    titleML: 'മതിലിന് മുകളിലേക്ക്',
    title: 'Up the wall',
    keys: [
      {
        center: [75.8600, 11.4600],
        zoom: 8.6,
        pitch: 74,
        bearing: 68,
        ml: 'പടിഞ്ഞാറ് സമതലം. കിഴക്ക് ഭിത്തി.',
        en: 'The plain to the west. The wall to the east.',
      },
      {
        center: [75.9900, 11.4850],
        zoom: 10.0,
        pitch: 72,
        bearing: 60,
        ml: 'കയറ്റം ഒറ്റ ചുവരിൽ ഒതുങ്ങുന്നു.',
        en: 'The climb happens in one face.',
      },
      {
        center: [76.1200, 11.5000],
        zoom: 11.3,
        pitch: 58,
        bearing: 44,
        ml: 'മുകളിൽ പീഠഭൂമി — വയനാട്.',
        en: 'On top, the plateau — Wayanad.',
      },
    ],
  },
  {
    id: 'crown',
    n: 2,
    kickerML: 'രണ്ട്',
    kicker: 'Two',
    titleML: 'മുകളിലെ ഭിത്തി',
    title: 'The wall above',
    keys: [
      {
        center: [76.08964, 11.51227],
        zoom: 12.2,
        pitch: 66,
        bearing: 24,
        ml: 'ചെമ്പ്ര — 2,058 മീറ്റർ.',
        en: 'Chembra — 2,058 m.',
      },
      {
        center: [76.1050, 11.5020],
        zoom: 12.8,
        pitch: 74,
        bearing: -38,
        ml: 'ഈ വരമ്പ് താഴ്‌വരയ്ക്ക് മുകളിൽ ആയിരം മീറ്ററോളം ഉയർന്നു നിൽക്കുന്നു.',
        en: 'This ridge stands a thousand metres over the valley.',
      },
      {
        center: [76.1300, 11.4960],
        zoom: 12.6,
        pitch: 70,
        bearing: -96,
        ml: 'താഴേക്ക് ഒരേയൊരു വഴി.',
        en: 'Downhill, there is only one way out.',
      },
    ],
  },
  {
    id: 'run',
    n: 3,
    kickerML: 'മൂന്ന്',
    kicker: 'Three',
    titleML: 'ചാൽ',
    title: 'The channel',
    keys: [
      {
        center: [76.15041, 11.49230],
        zoom: 13.2,
        pitch: 58,
        bearing: 36,
        ml: 'പുന്നപ്പുഴ — താഴ്‌വരയുടെ അടിത്തട്ട്.',
        en: 'The Punnappuzha — the floor of the valley.',
      },
      {
        center: [76.15867, 11.49461],
        zoom: 13.5,
        pitch: 64,
        bearing: 20,
        ml: 'മൂന്ന് കിലോമീറ്ററിൽ എൺപത് മീറ്റർ മാത്രം താഴ്ന്ന്.',
        en: 'Losing only eighty metres in three kilometres.',
      },
      {
        center: [76.16386, 11.50352],
        zoom: 13.3,
        pitch: 56,
        bearing: 4,
        ml: 'മുകളിൽ നിന്ന് വരുന്നതെല്ലാം ഇതിലൂടെ കടന്നുപോകുന്നു.',
        en: 'Whatever comes off the ridge passes along this.',
      },
    ],
  },
  {
    id: 'inway',
    n: 4,
    kickerML: 'നാല്',
    kicker: 'Four',
    titleML: 'വഴിയിൽ',
    title: 'In the way',
    keys: [
      {
        center: [76.15572, 11.48648],
        zoom: 13.2,
        pitch: 60,
        bearing: 350,
        ml: 'മുണ്ടക്കൈ, പിന്നെ ചൂരല്‍മല.',
        en: 'Mundakai, then Chooralmala.',
      },
      {
        center: [76.15987, 11.49923],
        zoom: 12.4,
        pitch: 46,
        bearing: 316,
        ml: 'ചാലും വാസസ്ഥലവും ഒരേ നിലം പങ്കിടുന്നു.',
        en: 'Channel and settlement share the same ground.',
      },
      {
        center: [76.1450, 11.5000],
        zoom: 11.4,
        pitch: 26,
        bearing: 270,
        ml: 'മുകളിൽ നിന്ന് നോക്കിയാൽ വഴി ഒന്നേയുള്ളൂ.',
        en: 'Seen from above, there was only ever one path.',
      },
    ],
  },
];

// ─── Prose between the acts ─────────────────────────────────────────────────

const interludes: Interlude[] = [
  {
    before: 1,
    ml: 'വയനാട് ഒരു മലനിരയല്ല. അത് ഒരു പീഠഭൂമിയാണ് — പശ്ചിമഘട്ടത്തിന്റെ മുകൾത്തട്ട്, ചുറ്റും കുത്തനെയുള്ള ചരിവുകൾ.',
    en: 'Wayanad is not a range of hills. It is a plateau — the top of the Western Ghats, with steep faces all round it.',
  },
  {
    before: 2,
    ml: 'പീഠഭൂമിയുടെ തെക്കുപടിഞ്ഞാറൻ അറ്റത്ത് നിലം പെട്ടെന്ന് അവസാനിക്കുന്നു.',
    en: 'At the south-western edge of the plateau, the ground simply stops.',
  },
  {
    before: 3,
    ml: 'ഒരു ചരിവ് പരാജയപ്പെട്ടാൽ, ആ വസ്തു എവിടേക്ക് പോകുമെന്ന് ഭൂപ്രകൃതി നേരത്തെ തീരുമാനിച്ചിട്ടുണ്ട്.',
    en: 'When a slope fails, the terrain has already decided where the material goes.',
  },
  {
    before: 4,
    ml: 'താഴ്‌വരയുടെ അടിത്തട്ട് വെറും ചാൽ മാത്രമല്ല. അത് പരന്നതും, ഫലഭൂയിഷ്ഠവും, താമസയോഗ്യവുമാണ്.',
    en: 'A valley floor is not only a channel. It is also the flat ground — fertile, and worth living on.',
  },
  {
    before: 5,
    ml: 'ഭൂപ്രകൃതി ഒരു വിശദീകരണമല്ല. പക്ഷേ അത് ചോദ്യത്തിന്റെ ആകൃതിയാണ്.',
    en: 'Terrain is not an explanation. But it is the shape of the question.',
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
 * Placeholder rows for the closing band. Deliberately about the state of the
 * coverage rather than about events, per the rule at the top of this file.
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
    titleML: 'പ്രദേശത്ത് നിന്നുള്ള ചിത്രങ്ങൾ',
    title: 'Pictures from the district',
    href: '/latest-news',
  },
  {
    kicker: 'Archive',
    titleML: 'ഭൂപ്രകൃതിയും ഭൂവിനിയോഗവും — വിശദീകരണം',
    title: 'Terrain and land use — an explainer',
    href: '/latest-news',
  },
  {
    kicker: 'Archive',
    titleML: 'സംസ്ഥാനത്തെ മറ്റ് ദുരന്തസാധ്യതാ മേഖലകൾ',
    title: 'Other hazard-prone zones in the state',
    href: '/latest-news',
  },
];

// ─── The story ──────────────────────────────────────────────────────────────

export const wayanad: TerrainStory = {
  places,
  line: channel,
  acts,
  interludes,
  // A 3 km valley seen from ~15 m per pixel.
  ribbon: { head: 90, toe: 240, lift: 60 },
  // The channel arrives across act three, the one that follows it downhill.
  lineAct: 3,
  maxBounds: [[75.55, 11.05], [76.70, 11.95]],
  exaggeration: 1.35,
};

export { places, archive };
