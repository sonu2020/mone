# MediaOne Video Subsystem

*Video-specific components built from the same atoms but with play affordances, duration badges, and cinematic ratios.*

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Video Atoms](#video-atoms)
3. [Video Blocks](#video-blocks)
4. [Video Bands](#video-bands)
5. [Ratios & Conventions](#ratios--conventions)
6. [States & Interactions](#states--interactions)

---

## Philosophy

The video subsystem follows the same atomic principles as the editorial system but with video-native conventions:

- **Show, don't tell**: Thumbnails are the primary content, not supplementary
- **Play is the CTA**: The play button is always visible, never hidden behind hover
- **Duration is metadata**: Every video shows its length — viewers decide before clicking
- **Cinematic ratios**: `21/9` for heroes, `16/9` for standard, `9/16` for shorts

**MediaOne is a broadcaster.** Video is not a section — it is the *spine*.

---

## Video Atoms

### PlayButton

**File:** `src/components/ui/PlayButton.astro`

The video play overlay. Always visible on thumbnails.

```astro
<PlayButton size="md" variant="glass" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `variant` | `'solid' \| 'glass'` | `'glass'` | Background style |

**Variants:**
- `glass`: Semi-transparent background, subtle border
- `solid`: Opaque background, high contrast

**States:**
- Default: Static center position
- Hover: Parent's `group-hover` may scale or brighten

---

### Duration

**File:** `src/components/ui/Duration.astro`

Video length badge. Positioned bottom-right of thumbnails.

```astro
<Duration value="12:34" class="absolute bottom-2 right-2" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Duration string (e.g., "12:34") |
| `class` | `string` | `''` | Additional classes |

**Visual:**
- Small pill/badge format
- Dark background, light text
- `tabular-nums` for consistent width

---

## Video Blocks

### VideoThumb

**File:** `src/components/news/VideoThumb.astro`

The core video still: image + play affordance + duration, with optional overlaid title.

```astro
<VideoThumb
  item={video}
  ratio="16/9"
  href="/video/123"
  playSize="md"
  showTitle={false}
  live={false}
/>
```

**Composition:**
```
<a.group.relative.block
  ├─ Media (ratio, zoom)
  ├─ Overlay: bg-ink/0 → group-hover:bg-ink/15
  ├─ PlayButton (centered, glass variant)
  ├─ [Badge "Live"] (top-left, when live)
  ├─ [Kicker] (top-left, when not live + not showTitle)
  ├─ Duration (bottom-right)
  └─ [Title overlay] (bottom, when showTitle)
      ├─ Kicker
      ├─ Headline (onDark)
      └─ Views
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `VideoItem` | required | Video data |
| `ratio` | `string` | `'16/9'` | Aspect ratio |
| `href` | `string` | — | Link URL (renders as `<a>`, else `<div>`) |
| `playSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Play button size |
| `showTitle` | `boolean` | `false` | Overlay title on thumbnail |
| `live` | `boolean` | `false` | Show live badge |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | Static image, play button centered, duration visible |
| Hover | `bg-ink/15` overlay darkens, image zooms |
| Live | Red "Live" badge top-left |
| ShowTitle | Title, category, views overlaid bottom-up |

**Usage Notes:**
- Renders as `<a>` when `href` is given, `<div>` when nested inside a parent link
- The `showTitle` mode is for shorts/reels and cinematic stills
- `live` mode adds a red pulse badge

---

### VideoCard

**File:** `src/components/news/VideoCard.astro`

Landscape video promo: thumb + caption beneath. The unit for video grids and lists.

```astro
<VideoCard item={video} ratio="16/9" size="base" />
```

**Composition:**
```
<a.group.block
  ├─ VideoThumb (ratio)
  └─ div.pt-3
      ├─ Headline (h3, size, clamp=2)
      └─ [Views · Date] (caption-text)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `VideoItem` | required | Video data |
| `ratio` | `string` | `'16/9'` | Thumbnail ratio |
| `size` | `'base' \| 'lg'` | `'base'` | Headline size |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | Standard card layout |
| Hover | Headline: `text-azure`, thumb: zoom + darken |

---

### VideoHero

**File:** `src/components/news/VideoHero.astro`

Full-bleed cinematic still for video landing pages.

**Purpose**: "Show me the big video."

**Layout**:
```
┌─────────────────────────────────────────┐
│                                         │
│         FULL-BLEED IMAGE (21/9)         │
│         with play overlay               │
│                                         │
├─────────────────────────────────────────┤
│ KICKER                                  │
│ HEADLINE (hero size)                    │
│ Views · Duration · Date                 │
└─────────────────────────────────────────┘
```

**Density**: Sparse  
**Depth**: Medium

---

### VideoFeature

**File:** `src/components/news/VideoFeature.astro`

Watch module: player with an up-next rail.

**Purpose**: "Watch now, and here's what's next."

**Layout**:
```
┌────────────────────────────┐┌──────────────┐
│                            ││              │
│      VIDEO PLAYER          ││  Up Next     │
│      (large)               ││  ┌────┐      │
│                            ││  │IMG │Title │
│                            ││  ├────┤      │
│                            ││  │IMG │Title │
│                            ││  ├────┤      │
│                            ││  │IMG │Title │
│                            ││  └────┘      │
└────────────────────────────┘└──────────────┘
```

**Layout**: `grid-cols-1 lg:grid-cols-12`  
**Player**: `lg:col-span-8`  
**Rail**: `lg:col-span-4`

---

### VideoGrid

**File:** `src/components/news/VideoGrid.astro`

VideoCard grid at 2–4 columns.

```astro
<VideoGrid items={videos} cols={3} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `VideoItem[]` | required | Array of videos |
| `cols` | `2 \| 3 \| 4` | `3` | Column count |
| `class` | `string` | `''` | Additional classes |

**Responsive Behavior:**

| cols | Mobile | sm | lg |
|------|--------|-----|-----|
| 2 | 2-col | 2-col | 2-col |
| 3 | 2-col | 2-col | 3-col |
| 4 | 2-col | 2-col | 4-col |

---

### ShortsRail

**File:** `src/components/news/ShortsRail.astro`

Horizontal rail of vertical reels (9/16).

**Purpose**: "Give me the 40-second version."

**Layout**:
```
← ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ →
  │    │ │    │ │    │ │    │ │    │ │    │
  │IMG │ │IMG │ │IMG │ │IMG │ │IMG │ │IMG │
  │    │ │    │ │    │ │    │ │    │ │    │
  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
  Title  Title  Title  Title  Title  Title
```

**Ratio**: `9/16` (phone-native)  
**Scroll**: Horizontal scroll with snap points  
**Height**: Fixed height, variable width

---

### TopVideosShelf

**File:** `src/components/news/TopVideosShelf.astro`

Full-bleed blue band of video cards. The Videos band on the homepage.

**Purpose**: "Show me the most-watched."

**Visual**:
- Full-width blue background (`bg-nav-bg` or similar)
- White text for contrast
- 3-4 VideoCards in a row
- "View all" link

---

## Ratios & Conventions

| Ratio | Use Case | Component |
|-------|----------|-----------|
| `21/9` | Cinematic hero | VideoHero, broadcast frames |
| `16/9` | Standard video | VideoCard, VideoThumb, VideoGrid |
| `4/3` | Square-ish content | Alternative video thumbs |
| `9/16` | Shorts/Reels | ShortsRail, vertical content |
| `1/1` | Profile/program | Program thumbnails |

---

## States & Interactions

### Video Thumb States

| State | Trigger | Visual |
|-------|---------|--------|
| **Default** | — | Image + play button + duration |
| **Hover** | `group-hover` | `bg-ink/15` overlay, image zooms |
| **Playing** | JS state | Pause icon replaces play |
| **Live** | `live={true}` | Red pulse badge |
| **Error** | Load failure | Neutral tint placeholder |

### Video Card States

| State | Trigger | Visual |
|-------|---------|--------|
| **Default** | — | Thumb + headline + meta |
| **Hover** | `group-hover` | Headline → azure, thumb overlay |
| **Active** | `:active` | Opacity 0.95 |
| **Focus** | `:focus-visible` | 2px azure outline |

### Play Button States

| State | Visual |
|-------|--------|
| **Default** | Glass/solid circle with play icon |
| **Hover** | Slight scale or brightness increase |
| **Playing** | Pause icon (if inline player) |

---

## Composition with Editorial System

Video components compose seamlessly with editorial atoms:

```astro
<!-- Video inside an editorial band -->
<FeatureBand
  label="Watch"
  feature={videoStory}
  stack={relatedVideos}
  rail={trendingVideos}
/>

<!-- Video cards in a standard grid -->
<VideoGrid items={videos} cols={3} />

<!-- Mixed editorial + video -->
<SplitBand
  lead={leadStory}
  cards={[...stories, ...videos]}  /* Mixed content */
  rail={latestStories}
/>
```

**Rule**: Video blocks use the same hover states, type tokens, and spacing as editorial blocks. The only differences are the play affordance and duration badge.

---

## Accessibility

- **Play buttons**: Always visible, never hover-only
- **Duration**: Screen-reader accessible via `aria-label`
- **Live badge**: Announced as "Live" to screen readers
- **Keyboard navigation**: Full focus support on all video links
- **Reduced motion**: Respects `prefers-reduced-motion` for zoom effects

---

*Last updated: August 2026*
