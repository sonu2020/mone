"""Shared scraping helpers for mediaoneonline.com programme pages.

Used by scrape-program.py (one programme, in depth) and scrape-catalogue.py
(every programme, shallow). Everything here reads public pages — no API key.
"""

import html
import json
import re
import urllib.request
from datetime import datetime, timezone

SITE = 'https://www.mediaoneonline.com'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')
THROTTLE_SECONDS = 0.6
MALAYALAM = re.compile(r'[\u0d00-\u0d7f]')

# Attribute quoting on the live pages is inconsistent (single quotes on the lead
# card, double on the rail), so anchor on the one attribute always present —
# data-video-id — and read backwards for the link and title.
VID_RE = re.compile(r"""data-video-id=['"]([A-Za-z0-9_-]{11})['"]""")
ALT_RE = re.compile(r"""alt=['"](.*?)['"]\s""", re.S)
THUMB_RE = re.compile(r"""data-src=['"]([^'"]+)['"]""")
CRUMB_RE = re.compile(r'bread-current[^>]*>([^<]+)<')


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    return urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'replace')


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r'<[^>]+>', '', s)).strip()


def program_title(page: str) -> str | None:
    """The programme's display name, as the site's own breadcrumb spells it."""
    m = CRUMB_RE.search(page)
    return strip_tags(m.group(1)) if m else None


def parse_listing(page: str, slug: str) -> list[dict]:
    """Episode cards on a programme listing, in page order (newest first).

    Programme pages also carry sitewide "latest news" rails whose clips belong
    to other programmes — and whose timestamps are identical across pages.
    Linking to a /programs/<slug>/ article is the membership test, so those
    rails are excluded rather than silently inflating the programme.
    """
    href_re = re.compile(f"""href=['"](/programs/{re.escape(slug)}/[^'"\\s>]+)['"]""")
    found, seen = [], set()
    for m in VID_RE.finditer(page):
        vid = m.group(1)
        if vid in seen:
            continue
        seen.add(vid)
        before = page[max(0, m.start() - 2000):m.start()]
        hrefs = href_re.findall(before)
        if not hrefs:
            continue
        alts, thumbs = ALT_RE.findall(before), THUMB_RE.findall(before)
        found.append({
            'youtubeId': vid,
            'href': hrefs[-1],
            'listingTitle': strip_tags(alts[-1]) if alts else '',
            'siteThumbnail': thumbs[-1] if thumbs else '',
        })
    return found


# ─── YouTube watch pages ────────────────────────────────────────────────────

def yt_field(page: str, key: str) -> str | None:
    m = re.search(re.escape(key) + r'\\?"\s*:\s*\\?"?([^",\\]{0,120})', page)
    return m.group(1) if m else None


def enrich(episode: dict) -> dict:
    """Add the facts the listing does not carry: duration, views, upload time."""
    page = fetch(f"https://www.youtube.com/watch?v={episode['youtubeId']}")
    title = re.search(r'"title"\s*:\s*\{"simpleText"\s*:\s*"(.*?)"\s*\}', page)
    secs = yt_field(page, 'lengthSeconds')
    views = yt_field(page, 'viewCount')
    return {
        **episode,
        'ytTitle': json.loads('"%s"' % title.group(1)) if title else episode['listingTitle'],
        'durationSeconds': int(secs) if secs else None,
        'viewCount': int(views) if views else None,
        'uploadedAt': yt_field(page, 'uploadDate'),
        'channel': yt_field(page, 'ownerChannelName'),
        'channelId': yt_field(page, 'channelId'),
    }


# ─── Shaping ────────────────────────────────────────────────────────────────

def split_title(title: str) -> tuple[str, str]:
    """Titles run 'Malayalam hook | English summary | <Programme>'.

    Neither the listing nor the article pages carry a real standfirst, so that
    middle segment is the only English gloss an episode has — keep it as its
    own field rather than inventing a description.
    """
    parts = [p.strip() for p in title.split('|') if p.strip()]
    body = parts[:-1] if len(parts) > 1 else parts
    ml = next((p for p in body if MALAYALAM.search(p)), '')
    en = next((p for p in body if not MALAYALAM.search(p)), '')
    return ml, en


def utc_iso(value: str) -> str:
    return (datetime.fromisoformat(value).astimezone(timezone.utc)
            .isoformat().replace('+00:00', 'Z'))


def episode_record(e: dict) -> dict:
    """One enriched episode in the shape the site's JSON files store."""
    slug = e['href'].rsplit('/', 1)[-1]
    article_id = re.search(r'-(\d+)$', slug)
    title = e['ytTitle'] or e['listingTitle']
    ml, en = split_title(title)
    vid = e['youtubeId']
    return {
        'slug': slug,
        'articleId': article_id.group(1) if article_id else None,
        'youtubeId': vid,
        'title': title,
        'titleML': ml,
        'titleEn': en,
        'publishedAt': utc_iso(e['uploadedAt']),
        'durationSeconds': e['durationSeconds'],
        'viewCount': e['viewCount'],
        # `site` is the poster MediaOne serves in its own listing (500x300, and
        # heavily weighted); the ytimg variants are the same frame at sizes that
        # actually fit a playlist row and a 16:9 player.
        'thumbnail': {
            'site': e['siteThumbnail'],
            'small': f'https://i.ytimg.com/vi/{vid}/mqdefault.jpg',
            'large': f'https://i.ytimg.com/vi/{vid}/maxresdefault.jpg',
        },
        'href': SITE + e['href'],
    }
