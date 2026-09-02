// ============================================================================
// Which treks have a 3D journey, and what to say about it.
//
// A registry rather than a field on Trek, so travelogue.ts stays a piece of
// editorial data and does not have to import a rendering package. Adding a
// journey to another trek means writing its data module and adding a line here.
//
// Only treks whose *shape* is the story earn one. The engine loads Three.js and
// a stack of DEM tiles; a walk along a flat backwater does not need it.
// ============================================================================

import type { Journey } from 'terrain-journey';
import { kumaraParvathaJourney, trekStats } from './kumara-parvatha';
import { meesapulimalaJourney, meesaStats } from './meesapulimala';

export interface TrekJourney {
  journey: Journey;
  /** Labels for the two views, in this trek's own language. */
  overviewLabel: string;
  firstPersonLabel: string;
  overviewIcon: string;
  firstPersonIcon: string;
  playLabel: string;
  markerNoun: string;
  kicker: string;
  title: string;
  standfirst: string;
  /** The "by the numbers" band: label, value, and what the figure means. */
  numbers: [string, string, string][];
  /** Practical advice the route itself supports. Icon, heading, body. */
  tips: [string, string, string][];
  /** A discrepancy worth stating rather than burying. */
  caveat?: { title: string; body: string };
}

const registry: Record<string, TrekJourney> = {
  'kumara-parvatha': {
    journey: kumaraParvathaJourney,
    overviewLabel: 'From the air',
    firstPersonLabel: 'On the trail',
    overviewIcon: 'ti-drone',
    firstPersonIcon: 'ti-shoe',
    playLabel: 'Walk it',
    markerNoun: 'Stage',
    kicker: 'The climb · കുക്കെ → കുമാരപർവതം',
    title: '1,576 metres up, in eight and a half kilometres',
    standfirst:
      'Scroll to climb. Watch the ridge from the air, or put yourself on the path — the gradient is at true scale in both, because this is the one walk on the site that needs no exaggerating.',
    numbers: [
      ['Cumulative ascent', `${trekStats.gain.toLocaleString('en-IN')} m`, 'Summing only the rises, over the whole walk'],
      ['Average gradient', `${(((trekStats.highest - trekStats.lowest) / trekStats.length) * 100).toFixed(1)}%`, `${trekStats.lowest} m at the trailhead, ${trekStats.highest} m at the top`],
      ['Hardest kilometre', `+${trekStats.steepest} m`, `Starts at km ${trekStats.steepestKm}, just above Kallu Mantapa`],
      ['Mapped length', `${(trekStats.length / 1000).toFixed(2)} km`, 'One way, trailhead to summit'],
      ['Water on route', `km ${trekStats.water.km}`, `${trekStats.water.elevation} m, ${trekStats.water.offTrail} m off the path — the only tap OSM knows`],
      ['Last roof', 'km 3.94', 'Bhattara Mane, at 849 m. Nothing above it.'],
    ],
    tips: [
      ['ti-droplet', 'Carry water from below Bhattara Mane',
        `The one tapped source on the mapped route is at km ${trekStats.water.km}, at ${trekStats.water.elevation} m. Above it there are ${((trekStats.length / 1000) - trekStats.water.km).toFixed(1)} km and ${trekStats.highest - trekStats.water.elevation} m of climbing with nothing marked.`],
      ['ti-mountain', 'Sesha Parvata is not the summit',
        'It looks like one, and people stop there. From its top the real peak is 159 m higher and a kilometre further, across a saddle that gives back some of what you have just climbed.'],
      ['ti-trending-up', 'The hardest part is above the shrine',
        `The steepest kilometre of the whole walk starts at km ${trekStats.steepestKm}, just past Kallu Mantapa: +${trekStats.steepest} m. If you are pacing the day, pace it around that.`],
      ['ti-home', 'Bhattara Mane is the last roof',
        'At km 3.94 and 849 m — under halfway by distance, barely half by height. Everything above is open ridge.'],
      ['ti-alert-triangle', 'Check the forest office before you count on anything',
        'This runs through Pushpagiri Wildlife Sanctuary. Entry rules, fees, daily caps and whether camping is allowed at all change from season to season, and this page has no live source for them — so treat any figure you read elsewhere, including here, as needing confirmation on the day.'],
    ],
    caveat: {
      title: `${(trekStats.length / 1000).toFixed(2)} km here, against the 13 everyone cites`,
      body: 'Almost every account of this trek calls it thirteen kilometres one way. The mapped trail — the full named path, end to end, with no gap between its two ways — measures 8.47. A walk-in from the town, or switchbacks too tight for anyone to have traced, would each account for some of the difference. Neither is measurable from the data, so both figures are here and neither is preferred.',
    },
  },

  meesapulimala: {
    journey: meesapulimalaJourney,
    overviewLabel: 'From the air',
    firstPersonLabel: 'On the ridge',
    overviewIcon: 'ti-drone',
    firstPersonIcon: 'ti-shoe',
    playLabel: 'Walk it',
    markerNoun: 'Stage',
    kicker: 'The ridge · സൈലന്റ് വാലി → മീശപ്പുലിമല',
    title: 'Eleven kilometres along the top, and 550 of them given back',
    standfirst:
      'Scroll to walk it. This is not a climb so much as a traverse — the ridge rises and falls the whole way, and the descent is half the work. True scale in both views.',
    numbers: [
      ['Cumulative ascent', `${meesaStats.gain.toLocaleString('en-IN')} m`, 'Summing only the rises'],
      ['Given back', `${meesaStats.loss} m`, 'Descent on the way out. A ridge, not a climb.'],
      ['Mapped length', `${(meesaStats.length / 1000).toFixed(2)} km`, `Ends ${meesaStats.baseGap} m short of the Cloud Farm base — the rest is unmapped`],
      ['Lowest point', `${meesaStats.lowest} m`, 'The walk never drops below this'],
      ['Hardest kilometre', `+${meesaStats.steepest} m`, `Starts at km ${meesaStats.steepestKm}, early on`],
      ['Summit, three ways', `${meesaStats.osmSummit} m`, `OpenStreetMap's tag. The DEM samples ${meesaStats.highest}; ${meesaStats.printed} is what gets printed.`],
    ],
    tips: [
      ['ti-trending-down', 'Half the work is downhill',
        `The ridge climbs ${meesaStats.gain} m and descends ${meesaStats.loss} m across eleven kilometres. Anyone planning around net height gain will get the day badly wrong, and the descent is on tired legs both ways.`],
      ['ti-map-off', 'The trail on the map stops before the base',
        `The connected path network ends ${meesaStats.baseGap} m short of Cloud Farm, where most walks start. That stretch is simply not in OpenStreetMap, so it is not drawn here either — do not read the start of this line as the start of the walk.`],
      ['ti-mountain', 'The peak next door may be higher',
        `OpenStreetMap tags Manna Malai — about 800 m off this trail — at ${meesaStats.nearbyHigher} m, against ${meesaStats.osmSummit} m for Meesapulimala. Neither carries a survey citation, which is worth knowing before repeating the "second-highest in the Western Ghats" line.`],
      ['ti-cloud', 'It is a high grassland, and it behaves like one',
        `Nothing on this route drops below ${meesaStats.lowest} m and there is no tree cover on the ridge itself — the terrain here is shola and grass, wooded only in the folds. Weather arrives with nothing in the way of it.`],
      ['ti-alert-triangle', 'Access is controlled and this page cannot tell you how',
        'The Meesapulimala trek is run through licensed operators and forest permissions that change season to season. This page has no live source for any of it, so treat every access detail — including any you read elsewhere — as needing confirmation before you travel.'],
    ],
    caveat: {
      title: 'A shortest path, not a signed route',
      body: 'There is no hiking relation in OpenStreetMap here, only unnamed paths and tracks. This line is the shortest way through that network from the summit outward — Dijkstra over 6,428 nodes — which is a defensible route and not necessarily the one a guide would walk you along. Where the mapping is thin, so is the claim.',
    },
  },
};

export function journeyFor(slug: string): TrekJourney | null {
  return registry[slug] ?? null;
}

export { trekStats, meesaStats };
