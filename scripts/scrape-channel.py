#!/usr/bin/env python3
"""Capture a MediaOne topic YouTube channel into src/data/channels/<desk>.json.

    python3 scripts/scrape-channel.py                 # every desk in DESKS
    python3 scripts/scrape-channel.py --only business

MediaOne runs desk-specific channels alongside the main one — Business, Gulf,
ShowMall — and their uploads belong on the matching section page. This reads a
channel's Videos tab and writes the newest run to a per-desk JSON file that
src/lib/channels.ts serves to the section pages.

Two passes, because the two sources know different things. The channel tab
carries the whole listing cheaply but dates it relatively ("19 hours ago"),
which is useless in a static build the moment it is committed. So the videos
that will actually be displayed get their watch page read for an absolute
publish time and an exact view count; the rest are kept as a tail with the
relative string and the capture date, which is honest about what it is.

The same page also carries the channel's own identity — its avatar, its
subscriber count, how many videos it has published. That is what makes a band
read as a channel rather than as a tray of thumbnails, so it is captured too,
and the avatar is downloaded into public/ rather than hotlinked: the yt3 URL
carries a sizing token and is not a contract.
"""

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mediaone import THROTTLE_SECONDS, UA, fetch, utc_iso, yt_field  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / 'src' / 'data' / 'channels'
# Avatars land in public/ and are served from the site's own origin. The path
# below is both where the file is written and what the JSON records, so the two
# cannot drift.
AVATAR_DIR = ROOT / 'public' / 'images' / 'channels'
AVATAR_HREF = '/images/channels'
ENRICH_PER_DESK = 8

# desk id → the channel that feeds it. `social` is recorded for credit only:
# Instagram is login-walled and scraping it is against their terms, so the
# handle is stored as a link, never as fetched posts.
DESKS = [
    {
        'desk': 'business',
        'handle': 'MediaOneBusiness',
        'label': 'MediaOne Business',
        'blurb': 'Markets, enterprise and the money story, from MediaOne’s business desk.',
        'social': [],
    },
    {
        'desk': 'entertainment',
        'handle': 'MediaOneShowMall',
        'label': 'MediaOne ShowMall',
        'blurb': 'Film, music and the screen — MediaOne’s entertainment channel.',
        'social': [{'network': 'Instagram', 'handle': '@mediaoneshowmall',
                    'href': 'https://instagram.com/mediaoneshowmall'}],
    },
    {
        'desk': 'gulf',
        'handle': 'MediaOneGulf',
        'label': 'MediaOne Gulf',
        'blurb': 'The Gulf desk — expatriate life, law and the news from the region.',
        'social': [],
    },
    {
        'desk': 'sports',
        'handle': 'MediaOneSports',
        'label': 'MediaOne Sports',
        'blurb': 'Round the clock from the sports desk — match nights, transfers and the '
                 'people behind the result.',
        'social': [],
    },
    {
        'desk': 'travel',
        'handle': 'MediaOneDestinations',
        'label': 'MediaOne Destinations',
        'blurb': 'Where the travel desk has been — road trips, food streets and the '
                 'places a Malayali passport actually reaches.',
        'social': [],
    },
    {
        'desk': 'health',
        'handle': 'MediaOneHealth',
        'label': 'MediaOne Health',
        'blurb': 'Medicine, public health and living well, explained by the people who '
                 'practise it.',
        'social': [],
    },
]


def view_models(page: str) -> list[dict]:
    """Every `lockupViewModel` on a channel tab, in page order.

    Both the Videos tab and the Playlists tab render this one shape rather than
    the older `videoRenderer`/`playlistRenderer` pair, so the same walk serves
    both and the tiles are told apart by their `contentType`.
    """
    m = re.search(r'var ytInitialData\s*=\s*(\{.*?\});</script>', page, re.S)
    if not m:
        return []

    found: list[dict] = []

    def walk(node):
        if isinstance(node, dict):
            if 'lockupViewModel' in node:
                found.append(node['lockupViewModel'])
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(json.loads(m.group(1)))
    return found


def lockups(page: str) -> list[dict]:
    """Every video tile on a channel's Videos tab.

    Duration lives in a thumbnail badge and the view count and relative date
    share a metadata row with the channel name — which row varies, so they are
    found by content rather than by index.
    """
    found = view_models(page)

    out = []
    for v in found:
        vid = v.get('contentId')
        if not vid:
            continue
        meta = v.get('metadata', {}).get('lockupMetadataViewModel', {})
        title = meta.get('title', {}).get('content')

        views = published = None
        rows = (meta.get('metadata', {}).get('contentMetadataViewModel', {})
                    .get('metadataRows', []))
        for row in rows:
            parts = [p.get('text', {}).get('content', '') for p in row.get('metadataParts', [])]
            for part in parts:
                if 'view' in part.lower():
                    views = part
                elif 'ago' in part.lower():
                    published = part

        duration = None
        for overlay in v.get('contentImage', {}).get('thumbnailViewModel', {}).get('overlays', []):
            for badge in overlay.get('thumbnailBottomOverlayViewModel', {}).get('badges', []):
                text = badge.get('thumbnailBadgeViewModel', {}).get('text')
                if text and re.fullmatch(r'[\d:]+', text):
                    duration = text

        out.append({
            'youtubeId': vid,
            'title': title,
            'durationText': duration,
            'viewsText': views,
            'publishedText': published,
            # Canonical ytimg URLs rather than the signed ones on the page —
            # those carry expiring query strings and would rot in the JSON.
            'thumbnail': {
                'small': f'https://i.ytimg.com/vi/{vid}/mqdefault.jpg',
                'large': f'https://i.ytimg.com/vi/{vid}/maxresdefault.jpg',
            },
            'href': f'https://www.youtube.com/watch?v={vid}',
        })
    return out


def shows(handle: str) -> list[dict]:
    """The channel's playlists — its shows, as the channel itself groups them.

    A desk channel is not a flat upload feed to the people who run it: Destinations
    keeps Travellers Cafe and Thailand Diary apart, Health keeps its strands
    apart, and those groupings are the closest thing the channel has to a
    programme slate. They are captured as links and counts rather than as
    episode lists — reading every playlist's contents would multiply the sweep
    by the number of playlists for a level of detail nothing displays yet, and a
    playlist embed plays the whole run in order anyway.
    """
    try:
        page = fetch(f'https://www.youtube.com/@{handle}/playlists')
    except urllib.error.HTTPError:
        return []

    out = []
    for v in view_models(page):
        if v.get('contentType') != 'LOCKUP_CONTENT_TYPE_PLAYLIST':
            continue
        pid = v.get('contentId')
        if not pid:
            continue

        meta = v.get('metadata', {}).get('lockupMetadataViewModel', {})
        title = meta.get('title', {}).get('content')
        if not title:
            continue

        # "7 videos" rides in the thumbnail's own badge on this tab, not in the
        # metadata rows the video tiles use.
        count = None
        thumb = v.get('contentImage', {}).get('collectionThumbnailViewModel', {})
        primary = thumb.get('primaryThumbnail', {}).get('thumbnailViewModel', {})
        for overlay in primary.get('overlays', []):
            for badge in overlay.get('thumbnailOverlayBadgeViewModel', {}).get('thumbnailBadges', []):
                text = badge.get('thumbnailBadgeViewModel', {}).get('text')
                if text and 'video' in text:
                    count = text

        # The tile's own thumbnail URL is signed and expiring, so the playlist's
        # cover is named by its first video instead — the same canonical ytimg
        # address every other thumbnail in this file uses.
        first = None
        for src in primary.get('image', {}).get('sources', []):
            m = re.search(r'/vi/([A-Za-z0-9_-]{11})/', src.get('url', ''))
            if m:
                first = m.group(1)
                break

        out.append({
            'playlistId': pid,
            'title': title,
            'videoCountText': count,
            'href': f'https://www.youtube.com/playlist?list={pid}',
            # Plays the whole playlist in order, in the site's own modal.
            'embedUrl': f'https://www.youtube.com/embed/videoseries?list={pid}',
            'thumbnail': f'https://i.ytimg.com/vi/{first}/mqdefault.jpg' if first else None,
        })
    return out


def identity(page: str, desk: str) -> dict:
    """The channel's own face: avatar, subscribers, how much it has published.

    The avatar is the page's og:image — YouTube publishes the channel picture
    there, at a size it picks (`=s900-…`). That URL is a rendering token rather
    than a stable address, so the bytes are pulled down to public/ and the JSON
    records the local path. A band that lost its avatar to an expired token
    would look broken in a way no build step would catch.

    Subscriber and video counts are the abbreviated strings YouTube itself
    shows ("147K subscribers"). They are kept as text: the exact numbers are
    not published, and rounding them ourselves would invent precision.
    """
    out: dict = {}

    m = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    if m:
        out['avatarSource'] = m.group(1)
        local = download_avatar(m.group(1), desk)
        if local:
            out['avatar'] = local

    for key, pattern in (('subscribersText', r'"([\d.]+[KMB]? subscribers)"'),
                         ('videoCountText', r'"([\d,.]+[KMB]? videos)"')):
        m = re.search(pattern, page)
        if m:
            out[key] = m.group(1)

    return out


def download_avatar(url: str, desk: str) -> str | None:
    """Fetch the avatar into public/images/channels/<desk>.jpg."""
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        data = urllib.request.urlopen(req, timeout=30).read()
    except Exception as ex:
        print(f'  {desk:14} avatar skipped: {ex}', file=sys.stderr)
        return None
    (AVATAR_DIR / f'{desk}.jpg').write_bytes(data)
    return f'{AVATAR_HREF}/{desk}.jpg'


def enrich(video: dict) -> dict:
    """Absolute publish time, exact counts and duration, from the watch page."""
    page = fetch(f"https://www.youtube.com/watch?v={video['youtubeId']}")
    secs = yt_field(page, 'lengthSeconds')
    views = yt_field(page, 'viewCount')
    uploaded = yt_field(page, 'uploadDate')
    return {
        **video,
        'durationSeconds': int(secs) if secs else None,
        'viewCount': int(views) if views else None,
        'publishedAt': utc_iso(uploaded) if uploaded else None,
    }


def capture(spec: dict, per: int) -> dict | None:
    url = f"https://www.youtube.com/@{spec['handle']}/videos"
    try:
        page = fetch(url)
    except urllib.error.HTTPError as e:
        print(f"  {spec['desk']:14} HTTP {e.code} — skipped", file=sys.stderr)
        return None

    videos = lockups(page)
    if not videos:
        print(f"  {spec['desk']:14} no tiles — YouTube markup may have changed", file=sys.stderr)
        return None

    featured = []
    for v in videos[:per]:
        try:
            full = enrich(v)
            if full['publishedAt'] and full['durationSeconds']:
                featured.append(full)
        except Exception as ex:
            print(f"  {spec['desk']:14} {v['youtubeId']} skipped: {ex}", file=sys.stderr)
        time.sleep(THROTTLE_SECONDS)

    if not featured:
        print(f"  {spec['desk']:14} nothing enriched — skipped", file=sys.stderr)
        return None

    featured.sort(key=lambda v: v['publishedAt'], reverse=True)
    ident = identity(page, spec['desk'])
    time.sleep(THROTTLE_SECONDS)
    playlists = shows(spec['handle'])
    print(f"  {spec['desk']:14} {spec['label']:22} listing={len(videos):3} "
          f"featured={len(featured)} shows={len(playlists):2} "
          f"newest={featured[0]['publishedAt'][:10]} "
          f"{ident.get('subscribersText', 'no subs')}")

    return {
        'desk': spec['desk'],
        'label': spec['label'],
        'blurb': spec['blurb'],
        'handle': f"@{spec['handle']}",
        'channelUrl': f"https://www.youtube.com/@{spec['handle']}",
        'social': spec['social'],
        **ident,
        # The channel's own playlists — its shows. Links and counts only; see
        # shows().
        'shows': playlists,
        'capturedAt': datetime.now(timezone.utc).date().isoformat(),
        # Enriched, with real dates — what the page renders.
        'featured': featured,
        # The rest of the listing as captured. Relative dates, so treat as a
        # snapshot: useful for counts and for spotting new uploads, not for
        # ordering against anything else.
        'more': videos[per:],
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--only', help='comma-separated desk ids')
    ap.add_argument('--per', type=int, default=ENRICH_PER_DESK,
                    help=f'videos to enrich per desk (default {ENRICH_PER_DESK})')
    args = ap.parse_args()

    specs = DESKS
    if args.only:
        wanted = {s.strip() for s in args.only.split(',')}
        specs = [s for s in DESKS if s['desk'] in wanted]

    print(f'→ sweeping {len(specs)} channel(s), enriching {args.per} each')
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    written = 0
    for spec in specs:
        doc = capture(spec, args.per)
        if not doc:
            continue
        out = DATA_DIR / f"{spec['desk']}.json"
        out.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        written += 1

    print(f'✓ {written} channel file(s) in {DATA_DIR}')
    return 0 if written else 1


if __name__ == '__main__':
    sys.exit(main())
