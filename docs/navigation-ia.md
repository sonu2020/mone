# Navigation IA

The top-level menu, submenus and trending strip for the MediaOne header.
Implemented by `src/lib/mega-nav.ts` → `src/components/nav/*` → `src/components/Header.astro`.

Keep this file and `mega-nav.ts` in step: the doc is the agreed structure, the module
is the typed source the components read.

## Top level

`Home · News · Politics · Gulf · Business · Health · ShowMall · Sports · Destination · Shows & Live · More`

Home is a plain link. Every other item opens a mega panel.

## Submenus

### 1. News → `/kerala`
| Item | Route |
|---|---|
| Kerala | `/kerala` |
| National | `/india` |
| International | `/world` |
| Fact Check | `/fact-check` * |

### 2. Politics → `/politics`
| Item | Route |
|---|---|
| Kerala Politics | `/politics/kerala` * |
| National Politics | `/politics/national` * |
| Political Analysis & Opinion | `/analysis` |
| Elections & Poll Watch | `/politics/elections` * |
| Assembly & Parliament | `/politics/assembly` * |
| Policy & Governance | `/politics/policy` * |

### 3. Gulf → `/gulf`
| Item | Route |
|---|---|
| UAE | `/gulf/uae` |
| Saudi Arabia | `/gulf/saudi-arabia` |
| Qatar | `/gulf/qatar` |
| Kuwait | `/gulf/kuwait` |
| Oman | `/gulf/oman` |
| Bahrain | `/gulf/bahrain` |

### 4. Business → `/business`
| Item | Route |
|---|---|
| Markets & Stocks (Sensex, Nifty) | `/business/markets` * |
| Gulf Business & Real Estate | `/business/gulf` * |
| Personal Finance & Mutual Funds | `/business/personal-finance` * |
| Startups & Entrepreneurship | `/business/startups` * |
| SMEs & Business Guides | `/business/sme` * |
| Gold Rates & Currency | `/business/gold-rates` * |

### 5. Health → `/health`
| Item | Route |
|---|---|
| Medical News & Research | `/health/medical-news` * |
| Lifestyle & Preventive Care | `/health/preventive-care` * |
| Pediatrics & Family Health | `/health/family-health` * |
| Nutrition & Fitness | `/health/nutrition` * |
| Doctor's Corner & Expert Columns | `/health/doctors-corner` * |

### 6. ShowMall → `/entertainment`
| Item | Route |
|---|---|
| Mollywood | `/entertainment/mollywood` * |
| Movie Reviews | `/entertainment/reviews` * |
| Box Office & Other Languages | `/entertainment/box-office` * |
| OTT Releases | `/entertainment/ott` * |
| Celebrity Interviews & Features | `/face-to-face` |

### 7. Sports → `/sports`
| Item | Route |
|---|---|
| Football | `/sports/football` * |
| Cricket | `/sports/cricket` * |
| ISL & IPL | `/sports/isl-ipl` * |
| World Sports | `/sports/world` * |

### 8. Destination → `/travel`
| Item | Route |
|---|---|
| Travel Guides & Spots | `/travel/guides` * |
| Destination Stories | `/travel/stories` * |
| Travel Vlogs & Visuals | `/travel/vlogs` * |
| Budget Travel & Tips | `/travel/budget` * |

### 9. Shows & Live → `/videos/shows`
| Item | Route |
|---|---|
| Live TV | `/live` |
| Prime Time Debates | `/videos/shows` |
| MediaOne Specials | `/programs` |
| Podcasts | `/videos/shows` |

### 10. More
| Item | Route |
|---|---|
| MediaOne Explained | `/shelf` |
| Tech & Gadgets | `/tech` |
| Automobile | `/auto` |
| Education & Career | `/education` |

`*` Route does not exist yet — the section landing pages are built from
`src/lib/sections.ts`, which currently covers `kerala, india, world, gulf, business,
health, entertainment, sports, politics, travel, tech, auto, education, crime,
lifestyle, magazine, analysis, agriculture, life-story, face-to-face, eyecatcher`.
Sub-routes need either new pages or a `[section]/[subsection]` route before launch.

## Trending strip

Sits under the nav bar, prefixed `TOPICS:`, pipe-separated:

`AssemblySession · IranConflict · Fact Check · Health Tips`

## Behaviour

- Panels open on hover and on keyboard focus; `Escape` closes and returns focus to the trigger.
- One panel open at a time; opening another closes the first.
- Below `lg` the bar collapses to a drawer — panels become accordions, since hover has no equivalent on touch.
- The bar is the MediaOne blue; panels are the card surface with hairline rules.
