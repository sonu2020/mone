#!/usr/bin/env python3
"""Sweep every MediaOne programme into src/data/programs/index.json.

    python3 scripts/scrape-catalogue.py

This is the shallow capture: for each programme it records identity, poster,
how many episodes its listing carries, when it last published, and the most
recent few episodes with real YouTube metadata. That is enough to rank
programmes by freshness and to show "what's new" without pulling every episode
of every programme.

What is real here and what is ours
----------------------------------
Real, read from the live site: the slug set, display titles, posters, episode
links, and — from each YouTube watch page — duration, view count and publish
time. The `group` is ours: mediaoneonline.com does not group its programmes
anywhere (the nav lists six of them flat, the footer none), so the TV/digital
split is the editorial taxonomy this site already used, carried forward.

Programme slugs are seeded below and each is probed; a slug the site 404s is
dropped, so this list can be edited freely without breaking the run.
"""

import argparse
import json
import sys
import time
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mediaone import (SITE, THROTTLE_SECONDS, enrich, episode_record, fetch,  # noqa: E402
                      parse_listing, program_title)

DATA_DIR = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'programs'
RECENT_PER_PROGRAM = 6

# Seeds: every slug the live site links to from its "Shows" nav menu, from the
# /programs feed's episode tags, and from this site's own authored list. Each is
# probed — the 404s drop out.
#
# `group` and `titleML` are ours (see the module docstring); everything else on
# a programme is read from the site.
SEEDS = [
    ('special-edition', 'tv', 'സ്പെഷ്യൽ എഡിഷൻ'),
    ('news-at-1', 'tv', 'ന്യൂസ് @ 1'),
    ('mid-east-hour', 'tv', 'മിഡ് ഈസ്റ്റ് അവർ'),
    ('media-scan', 'tv', 'മീഡിയ സ്കാൻ'),
    ('nilapadu', 'tv', 'നിലപാട്'),
    ('saudi-story', 'tv', 'സൗദി സ്റ്റോറി'),
    ('weekend-arabia', 'tv', 'വീക്കൻഡ് അറേബ്യ'),
    ('world-with-us', 'tv', 'വേൾഡ് വിത്ത് അസ്'),
    ('stethoscope', 'tv', 'സ്റ്റെതസ്കോപ്പ്'),
    ('out-of-focus', 'digital', 'ഔട്ട് ഓഫ് ഫോക്കസ്'),
    ('editorstake', 'digital', 'എഡിറ്റേഴ്സ് ടേക്ക്'),
    ('ajimshow', 'digital', 'അജിംഷോ'),
    ('deshantharam', 'digital', 'ദേശാന്തരം'),
    ('film-interview', 'digital', 'ഫിലിം അഭിമുഖം'),
]

GROUPS = [
    {'id': 'tv', 'label': 'TV Shows', 'labelML': 'ടിവി ഷോകൾ'},
    {'id': 'digital', 'label': 'Digital Shows', 'labelML': 'ഡിജിറ്റൽ ഷോകൾ'},
]


def capture(slug: str, group: str, title_ml: str, recent: int) -> dict | None:
    url = f'{SITE}/programs/{slug}'
    try:
        page = fetch(url)
    except urllib.error.HTTPError as e:
        print(f'  {slug:18} HTTP {e.code} — dropped', file=sys.stderr)
        return None

    listing = parse_listing(page, slug)
    if not listing:
        print(f'  {slug:18} no episode cards — dropped', file=sys.stderr)
        return None

    episodes = []
    for ep in listing[:recent]:
        try:
            full = enrich(ep)
            if full['uploadedAt'] and full['durationSeconds']:
                episodes.append(episode_record(full))
        except Exception as ex:
            print(f"  {slug:18} {ep['youtubeId']} skipped: {ex}", file=sys.stderr)
        time.sleep(THROTTLE_SECONDS)

    if not episodes:
        print(f'  {slug:18} nothing enriched — dropped', file=sys.stderr)
        return None

    episodes.sort(key=lambda e: e['publishedAt'], reverse=True)
    print(f"  {slug:18} {program_title(page) or '?':22} "
          f"listing={len(listing):3} recent={len(episodes)} last={episodes[0]['publishedAt'][:10]}")

    return {
        'slug': slug,
        'title': program_title(page) or slug.replace('-', ' ').title(),
        'titleML': title_ml,
        'group': group,
        'href': f'/programs/{slug}',
        # Episodes visible on page one of the listing — not the full archive,
        # which the site paginates behind a "load more" we do not follow.
        'listingEpisodes': len(listing),
        'lastPublishedAt': episodes[0]['publishedAt'],
        'poster': episodes[0]['thumbnail'],
        'recentEpisodes': episodes,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--recent', type=int, default=RECENT_PER_PROGRAM,
                    help=f'episodes to enrich per programme (default {RECENT_PER_PROGRAM})')
    ap.add_argument('--only', help='comma-separated slugs, for a partial refresh')
    args = ap.parse_args()

    seeds = SEEDS
    if args.only:
        wanted = {s.strip() for s in args.only.split(',')}
        seeds = [s for s in SEEDS if s[0] in wanted]

    print(f'→ sweeping {len(seeds)} programmes, {args.recent} episodes each')
    captured = [c for c in (capture(slug, group, ml, args.recent) for slug, group, ml in seeds)
                if c]
    if not captured:
        print('Nothing captured.', file=sys.stderr)
        return 1

    # Rank programmes by recency, and each group by its freshest programme, so
    # the stored order is the order a reader should meet them in.
    captured.sort(key=lambda p: p['lastPublishedAt'], reverse=True)
    groups = [g for g in GROUPS if any(p['group'] == g['id'] for p in captured)]
    groups.sort(key=lambda g: max(p['lastPublishedAt'] for p in captured
                                  if p['group'] == g['id']), reverse=True)

    doc = {
        'source': {
            'index': f'{SITE}/programs',
            'channel': 'MediaoneTV Live',
            'channelUrl': 'https://www.youtube.com/@MediaoneTVLive',
            'capturedAt': datetime.now(timezone.utc).date().isoformat(),
            'note': 'Programme identity, posters and episode links scraped from the live '
                    'site; duration, view count and publish time read from each YouTube '
                    'watch page. Group membership is editorial — mediaoneonline.com does '
                    'not group its programmes.',
            'recentPerProgram': args.recent,
        },
        'groups': groups,
        'programs': captured,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / 'index.json'
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"✓ {out} — {len(captured)} programmes across {len(groups)} groups, "
          f"freshest {captured[0]['slug']} ({captured[0]['lastPublishedAt'][:10]})")
    return 0


if __name__ == '__main__':
    sys.exit(main())
