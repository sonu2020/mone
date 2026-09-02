# MediaOne Layout Theory

*A systematic approach to organizing content based on density, depth, and visual rhythm — the architecture behind the homepage stream.*

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [The Density Spectrum](#the-density-spectrum)
3. [The Depth Spectrum](#the-depth-spectrum)
4. [The Density-Depth Matrix](#the-density-depth-matrix)
5. [Section Rhythm & Breathing](#section-rhythm--breathing)
6. [Grid Architecture](#grid-architecture)
7. [Responsive Behavior](#responsive-behavior)
8. [Content Hierarchy Patterns](#content-hierarchy-patterns)
9. [Anti-Patterns](#anti-patterns)

---

## Core Principles

### 1. The Page is a Stream, Not a Wall

The homepage is a **top-to-bottom news stream** ordered by descending urgency and expanding breadth. Each band is one modular component that answers a reader need:

| Position | Reader Question | Band Type |
|----------|----------------|-----------|
| Top | "What's happening right now?" | Live signal / breaking |
| Upper | "What's the biggest story?" | Hero / lead package |
| Middle | "What else is new?" | Latest / feeds |
| Center | "Show me, don't tell me" | Video / broadcast |
| Lower | "What deserves attention?" | Editorial / shelves |
| Bottom | "The long tail" | More / misc |

### 2. Hierarchy is Density, Not Chrome

Importance is created by **size of type, size of image, and amount of space** — never by borders, boxes, shadows, or decorative color.

- **The lead** is large and alone
- **The secondary** is smaller and clustered
- **The archive** is dense and text-only

This is the NYT lesson applied to a video-native product.

### 3. The Page is a Rhythm, Not a Wall

Sections breathe alternately:

```
Sparse (hero) → Dense (latest) → Moderate (shelf) → Sparse (video) → Dense (tail)
```

This prevents the "endless grid fatigue" that flattens most news homepages into wallpaper. This is the Guardian's structural breathing.

---

## The Density Spectrum

Density measures **how much content fits in a given space**. It's the visual weight per square pixel.

| Level | Whitespace | Type Size | Image Size | Example Components |
|-------|-----------|-----------|-----------|-------------------|
| **Sparse** | Abundant | Large (hero/title) | Full-bleed or dominant | `FeatureBand` lead, `HeroSection`, `VideoHero` |
| **Moderate** | Comfortable | Medium (headline) | Standard card size | `StoryCard`, `PromoGrid`, `ShelfBand` |
| **Dense** | Tight | Small (deck) | Small thumbnail | `ThumbRow`, `StoryList`, `ArticleList` |
| **Packed** | Minimal | Tiny (meta/body) | None or icon-only | `Timeline`, `BreakingTicker`, `TopicStrip` |

### Density by Section Type

```
SPARSE                    MODERATE                  DENSE                     PACKED
┌─────────────────┐       ┌─────────┐┌─────────┐  ┌────┬────────────┐       ┌─┬─┬─┬─┐
│                 │       │         ││         │  │    │ Headline   │       │•│Text│
│    LARGE        │       │  IMG    ││  IMG    │  │IMG │ 2 lines    │       │•│Text│
│    IMAGE        │       │         ││         │  │    │ meta       │       │•│Text│
│                 │       ├─────────┤├─────────┤  ├────┴────────────┤       │•│Text│
│    Headline     │       │Headline ││Headline │  ┌────┬────────────┐       └─┴─┴─┘
│    Excerpt      │       │meta     ││meta     │  │    │ Headline   │
│    Timestamp    │       └─────────┘└─────────┘  │IMG │ 2 lines    │
│                 │                                │    │ meta       │
└─────────────────┘                                └────┴────────────┘
```

### Density Controls

Density is controlled by three levers:

1. **Image size ratio**: `21/9` (sparse) → `16/9` (moderate) → `4/3` (dense) → none (packed)
2. **Type scale**: `text-hero` (sparse) → `text-headline` (moderate) → `text-deck` (dense) → `text-meta` (packed)
3. **Whitespace**: `gap-8` + `py-10` (sparse) → `gap-4` + `py-6` (moderate) → `gap-2` + `py-3` (dense)

---

## The Depth Spectrum

Depth measures **how much context is shown** for each story. It's the information richness of a single unit.

| Level | Content Shown | Example |
|-------|---------------|---------|
| **Surface** | Headline only | `ThumbRow` in a side rail |
| **Shallow** | Headline + category | `StoryCard` without excerpt |
| **Medium** | Headline + excerpt + meta | `StoryCard` with `showExcerpt` |
| **Deep** | Headline + excerpt + full image + timestamp + category + context | `FeatureBand` lead |

### Depth by Component

| Component | Depth | Elements |
|-----------|-------|----------|
| `ThumbRow` | Surface | Headline (2-3 lines), optional meta |
| `StoryRow` | Shallow | Thumb, headline, category, timestamp |
| `StoryCard` | Medium | Image, category, headline, timestamp, optional excerpt |
| `ArticleCard` (compact) | Shallow | Thumb, headline, category |
| `ArticleCard` (standard) | Medium | Image, headline, category, timestamp |
| `ArticleCard` (lead) | Deep | Hero image, headline, excerpt, category, timestamp |
| `ArticleCard` (overlay) | Medium | Full-bleed image, headline, category, timestamp |
| `FeatureBand` lead | Deep | Large image, headline, excerpt, category, timestamp |

---

## The Density-Depth Matrix

A section's character is determined by its position on this 2D matrix:

```
                    DEPTH
              Surface   Shallow   Medium    Deep
            ┌─────────┬─────────┬─────────┬─────────┐
     Sparse │         │         │  Video  │  Hero   │
D           │         │         │  Card   │  Lead   │
E           │         │         │         │Feature  │
N           ├─────────┼─────────┼─────────┼─────────┤
S           │         │PromoGrid│ Story   │ Feature │
I           │         │  cols   │  Card   │  Band   │
T           │         │  2-3    │         │  Lead   │
Y           ├─────────┼─────────┼─────────┼─────────┤
            │  Thumb  │ Story   │Article  │         │
            │  Row    │  Row    │ compact│         │
            │  rail   │         │         │         │
            ├─────────┼─────────┼─────────┼─────────┤
     Packed │ Breaking│ Timeline│         │         │
            │  Ticker │         │         │         │
            └─────────┴─────────┴─────────┴─────────┘
```

### Reading the Matrix

- **Top-right (Sparse + Deep)**: Hero areas. One story, fully unpacked, commanding attention
- **Top-middle (Sparse + Medium)**: Video sections. Visual-first, but not fully unpacked
- **Middle (Moderate + Medium)**: Standard grids. The "workhorse" density for most content
- **Bottom-left (Dense + Surface)**: Rails and lists. Maximum stories, minimum space per story
- **Bottom-right (Packed + Surface)**: Timelines and tickers. Pure information density

### Homepage Stream as Matrix Journey

```
Row 0:  [SPARSE, DEEP]     Hero lead — "The biggest story"
Row 1:  [DENSE, SHALLOW]   Latest news rail — "What else is new"
Row 2:  [MODERATE, MEDIUM] Editorial shelf — "What deserves attention"
Row 3:  [SPARSE, MEDIUM]   Video section — "Show me"
Row 4:  [DENSE, SHALLOW]   Category duo — "Home market + diaspora"
Row 5:  [MODERATE, DEEP]   Photo story — "The image of the day"
Row 6:  [PACKED, SURFACE]  More/Misc — "The long tail"
```

This alternating pattern creates **visual breathing** — the eye rests on sparse sections, scans dense sections, and never encounters monotony.

---

## Section Rhythm & Breathing

### The Breathing Pattern

```
INHALE          EXHALE          INHALE          EXHALE
┌──────────┐   ┌────┬────┐    ┌──────────┐   ┌────┬────┐
│          │   │    │    │    │          │   │    │    │
│  HERO    │   ├────┼────┤    │  VIDEO   │   ├────┼────┤
│          │   │    │    │    │          │   │    │    │
└──────────┘   └────┴────┘    └──────────┘   └────┴────┘
  sparse          dense          sparse          dense
```

### Spacing Rules

| Context | Padding | Gap | Purpose |
|---------|---------|-----|---------|
| Between bands | `py-6` | — | Section separation |
| Hero / sparse | `py-10` | `gap-8` | Breathing room |
| Standard / moderate | `py-6` | `gap-4` | Comfortable density |
| Rail / dense | `py-3` | `gap-2` | Tight packing |
| Ad slot between | `py-8` | — | Structural pause |

### Hairline Rules

Every band is separated by a `border-b border-rule`:

```astro
<section class="py-6 border-b border-rule dark:border-ivory/10">
```

This creates a **visual heartbeat** — the 1px rules mark the end of one thought and the beginning of the next.

### The "Silence Between Sentences"

Vertical padding is not empty space. It is **punctuation**:

- `py-6` = comma (brief pause)
- `py-8` = semicolon (moderate pause)
- `py-10` = period (full stop, new thought)

---

## Grid Architecture

### The 12-Column Foundation

All bands use a 12-column grid with consistent gutters:

```
├─1─┼─2─┼─3─┼─4─┼─5─┼─6─┼─7─┼─8─┼─9─┼─10┼─11┼─12┤
└───gap-8 (32px) between columns──┘
```

### Standard Splits

| Pattern | Columns | Usage | Band |
|---------|---------|-------|------|
| **5/3/4** | Feature (5) + Stack (3) + Rail (4) | Three-zone editorial | `FeatureBand` |
| **8/4** | Main (8) + Rail (4) | Standard split | `SplitBand` |
| **9/3** | Main (9) + Rail (3) | Wide main | `SplitBand` (wide) |
| **6/6** | Left (6) + Right (6) | Equal duo | `ClusterDuo` |
| **12** | Full-width | No split | Hero, video, full-bleed |
| **4×3** | Four equal | Card grid | `PromoGrid` (4-col) |
| **3×4** | Three equal | Card grid | `PromoGrid` (3-col) |

### Grid with Vertical Rules

The NYT broadsheet move — vertical `rule` dividers between columns:

```astro
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div class="lg:col-span-8 lg:border-r lg:border-rule lg:pr-8">
    <!-- Main content -->
  </div>
  <aside class="lg:col-span-4">
    <!-- Rail content -->
  </aside>
</div>
```

**Why:** The vertical rule creates a **page boundary** between zones, not just a gap. It makes the layout feel like a broadsheet newspaper.

---

## Responsive Behavior

### Breakpoint Strategy

| Breakpoint | Width | Layout Change |
|------------|-------|---------------|
| Default | < 640px | Single column, all stacks |
| `sm` | 640px | 2-column grids appear |
| `md` | 768px | Side-by-side layouts, rails appear |
| `lg` | 1024px | 12-column grid active, full layout |
| `xl` | 1280px | Wider gutters, larger images |
| `2xl` | 1536px | Max width capped at `80rem` |

### Responsive Patterns

#### Pattern 1: Stack → Split

```
Mobile (< md)          Desktop (≥ md)
┌──────────┐           ┌────────┬───────┐
│  IMAGE   │           │  TEXT  │ IMAGE │
│          │           │        │       │
├──────────┤           │        │       │
│  TEXT    │           │        │       │
│          │           │        │       │
└──────────┘           └────────┴───────┘
```

Used in: `SplitBand` lead, `ArticleCard` (lead variant)

#### Pattern 2: Single → Grid

```
Mobile (< sm)          Tablet (≥ sm)          Desktop (≥ lg)
┌──────────┐           ┌────┬────┐           ┌───┬───┬───┐
│  CARD    │           │CARD│CARD│           │C  │C  │C  │
├──────────┤           ├────┼────┤           │A  │A  │A  │
│  CARD    │           │CARD│CARD│           │R  │R  │R  │
├──────────┤           └────┴────┘           │D  │D  │D  │
│  CARD    │                               └───┴───┴───┘
└──────────┘
```

Used in: `PromoGrid`, `CardGrid`

#### Pattern 3: Hidden → Visible

```
Mobile                Desktop
┌──────────┐         ┌──────────┬────────┐
│  MAIN    │         │  MAIN    │  RAIL  │
│  (only)  │         │          │  (now  │
│          │         │          │ visible│
└──────────┘         └──────────┴────────┘
```

Used in: `SplitBand` rail, sidebars

#### Pattern 4: Compact → Full

```
Mobile                Desktop
┌────┬─────┐         ┌──────────┐
│IMG │Text │         │          │
├────┼─────┤         │  IMAGE   │
│IMG │Text │         │          │
├────┼─────┤         ├──────────┤
│IMG │Text │         │  TEXT    │
└────┴─────┘         └──────────┘
```

Used in: `StoryList`, `ArticleList`

### Fluid Typography

All type scales use `clamp()` for smooth scaling:

```css
--text-headline: clamp(0.875rem, 0.81rem + 0.27vw, 1.125rem);
```

This means:
- **Mobile (390px)**: 14px
- **Desktop (1280px)**: 18px
- **No breakpoint jumps** — smooth, continuous scaling

---

## Content Hierarchy Patterns

### Pattern 1: The Lead Package

**Purpose**: "What's the biggest story, with context?"

**Structure**:
```
┌─────────────────────────────────────────┐
│                                         │
│              LARGE IMAGE                │
│              (21/9 or 16/9)             │
│                                         │
├─────────────────────────────────────────┤
│ KICKER                                  │
│ HEADLINE (hero size)                    │
│ Excerpt paragraph (2-3 lines)           │
│ Category · Timestamp                    │
└─────────────────────────────────────────┘
```

**Density**: Sparse  
**Depth**: Deep  
**Examples**: `HeroSection`, `FeatureBand` lead

---

### Pattern 2: The Latest Feed

**Purpose**: "What else is new?"

**Structure**:
```
┌────┬────────────────────┐┌────┬────────────────────┐
│IMG │ Headline           ││IMG │ Headline           │
│    │ 2 lines            ││    │ 2 lines            │
│    │ Category · Time    ││    │ Category · Time    │
├────┼────────────────────┤├────┼────────────────────┤
│IMG │ Headline           ││IMG │ Headline           │
│    │ 2 lines            ││    │ 2 lines            │
│    │ Category · Time    ││    │ Category · Time    │
└────┴────────────────────┘└────┴────────────────────┘
```

**Density**: Dense  
**Depth**: Shallow  
**Examples**: `ListBand`, `StoryList`, `LatestSection`

---

### Pattern 3: The Editorial Shelf

**Purpose**: "What deserves my attention beyond the headlines?"

**Structure**:
```
┌─────────────────────┐┌──────────┐┌──────────┐
│                     ││          ││          │
│    LARGE IMAGE      ││   IMG    ││   IMG    │
│    (16/9)           ││  (16/9)  ││  (16/9)  │
│                     ││          ││          │
├─────────────────────┤├──────────┤├──────────┤
│ KICKER              ││ KICKER   ││ KICKER   │
│ HEADLINE (feature)  ││ HEADLINE ││ HEADLINE │
│ Excerpt (2-3 lines) ││          ││          │
│ Category · Time     ││ Time     ││ Time     │
└─────────────────────┘└──────────┘└──────────┘
```

**Density**: Moderate  
**Depth**: Medium  
**Examples**: `ShelfBand`, `FeatureBand`

---

### Pattern 4: The Video Section

**Purpose**: "Show me, don't just tell me."

**Structure**:
```
┌─────────────────────────────────────────┐
│                                         │
│           LARGE VIDEO HERO              │
│           (21/9) with play button       │
│                                         │
├─────────────────────────────────────────┤
│ KICKER: "Watch"                         │
│ HEADLINE                                │
└─────────────────────────────────────────┘
```

**Density**: Sparse  
**Depth**: Medium  
**Examples**: `VideoSection`, `VideoBand`, `VideoHero`

---

### Pattern 5: The Duo Cluster

**Purpose**: "Two related beats, side by side."

**Structure**:
```
┌────────────────────┐┌────────────────────┐
│ SECTION HEADING    ││ SECTION HEADING    │
├────────────────────┤├────────────────────┤
│ ┌────┬───────────┐ ││ ┌────┬───────────┐ │
│ │IMG │ Headline  │ ││ │IMG │ Headline  │ │
│ │    │ meta      │ ││ │    │ meta      │ │
│ └────┴───────────┘ ││ └────┴───────────┘ │
│ ┌────┬───────────┐ ││ ┌────┬───────────┐ │
│ │IMG │ Headline  │ ││ │IMG │ Headline  │ │
│ │    │ meta      │ ││ │    │ meta      │ │
│ └────┴───────────┘ ││ └────┴───────────┘ │
└────────────────────┘└────────────────────┘
```

**Density**: Dense  
**Depth**: Shallow  
**Examples**: `ClusterDuo`, category side-by-side sections

---

### Pattern 6: The Timeline

**Purpose**: "What happened and when?"

**Structure**:
```
┌────┬─────────────────────────────────────┐
│ 18:18 │ Headline                        │
│  ●    │ 2 lines                         │
├────┼─────────────────────────────────────┤
│ 18:00 │ Headline                        │
│  ●    │ 2 lines                         │
├────┼─────────────────────────────────────┤
│ 17:56 │ Headline                        │
│  ●    │ 2 lines                         │
└────┴─────────────────────────────────────┘
```

**Density**: Packed  
**Depth**: Surface  
**Examples**: `Timeline`, `ScheduleList`

---

## Anti-Patterns

### What the System Deliberately Does NOT Do

1. **No carousels** — A carousel is an admission that you couldn't decide what matters
2. **No card nesting** — No card inside a card, no bordered box inside a bordered box
3. **No gradients or glassmorphism** — Image placeholders are flat tinted blocks
4. **No red outside breaking/live** — Red is a verb meaning "stop and read this now"
5. **No bespoke section markup** — If a section can't be composed from atoms + blocks, the system is wrong
6. **No 4-column wall at the top** — The top must breathe; equal cards flatten hierarchy
7. **No shadow elevation** — Elevation is conveyed by surface contrast and hairlines
8. **No animated layout** — Only color and image transform animate; layout is static

### Density Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| **Wall of equal cards** | No hierarchy, reader can't scan | Vary sizes: one large + several small |
| **Too much sparse** | Wasted space, reader must scroll endlessly | Alternate: sparse → dense → sparse |
| **Too much dense** | Visual fatigue, everything screams equally | Insert breathing room |
| **Inconsistent depth** | Some cards show excerpts, some don't within same section | Standardize per section |
| **Mixed ratios in grid** | Visual chaos, misaligned gutters | One ratio per grid |

---

*Last updated: August 2026*
