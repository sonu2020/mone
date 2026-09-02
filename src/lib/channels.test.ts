import { describe, expect, it } from 'vitest';
import { allDeskChannels, deskChannels, subscriberRank } from './channels';
import type { DeskChannel } from './channels';

/** A channel stub — only the fields the ordering actually reads. */
function channel(desk: string, subscribersText?: string): DeskChannel {
  return {
    desk,
    label: desk,
    blurb: '',
    handle: `@${desk}`,
    channelUrl: `https://www.youtube.com/@${desk}`,
    subscribersText,
    social: [],
    shows: [],
    capturedAt: '2026-08-07',
    featured: [],
    more: [],
  };
}

describe('subscriberRank', () => {
  it('reads the abbreviations YouTube publishes', () => {
    expect(subscriberRank(channel('a', '147K subscribers'))).toBe(147_000);
    expect(subscriberRank(channel('a', '1.4M subscribers'))).toBe(1_400_000);
    expect(subscriberRank(channel('a', '2B subscribers'))).toBe(2_000_000_000);
  });

  it('treats a bare count as units', () => {
    expect(subscriberRank(channel('a', '812 subscribers'))).toBe(812);
  });

  it('ranks a channel with no captured count last rather than throwing', () => {
    expect(subscriberRank(channel('a'))).toBe(0);
    expect(subscriberRank(channel('a', 'not a number'))).toBe(0);
  });
});

describe('allDeskChannels', () => {
  it('lists every captured channel', () => {
    expect(allDeskChannels().map((c) => c.desk).sort()).toEqual(
      Object.keys(deskChannels).sort(),
    );
  });

  it('orders by audience so the list reads the same on every page', () => {
    const ranks = allDeskChannels().map(subscriberRank);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
  });

  it("leads with the reader's own desk, whatever its size", () => {
    // Business is the smallest of the captured channels, so it only reaches
    // the front if the current desk genuinely wins over the ordering.
    expect(allDeskChannels('business')[0].desk).toBe('business');
    expect(allDeskChannels('gulf')[0].desk).toBe('gulf');
  });

  it('still ranks the rest by audience behind the current desk', () => {
    const rest = allDeskChannels('business').slice(1).map(subscriberRank);
    expect(rest).toEqual([...rest].sort((a, b) => b - a));
  });

  it('ignores a desk that has no channel', () => {
    expect(allDeskChannels('kerala').map((c) => c.desk)).toEqual(
      allDeskChannels().map((c) => c.desk),
    );
  });

  it('does not reorder the registry itself', () => {
    const before = Object.keys(deskChannels);
    allDeskChannels('gulf');
    expect(Object.keys(deskChannels)).toEqual(before);
  });
});
