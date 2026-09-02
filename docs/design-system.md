# MediaOne Design System

*An editorial design system for a Malayalam broadcaster's digital presence, built on atomic principles and informed by the NYT, Guardian, BBC, and Al Jazeera.*

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Atomic Architecture](#atomic-architecture)
3. [Design Tokens](#design-tokens)
4. [Composition Patterns](#composition-patterns)
5. [State System](#state-system)
6. [Content Density & Depth](#content-density--depth)

---

## Philosophy

**MediaOne is a broadcaster that happens to publish on the web — not a newspaper.**

This one idea governs every decision:
- **Signal first**: The live bar, the pulse, the timestamp — recency is currency
- **Hierarchy through density**: Importance is created by type size, image size, and space — never by borders, shadows, or chrome
- **One accent, used as a verb**: Azure (`#166bc0`) for actions and state; red for urgency only
- **Hairlines, never shadows**: 1px `rule` dividers and surface contrast carry elevation
- **Type is the brand**: Anek Latin + Anek Malayalam, a metrically matched superfamily
- **Time is a first-class citizen**: Tabular-nums everywhere so the clock never jitters

---

## Atomic Architecture

The system follows a strict **Atom → Block → Band → Page** hierarchy. Nothing escapes this structure.

### Atoms (The Primitives)

Atoms are the smallest indivisible units. They accept data and render markup. They never compose other components.

| Atom | File | Role | Props |
|------|------|------|-------|
| **Media** | `ui/Media.astro` | Aspect-ratio image frame with zoom, overlay, lazy-loading | `seed`, `src`, `ratio`, `overlay`, `zoom`, `w`, `h`, `loading`, `fetchpriority` |
| **Art** | `home4/Art.astro` | Story artwork wrapper — renders image or holds neutral tint | `story`, `ratio`, `w`, `zoom`, `loading` |
| **Headline** | `ui/Headline.astro` | The one heading primitive. `size` maps to exactly one type token. | `as`, `size`, `tone`, `clamp`, `text` |
| **Kicker** | `ui/Kicker.astro` | Category eyebrow. Latin uppercase only. | `text`, `tone` |
| **MetaRow** | `ui/MetaRow.astro` | Category · timestamp line. | `category`, `date`, `tone` |
| **BandHeading** | `home4/BandHeading.astro` | Section marker: uppercase label + hairline + optional "View all" | `label`, `href`, `viewAllHref`, `badge` |
| **SectionHeading** | `ui/SectionHeading.astro` | Homepage block label with azure accent rule | `title`, `titleEn`, `href`, `viewAllHref`, `accent` |
| **PlayButton** | `ui/PlayButton.astro` | Video play overlay | — |
| **Pulse** | `ui/Pulse.astro` | Live signal dot | — |
| **Badge** | `ui/Badge.astro` | Small flag/label | — |
| **Duration** | `ui/Duration.astro` | Video timestamp | — |
| **Bi** | `ui/Bi.astro` | Icon wrapper (Tabler Icons) | — |

**Atom Rules:**
- Atoms never import other components
- Atoms always accept a `class` prop for context-specific styling
- Atoms use `group-hover` for interactive states (the parent `<a>` carries `group`)
- Every atom has a `tone` prop for light/dark/onDark variants

### Blocks (The Composites)

Blocks compose atoms into story units. A block is one *thing* a reader recognizes: a card, a row, a list.

| Block | File | Role | Composition |
|-------|------|------|-------------|
| **StoryCard** | `news/StoryCard.astro` | Image-top promo unit. The workhorse of grids. | Media + Kicker + Headline + (excerpt) + timestamp |
| **StoryRow** | `news/StoryRow.astro` | Horizontal thumb + headline. Rail/list workhorse. | Media + Headline + MetaRow |
| **StoryList** | `news/StoryList.astro` | Hairline-divided stack of StoryRows. | StoryRow × N |
| **ThumbRow** | `home4/ThumbRow.astro` | Headline left, fixed 88px thumb right. The rail workhorse. | Headline + Art |
| **ArticleCard** | `ArticleCard.astro` | Multi-variant card (lead/standard/compact/overlay) | Placeholder + headline + meta |
| **ArticleList** | `ArticleList.astro` | Compact list of ArticleCards | ArticleCard × N |
| **CardGrid** | `CardGrid.astro` | Grid wrapper for ArticleCards | ArticleCard × N in grid |
| **PromoGrid** | `news/PromoGrid.astro` | Disciplined grid of StoryCards | StoryCard × N in grid |
| **VideoCard** | `news/VideoCard.astro` | Video-specific card with duration | Media + PlayButton + Headline |
| **VideoThumb** | `news/VideoThumb.astro` | Video thumbnail with play overlay | Media + PlayButton |

**Block Rules:**
- Blocks always wrap in `<a>` with `class="group"` for hover states
- Blocks accept data props and pass them to atoms
- Blocks never reach for arbitrary CSS — only tokens and standard utilities
- A block's variants are controlled by props, not separate components

### Bands (The Sections)

Bands are full-width homepage sections. They compose blocks into *reader jobs*: "What's happening now?", "What deserves my attention?"

| Band | File | Role | Layout |
|------|------|------|--------|
| **FeatureBand** | `home4/FeatureBand.astro` | Labelled band with tall feature + promo stack + deep rail | 12-col grid: 5/3/4 split |
| **ListBand** | `home4/ListBand.astro` | "Latest News" — two-column run of thumbed rows | 2-col grid, rule-separated |
| **SplitBand** | `home4/SplitBand.astro` | Mirrored split lead + four-up cards + rail | 12-col grid: 8/4 or 9/3 split |
| **ShelfBand** | `home4/ShelfBand.astro` | Editorial shelf with large hero + supporting cards | Asymmetric grid |
| **OpinionBand** | `home4/OpinionBand.astro` | Opinion/commentary section | Column-based |
| **VideoBand** | `home4/VideoBand.astro` | Video-centric section | Grid of VideoCards |
| **ProgramBand** | `home4/ProgramBand.astro` | TV program showcase | Feature + list |
| **TopicStrip** | `home4/TopicStrip.astro` | Horizontal topic/tag strip | Flex row |
| **OnAirNow** | `home4/OnAirNow.astro` | Live broadcast indicator | Hero + metadata |

**Band Rules:**
- Every band starts with a `BandHeading`
- Bands are separated by `border-b border-rule`
- Bands use `py-6` vertical padding (the silence between sentences)
- Bands never nest — a band contains blocks, not other bands
- The page file is a thin conductor: imports bands, passes data, inserts ad slots

---

## Design Tokens

All tokens live in one `@theme` block in `src/styles/app.css`. This is the single source of truth.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-ink` | `oklch(0.376 0.065 262)` | Primary dark text |
| `--color-ink-light` | `oklch(0.52 0.018 256)` | Secondary text |
| `--color-ink-muted` | `oklch(0.555 0.013 256)` | Tertiary/meta text |
| `--color-ivory` | `oklch(0.988 0.002 250)` | Light backgrounds |
| `--color-ivory-dark` | `oklch(0.965 0.004 250)` | Slightly darker ivory |
| `--color-off-white` | `#fffeff` | Card/pure backgrounds |
| `--color-light-gray` | `#f1f4f6` | Tinted surfaces |
| `--color-rule` | `oklch(0.905 0.006 250)` | Hairline dividers |
| `--color-rule-blue` | `#173661` | Navy rules |
| `--color-azure` | `oklch(0.527 0.153 253)` | Primary accent (links, hover, eyebrows) |
| `--color-azure-dark` | `oklch(0.43 0.123 254)` | Hover dark |
| `--color-azure-light` | `oklch(0.68 0.125 245)` | Dark mode accent |
| `--color-brand-dark` | `oklch(0.145 0.018 262)` | Dark mode canvas |
| `--color-brand-elevated` | `oklch(0.195 0.022 262)` | Dark mode cards |
| `--color-header-bg` | `#000813` | Header background |
| `--color-nav-bg` | `#0b2e5d` | Navigation/masthead navy |
| `--color-accent-red` | `#a72626` | Breaking/urgency only |

### Typography Tokens

Two parallel scales:

**Promo Scale** (airy, image-led):
| Token | Mobile → Desktop | Line-height | Weight |
|-------|-----------------|-------------|--------|
| `--text-display` | 32px → 56px | 1.06 | 700 |
| `--text-hero` | 24px → 44px | 1.12 | 700 |
| `--text-title` | 21px → 30px | 1.20 | 700 |
| `--text-section` | 19px → 24px | 1.27 | 600 |
| `--text-headline` | 14px → 18px | 1.34 | 600 |
| `--text-lead` | 15px → 19px | 1.62 | 400 |
| `--text-body` | 14px → 17px | 1.72 | 400 |
| `--text-meta` | 12px → 13px | 1.50 | 500 |

**Editorial Scale** (dense, newsroom grid):
| Token | Mobile → Desktop | Line-height | Weight |
|-------|-----------------|-------------|--------|
| `--text-deck` | 15px → 16.5px | 1.28 | 550 |
| `--text-feature` | 19px → 22px | 1.23 | 600 |
| `--text-lead-story` | 21px → 25px | 1.28 | 550 |
| `--text-band` | 18px → 22px | 1.14 | 800 |

### Spacing Tokens

Fluid named scale (NOT in `@theme` — plain CSS vars to avoid max-w collision):

| Token | Mobile → Desktop |
|-------|-----------------|
| `--spacing-xxs` | 1px → 2px |
| `--spacing-xs` | 2px → 4px |
| `--spacing-sm` | 4px → 8px |
| `--spacing-md` | 6px → 12px |
| `--spacing-lg` | 8px → 16px |
| `--spacing-xl` | 10px → 20px |
| `--spacing-2xl` | 12px → 24px |
| `--spacing-3xl` | 16px → 32px |
| `--spacing-4xl` | 24px → 48px |

### Border Radius Tokens

| Token | Value |
|-------|-------|
| `--radius-sm` | 2px |
| `--radius-md` | 2px → 4px (fluid) |
| `--radius-lg` | 3px → 5px (fluid) |
| `--radius-xl` | 8px → 12px (fluid) |
| `--radius-full` | 9999px |

---

## Composition Patterns

### 1. The Group Hover Pattern

Every interactive block wraps in `<a class="group">`. Atoms inside use `group-hover:` for state changes:

```astro
<a href={story.href} class="group block">
  <Media zoom class="mb-3" />
  <Headline text={story.title} />
  <!-- Headline automatically gets group-hover:text-azure -->
</a>
```

**Why:** One class on the parent, zero JS, works for every child. The hover state is structural, not decorative.

### 2. The Tone Propagation Pattern

Atoms accept a `tone` prop that switches color for light/dark/onDark contexts:

```astro
<Kicker text="Kerala" tone="azure" />        <!-- Light mode -->
<Kicker text="Kerala" tone="onDark" />       <!-- Over image -->
<MetaRow category="Kerala" date="9:03 PM" tone="onDark" />
```

**Why:** Context (light surface vs. dark overlay) is the parent's job, but the atom renders the correct colors.

### 3. The Clamp Propagation Pattern

Headlines accept `clamp` (0 | 2 | 3) for line-clamping. The block decides how many lines based on context:

```astro
<!-- Card: generous space, 3 lines -->
<StoryCard story={s} />
<!-- Headline inside clamps at 3 -->

<!-- Rail: tight space, 2 lines -->
<StoryRow story={s} />
<!-- Headline inside clamps at 2 -->
```

**Why:** Line clamping is a layout decision, not a typography decision.

### 4. The Ratio Convention Pattern

Image ratios are conventions matching the medium, not arbitrary choices:

| Ratio | Medium | Usage |
|-------|--------|-------|
| `21/9` | Broadcast frame | Hero stills, live bar |
| `16/9` | Video standard | Cards, video thumbs |
| `16/10` | Editorial photo | Article cards |
| `4/3` | Newspaper mug | List thumbs |
| `1/1` | Social/icon | ThumbRow, profile pics |
| `9/16` | Phone-native | Shorts/Reels |
| `8/5` | Feature crop | FeatureBand heroes |
| `3/4` | Portrait | Overlay cards |

### 5. The Grid Split Pattern

Bands use a 12-column grid with standard splits:

| Split | Columns | Usage |
|-------|---------|-------|
| 5/3/4 | Feature/Stack/Rail | FeatureBand |
| 8/4 | Main/Rail | SplitBand with rail |
| 9/3 | Main/Rail | SplitBand wide |
| 6/6 | Two equal | ClusterDuo |
| 12 | Full-width | Lead packages, video heroes |

### 6. The Data Props Pattern

Blocks and bands accept typed data props, never raw markup:

```typescript
interface Story {
  title: string;
  href: string;
  category?: string;
  date?: string;
  excerpt?: string;
  image?: string;
}
```

**Why:** The page file reads like a table of contents. Data flows top-down; components render.

---

## State System

### Interactive States

| State | Trigger | Visual |
|-------|---------|--------|
| **Default** | — | Text: `text-text-primary`, Image: no transform |
| **Hover** | `group-hover` | Text: `text-azure`, Image: `scale-[1.03]` over 700ms |
| **Active** | `:active` | Slight opacity reduction (0.95) |
| **Focus** | `:focus-visible` | 2px `azure` outline, offset 2px |
| **Disabled** | `[disabled]` | `opacity-50`, `cursor-not-allowed` |

### Dark Mode States

| State | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Default text | `text-text-primary` | `dark:text-ivory` |
| Hover text | `group-hover:text-azure` | `dark:group-hover:text-azure-light` |
| Rule | `border-rule` | `dark:border-ivory/10` |
| Surface | `bg-light-gray` | `dark:bg-brand-elevated` |

### Component-Specific States

**ThumbRow:**
- `metaBelow` prop moves category/time under headline (for author rows)
- `clamp` controls headline lines (0/2/3)

**StoryCard:**
- `size` controls headline size (`base` vs `lg`)
- `showExcerpt` adds excerpt paragraph (hidden on mobile)
- `ratio` controls image aspect ratio

**ArticleCard:**
- `variant` switches between 4 layouts: `lead`, `standard`, `compact`, `overlay`
- Each variant has its own image ratio, text size, and layout

**PromoGrid:**
- `cols` controls responsive columns (2/3/4)
- `showExcerpt` adds excerpt to all cards

---

## Content Density & Depth

The system organizes content along two axes:

### Density (how much fits in a space)

| Density | Visual | Example |
|---------|--------|---------|
| **Sparse** | Large image, large type, lots of whitespace | Hero lead, FeatureBand |
| **Moderate** | Standard card, 2-3 lines of text | StoryCard, PromoGrid |
| **Dense** | Small thumb, 2-line headline, meta inline | ThumbRow, StoryList |
| **Packed** | Text-only, timestamps, no images | Timeline, breaking list |

### Depth (how much context is shown)

| Depth | Content | Example |
|-------|---------|---------|
| **Surface** | Headline only | ThumbRow in rail |
| **Shallow** | Headline + category | StoryCard without excerpt |
| **Medium** | Headline + excerpt + meta | StoryCard with `showExcerpt` |
| **Deep** | Headline + excerpt + full image + timestamp + category | FeatureBand lead |

### The Density-Depth Matrix

A section's "feel" is determined by its position on this matrix:

| Section | Density | Depth | Purpose |
|---------|---------|-------|---------|
| Live bar | Packed | Surface | "What's happening NOW?" |
| Hero lead | Sparse | Deep | "Tell me the biggest story" |
| Latest news | Dense | Shallow | "What's new?" |
| Editorial shelf | Moderate | Medium | "What deserves my attention?" |
| Video section | Sparse | Medium | "Show me" |
| More/Misc | Dense | Surface | "The long tail" |

### Rhythm Rule

Sections alternate density to create visual breathing:

```
Sparse (hero) → Dense (latest) → Moderate (shelf) → Sparse (video) → Dense (tail)
```

This prevents "endless grid fatigue" — the monotony that flattens most news homepages into wallpaper.

---

*Last updated: August 2026*
