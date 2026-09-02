// Typed view over the committed LSG 2025 data (built by
// scripts/build-lsg-data.mjs). The page renders from these JSON artifacts;
// nothing here computes a number from raw CSVs.
//
// Provenance is in attribution.json and on the page: results are the
// candidate-level CSV of OpenDataKerala's LSGD2025-Results-Data, bodies and
// voters are from OpenDataKerala's LSG2025 portal, and the geometry is OSM via
// the same portal. See the header of src/lib/gold-prices.ts for the same rule.

import state from '../data/lsg/state.json';
import parties from '../data/lsg/parties.json';
import bodies from '../data/lsg/bodies.json';
import attribution from '../data/lsg/attribution.json';

export type Front = 'LDF' | 'UDF' | 'NDA' | 'OTHERS' | 'TIE';
export const FRONTS: Front[] = ['LDF', 'UDF', 'NDA', 'OTHERS'];

export interface Seats {
  LDF: number;
  UDF: number;
  NDA: number;
  OTHERS: number;
}

export interface DistrictSummary {
  name: string;
  slug: string;
  wards: number;
  declared: number;
  voters: number;
  seats: Seats;
  leading: Front | '—';
}

export interface LocalBody {
  code: string;
  name: string;
  type: string;
  district: string;
  wards: number;
  voters: number;
}

export interface WardWinner {
  ward: string;
  name: string;
  party: string;
  group: Front;
  votes: number;
  margin: number | null;
  voters: number | null;
}

export interface LbResult {
  code: string;
  name: string;
  type: string;
  wards: number;
  declared: number;
  voters: number;
  seats: Seats;
  leading: Front | '—';
  winners: WardWinner[];
}

export const LSG = {
  state,
  parties,
  bodies: bodies as LocalBody[],
  attribution,
};

export const frontLabel = (f: Front | '—'): string =>
  f === '—' ? '—' : (parties.groups[f as Front]?.label ?? f);

export const frontLabelEn = (f: Front | '—'): string =>
  f === '—' ? '—' : (parties.groups[f as Front]?.labelEn ?? f);

/** Indian digit grouping: 23573 → 23,573. */
export const fmt = (n: number): string => n.toLocaleString('en-IN');

/** Kerala's 14 districts, Malayalam first (editorial constant, not derivable). */
export const DISTRICT_ML: Record<string, string> = {
  Thiruvananthapuram: 'തിരുവനന്തപുരം',
  Kollam: 'കൊല്ലം',
  Pathanamthitta: 'പത്തനംതിട്ട',
  Alappuzha: 'ആലപ്പുഴ',
  Kottayam: 'കോട്ടയം',
  Idukki: 'ഇടുക്കി',
  Ernakulam: 'എറണാകുളം',
  Thrissur: 'തൃശ്ശൂർ',
  Palakkad: 'പാലക്കാട്',
  Malappuram: 'മലപ്പുറം',
  Kozhikode: 'കോഴിക്കോട്',
  Wayanad: 'വയനാട്',
  Kannur: 'കണ്ണൂർ',
  Kasaragod: 'കാസർഗോഡ്',
};

/** Tailwind fill classes for the three fronts, others, and ties. */
export const FRONT_FILL: Record<Front | '—', string> = {
  LDF: 'bg-accent-red',
  UDF: 'bg-azure',
  NDA: 'bg-saffron',
  OTHERS: 'bg-ink-muted',
  TIE: 'bg-ink-light',
  '—': 'bg-rule',
};
