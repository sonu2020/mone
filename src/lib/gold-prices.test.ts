import { describe, expect, it } from 'vitest';
import { GOLD_ATTRIBUTION, goldActs, goldReports, goldSeries } from './gold-prices';
import { stats, windowSeries } from './price-series';

describe('goldSeries', () => {
  it('declares both purities and both units, grams first', () => {
    expect(goldSeries.variants.map((v) => v.id)).toEqual(['22k', '24k']);
    expect(goldSeries.units.map((u) => u.id)).toEqual(['gram', 'pavan']);
    expect(goldSeries.units[1].factor).toBe(8);
  });

  it('carries the full scraped history, ascending', () => {
    expect(goldSeries.points.length).toBeGreaterThan(5000);
    const dates = goldSeries.points.map((p) => p.date);
    expect(dates).toEqual([...dates].sort());
    expect(dates[0] < '2010-06-01').toBe(true);
  });

  it('uses whole rupees', () => {
    expect(goldSeries.precision).toBe(0);
  });

  it('every range yields a drawable window', () => {
    for (const r of ['1W', '1M', '1Y', '5Y', 'ALL'] as const) {
      expect(windowSeries(goldSeries, r).length).toBeGreaterThan(1);
    }
  });

  it('quotes 24K dearer than 22K on every day', () => {
    for (const p of goldSeries.points) {
      expect(p.values['24k']!).toBeGreaterThan(p.values['22k']!);
    }
  });
});

describe('goldActs', () => {
  const first = goldSeries.points[0].date;
  const last = goldSeries.points[goldSeries.points.length - 1].date;

  it('spans real dates inside the series', () => {
    for (const act of goldActs) {
      expect(act.from >= first).toBe(true);
      expect(act.to <= last).toBe(true);
      expect(act.from < act.to).toBe(true);
    }
  });

  it('has a body for every act', () => {
    for (const act of goldActs) expect(act.body.length).toBeGreaterThan(40);
  });

  // The acts make causal claims about money. Each one asserts a direction here,
  // checked against the series — so a story that drifts from the data fails the
  // build rather than misleading a reader.
  it('claims a direction the data actually supports', () => {
    for (const act of goldActs) {
      const window = goldSeries.points.filter((p) => p.date >= act.from && p.date <= act.to);
      const s = stats(window, '22k');
      expect(s).not.toBeNull();
      if (act.direction === 'up') expect(s!.change).toBeGreaterThan(0);
      if (act.direction === 'down') expect(s!.change).toBeLessThan(0);
    }
  });
});

describe('goldReports', () => {
  it('anchors every report to a day the chart can mark', () => {
    const dates = new Set(goldSeries.points.map((p) => p.date));
    for (const r of goldReports) expect(dates.has(r.date)).toBe(true);
  });
});

describe('GOLD_ATTRIBUTION', () => {
  it('names the source and when it was read', () => {
    expect(GOLD_ATTRIBUTION.source).toBeTruthy();
    expect(GOLD_ATTRIBUTION.sourceUrl).toMatch(/^https:\/\//);
    expect(GOLD_ATTRIBUTION.scrapedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});
