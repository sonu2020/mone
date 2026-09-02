#!/usr/bin/env python3
"""Capture Kerala's daily gold rates into src/data/gold/prices.json.

    python3 scripts/scrape-gold.py                  # top up recent months
    python3 scripts/scrape-gold.py --full           # re-walk 2010 -> now
    python3 scripts/scrape-gold.py --from 2024      # re-walk from a year

keralagoldrates.com publishes one page per month, each a table of daily 22K and
24K rates in both rupees-per-gram and rupees-per-pavan. Only the per-gram columns
are stored: a pavan is exactly eight grams, so keeping both would be two sources
of truth for one number, and they would eventually disagree.

Default runs are incremental — history before the current year does not change,
so re-fetching 190 pages to learn today's rate would be rude to the source and
slow for us. Use --full after a gap.
"""

import argparse
import json
import re
import sys
import time
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mediaone import THROTTLE_SECONDS, fetch  # noqa: E402

SOURCE = 'keralagoldrates.com'
BASE = 'https://keralagoldrates.com'
OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'gold' / 'prices.json'
FIRST_YEAR = 2010
MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
          'july', 'august', 'september', 'october', 'november', 'december']
MAX_RETRIES = 3

# A plausible per-gram 22K rate, used to reject rows that are really the pavan
# table or a summary block. Kerala's 22K gram rate has run roughly ₹1,200
# (2010) to ₹13,000 (2026); the bounds are deliberately loose.
MIN_GRAM_RATE = 100
MAX_GRAM_RATE = 100_000

ROW_RE = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S | re.I)
CELL_RE = re.compile(r'<t[dh][^>]*>(.*?)</t[dh]>', re.S | re.I)
TAG_RE = re.compile(r'<[^>]+>')
# "Jan 1", "January 1", "Jan 1, 2026" — take the day number and trust the
# month and year from the URL we asked for.
DAY_RE = re.compile(r'\b([12]\d|3[01]|0?[1-9])\b')
MONEY_RE = re.compile(r'[\d,]+(?:\.\d+)?')


def _text(cell: str) -> str:
    return TAG_RE.sub('', cell).replace('&nbsp;', ' ').strip()


def _money(cell: str) -> float | None:
    m = MONEY_RE.search(_text(cell))
    if not m:
        return None
    try:
        return float(m.group(0).replace(',', ''))
    except ValueError:
        return None


def parse_month(page: str, year: int, month: int) -> list[dict]:
    """Daily rows for one month page, ascending by date.

    Raises ValueError when no row parses — an empty result from a page that was
    fetched successfully means their markup moved, and writing that as "no data"
    would silently punch a hole in the series.
    """
    rows: dict[str, dict] = {}
    for raw in ROW_RE.findall(page):
        cells = CELL_RE.findall(raw)
        if len(cells) < 3:
            continue
        day_match = DAY_RE.search(_text(cells[0]))
        if not day_match:
            continue
        v22, v24 = _money(cells[1]), _money(cells[2])
        if v22 is None or v24 is None:
            continue
        # Guards against matching a summary or the per-pavan block by mistake.
        if not (MIN_GRAM_RATE < v22 < MAX_GRAM_RATE) or v24 <= v22:
            continue
        day = int(day_match.group(1))
        try:
            date = datetime(year, month, day).strftime('%Y-%m-%d')
        except ValueError:
            continue
        # Last row for a date wins. The source posts several updates a day and
        # lists them in order, so the final one is the day's settled rate — and
        # it is the one their own published record high agrees with. Keeping the
        # first would quietly report every day's opening quote instead.
        rows[date] = {'date': date, 'values': {'22k': v22, '24k': v24}}

    if not rows:
        raise ValueError(f'no rows parsed for {year}-{month:02d}; source markup changed')
    return [rows[d] for d in sorted(rows)]


def fetch_month(year: int, month: int) -> list[dict]:
    url = f'{BASE}/daily-gold-prices-{MONTHS[month - 1]}-{year}/'
    for attempt in range(MAX_RETRIES):
        try:
            return parse_month(fetch(url), year, month)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return []          # month not published — a real gap, not an error
            if attempt == MAX_RETRIES - 1:
                raise SystemExit(f'giving up on {url}: HTTP {e.code}')
            time.sleep(2 ** attempt)
        except urllib.error.URLError as e:
            if attempt == MAX_RETRIES - 1:
                raise SystemExit(f'giving up on {url}: {e.reason}')
            time.sleep(2 ** attempt)
    return []


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--full', action='store_true')
    ap.add_argument('--from', dest='from_year', type=int)
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    existing: dict[str, dict] = {}
    if OUT.exists() and not args.full:
        for p in json.loads(OUT.read_text())['points']:
            existing[p['date']] = p

    start = FIRST_YEAR if args.full else (
        args.from_year or (now.year if existing else FIRST_YEAR))

    for year in range(start, now.year + 1):
        for month in range(1, 13):
            if year == now.year and month > now.month:
                break
            for row in fetch_month(year, month):
                existing[row['date']] = row
            print(f'  {year}-{month:02d}  {len(existing)} points', flush=True)
            time.sleep(THROTTLE_SECONDS)

    if not existing:
        raise SystemExit('refusing to write an empty series')

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        'source': SOURCE,
        'sourceUrl': f'{BASE}/daily-gold-prices/',
        'scrapedAt': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'baseUnit': 'gram',
        'points': [existing[d] for d in sorted(existing)],
    }, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'wrote {OUT} — {len(existing)} points')


if __name__ == '__main__':
    main()
