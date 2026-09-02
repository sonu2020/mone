// Invariants over the committed LSG 2025 data (src/data/lsg/*.json and
// public/lsg-data/*). The build script regenerates these files; if a re-run
// drifts from reality — a dropped ward, a mistyped join key, a front that
// stops summing — this suite fails the build instead of misleading a reader.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LSG, FRONTS, type Front } from './lsg';

const ROOT = join(import.meta.dirname, '..', '..');
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const byCode = new Map(LSG.bodies.map((b) => [b.code, b]));

const TYPE_COUNTS: Record<string, number> = {
  'Grama Panchayat': 941,
  Municipality: 87,
  Corporation: 6,
  'Block Panchayat': 152,
  'District Panchayat': 14,
};

describe('bodies', () => {
  it('is every Kerala local body, once', () => {
    expect(LSG.bodies).toHaveLength(1200);
    const codes = LSG.bodies.map((b) => b.code);
    expect(new Set(codes).size).toBe(1200);
  });

  it('has the right shape of body, per tier', () => {
    const byType = LSG.bodies.reduce((acc, b) => {
      acc[b.type] = (acc[b.type] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(byType).toEqual(TYPE_COUNTS);
  });

  it('has registered voters on every body, from the ground tier up', () => {
    for (const b of LSG.bodies) {
      expect(b.voters).toBeGreaterThan(0);
      expect(Number.isInteger(b.voters)).toBe(true);
    }
    const ground = LSG.bodies.filter((b) => ['Grama Panchayat', 'Municipality', 'Corporation'].includes(b.type));
    const sum = ground.reduce((s, b) => s + b.voters, 0);
    expect(sum).toBe(LSG.state.counts.voters);
    // Sanity window around the SEC's published 2025 roll (~2.84–2.87 crore).
    expect(sum).toBeGreaterThan(28_000_000);
    expect(sum).toBeLessThan(29_000_000);
  });
});

describe('state seats', () => {
  it('declared wards equal seats, matching the 23,573 the SEC reported', () => {
    const total = FRONTS.reduce((s, f) => s + LSG.state.seats[f], 0);
    expect(LSG.state.counts.declared).toBe(23573);
    expect(total).toBe(LSG.state.counts.declared);
  });

  it('sums districts into the state, and each leading front is the argmax', () => {
    expect(LSG.state.districts).toHaveLength(14);
    const acc: Record<Front, number> = { LDF: 0, UDF: 0, NDA: 0, OTHERS: 0 };
    for (const d of LSG.state.districts) {
      for (const f of FRONTS) acc[f] += d.seats[f];
      const top = FRONTS.map((f) => [f, d.seats[f]] as const).sort((a, b) => b[1] - a[1]);
      const expected = top[0][1] === top[1][1] ? 'TIE' : top[0][0];
      expect(d.leading).toBe(expected);
      expect(d.declared).toBeLessThanOrEqual(d.wards);
      expect(d.declared).toBeGreaterThan(0);
    }
    expect(acc).toEqual(LSG.state.seats);
  });
});

describe('district chunks', () => {
  const files = readdirSync(join(ROOT, 'public/lsg-data/district')).filter((f) => f.endsWith('.json'));

  it('covers every district exactly once and every declared ward once', () => {
    expect(files).toHaveLength(14);
    let declared = 0;
    for (const f of files) {
      const chunk = read(`public/lsg-data/district/${f}`);
      expect(chunk.district.slug).toBe(f.replace('.json', ''));
      const chunkDeclared = chunk.lBs.reduce((s: number, lb: { declared: number }) => s + lb.declared, 0);
      expect(chunkDeclared).toBe(chunk.district.declared);
      declared += chunkDeclared;
    }
    expect(declared).toBe(23573);
  });

  it('every LB joins to local_bodies with a consistent winner ledger', () => {
    for (const f of files) {
      const chunk = read(`public/lsg-data/district/${f}`);
      for (const lb of chunk.lBs as Array<{
        code: string; name: string; type: string; wards: number; declared: number;
        voters: number; seats: Record<Front, number>; winners: Array<{
          group: Front; votes: number; margin: number | null; voters: number | null;
        }>;
      }>) {
        const body = byCode.get(lb.code);
        expect(body, `${lb.code} in bodies`).toBeDefined();
        expect(lb.name).toBe(body!.name);
        expect(lb.type).toBe(body!.type);
        expect(lb.voters).toBe(body!.voters);
        expect(lb.declared).toBeLessThanOrEqual(lb.wards);
        expect(lb.winners).toHaveLength(lb.declared);
        const seats = FRONTS.reduce((s, g) => s + lb.seats[g], 0);
        expect(seats).toBe(lb.declared);
        for (const w of lb.winners) {
          expect(FRONTS).toContain(w.group);
          // Uncontested wards return a winner on 0 votes.
          expect(w.votes).toBeGreaterThanOrEqual(0);
          if (w.margin !== null) expect(w.margin).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});

describe('geometry', () => {
  it('the state map is exactly the 14 districts, joined to the summary', () => {
    const geo = read('public/lsg-data/districts.geojson');
    expect(geo.type).toBe('FeatureCollection');
    expect(geo.features).toHaveLength(14);
    const names = geo.features.map((f: { properties: { name: string } }) => f.properties.name).sort();
    expect(names).toEqual(LSG.state.districts.map((d) => d.name).sort());
    for (const f of geo.features as Array<{ properties: { leading?: string; seats?: unknown } }>) {
      expect(f.properties.leading).toBeDefined();
      expect(f.properties.seats).toBeDefined();
    }
  });

  it('every LB shape joins to a body and a result', () => {
    const files = readdirSync(join(ROOT, 'public/lsg-data/district')).filter((f) => f.endsWith('.geojson'));
    expect(files).toHaveLength(14);
    for (const f of files) {
      const geo = read(`public/lsg-data/district/${f}`);
      for (const feat of geo.features as Array<{
        properties: { code: string; leading?: string; seats?: unknown };
      }>) {
        expect(byCode.get(feat.properties.code)).toBeDefined();
        expect(['LDF', 'UDF', 'NDA', 'OTHERS', 'TIE']).toContain(feat.properties.leading);
        expect(feat.properties.seats).toBeDefined();
      }
    }
  });
});

describe('parties', () => {
  it('maps the big three where they belong', () => {
    expect(LSG.parties.party['CPI(M)']).toBe('LDF');
    expect(LSG.parties.party['INC']).toBe('UDF');
    expect(LSG.parties.party['BJP']).toBe('NDA');
  });
});

describe('attribution', () => {
  it('points at both OpenDataKerala repos and a build time', () => {
    expect(new Date(LSG.attribution.builtAt).getTime()).not.toBeNaN();
    expect(LSG.attribution.repos.map((r) => r.url)).toEqual([
      'https://github.com/opendatakerala/LSG2025',
      'https://github.com/opendatakerala/LSGD2025-Results-Data',
    ]);
  });
});
