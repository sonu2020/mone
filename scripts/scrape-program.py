#!/usr/bin/env python3
"""Capture one programme's full episode list into src/data/programs/<slug>.json.

    python3 scripts/scrape-program.py out-of-focus --title "Out Of Focus"

This is the deep capture — every episode on the listing, each enriched from its
YouTube watch page. For the shallow sweep across every programme, use
scrape-catalogue.py instead; src/lib/program-catalogue.ts prefers a deep file
when one exists and falls back to the catalogue's recent episodes otherwise.

The numbers are a snapshot — view counts drift. Re-run to refresh; `capturedAt`
in the output records when the snapshot was taken.
"""

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mediaone import (SITE, THROTTLE_SECONDS, enrich, episode_record, fetch,  # noqa: E402
                      parse_listing, program_title)

DATA_DIR = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'programs' / 'episodes'


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('slug', help='programme slug, e.g. out-of-focus')
    ap.add_argument('--title', help='display title (defaults to the site breadcrumb)')
    ap.add_argument('--title-ml', default='', help='Malayalam display title')
    ap.add_argument('--category', default='digital', choices=['tv', 'digital'])
    args = ap.parse_args()

    url = f'{SITE}/programs/{args.slug}'
    print(f'→ {url}')
    page = fetch(url)
    listing = parse_listing(page, args.slug)
    if not listing:
        print('No episodes found — the page markup may have changed.', file=sys.stderr)
        return 1
    print(f'  {len(listing)} episodes on the listing')

    enriched = []
    for i, ep in enumerate(listing, 1):
        try:
            full = enrich(ep)
            enriched.append(full)
            print(f"  {i:2}/{len(listing)} {full['youtubeId']} "
                  f"{full['durationSeconds']:>5}s {full['viewCount']:>8} views")
        except Exception as ex:  # a single dead video shouldn't lose the run
            print(f"  {i:2}/{len(listing)} {ep['youtubeId']} SKIPPED: {ex}", file=sys.stderr)
        time.sleep(THROTTLE_SECONDS)

    records = sorted((episode_record(e) for e in enriched
                      if e['uploadedAt'] and e['durationSeconds']),
                     key=lambda r: r['publishedAt'], reverse=True)
    if not records:
        print('Nothing usable after enrichment.', file=sys.stderr)
        return 1

    first = enriched[0]
    doc = {
        'slug': args.slug,
        'title': args.title or program_title(page) or args.slug.replace('-', ' ').title(),
        'titleML': args.title_ml,
        'category': args.category,
        'source': {
            'program': url,
            'channel': first.get('channel'),
            'channelId': first.get('channelId'),
            'channelUrl': f"https://www.youtube.com/channel/{first.get('channelId')}",
            'capturedAt': datetime.now(timezone.utc).date().isoformat(),
            'note': 'Scraped from the live programme listing; duration, view count and '
                    'publish time read from each YouTube watch page at capture time.',
        },
        'episodes': records,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / f'{args.slug}.json'
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"✓ {out} — {len(records)} episodes, "
          f"{records[-1]['publishedAt'][:10]} → {records[0]['publishedAt'][:10]}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
