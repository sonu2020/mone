import { describe, expect, it } from 'vitest';
import { buildPath, downsample, formatINR, stats, toUnit, windowSeries } from './price-series';
import type { PricePoint, PriceSeries, Unit } from './price-series';

const PAVAN: Unit = { id: 'pavan', label: 'pavan', labelML: 'പവൻ', factor: 8 };
const GRAM: Unit = { id: 'gram', label: 'gram', labelML: 'ഗ്രാം', factor: 1 };

describe('formatINR', () => {
  it('groups by the Indian system, not the Western one', () => {
    expect(formatINR(110920, 0)).toBe('1,10,920');
    expect(formatINR(1310160, 0)).toBe('13,10,160');
  });

  it('leaves small numbers ungrouped', () => {
    expect(formatINR(920, 0)).toBe('920');
  });

  it('honours precision for currency-style series', () => {
    expect(formatINR(83.25, 2)).toBe('83.25');
    expect(formatINR(83.2, 2)).toBe('83.20');
  });
});

describe('toUnit', () => {
  it('scales the stored base unit by the unit factor', () => {
    expect(toUnit(12380, PAVAN, 0)).toBe(99040);
    expect(toUnit(12380, GRAM, 0)).toBe(12380);
  });

  it('rounds to the series precision', () => {
    expect(toUnit(12380.4, GRAM, 0)).toBe(12380);
  });
});

function seriesOf(rows: [string, number][]): PriceSeries {
  return {
    id: 'test',
    variants: [{ id: 'a', label: 'A', labelML: 'എ' }],
    units: [GRAM],
    granularity: 'daily',
    precision: 0,
    points: rows.map(([date, v]) => ({ date, values: { a: v } })),
  };
}

describe('windowSeries', () => {
  const s = seriesOf([
    ['2026-01-01', 100],
    ['2026-06-01', 200],
    ['2026-07-25', 300],
    ['2026-08-01', 400],
  ]);

  it('anchors on the last point, not on today', () => {
    const w = windowSeries(s, '1W');
    expect(w.map((p) => p.date)).toEqual(['2026-07-25', '2026-08-01']);
  });

  it('includes a point falling exactly on the boundary', () => {
    const w = windowSeries(seriesOf([
      ['2026-07-25', 1],
      ['2026-08-01', 2],
    ]), '1W');
    expect(w).toHaveLength(2);
  });

  it('returns everything for ALL', () => {
    expect(windowSeries(s, 'ALL')).toHaveLength(4);
  });

  it('spans months and years by calendar, not by fixed day counts', () => {
    expect(windowSeries(s, '1M').map((p) => p.date))
      .toEqual(['2026-07-25', '2026-08-01']);
    expect(windowSeries(s, '1Y')).toHaveLength(4);
  });
});

describe('stats', () => {
  it('reports the extremes and the change across the window', () => {
    const s = seriesOf([
      ['2026-01-01', 100],
      ['2026-01-02', 250],
      ['2026-01-03', 200],
    ]);
    expect(stats(s.points, 'a')).toEqual({
      min: 100, max: 250, first: 100, last: 200,
      change: 100, changePercent: 100,
    });
  });

  it('ignores gaps rather than treating them as zero', () => {
    const points = [
      { date: '2026-01-01', values: { a: 100 } },
      { date: '2026-01-02', values: {} },
      { date: '2026-01-03', values: { a: 200 } },
    ];
    expect(stats(points, 'a')).toMatchObject({ min: 100, max: 200, last: 200 });
  });

  it('returns null when the variant has no data at all', () => {
    expect(stats([{ date: '2026-01-01', values: {} }], 'a')).toBeNull();
  });
});

describe('downsample', () => {
  // 1000 consecutive days from 2020-01-01, with one spike and one trough buried
  // in the interior so the extreme-preservation claim is actually tested.
  const many: PricePoint[] = Array.from({ length: 1000 }, (_, i) => {
    const d = new Date(Date.UTC(2020, 0, 1 + i));
    return {
      date: d.toISOString().slice(0, 10),
      values: { a: i === 500 ? 9999 : i === 700 ? -50 : 100 + (i % 17) },
    };
  });

  it('returns the input untouched when it already fits', () => {
    const few = many.slice(0, 10);
    expect(downsample(few, 'a', 400)).toBe(few);
  });

  it('never exceeds maxPoints', () => {
    expect(downsample(many, 'a', 400).length).toBeLessThanOrEqual(400);
  });

  it('preserves the global maximum and minimum', () => {
    const out = downsample(many, 'a', 400);
    const values = out.map((p) => p.values.a).filter((v): v is number => v != null);
    expect(Math.max(...values)).toBe(9999);
    expect(Math.min(...values)).toBe(-50);
  });

  it('keeps the first and last points', () => {
    const out = downsample(many, 'a', 400);
    expect(out[0]).toBe(many[0]);
    expect(out[out.length - 1]).toBe(many[many.length - 1]);
  });

  it('stays in ascending index order', () => {
    const out = downsample(many, 'a', 400);
    const indices = out.map((p) => many.indexOf(p));
    expect(indices).toEqual([...indices].sort((x, y) => x - y));
  });
});

describe('buildPath', () => {
  const pts: PricePoint[] = [
    { date: '2026-01-01', values: { a: 100 } },
    { date: '2026-01-02', values: { a: 200 } },
    { date: '2026-01-03', values: { a: 300 } },
  ];

  it('maps the value range onto the full height, y inverted', () => {
    // min -> bottom (y = height), max -> top (y = 0)
    expect(buildPath(pts, 'a', 100, 40, 100, 300)).toBe('M0,40L50,20L100,0');
  });

  it('starts a new subpath at a gap instead of drawing across it', () => {
    const gapped: PricePoint[] = [
      { date: '2026-01-01', values: { a: 100 } },
      { date: '2026-01-02', values: {} },
      { date: '2026-01-03', values: { a: 300 } },
    ];
    expect(buildPath(gapped, 'a', 100, 40, 100, 300)).toBe('M0,40M100,0');
  });

  it('draws a flat line down the middle when every value is equal', () => {
    const flat: PricePoint[] = [
      { date: '2026-01-01', values: { a: 5 } },
      { date: '2026-01-02', values: { a: 5 } },
    ];
    expect(buildPath(flat, 'a', 100, 40, 5, 5)).toBe('M0,20L100,20');
  });

  it('returns an empty string for no points', () => {
    expect(buildPath([], 'a', 100, 40, 0, 1)).toBe('');
  });
});
