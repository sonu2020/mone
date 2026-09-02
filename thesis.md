# MediaOne /v3 — Homepage Thesis

*A principal design engineer's brief for the next MediaOne homepage, synthesizing
decades of newsroom product work at the NYT, Guardian, BBC, and Al Jazeera into a
single Malayalam broadcaster's front page.*

---

## 1. The one idea

**MediaOne is a broadcaster that happens to publish on the web — not a newspaper.**
A newspaper homepage (NYT, Guardian) leads with *type* and divides the page with
rules, because print literacy is its inheritance. A broadcaster homepage leads with
*a live signal*: a pulse, a timestamp, a face, a still from the control room. The
page must feel like a control room you can read — calm, authoritative, and
*narrating the present tense*.

/v3 is built around that one idea. Everything else is discipline.

---

## 2. First principles (the rules I will not break)

1. **The signal first.** The most valuable real estate — the very top of the
   stream — answers one question: *what is happening right now?* A live bar, a
   pulsing dot, a hero still that is clearly a broadcast frame, a time-spine of
   updates. If the page is silent for a reader's first scroll, we have failed.
2. **Hierarchy is density, not chrome.** We do not reach for borders, boxes,
   shadows, or color to create importance. Importance is created by *size of type,
   size of image, and amount of space around a thing.* The lead is large and alone;
   the secondary is smaller and clustered; the archive is dense and text-only.
   This is the NYT lesson applied to a video-native product.
3. **One accent, used as a verb.** The MediaOne blue (`azure`, `#166bc0`) is the
   only chromatic accent and it is reserved for *actions and state*: eyebrows,
   the live signal, links, hover, the masthead rule. It never decorates. Red
   (`accent-red`) is reserved exclusively for *urgency* — breaking and live. Two
   accents, two meanings. No third.
4. **Hairlines, never shadows.** Elevation is conveyed by 1px `rule` dividers and
   surface contrast (`ivory` vs `ink`), the way Wired and the Guardian do it. A
   drop-shadow is a confession that the layout couldn't carry the hierarchy.
5. **Modular, KISS, maximally.** The homepage is *composition, not authoring.*
   Every section is a self-contained block that accepts data props and renders
   only from the design-system atoms and the news blocks. The page file is a thin
   conductor: it imports sections, passes data, inserts ad slots, and nothing else.
   Add a section = add one import + one tag. Remove a section = delete one tag.
6. **Type is the brand.** Anek Latin + Anek Malayalam, a metrically matched
   superfamily, Latin leading and Malayalam falling through per-glyph. There is no
   serif display face for Malayalam, so we do not pretend there is one — we make
   the sans carry display weight through *scale and weight contrast*, not through a
   borrowed serif. Letter-spacing only on Latin uppercase eyebrows; never on
   Malayalam.
7. **Time is a first-class citizen.** A broadcaster's currency is recency. Every
   story carries a timestamp; the live spine is the spine of the page; tabular-nums
   everywhere a number appears so the clock never jitters. The BBC/Sky lesson: make
   time *legible*, not decorative.
8. **The page is a rhythm, not a wall.** Sections breathe alternately: a dense
   multi-column package, then a single full-bleed band, then a quiet two-up, then a
   scroll-rail. This is the Guardian's structural breathing — it prevents the
   "endless grid fatigue" that flattens most news homepages into wallpaper.
9. **Restraint is the differentiator.** The temptation on a news homepage is to
   add: another ticker, another carousel, another badge, another gradient. The
   mature product subtracts. /v3 has exactly the sections it needs and not one more.

---

## 3. Information architecture — the stream

The page is a top-to-bottom *news stream* ordered by descending urgency and
expanding breadth. Each band is one modular component.

| # | Section | Component | Reader job answered |
|---|---------|----------|---------------------|
| 0 | **Live signal bar** | `LiveBar` | "What's happening right now?" — breaking + trending |
| 1 | **Lead package** | `HeroSection` | "What's the biggest story, with context?" |
| 2 | **Latest + Most read** | `LatestSection` | "What else is new, and what's everyone reading?" |
| 3 | **Editorial shelf** | `ShelfSection` | "What deserves my attention beyond the headlines?" |
| 4 | **Watch (broadcaster core)** | `VideoSection` | "Show me, don't just tell me." |
| 5 | **Shorts / Reels** | `ShortsSection` | "Give me the 40-second version." |
| 6 | **Kerala (home market)** | `ShelfSection` | "What's happening at home?" |
| 7 | **Gulf + India duo** | `ClusterDuo` | "The two diaspora beats, side by side." |
| 8 | **Entertainment + Sports duo** | `ClusterDuo` | "The two diversion beats, side by side." |
| 9 | **Photo story** | `PhotoSection` | "Show me the image of the day." |
| 10 | **More across MediaOne** | `MoreSection` | "Catch-all, the long tail." |

The order is deliberate and load-bearing:
- **Signal → lead → context** answers the first 5 seconds, 30 seconds, and 2
  minutes of a visit respectively.
- **Watch + Shorts** sit at the center because MediaOne is a TV brand — video is
  not a section, it is the *spine*.
- **Home market → diaspora → diversion → image → tail** broadens outward like ripples.

---

## 4. Composition rules (the how)

- **Grid:** a single `max-w-site` (80rem) canvas on `bg-bg-card`, with horizontal
  padding that steps `px-4 sm:px-6 lg:px-8`. Internal splits use a 12-col grid with
  `lg:gap-8` and vertical `rule` dividers between columns — the NYT broadsheet
  move. Never a 4-col wall of equal cards at the top; the top must *breathe*.
- **Section rhythm:** every section is separated by `border-t border-rule`, with
  `py-7 lg:py-10` vertical padding. The padding is the silence between sentences.
  Ad slots (`AdSlot`) are *also* structural — they sit between sections as full-width
  bands, not as injected rectangles, so they never interrupt a column.
- **Section identity:** the `SectionHeading` atom — Malayalam title with a 0.5px
  azure accent rule beneath, an English kicker beside it, and a right-aligned
  "View all →". One identity per section, consistent everywhere.
- **Image ratios:** heroes `16/9` (broadcast frame), cards `16/10` (editorial),
  list thumbs `1/1` (newspaper mug), shorts `9/16` (phone-native). Each ratio is a
  *convention*, not a choice — pick the one that matches the medium.
- **Hover:** the only motion that signals interactivity is a color shift to
  `azure` (text) and a `scale-[1.03]` on images over 700ms ease-out. Nothing animates
  layout. `prefers-reduced-motion` is globally honored.
- **Dark mode:** every token has a `.dark` variant. The page never hardcodes a
  color; it always reaches for `ink` / `ivory` / `rule` / `azure` / `text-primary`
  etc. Dark mode is not a feature, it is a *consequence of discipline*.

---

## 5. What /v3 deliberately does *not* do

- **No carousels.** A carousel is an admission that you couldn't decide what
  matters. We decide. The lead is the lead.
- **No "card nesting".** No card inside a card, no bordered box inside a bordered
  box. Hierarchy is type + space + hairline, full stop.
- **No gradients, no glassmorphism, no glow.** Image placeholders are flat tinted
  blocks. Overlays are a single bottom-up scrim on the hero, and only there.
- **No red outside breaking/live.** Red is a verb meaning *stop and read this now*.
  If it appears anywhere else, it has lost its meaning.
- **No third typeface.** Anek does everything. Adding Playfair or Inter would be
  importing a voice that has no Malayalam — it would fracture the per-glyph
  fallthrough that makes the superfamily work.
- **No bespoke section markup.** If a section can't be composed from the system's
  atoms + blocks, the system is wrong, not the section. /v3 proves the system by
  *only* composing it.

---

## 6. The proof

The deliverable is `src/pages/v3.astro` plus a set of self-contained section
components under `src/components/v3/`. The page file should read like a table of
contents: import, pass data, render. If you can understand the homepage's
information architecture by reading *only* the page file (never opening a
component), the architecture has succeeded. That is the bar.

   If a section doesn't earn its space by answering a reader need, it is not on the
   page.
