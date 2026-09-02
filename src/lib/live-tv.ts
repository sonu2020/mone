// ============================================================================
// Live TV — the channel feed and its 24-hour programme grid.
//
// The site is statically built, so "what is on air right now" can never be
// resolved at build time. Instead the whole day ships in the HTML and the
// client picks the current slot (see OnAirNow.astro). Slot times are IST and
// are read against Asia/Kolkata on the client, so a viewer in the Gulf still
// sees the schedule the channel actually broadcasts.
// ============================================================================

const CHANNEL_ID = 'UCpt10lzibN9Ux-tFGVAnrBw';

/** The current 24×7 broadcast: youtube.com/watch?v=-8d8-c0yvyU.
 *  Swap this one id when the channel restarts its live stream. */
const LIVE_VIDEO_ID = '-8d8-c0yvyU';

/** The live feed — the single source every surface points at, so the modal,
 *  /live and the on-air utility can't drift apart. `embedUrl` is carried whole
 *  rather than rebuilt from an id, because a channel `live_stream` embed (the
 *  fallback form) has no video id to rebuild from. */
export const LIVE_CHANNEL = {
  id: 'mediaone-live',
  channelId: CHANNEL_ID,
  videoId: LIVE_VIDEO_ID,
  title: 'MediaOne Live TV',
  titleML: 'മീഡിയവൺ ലൈവ് ടിവി',
  href: '/live',
  watchUrl: `https://www.youtube.com/watch?v=${LIVE_VIDEO_ID}`,
  // hqdefault, not maxresdefault — the latter 404s on plenty of live streams.
  poster: `https://i.ytimg.com/vi/${LIVE_VIDEO_ID}/hqdefault.jpg`,
  embedUrl: `https://www.youtube.com/embed/${LIVE_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`,
} as const;

/** Where the full grid lives — the "view all" target. */
export const SCHEDULE_HREF = '/live';

export type SlotKind = 'news' | 'show' | 'talk' | 'special';

export interface TvSlot {
  start: string;    // 'HH:MM', 24-hour IST
  end: string;      // 'HH:MM', 24-hour IST — '24:00' closes the day
  title: string;
  titleML: string;
  kind: SlotKind;
  slug?: string;    // /programs/<slug> when the show has a page
  repeat?: boolean; // rerun rather than an originating broadcast
}

/** One broadcast day, IST. Contiguous and ordered — the client walks it once. */
export const schedule: TvSlot[] = [
  { start: '00:00', end: '01:00', title: 'News Night',       titleML: 'ന്യൂസ് നൈറ്റ്',       kind: 'news' },
  { start: '01:00', end: '02:00', title: 'Nilapadu',         titleML: 'നിലപാട്',            kind: 'talk',    slug: 'nilapadu',       repeat: true },
  { start: '02:00', end: '03:00', title: 'World With Us',    titleML: 'വേൾഡ് വിത്ത് അസ്',   kind: 'show',    slug: 'world-with-us',  repeat: true },
  { start: '03:00', end: '04:00', title: 'Media Scan',       titleML: 'മീഡിയ സ്കാൻ',        kind: 'show',    slug: 'media-scan',     repeat: true },
  { start: '04:00', end: '05:00', title: 'MediaOne Bulletin', titleML: 'വാർത്തകൾ',          kind: 'news' },
  { start: '05:00', end: '06:00', title: 'Good Morning Kerala', titleML: 'ഗുഡ് മോർണിങ് കേരള', kind: 'news' },
  { start: '06:00', end: '07:00', title: 'News Update',      titleML: 'ന്യൂസ് അപ്‌ഡേറ്റ്',   kind: 'news' },
  { start: '07:00', end: '08:00', title: 'News Morning',     titleML: 'ന്യൂസ് മോർണിങ്',     kind: 'news' },
  { start: '08:00', end: '09:00', title: 'News Hour',        titleML: 'ന്യൂസ് അവർ',         kind: 'talk' },
  { start: '09:00', end: '10:00', title: 'Media Scan',       titleML: 'മീഡിയ സ്കാൻ',        kind: 'show',    slug: 'media-scan' },
  { start: '10:00', end: '11:00', title: 'News @ 10',        titleML: 'ന്യൂസ് @ 10',        kind: 'news' },
  { start: '11:00', end: '12:00', title: 'Mid East Hour',    titleML: 'മിഡ് ഈസ്റ്റ് അവർ',   kind: 'show',    slug: 'mid-east-hour' },
  { start: '12:00', end: '13:00', title: 'Stethoscope',      titleML: 'സ്റ്റെതസ്കോപ്പ്',    kind: 'show',    slug: 'stethoscope' },
  { start: '13:00', end: '14:00', title: 'News @ 1',         titleML: 'ന്യൂസ് @ 1',         kind: 'news',    slug: 'news-at-1' },
  { start: '14:00', end: '15:00', title: 'Saudi Story',      titleML: 'സൗദി സ്റ്റോറി',      kind: 'show',    slug: 'saudi-story' },
  { start: '15:00', end: '16:00', title: 'Weekend Arabia',   titleML: 'വീക്കൻഡ് അറേബ്യ',    kind: 'show',    slug: 'weekend-arabia' },
  { start: '16:00', end: '17:00', title: 'News @ 4',         titleML: 'ന്യൂസ് @ 4',         kind: 'news' },
  { start: '17:00', end: '18:00', title: 'World With Us',    titleML: 'വേൾഡ് വിത്ത് അസ്',   kind: 'show',    slug: 'world-with-us' },
  { start: '18:00', end: '19:00', title: 'News @ 6',         titleML: 'ന്യൂസ് @ 6',         kind: 'news' },
  { start: '19:00', end: '20:00', title: 'Nilapadu',         titleML: 'നിലപാട്',            kind: 'talk',    slug: 'nilapadu' },
  { start: '20:00', end: '21:00', title: 'News Night',       titleML: 'ന്യൂസ് നൈറ്റ്',       kind: 'news' },
  { start: '21:00', end: '22:00', title: 'Special Edition',  titleML: 'സ്പെഷ്യൽ എഡിഷൻ',    kind: 'special', slug: 'special-edition' },
  { start: '22:00', end: '23:00', title: 'News @ 10',        titleML: 'ന്യൂസ് @ 10',        kind: 'news' },
  { start: '23:00', end: '24:00', title: 'Out Of Focus',     titleML: 'ഔട്ട് ഓഫ് ഫോക്കസ്',  kind: 'show',    slug: 'out-of-focus' },
];

/** 'HH:MM' → minutes past midnight. '24:00' → 1440. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** 'HH:MM' → '6:00 PM'. Rendered server-side so the markup is readable
 *  without JS; the client never reformats these. */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** '6:00 – 7:00 PM' — drops the repeated meridiem when both ends share one. */
export function formatRange(start: string, end: string): string {
  const a = formatTime(start);
  const b = formatTime(end);
  const [aTime, aSuffix] = a.split(' ');
  const [, bSuffix] = b.split(' ');
  return aSuffix === bSuffix ? `${aTime} – ${b}` : `${a} – ${b}`;
}
