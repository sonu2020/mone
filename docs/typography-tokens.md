# 📊 MediaOne Typography System — 17 Tokens Research & Reference

This document provides a comprehensive research summary of the **17 living typography tokens** defined in `@theme` (`src/styles/app.css`, generated from `tokens/typography.json` — see [`TOKENS.md`](../TOKENS.md) for the build pipeline) for the **MediaOne Malayalam Newsroom Design System**.

---

## 📋 Master Tokens Table

| # | Token Name | Fluid Clamp Formula | Min → Max Size | Line Height | Weight | Key Utility Class | Primary Codebase Usages | Functional Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `--text-display` | `clamp(2.00rem, 1.636rem + 1.87vw, 3.50rem)` | **32px → 56px** | `1.06` | `700` | `@utility display-text` | `LsgDesk.astro`, `PriceDesk.astro` | Super-hero splash headers & election result counters |
| **2** | `--text-hero` | `clamp(1.50rem, 1.227rem + 1.40vw, 2.75rem)` | **24px → 44px** | `1.12` | `700` | `@utility hero-text` | `DesignShell.astro`, `PriceDesk.astro` | Page H1 titles on documentation & landing pages |
| **3** | `--text-title` | `clamp(1.31rem, 1.170rem + 0.58vw, 1.88rem)` | **21px → 30px** | `1.20` | `700` | `@utility article-title-lg` | `ShelfSectionHead.astro`, `ShelfNarrative.astro`, `live.astro` | Primary article titles & top-level shelf headers |
| **4** | `--text-section` | `clamp(1.19rem, 1.110rem + 0.33vw, 1.50rem)` | **19px → 24px** | `1.27` | `600` | `@utility section-header` | `PriceStoryRail.astro`, `MustWatchShelf.astro`, `Rule.astro` | Reusable H2 section block headers across pages |
| **5** | `--text-headline` | `clamp(0.88rem, 0.810rem + 0.27vw, 1.13rem)` | **14px → 18px** | `1.34` | `600` | `@utility article-title` | `FeaturedCard.astro`, `Sidebar.astro`, `Spec.astro` | Workhorse card titles in 2-up, 3-up, & 4-up story grids |
| **6** | `--text-lead` | `clamp(0.94rem, 0.880rem + 0.24vw, 1.19rem)` | **15px → 19px** | `1.62` | `400` | `@utility lead-text` | `LsgDesk.astro`, `breaking.astro`, `old-latest-news.astro` | Article standfirst / intro summary paragraph |
| **7** | `--text-body` | `clamp(0.88rem, 0.840rem + 0.15vw, 1.06rem)` | **14px → 17px** | `1.72` | `400` | `.article-body` | `StoryArticle.astro`, `ArticleBody.astro`, `PriceStoryRail.astro` | Long-form Malayalam article text (`Noto Sans Malayalam`) |
| **8** | `--text-meta` | `clamp(0.75rem, 0.730rem + 0.09vw, 0.81rem)` | **12px → 13px** | `1.50` | `500` | `@utility row-meta` | `Header.astro`, `PriceDesk.astro`, `LsgDesk.astro` | Timestamps, bylines, view counts, tabular data |
| **9** | `--text-nav` | `clamp(0.94rem, 0.900rem + 0.10vw, 1.06rem)` | **15px → 17px** | `1.30` | `600` | `@utility nav-text` | `HeaderFlat.astro`, `Header.astro` | Top bar navigation links & breaking badge text |
| **10** | `--text-eyebrow` | `clamp(0.69rem, 0.670rem + 0.07vw, 0.75rem)` | **11px → 12px** | `1.30` | `700` | `@utility eyebrow` | `PriceDesk.astro`, `PriceChart.astro`, `PriceStoryRail.astro` | Uppercase kicker tags (`letter-spacing: 0.11em`) |
| **11** | `--text-caption` | `clamp(0.69rem, 0.670rem + 0.07vw, 0.75rem)` | **11px → 12px** | `1.45` | `400` | `@utility caption-text` | `StoryArticle.astro`, `Sidebar.astro`, `PriceStoryRail.astro` | Image captions, photo credits, & fine print |
| **12** | `--text-category` | `clamp(1.75rem, 1.520rem + 1.02vw, 2.50rem)` | **28px → 40px** | `0.90` | `700` | `@utility category-label` | `app.css`, category landing pages | Malayalam display title banners (tight `lh: 0.90`) |
| **13** | `--text-body-small` | `clamp(0.75rem, 0.730rem + 0.09vw, 0.81rem)` | **12px → 13px** | `1.40` | `500` | `@utility body-small` | `blah.astro`, `alt.astro` | Compact card blurbs & sidebar teaser copy |
| **14** | `--text-deck` | `clamp(0.94rem, 0.905rem + 0.14vw, 1.03rem)` | **15px → 16.5px** | `1.28` | `550` | `@utility headline-deck` | `app.css`, homepage rail rows | Rail rows & grid cards in dense newsroom layout |
| **15** | `--text-feature` | `clamp(1.19rem, 1.100rem + 0.33vw, 1.38rem)` | **19px → 22px** | `1.23` | `600` | `@utility headline-feature` | `app.css`, shelf hero components | Shelf hero package headlines |
| **16** | `--text-lead-story` | `clamp(1.31rem, 1.210rem + 0.44vw, 1.56rem)` | **21px → 25px** | `1.28` | `550` | `@utility headline-lead` | `LeadPackage.astro`, `home.astro` | Homepage main hero cover story headline |
| **17** | `--text-band` | `clamp(1.13rem, 1.020rem + 0.44vw, 1.38rem)` | **18px → 22px** | `1.14` | `800` | `@utility band-label` | `DesignShell.astro`, section band labels | Uppercase Latin section markers (`wght: 800`) |

---

## 🔍 In-Depth Codebase Usages

### Tier 1: Standard Editorial Scale (13 Tokens)

### 1. `--text-display` (32px → 56px)
- **Line Height**: `1.06` | **Weight**: `700`
- **Code Locations**:
  - `src/components/lsg/LsgDesk.astro:L30`: Cover election header (`<h1 class="text-display">`)
  - `src/components/price/PriceDesk.astro:L53`: Live gold/currency ticker (`<p class="text-display tabular-nums">`)
  - `src/styles/app.css:L509`: Reusable `@utility display-text`
- **Purpose**: Super-hero splash titles and high-visibility statistical numbers.

### 2. `--text-hero` (24px → 44px)
- **Line Height**: `1.12` | **Weight**: `700`
- **Code Locations**:
  - `src/components/design/DesignShell.astro:L87`: Primary H1 title across all design system pages (`<h1 class="text-hero">`)
  - `src/components/price/PriceDesk.astro:L50`: Feature landing page H1 title (`<h1 class="text-hero">`)
  - `src/styles/app.css:L516`: Reusable `@utility hero-text`
- **Purpose**: Section landing page titles requiring prominent presence without consuming full display height.

### 3. `--text-title` (21px → 30px)
- **Line Height**: `1.20` | **Weight**: `700`
- **Code Locations**:
  - `src/components/shelf/ShelfSectionHead.astro:L29`: Major section headline (`<h2 class="text-title">`)
  - `src/components/shelf/ShelfNarrative.astro:L38`: Narrative lead title (`<h3 class="text-title">`)
  - `src/components/shelf/ShelfFigure.astro:L29`: Primary shelf titles (`article-title-lg sm:text-title`)
  - `src/pages/live.astro:L53`: Broadcast title header
- **Purpose**: Primary H1 title for story pages & prominent shelf package headers.

### 4. `--text-section` (19px → 24px)
- **Line Height**: `1.27` | **Weight**: `600`
- **Code Locations**:
  - `src/components/price/PriceStoryRail.astro:L41`: Timeline rail section header (`<h3 class="text-section">`)
  - `src/components/news/MustWatchShelf.astro:L30`: Video shelf header (`text-section`)
  - `src/components/design/handbook/Rule.astro:L16`: Handbook section header (`<h2 class="text-section">`)
  - `src/styles/app.css:L502`: Reusable `@utility section-header`
- **Purpose**: Reusable H2 section titles that demarcate content blocks across editorial pages.

### 5. `--text-headline` (14px → 18px)
- **Line Height**: `1.34` | **Weight**: `600`
- **Code Locations**:
  - `src/components/FeaturedCard.astro:L43`: Featured card title (`<h2 class="text-headline">`)
  - `src/components/Sidebar.astro:L33,56,77`: Sidebar news rail titles (`<p class="text-headline">`)
  - `src/components/kitchen/Spec.astro:L42`: Specification title (`<h3 class="text-headline">`)
  - `src/styles/app.css:L417`: `@utility article-title`
- **Purpose**: Workhorse card title for 2-up, 3-up, and 4-up story grids across home and section pages.

### 6. `--text-lead` (15px → 19px)
- **Line Height**: `1.62` | **Weight**: `400`
- **Code Locations**:
  - `src/components/lsg/LsgDesk.astro:L33`: Deck summary intro paragraph (`<p class="text-lead">`)
  - `src/pages/old-latest-news.astro:L90`: Section standfirst summary (`<p class="lead-text">`)
  - `src/pages/breaking.astro:L53`: Excerpt summary under breaking headline (`<p class="lead-text">`)
- **Purpose**: Article standfirst / lead summary paragraph situated directly between headline and body copy.

### 7. `--text-body` (14px → 17px)
- **Line Height**: `1.72` | **Weight**: `400`
- **Code Locations**:
  - `src/components/story/StoryArticle.astro:L212,228`: Main story text (`<p class="text-body">`)
  - `src/components/article/ArticleBody.astro:L33`: Article body renderer (`text-body text-text-primary`)
  - `src/components/price/PriceStoryRail.astro:L43`: Rail narrative text (`<p class="text-body">`)
- **Purpose**: Standard long-form article body copy (uses `Noto Sans Malayalam` at relaxed 1.72 line-height for reading density).

### 8. `--text-meta` (12px → 13px)
- **Line Height**: `1.50` | **Weight**: `500`
- **Code Locations**:
  - `src/components/Header.astro:L47`: Masthead date string (`<p class="text-meta">`)
  - `src/components/OldHeader.astro:L376`: Top bar trending tags (`<div class="text-meta">`)
  - `src/components/price/PriceDesk.astro:L64`: Rate timestamp line (`<p class="text-meta">`)
  - `src/styles/app.css:L479`: `@utility row-meta` (e.g. `KERALA · 5 MNT AGO`)
- **Purpose**: Secondary metadata lines (author bylines, timestamps, share counters, tabular data cells).

### 9. `--text-nav` (15px → 17px)
- **Line Height**: `1.30` | **Weight**: `600`
- **Code Locations**:
  - `src/components/nav/HeaderFlat.astro:L88`: Nav link text (`<a class="text-nav">`)
  - `src/styles/app.css:L407`: `@utility breaking-badge` (uses `var(--text-nav)`)
  - `src/styles/app.css:L537`: `@utility nav-text`
- **Purpose**: Menu links in sticky top mastheads, drawer navigation, and breaking badge labels.

### 10. `--text-eyebrow` (11px → 12px)
- **Line Height**: `1.30` | **Weight**: `700`
- **Code Locations**:
  - `src/components/price/PriceDesk.astro:L49,72,82`: Kicker labels (`<p class="eyebrow text-eyebrow">`)
  - `src/components/price/PriceStoryRail.astro:L16,38`: Category kickers (`<p class="eyebrow text-eyebrow">`)
  - `src/components/price/PriceChart.astro:L130`: Chart tab labels
  - `src/styles/app.css:L389`: `@utility eyebrow` (`letter-spacing: 0.11em; text-transform: uppercase;`)
- **Purpose**: All-caps micro labels and category kicker tags positioned above main headlines.

### 11. `--text-caption` (11px → 12px)
- **Line Height**: `1.45` | **Weight**: `400`
- **Code Locations**:
  - `src/components/story/StoryArticle.astro:L203`: Image caption/credit (`<figcaption class="text-caption">`)
  - `src/components/Sidebar.astro:L45,69`: Secondary rail links (`<a class="text-caption">`)
  - `src/components/price/PriceStoryRail.astro:L26,45`: Subtitles & disclaimers (`<p class="text-caption">`)
- **Purpose**: Image captions, photo credits, copyright fine print, and disclaimer copy.

### 12. `--text-category` (28px → 40px)
- **Line Height**: `0.90` | **Weight**: `700`
- **Code Locations**:
  - `src/styles/app.css:L398`: `@utility category-label`
  - Section title banners & Malayalam category display watermarks
- **Purpose**: Malayalam display category headers. Malayalam characters require a tight line-height (`lh: 0.90`) so stacked category titles don't drift vertically.

### 13. `--text-body-small` (12px → 13px)
- **Line Height**: `1.40` | **Weight**: `500`
- **Code Locations**:
  - `src/pages/blah.astro:L106,122,159`: Compact excerpt blurb (`<p class="body-small">`)
  - `src/pages/alt.astro:L79`: Subtitle description text (`<p class="body-small">`)
  - `src/styles/app.css:L487`: `@utility body-small`
- **Purpose**: Dense card summaries, sidebar blurb previews, and secondary description copy.

---

### Tier 2: Dense Editorial Scale (4 Tokens)

### 14. `--text-deck` (15px → 16.5px)
- **Line Height**: `1.28` | **Weight**: `550`
- **Code Locations**:
  - `src/styles/app.css:L444`: `@utility headline-deck` (`wdth: 94, wght: 550`)
  - Packed homepage rail rows, grid cards, and dense story lists
- **Purpose**: Workhorse rail row headline in dense homepage composition (measured directly from 1280px newsroom design).

### 15. `--text-feature` (19px → 22px)
- **Line Height**: `1.23` | **Weight**: `600`
- **Code Locations**:
  - `src/styles/app.css:L451`: `@utility headline-feature` (`wdth: 94, wght: 600`)
  - Shelf hero headlines on major topic shelves
- **Purpose**: Shelf hero package headline in dense newsroom layout.

### 16. `--text-lead-story` (21px → 25px)
- **Line Height**: `1.28` | **Weight**: `550`
- **Code Locations**:
  - `src/components/home4/LeadPackage.astro`: Cover story hero package headline
  - `src/pages/guided/home.astro:L177`: Guided tour lead story specimen (`<h3 class="text-lead-story font-bold">`)
  - `src/styles/app.css:L459`: `@utility headline-lead`
- **Purpose**: Homepage hero lead story package headline.

### 17. `--text-band` (18px → 22px)
- **Line Height**: `1.14` | **Weight**: `800`
- **Code Locations**:
  - `src/components/design/DesignShell.astro:L50`: Section brand label (`<span class="band-label">`)
  - `src/styles/app.css:L468`: `@utility band-label` (`wdth: 115, wght: 800; text-transform: uppercase`)
- **Purpose**: Uppercase Latin section markers (`KERALA`, `GULF NEWS`, `DESIGN SYSTEM`) with bold tracking.

---

## 🏗️ Design System Evaluation: Is 17 Tokens Too Much?

### Key Takeaways

1. **Bilingual Typography Requirements**:
   - Malayalam (`Anek Malayalam` / `Noto Sans Malayalam`) has fundamentally different ascenders, descenders, and x-heights compared to Latin (`Anek Latin`).
   - Default Tailwind sizes (like `text-xl` or `text-3xl`) cause awkward line-height gaps or clipping in Malayalam copy.
   - Tokens like `text-category` (`lh: 0.90`) and `text-body` (`lh: 1.72`) bake script-specific line-height parameters directly into the tokens.

2. **Dual Layout Modes**:
   - **Reading Mode (Articles)**: Needs airy, comfortable line heights (`lh: 1.62 – 1.72`).
   - **Newsroom Grid (Homepage)**: Needs tight, high-density vertical rhythms (`deck`, `feature`, `lead-story`, `band` at `lh: 1.14 – 1.28`).

3. **Variable Font Axis Alignment**:
   - Each token bakes in specific variable font axis parameters (`wght: 550`, `wght: 600`, `wght: 800`, `wdth: 94`, `wdth: 115`).
   - This eliminates ad-hoc styling hacks across 50+ Astro components.
