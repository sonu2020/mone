// Kerala gold rates as an instance of the price-series contract.
//
// Prices are real, scraped from keralagoldrates.com by scripts/scrape-gold.py
// (2010 -> present, daily, 22K and 24K). Only rupees-per-gram is stored; pavan
// is derived through the unit factor, because a pavan is exactly eight grams.
//
// The narration in `goldActs` is a different kind of claim from the numbers: it
// says *why* the price moved. Every act carries a `direction` that is checked
// against the series in gold-prices.test.ts, so a story that drifts away from
// the data fails the build instead of misleading a reader. Anything unsourced
// is marked `sourced: false` and renders under a visible prototype label.
// See the header of src/lib/terrain.ts for the same rule applied to terrain.

import raw from '../data/gold/prices.json';
import type { PricePoint, PriceSeries } from './price-series';

export interface PriceReport {
  id: string;
  /** The day the chart should mark. ISO yyyy-mm-dd, must exist in the series. */
  date: string;
  eyebrow: string;
  headline: string;
  headlineML: string;
  dek: string;
  href: string;
}

export interface PriceAct {
  id: string;
  from: string;
  to: string;
  title: string;
  titleML: string;
  body: string;
  /** Asserted against the data by the test suite. */
  direction: 'up' | 'down';
  /** False renders the act under a visible "prototype narration" label. */
  sourced: boolean;
}

export const GOLD_ATTRIBUTION = {
  source: raw.source,
  sourceUrl: raw.sourceUrl,
  scrapedAt: raw.scrapedAt,
};

export const goldSeries: PriceSeries = {
  id: 'gold',
  variants: [
    { id: '22k', label: '22K', labelML: '22 കാരറ്റ്' },
    { id: '24k', label: '24K', labelML: '24 കാരറ്റ്' },
  ],
  units: [
    { id: 'gram', label: 'gram', labelML: 'ഗ്രാം', factor: 1 },
    { id: 'pavan', label: 'pavan', labelML: 'പവൻ', factor: 8 },
  ],
  granularity: 'daily',
  precision: 0,
  points: raw.points as PricePoint[],
};

export const goldActs: PriceAct[] = [
  {
    id: 'duty-2013',
    from: '2013-01-01',
    to: '2013-12-31',
    title: 'The year the duty softened a fall',
    titleML: 'വില വീണ വർഷം, തീരുവ താങ്ങിയ വർഷം',
    body:
      'Gold fell in 2013 — the global price broke in April and Kerala’s 22K rate '
      + 'slid from ₹2,880 a gram in January to ₹2,400 by late June. What Kerala did not '
      + 'feel was the full drop. India raised the import duty three times that year, '
      + 'from 4% to 6% in January, to 8% in June and to 10% in August, trying to '
      + 'close a record current account deficit. The duty put a floor under the '
      + 'domestic price that the world price did not have, and the year closed down '
      + 'only about 5%.',
    direction: 'down',
    sourced: true,
  },
  {
    id: 'pandemic-2020',
    from: '2020-01-01',
    to: '2020-12-31',
    title: 'The pandemic run',
    titleML: 'മഹാമാരിക്കാലത്തെ കുതിപ്പ്',
    body:
      'With rates falling worldwide and no clear end to the pandemic, money moved '
      + 'into gold. Kerala’s 22K rate opened 2020 at ₹3,625 a gram and touched '
      + '₹5,250 on 7 August — a 45% climb in seven months, and the first time the '
      + 'metal had crossed ₹5,000 here. It gave part of that back over the rest of '
      + 'the year, closing near ₹4,670.',
    direction: 'up',
    sourced: true,
  },
  {
    id: 'record-run',
    from: '2025-01-01',
    to: '2026-01-29',
    title: 'Into record ground',
    titleML: 'റെക്കോർഡിലേക്ക്',
    body:
      'The steepest climb in the series. From ₹7,150 a gram at the start of 2025, '
      + 'Kerala’s 22K rate more than doubled to ₹16,395 on 29 January 2026 — '
      + '₹1,31,160 a pavan, the highest ever recorded here. Central banks were '
      + 'buying through it, adding reserves even at record prices, and gold ETFs '
      + 'took their largest annual inflows on record in 2025. Bullion peaked at '
      + 'about $5,589 an ounce on 28 January; Kerala’s high landed the next day.',
    direction: 'up',
    sourced: true,
  },
  {
    id: 'retreat-2026',
    from: '2026-01-29',
    to: '2026-08-07',
    title: 'And off the peak',
    titleML: 'കൊടുമുടിയിൽനിന്ന് താഴേക്ക്',
    body:
      'Records are the easy part of the story. Since that January high the rate '
      + 'has come down about 16%, to ₹13,740 a gram — still far above where 2025 '
      + 'began, but well short of the number every headline quoted. A reader '
      + 'deciding when to buy is standing here, not at the peak.',
    direction: 'down',
    sourced: true,
  },
];

// Each report is anchored to a day the chart can mark, so a marker on the curve
// and a card in the list are the same object. Headlines are prototype copy — the
// prices they sit against are not.
export const goldReports: PriceReport[] = [
  {
    id: 'record-2026',
    date: '2026-01-29',
    eyebrow: 'MARKETS',
    headline: 'Gold sets a record in Kerala at ₹1,31,160 a pavan',
    headlineML: 'സ്വർണവില റെക്കോർഡിൽ: പവന് ₹1,31,160',
    dek: 'The 22K rate reached ₹16,395 a gram, the highest in the sixteen years this series covers.',
    href: '/story/gold-price-record',
  },
  {
    id: 'pandemic-2020',
    date: '2020-08-07',
    eyebrow: 'MARKETS',
    headline: 'Gold crosses ₹5,000 a gram for the first time',
    headlineML: 'സ്വർണവില ഗ്രാമിന് ₹5,000 കടന്നു',
    dek: 'Safe-haven demand through the pandemic carried the 22K rate to ₹5,250, a level it had never touched.',
    href: '/story/gold-price-record',
  },
  {
    id: 'duty-2013',
    date: '2013-08-13',
    eyebrow: 'POLICY',
    headline: 'Import duty on gold raised to 10%',
    headlineML: 'സ്വർണത്തിന്റെ ഇറക്കുമതി തീരുവ 10% ആയി',
    dek: 'The third hike of the year, aimed at a record current account deficit — and a floor under the domestic price as the world price fell.',
    href: '/story/gold-price-record',
  },
];
