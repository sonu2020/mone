# MediaOne Component Stock

Complete inventory of custom Astro components in `src/components/`, their usage across
pages, and the **internal component marker** (`mc`) that flags custom components in
rendered output. Generated 2026-08-11 from source imports + a production build.

## Stock summary

- Components: **132** total — **125** live, **7** orphaned (never imported)
- Pages: **55** under `src/pages/`
- Pages with the marker applied (build-verified): **285** of 292 built `index.html` files

## The `mc` marker

Every live component stamps its **root element** with the single class `mc` (MediaOne
Component). It is an inert audit hook, **off by default**: no CSS attaches to `.mc`
unless the debug class `.mc-outline` sits on `<html>`.

```css
/* src/styles/app.css */
.mc-outline .mc {
  outline: 1px dashed var(--color-azure);
  outline-offset: -1px;
}
```

### Turning it on / off

| Switch | Effect |
|---|---|
| `PUBLIC_MC_OUTLINE=true npm run build` (or `astro dev`) | Layout.astro adds `mc-outline` to `<html>`; every custom component root gets a dashed azure outline |
| Unset the env var (default) | Marker inert — the class ships in HTML but nothing renders |
| Delete the `.mc-outline` block from `app.css` | Marker styles leave the shipped CSS entirely |

Exempt by design: `MapBase` (renders nothing — a script-only loader), `DesignShell` (its
root is the Layout page shell), and the orphaned components below (never render).

## Orphaned components (never imported — do not extend, remove deliberately)

| Component | Notes |
|---|---|
| `BrandedShelf`, `Header`, `HeaderFlat`, `Sidebar`, `VideoSubNav` | Legacy header/shelf variants replaced by `nav/HeaderBar` + the /home4 shelf system |
| `MustWatchShelf` | No importer; superseded by `news/` shelf set |
| `ThemeSelector` | Archived per AGENTS.md — intentionally not wired |

## Inventory by directory (live, 125)

### `components/(root)/`

`AdSlot`, `ArticleCard`, `ArticleList`, `BreakingTicker`, `CardGrid`, `DummyImage`, `FeaturedCard`, `Footer`, `LayoutSwitcher`, `Logo`, `MediaPlayer`, `OldHeader`, `PhotoGallery`, `Placeholder`, `SectionBlock`, `SectionHeader`, `ShortsShelf`, `ShowViewer`, `VideoEmbed`, `VideoModal`

### `components/ads/`

`StickyFooterAd`

### `components/channels/`

`ChannelBand`

### `components/design/`

`BandBlueprint`, `Blueprint`, `DesignShell`, `Rule`, `SkCell`, `SkImg`, `SkText`, `Split`

### `components/desk/`

`DeskMasthead`, `DeskPage`, `DeskRail`, `LegacyDeskPage`

### `components/home/`

`HomeAlJazeera`, `HomeBBC`, `HomeBBC3Col`, `HomeGuardian`, `HomeIdeal`, `HomeMagazine`, `HomeModular`, `HomeNYT`, `HomeSky`

### `components/home4/`

`Art`, `BandHeading`, `FeatureBand`, `LeadPackage`, `ListBand`, `OnAirNow`, `OpinionBand`, `ProgramBand`, `ShelfBand`, `SplitBand`, `ThumbRow`, `TopicStrip`, `VideoBand`

### `components/journey/`

`JourneyStage`

### `components/kitchen/`

`Spec`

### `components/live/`

`ScheduleList`

### `components/map/`

`MapBase`, `PinMap`

### `components/nav/`

`HeaderBar`, `MegaPanel`, `SectionSubNav`, `SubNavBar`

### `components/news/`

`AsymmetricShelf`, `CategoryColumnsShelf`, `EditorialShelf`, `FeaturedBand`, `NumberedList`, `OverlayStory`, `PromoGrid`, `SectionColumn`, `ShortsRail`, `StoryCard`, `StoryLink`, `StoryList`, `StoryListItem`, `StoryRow`, `Timeline`, `TopVideosShelf`, `VideoCard`, `VideoFeature`, `VideoGrid`, `VideoHero`, `VideoPlayer`, `VideoThumb`

### `components/price/`

`PriceChart`, `PriceDesk`, `PriceStoryRail`

### `components/programs/`

`EpisodeCard`, `ProgramBrowser`, `ProgramCard`

### `components/shelf/`

`ShelfFigure`, `ShelfIndexRow`, `ShelfMasthead`, `ShelfNarrative`, `ShelfSectionHead`

### `components/story/`

`StoryArticle`

### `components/terrain/`

`TerrainStage`

### `components/travel/`

`ImmersiveBar`, `InlineMap`, `RouteMap`, `StoryBlocks`, `TrekList`

### `components/ui/`

`Badge`, `Bi`, `Duration`, `Headline`, `Kicker`, `Media`, `MetaRow`, `PlayButton`, `Pulse`, `SectionHeading`

### `components/v3/`

`ClusterDuo`, `HeroSection`, `LatestSection`, `LiveBar`, `MoreSection`, `PhotoSection`, `ShelfSection`, `ShortsSection`, `VideoSection`

### `components/videos/`

`ProgramFeed`

## Pages and the components they use (direct imports)

| Page | Direct components |
|---|---|
| `layouts/Layout.astro` | `AdSlot` |
| `pages/[section].astro` | `BandHeading`, `ChannelBand`, `DeskPage`, `Footer`, `HeaderBar`, `LegacyDeskPage`, `OldHeader`, `ScheduleList`, `SectionSubNav`, `TrekList`, `VideoModal` |
| `pages/[section]/[sub].astro` | `DeskPage`, `Footer`, `HeaderBar`, `ScheduleList`, `SectionSubNav`, `VideoModal` |
| `pages/[section]/page/[n].astro` | `DeskPage`, `Footer`, `HeaderBar`, `ScheduleList`, `SectionSubNav`, `VideoModal` |
| `pages/about-us.astro` | `Footer`, `HeaderBar` |
| `pages/alt.astro` | `Footer`, `NumberedList`, `OldHeader`, `PromoGrid`, `SectionColumn`, `SectionHeading`, `StoryCard` |
| `pages/blah.astro` | `Footer`, `Headline`, `Kicker`, `Media`, `OldHeader` |
| `pages/breaking.astro` | `AdSlot`, `FeaturedBand`, `Footer`, `HeaderBar`, `NumberedList`, `OverlayStory`, `PhotoGallery`, `PromoGrid`, `Pulse`, `SectionColumn`, `SectionHeading`, `StoryCard`, `StoryList`, `Timeline` |
| `pages/contact-us.astro` | `Footer`, `HeaderBar` |
| `pages/demo/fonts.astro` | `DeskPage`, `Footer`, `HeaderBar` |
| `pages/design/archive.astro` | `AsymmetricShelf`, `CategoryColumnsShelf`, `DesignShell`, `EditorialShelf`, `OverlayStory`, `Spec`, `StoryCard`, `StoryList` |
| `pages/design/components.astro` | `ArticleCard`, `ArticleList`, `BreakingTicker`, `CardGrid`, `DesignShell`, `EditorialShelf`, `FeaturedCard`, `PhotoGallery`, `SectionBlock`, `SectionHeader` |
| `pages/design/index.astro` | `DesignShell` |
| `pages/design/kitchen.astro` | `Art`, `AsymmetricShelf`, `Badge`, `BandHeading`, `CategoryColumnsShelf`, `DesignShell`, `EditorialShelf`, `FeatureBand`, `Headline`, `Kicker`, `LeadPackage`, `ListBand`, `Media`, `MetaRow`, `NumberedList`, `OpinionBand`, `OverlayStory`, `ProgramBand`, `PromoGrid`, `Pulse`, `SectionHeading`, `ShelfBand`, `ShortsRail`, `Spec`, `SplitBand`, `StoryCard`, `StoryLink`, `StoryList`, `ThumbRow`, `Timeline`, `TopVideosShelf`, `VideoCard`, `VideoFeature`, `VideoGrid`, `VideoHero`, `VideoPlayer`, `VideoThumb` |
| `pages/design/layout.astro` | `BandBlueprint`, `Blueprint`, `DesignShell`, `Rule`, `SkCell`, `Split` |
| `pages/design/system.astro` | `AdSlot`, `AsymmetricShelf`, `Badge`, `CategoryColumnsShelf`, `DesignShell`, `EditorialShelf`, `Headline`, `Kicker`, `Media`, `MetaRow`, `NumberedList`, `OverlayStory`, `Placeholder`, `StoryCard`, `StoryList`, `StoryListItem`, `TopVideosShelf` |
| `pages/design/terrain-journey.astro` | `DesignShell`, `JourneyStage` |
| `pages/features/gold-price.astro` | `Footer`, `PriceChart`, `PriceDesk`, `PriceStoryRail` |
| `pages/features/kerala-floods-2018.astro` | `BandHeading`, `Footer`, `ImmersiveBar`, `PinMap`, `TerrainStage` |
| `pages/features/rivers-of-kerala.astro` | `Footer`, `ImmersiveBar`, `JourneyStage`, `PinMap` |
| `pages/features/thamarassery-churam.astro` | `Footer`, `ImmersiveBar`, `JourneyStage`, `PinMap` |
| `pages/features/wayanad-slide.astro` | `BandHeading`, `Footer`, `ImmersiveBar`, `PinMap`, `TerrainStage` |
| `pages/food-map.astro` | `Bi`, `DeskMasthead`, `Footer`, `HeaderBar`, `PinMap` |
| `pages/gulf/[country].astro` | `ArticleCard`, `ArticleList`, `CardGrid`, `Footer`, `HeaderBar`, `SectionBlock`, `SectionHeader` |
| `pages/home/[variant].astro` | `Footer`, `HomeAlJazeera`, `HomeBBC`, `HomeBBC3Col`, `HomeGuardian`, `HomeIdeal`, `HomeMagazine`, `HomeModular`, `HomeNYT`, `HomeSky`, `LayoutSwitcher`, `OldHeader` |
| `pages/home/index.astro` | — (none; Layout or raw HTML only) |
| `pages/index.astro` | `AdSlot`, `FeatureBand`, `Footer`, `HeaderBar`, `LeadPackage`, `OpinionBand`, `ScheduleList`, `ShelfBand`, `SplitBand`, `VideoBand`, `VideoModal` |
| `pages/investor-care.astro` | `Footer`, `HeaderBar` |
| `pages/latest-news.astro` | `DeskPage`, `Footer`, `HeaderBar`, `ScheduleList`, `SectionSubNav`, `VideoModal` |
| `pages/latest-news/page/[n].astro` | `DeskPage`, `Footer`, `HeaderBar`, `ScheduleList`, `SectionSubNav`, `VideoModal` |
| `pages/live.astro` | `Footer`, `HeaderBar`, `SectionSubNav` |
| `pages/magazine.astro` | `ArticleCard`, `Footer`, `HeaderBar`, `SectionHeader`, `SectionSubNav` |
| `pages/magazine/[slug].astro` | `Footer`, `HeaderBar`, `SectionSubNav`, `StickyFooterAd` |
| `pages/new.astro` | `Footer`, `OldHeader` |
| `pages/old-home.astro` | `Footer`, `HomeModular`, `OldHeader` |
| `pages/old-latest-news.astro` | `ArticleCard`, `ArticleList`, `CardGrid`, `Footer`, `OldHeader`, `SectionBlock`, `SectionHeader` |
| `pages/old-section/[section].astro` | `Footer`, `LegacyDeskPage`, `OldHeader`, `SectionSubNav` |
| `pages/old-shelf.astro` | `BandHeading`, `DeskMasthead`, `Footer`, `HeaderBar`, `SubNavBar` |
| `pages/our-team.astro` | `Footer`, `HeaderBar` |
| `pages/player-lab.astro` | `MediaPlayer` |
| `pages/privacy-policy.astro` | `Footer`, `HeaderBar` |
| `pages/programs/[slug].astro` | `Footer`, `HeaderBar`, `ProgramCard`, `SectionHeader`, `SectionSubNav`, `ShowViewer`, `StickyFooterAd` |
| `pages/programs/index.astro` | `EpisodeCard`, `Footer`, `HeaderBar`, `ProgramCard`, `SectionHeader`, `SectionSubNav` |
| `pages/shelf/[slug].astro` | `ArticleCard`, `Footer`, `HeaderBar`, `SectionBlock`, `SubNavBar` |
| `pages/shelf/index.astro` | `Footer`, `HeaderBar`, `ShelfFigure`, `ShelfIndexRow`, `ShelfMasthead`, `ShelfNarrative`, `ShelfSectionHead`, `SubNavBar` |
| `pages/slide.astro` | — (none; Layout or raw HTML only) |
| `pages/story/[slug].astro` | `Footer`, `HeaderBar`, `SectionSubNav`, `StickyFooterAd`, `StoryArticle` |
| `pages/tech.astro` | `Footer`, `HeaderBar` |
| `pages/terms-and-conditions.astro` | `Footer`, `HeaderBar` |
| `pages/travel/[trek].astro` | `BandHeading`, `Footer`, `ImmersiveBar`, `JourneyStage`, `Media`, `RouteMap`, `ScheduleList`, `StoryBlocks`, `VideoModal` |
| `pages/v3.astro` | `AdSlot`, `ClusterDuo`, `Footer`, `HeroSection`, `LatestSection`, `LiveBar`, `MoreSection`, `OldHeader`, `PhotoSection`, `ShelfSection`, `ShortsSection`, `VideoSection` |
| `pages/videos/index.astro` | `BandHeading`, `DeskMasthead`, `Footer`, `HeaderBar`, `ProgramBrowser`, `ProgramFeed`, `SectionSubNav`, `ShortsShelf`, `VideoModal` |
| `pages/videos/shows.astro` | `DeskMasthead`, `DummyImage`, `Footer`, `HeaderBar`, `SectionSubNav` |
| `pages/videos/shows/[slug].astro` | `DeskMasthead`, `DummyImage`, `Footer`, `HeaderBar`, `SectionHeader`, `SectionSubNav`, `ShowViewer` |
| `pages/videos/watch/[slug].astro` | `DeskMasthead`, `Footer`, `HeaderBar`, `SectionSubNav`, `VideoEmbed` |

## Pages with the marker applied (build-verified)

285 of 292 built pages render at least one `mc`-marked custom
component. The 7 that do not are Astro redirect stubs (`/system`, `/components`, `/kitchen`,
`/kitchen/archive`, `/home4`, `/home`) and `/slide` — the pitch deck renders raw HTML under
Layout with `topAd={false}` and zero custom components.

- `about-us` (8 markers)
- `agriculture` (42 markers)
- `alt` (115 markers)
- `analysis` (51 markers)
- `auto` (42 markers)
- `blah` (27 markers)
- `breaking` (205 markers)
- `business` (49 markers)
- `business/gold-rates` (34 markers)
- `business/gulf` (34 markers)
- `business/markets` (34 markers)
- `business/personal-finance` (34 markers)
- `business/sme` (34 markers)
- `business/startups` (34 markers)
- `contact-us` (8 markers)
- `crime` (48 markers)
- `demo/malini` (80 markers)
- `design` (1 markers)
- `design/archive` (140 markers)
- `design/components` (101 markers)
- `design/kitchen` (443 markers)
- `design/layout` (209 markers)
- `design/system` (152 markers)
- `design/terrain-journey` (1 markers)
- `education` (45 markers)
- `entertainment` (70 markers)
- `entertainment/box-office` (34 markers)
- `entertainment/mollywood` (34 markers)
- `entertainment/ott` (34 markers)
- `entertainment/page/2` (37 markers)
- `entertainment/reviews` (34 markers)
- `eyecatcher` (44 markers)
- `face-to-face` (42 markers)
- `features/gold-price` (7 markers)
- `features/kerala-floods-2018` (7 markers)
- `features/rivers-of-kerala` (6 markers)
- `features/thamarassery-churam` (6 markers)
- `features/wayanad-slide` (7 markers)
- `food-map` (158 markers)
- `gulf` (67 markers)
- `gulf/bahrain` (33 markers)
- `gulf/kuwait` (33 markers)
- `gulf/oman` (33 markers)
- `gulf/page/2` (46 markers)
- `gulf/qatar` (33 markers)
- `gulf/saudi-arabia` (33 markers)
- `gulf/uae` (33 markers)
- `health` (49 markers)
- `health/doctors-corner` (34 markers)
- `health/family-health` (34 markers)
- `health/medical-news` (34 markers)
- `health/nutrition` (34 markers)
- `health/preventive-care` (34 markers)
- `home/aljazeera` (16 markers)
- `home/bbc` (22 markers)
- `home/bbc-3col` (22 markers)
- `home/guardian` (15 markers)
- `home/ideal` (115 markers)
- `home/magazine` (237 markers)
- `home/modular` (233 markers)
- `home/nyt` (17 markers)
- `home/sky` (13 markers)
- `index.html` (208 markers)
- `india` (63 markers)
- `investor-care` (8 markers)
- `kerala` (85 markers)
- `kerala/page/2` (52 markers)
- `latest-news` (84 markers)
- `latest-news/page/10` (58 markers)
- `latest-news/page/11` (58 markers)
- `latest-news/page/12` (58 markers)
- `latest-news/page/13` (58 markers)
- `latest-news/page/14` (52 markers)
- `latest-news/page/2` (58 markers)
- `latest-news/page/3` (58 markers)
- `latest-news/page/4` (55 markers)
- `latest-news/page/5` (58 markers)
- `latest-news/page/6` (58 markers)
- `latest-news/page/7` (58 markers)
- `latest-news/page/8` (58 markers)
- `latest-news/page/9` (58 markers)
- `life-story` (44 markers)
- `lifestyle` (42 markers)
- `live` (11 markers)
- `magazine` (11 markers)
- `magazine/article-ksrtc-free-travel-326957` (14 markers)
- `magazine/ayodhya-ram-mandir-donation-scam-329589` (14 markers)
- `magazine/buddha-purnima-analysis-322500` (14 markers)
- `magazine/cockroach-janta-political-partys-rise-reflects-youth-anger-in-india-325709` (14 markers)
- `magazine/mediascan-latest-issue-328205` (14 markers)
- `magazine/voters-list-and-passport-328638` (14 markers)
- `new` (7 markers)
- `old-home` (233 markers)
- `old-latest-news` (254 markers)
- `old-section/agriculture` (23 markers)
- `old-section/analysis` (35 markers)
- `old-section/auto` (23 markers)
- `old-section/business` (31 markers)
- `old-section/crime` (31 markers)
- `old-section/education` (27 markers)
- `old-section/entertainment` (35 markers)
- `old-section/eyecatcher` (26 markers)
- `old-section/face-to-face` (23 markers)
- `old-section/gulf` (42 markers)
- `old-section/health` (31 markers)
- `old-section/india` (46 markers)
- `old-section/kerala` (56 markers)
- `old-section/life-story` (26 markers)
- `old-section/lifestyle` (23 markers)
- `old-section/magazine` (30 markers)
- `old-section/politics` (35 markers)
- `old-section/sports` (37 markers)
- `old-section/tech` (23 markers)
- `old-section/travel` (23 markers)
- `old-section/world` (37 markers)
- `old-shelf` (18 markers)
- `our-team` (8 markers)
- `player-lab` (16 markers)
- `politics` (51 markers)
- `politics/assembly` (34 markers)
- `politics/elections` (34 markers)
- `politics/kerala` (34 markers)
- `politics/national` (34 markers)
- `politics/policy` (34 markers)
- `privacy-policy` (8 markers)
- `programs` (36 markers)
- `programs/ajimshow` (22 markers)
- `programs/deshantharam` (22 markers)
- `programs/editorstake` (22 markers)
- `programs/film-interview` (22 markers)
- `programs/media-scan` (22 markers)
- `programs/mid-east-hour` (22 markers)
- `programs/news-at-1` (22 markers)
- `programs/nilapadu` (22 markers)
- `programs/out-of-focus` (22 markers)
- `programs/saudi-story` (22 markers)
- `programs/special-edition` (22 markers)
- `programs/stethoscope` (22 markers)
- `programs/weekend-arabia` (22 markers)
- `programs/world-with-us` (22 markers)
- `shelf` (46 markers)
- `shelf/analysis` (11 markers)
- `shelf/art-and-literature` (11 markers)
- `shelf/column` (11 markers)
- `shelf/comrade-vs-achuthanandan-is-my-co-star-adam-ayub-299176` (23 markers)
- `shelf/concepts-that-revived-the-arabic-language-313364` (23 markers)
- `shelf/cristiano-ronaldo-never-write-him-off-327442` (23 markers)
- `shelf/feminichi-fathima-director-fasil-muhammed-interview-305459` (23 markers)
- `shelf/forms-of-resistance-the-sculptures-of-haseena-suresh-322824` (23 markers)
- `shelf/fyugp-a-new-chapter-in-higher-education-or-a-new-challenge-for-students-327077` (23 markers)
- `shelf/hala-al-khatib-is-an-english-literature-student-from-gaza-288931` (23 markers)
- `shelf/interview` (11 markers)
- `shelf/interview-engandiyoor-chandrasekharan-288721` (23 markers)
- `shelf/interview-with-shooba-ks-about-his-new-drama-283159` (23 markers)
- `shelf/invisible-lives-undiscussed-women-work-sector-in-kerala-media-one-shelf-325841` (23 markers)
- `shelf/karinji-movie-director-sheethal-ns-interview-301050` (23 markers)
- `shelf/life-story` (11 markers)
- `shelf/maqamat-marking-the-beauty-of-language-310403` (23 markers)
- `shelf/media-scan-latest-episode-327683` (23 markers)
- `shelf/pennum-porattum-changing-the-beauty-standards-of-the-cinematic-visuals-315290` (23 markers)
- `shelf/pep-guardiola-jurgen-klopp-football-premier-league-325782` (23 markers)
- `shelf/pep-guardiola-master-of-the-masters-324818` (23 markers)
- `shelf/podcast` (11 markers)
- `shelf/rima-has-put-in-the-effort-of-getting-paid-for-three-films-not-many-people-have-used-her-as-an-actor-sajin-babu-speaks-303110` (23 markers)
- `shelf/should-sir-india-live-or-die-327553` (23 markers)
- `shelf/story-about-nadibalam-randathani-325997` (23 markers)
- `shelf/the-waqf-amendment-bill-eliminates-the-concept-of-waqf-285221` (23 markers)
- `shelf/videos` (11 markers)
- `shelf/vincius-jnior-life-story-327688` (23 markers)
- `shelf/vinicius-jr-life-story-and-politics-275566` (23 markers)
- `shelf/war-in-arabic-literature-321251` (23 markers)
- `shelf/who-is-the-strategist-mo-bopath-who-changed-the-course-of-bangalore-325596` (23 markers)
- `sports` (70 markers)
- `sports/cricket` (39 markers)
- `sports/football` (36 markers)
- `sports/isl-ipl` (34 markers)
- `sports/world` (34 markers)
- `story/aamir-khan-film` (40 markers)
- `story/africa-food-crisis` (40 markers)
- `story/agriculture-drone` (37 markers)
- `story/alappuzha-boat` (40 markers)
- `story/alternative-education` (40 markers)
- `story/asian-games-india` (40 markers)
- `story/australia-floods` (40 markers)
- `story/australia-wins` (40 markers)
- `story/bahrain-malayali` (40 markers)
- `story/china-taiwan` (40 markers)
- `story/crop-disease-alert` (37 markers)
- `story/dam-siltation` (40 markers)
- `story/dileesh-pothan` (40 markers)
- `story/electric-car-sales` (37 markers)
- `story/ernakulam-accident` (40 markers)
- `story/eu-climate` (40 markers)
- `story/farmer-protest` (40 markers)
- `story/farmer-subsidy` (37 markers)
- `story/fashion-trends` (37 markers)
- `story/fifa-2026-india` (40 markers)
- `story/flight-fares-drop` (37 markers)
- `story/g7-summit` (40 markers)
- `story/gold-price-record` (40 markers)
- `story/gold-smuggling` (40 markers)
- `story/gopi-sundar` (40 markers)
- `story/gst-collection` (40 markers)
- `story/idukki-coffee` (40 markers)
- `story/india-ireland-odi` (40 markers)
- `story/india-uae-trade` (40 markers)
- `story/indian-football-rise` (37 markers)
- `story/ipl-2026-final` (40 markers)
- `story/ips-shrikumar` (40 markers)
- `story/isro-venus` (40 markers)
- `story/kannur-food` (38 markers)
- `story/kasargod-tourism` (40 markers)
- `story/kerala-blasters` (40 markers)
- `story/kochi-crime` (39 markers)
- `story/kochi-metro` (40 markers)
- `story/korea-peace` (40 markers)
- `story/kozhikode-bridge` (40 markers)
- `story/kuwait-construction` (40 markers)
- `story/malappuram-career` (40 markers)
- `story/malayali-students-abroad` (38 markers)
- `story/mammootty-film` (40 markers)
- `story/mohanlal-jeethu` (40 markers)
- `story/motor-vehicle-act` (37 markers)
- `story/new-bus-terminals` (37 markers)
- `story/new-restaurants` (37 markers)
- `story/oman-investment` (40 markers)
- `story/ott-release` (40 markers)
- `story/pala-election` (40 markers)
- `story/palakkad-hospital` (40 markers)
- `story/parliament-session` (40 markers)
- `story/pathanamthitta-hospital` (40 markers)
- `story/popular-travel-destinations` (37 markers)
- `story/pv-sindhu-ranking` (40 markers)
- `story/qatar-development` (40 markers)
- `story/qatar-labour-law` (40 markers)
- `story/railway-budget` (40 markers)
- `story/rain-alert` (40 markers)
- `story/sabarimala-traffic` (40 markers)
- `story/saudi-visa` (40 markers)
- `story/saudi-visa-policy` (40 markers)
- `story/sleep-health` (37 markers)
- `story/temple-theft` (39 markers)
- `story/thrissur-temple` (40 markers)
- `story/trivandrum-water` (40 markers)
- `story/uae-flights` (40 markers)
- `story/vote-buying` (40 markers)
- `tech` (8 markers)
- `terms-and-conditions` (8 markers)
- `travel` (47 markers)
- `travel/agasthyakoodam` (30 markers)
- `travel/budget` (34 markers)
- `travel/guides` (34 markers)
- `travel/kodachadri` (40 markers)
- `travel/kumara-parvatha` (41 markers)
- `travel/meesapulimala` (29 markers)
- `travel/stories` (34 markers)
- `travel/vlogs` (34 markers)
- `v3` (374 markers)
- `videos` (108 markers)
- `videos/shows` (21 markers)
- `videos/shows/analysis` (23 markers)
- `videos/shows/eyecatcher` (23 markers)
- `videos/shows/face-to-face` (25 markers)
- `videos/shows/gulf-chronicle` (23 markers)
- `videos/shows/health-matters` (23 markers)
- `videos/shows/life-story` (24 markers)
- `videos/shows/magazine` (23 markers)
- `videos/shows/special-report` (22 markers)
- `videos/shows/sports-review` (23 markers)
- `videos/watch/yt--WGXg4-2bTk` (12 markers)
- `videos/watch/yt-189804av2W8` (12 markers)
- `videos/watch/yt-4B9pqFW0nRM` (12 markers)
- `videos/watch/yt-I_IunvAVYNk` (12 markers)
- `videos/watch/yt-KCMMCvrSnzY` (12 markers)
- `videos/watch/yt-OkF7APAHwbs` (12 markers)
- `videos/watch/yt-Tr3Wr40Z6TQ` (12 markers)
- `videos/watch/yt-V32YtRVB1_g` (12 markers)
- `videos/watch/yt-Wq_RAGOgMuA` (12 markers)
- `videos/watch/yt-jeHILGPRNJw` (12 markers)
- `videos/watch/yt-lvDoIfhkJW8` (12 markers)
- `videos/watch/yt-rY1kd5wYeKQ` (12 markers)
- `videos/watch/yt-rr9S8rMRsFo` (12 markers)
- `videos/watch/yt-sQJoM7RYmVE` (12 markers)
- `videos/watch/yt-vXi57M7Rdp0` (12 markers)
- `world` (69 markers)

## Keeping this stock current

- **Marker placement rule:** a component's root element carries `mc`; conditional/fragment
  roots carry it on every branch. New components should follow the same rule.
- The usage map above is derivable from source: `import … from '<rel>/components/*.astro'`.
  The applied list is ground truth from a production build (`dist/**/index.html`).
