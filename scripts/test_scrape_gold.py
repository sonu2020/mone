"""Fixture test for the gold archive parser.

The parser reads someone else's markup, so it will break when they change it.
This test exists to make that break loud and local rather than silent — a
regex that stops matching yields an empty list, which would otherwise commit
as "no data for that month" and never be noticed.
"""

import unittest
from importlib.machinery import SourceFileLoader
from pathlib import Path

scrape_gold = SourceFileLoader(
    'scrape_gold', str(Path(__file__).parent / 'scrape-gold.py')).load_module()

FIXTURE = Path(__file__).parent / 'fixtures' / 'gold-january-2026.html'


class ParseMonthTest(unittest.TestCase):
    def setUp(self):
        self.rows = scrape_gold.parse_month(FIXTURE.read_text(), 2026, 1)

    def test_finds_a_row_for_most_days(self):
        self.assertGreaterEqual(len(self.rows), 28)

    def test_first_row_matches_the_published_table(self):
        self.assertEqual(self.rows[0]['date'], '2026-01-01')
        self.assertEqual(self.rows[0]['values']['22k'], 12380)
        self.assertEqual(self.rows[0]['values']['24k'], 13505)

    def test_dates_are_iso_and_ascending(self):
        dates = [r['date'] for r in self.rows]
        self.assertEqual(dates, sorted(dates))
        self.assertTrue(all(len(d) == 10 and d[4] == '-' for d in dates))

    def test_24k_is_always_dearer_than_22k(self):
        for r in self.rows:
            self.assertGreater(r['values']['24k'], r['values']['22k'], r['date'])

    def test_stores_per_gram_not_per_pavan(self):
        # The page carries both columns; only grams are stored, because a pavan
        # is exactly eight of them and two sources of truth eventually disagree.
        for r in self.rows:
            self.assertLess(r['values']['22k'], 50_000, r['date'])

    def test_last_update_of_a_day_wins(self):
        # The source posts several updates a day. The final one is the settled
        # rate, and the one their own published record high agrees with —
        # 22K peaked at Rs16,395/gram on 2026-01-29 (Rs1,31,160/pavan), which is
        # the *second* Jan 29 row on the page, not the first.
        jan29 = next(r for r in self.rows if r['date'] == '2026-01-29')
        self.assertEqual(jan29['values']['22k'], 16395)

    def test_picks_the_later_row_for_a_duplicated_date(self):
        page = (
            '<table>'
            '<tr><td>Jan 5</td><td>₹1,000</td><td>₹1,100</td></tr>'
            '<tr><td>Jan 5</td><td>₹2,000</td><td>₹2,200</td></tr>'
            '</table>'
        )
        rows = scrape_gold.parse_month(page, 2026, 1)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['values']['22k'], 2000)

    def test_unparseable_markup_raises_rather_than_returning_nothing(self):
        with self.assertRaises(ValueError):
            scrape_gold.parse_month('<html><body>no table</body></html>', 2026, 1)


if __name__ == '__main__':
    unittest.main()
