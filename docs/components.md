# MediaOne Component Catalog

*Complete reference for all reusable components, their props, states, and usage patterns.*

> **Inventory & page usage:** the machine-generated stock — every component, which
> pages use it, and the `mc` internal-component marker — lives in
> [component-stock.md](./component-stock.md).

---

## Table of Contents

1. [UI Atoms](#ui-atoms)
2. [Story Blocks](#story-blocks)
3. [Layout Blocks](#layout-blocks)
4. [Band Sections](#band-sections)
5. [State Reference](#state-reference)
6. [Focus & Accessibility](#focus--accessibility)

---

## UI Atoms

### Media

**File:** `src/components/ui/Media.astro`

The aspect-ratio image frame. Square by system default. Ratio is applied via inline `aspect-ratio` so any value is safe at build time.

```astro
<Media
  seed={story.href}
  src={story.image}
  ratio="16/9"
  overlay="soft"
  zoom
  w={800}
  loading="lazy"
  fetchpriority="low"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | `string` | — | Hash seed for dummy image generation |
| `src` | `string` | — | Actual image URL |
| `ratio` | `string` | `'16/9'` | Aspect ratio (e.g., `21/9`, `4/3`, `1/1`) |
| `overlay` | `false \| 'soft' \| 'strong'` | `false` | Bottom-up scrim for text-over-image |
| `zoom` | `boolean` | `false` | Hover scale transform |
| `w` | `number` | `800` | Intrinsic width hint |
| `h` | `number` | auto | Intrinsic height hint (derived from ratio) |
| `loading` | `'lazy' \| 'eager'` | — | Image loading strategy |
| `fetchpriority` | `'high' \| 'low' \| 'auto'` | — | Fetch priority hint |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | CSS | Behavior |
|-------|-----|----------|
| Default | — | Static image, no transform |
| Hover | `group-hover:scale-[1.03]` | 700ms ease-out scale when parent has `group` |
| Overlay soft | `bg-gradient-to-t from-ink/80 via-ink/20 to-transparent` | Dark scrim for text legibility |
| Overlay strong | `bg-gradient-to-t from-ink via-ink/40 to-transparent` | Heavy scrim for hero units |

**Usage Notes:**
- Always place inside `<a class="group">` when `zoom` is enabled
- Derives intrinsic dimensions from ratio when `h` is not provided
- DummyImage component handles placeholder generation when `src` is missing

---

### Art

**File:** `src/components/home4/Art.astro`

Story artwork wrapper. Renders the story's own image when available; holds a neutral tint frame when the story has no art.

```astro
<Art story={feature} ratio="8/5" w={800} zoom />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `LiveStory` | required | Story object with `image`, `href` |
| `ratio` | `string` | `'16/9'` | Aspect ratio |
| `w` | `number` | — | Width hint passed to Media |
| `zoom` | `boolean` | `false` | Enable hover zoom |
| `loading` | `'lazy' \| 'eager'` | — | Loading strategy |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| With image | Renders Media component |
| Without image | `bg-light-gray dark:bg-brand-elevated` placeholder |

**Usage Notes:**
- A preview should never imply artwork that doesn't exist — always use Art, never raw Media for story images
- The placeholder maintains layout stability (no CLS)

---

### Headline

**File:** `src/components/ui/Headline.astro`

The one heading primitive. `size` maps to exactly one type token; never set headline type ad hoc.

```astro
<Headline as="h3" size="base" tone="default" clamp={3} text={story.title} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| 'h3'` | `'h3'` | HTML tag |
| `size` | `'hero' \| 'lg' \| 'base' \| 'section'` | `'base'` | Type token size |
| `tone` | `'default' \| 'onDark'` | `'default'` | Color context |
| `clamp` | `0 \| 2 \| 3` | `0` | Line clamp (0 = no clamp) |
| `text` | `string` | required | Headline text |
| `class` | `string` | `''` | Additional classes |

**Size Mapping:**

| Size | Token | Mobile → Desktop | Weight |
|------|-------|-----------------|--------|
| `hero` | `text-hero` | 24px → 44px | 700 |
| `lg` | `article-title-lg` | ~20px → 28px | 700 |
| `base` | `article-title` | ~16px → 20px | 600 |
| `section` | `section-header` | ~19px → 24px | 600 |

**States:**

| State | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Default | `text-text-primary` | `text-ivory` |
| Hover | `group-hover:text-azure` | `dark:group-hover:text-azure-light` |
| OnDark | `text-white group-hover:text-azure-light` | — |

**Usage Notes:**
- Expects a `group` ancestor (usually the wrapping `<a>`) so hover color applies
- `clamp` is a layout decision — the parent block decides based on available space
- Always use Headline, never raw `<h*>` tags with ad-hoc classes

---

### Kicker

**File:** `src/components/ui/Kicker.astro`

The category eyebrow. Latin uppercase only. The one place tracking is allowed.

```astro
<Kicker text="Kerala" tone="azure" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Category name |
| `tone` | `'azure' \| 'onDark' \| 'muted'` | `'azure'` | Color variant |
| `class` | `string` | `''` | Additional classes |

**Tone Mapping:**

| Tone | Light Mode | Dark Mode |
|------|-----------|-----------|
| `azure` | `text-azure` | `text-azure-light` |
| `onDark` | `text-azure-light` | `text-azure-light` |
| `muted` | `text-text-muted` | `text-ivory/50` |

**Usage Notes:**
- Always uppercase Latin text; Malayalam category names render as-is
- Used above headlines in cards, beside timestamps in meta rows

---

### MetaRow

**File:** `src/components/ui/MetaRow.astro`

The category · timestamp line. Pair with a Kicker above a headline, or use inline beneath.

```astro
<MetaRow category="Kerala" date="9:03 PM" tone="default" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `category` | `string` | — | Category name |
| `date` | `string` | — | Timestamp |
| `tone` | `'default' \| 'onDark'` | `'default'` | Color context |
| `class` | `string` | `''` | Additional classes |

**States:**

| Tone | Category | Date Separator | Date |
|------|----------|---------------|------|
| `default` | `text-azure` | `text-text-muted` | `text-text-muted` |
| `onDark` | `text-azure-light` | `text-white/55` | `text-white/55` |

**Usage Notes:**
- Uses `tabular-nums` on the date so timestamps never jitter
- The `·` separator only renders when both category and date are present

---

### BandHeading

**File:** `src/components/home4/BandHeading.astro`

The /home4 section marker: uppercase Latin label, hairline rule to far edge, optional "View all".

```astro
<BandHeading
  label="Latest News"
  href="/latest"
  viewAllHref="/latest"
  badge="Popular"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Section label (uppercase Latin) |
| `href` | `string` | — | Makes label clickable |
| `viewAllHref` | `string` | — | "View all →" link |
| `badge` | `string` | — | Small flag beside label |
| `class` | `string` | `''` | Additional classes |

**States:**

| Element | Default | Hover |
|---------|---------|-------|
| Label | `text-text-navy-deep` | `hover:text-azure` |
| Rule | `bg-rule` | — |
| "View all" | `text-azure` | `hover:text-azure-dark` |
| Badge | `border-azure/40 bg-azure/5 text-azure` | — |

**Usage Notes:**
- The rule is a flex child (`flex-1`) rather than a border so it always ends where the link begins
- Label renders as `<a>` when `href` is provided, `<span>` otherwise

---

### SectionHeading

**File:** `src/components/ui/SectionHeading.astro`

Homepage block label with Malayalam title, azure accent rule, English kicker, optional "View all".

```astro
<SectionHeading
  title="പ്രധാന വാർത്തകൾ"
  titleEn="Headlines"
  href="/news"
  viewAllHref="/news"
  accent={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Malayalam section title |
| `titleEn` | `string` | — | English kicker |
| `href` | `string` | — | Makes title clickable |
| `viewAllHref` | `string` | — | "View all →" link |
| `accent` | `boolean` | `true` | Show azure underline |
| `class` | `string` | `''` | Additional classes |

**States:**

| Element | Default | Hover |
|---------|---------|-------|
| Title | `text-ink` with `after:bg-azure` underline | `group-hover:text-azure` |
| English kicker | `text-text-muted` | — |
| "View all" | `text-azure` | `hover:text-azure-dark` |

**Usage Notes:**
- The accent rule is a `::after` pseudo-element, `h-0.5 w-9 bg-azure`
- Distinct from `SectionHeader` (the section-page masthead banner)

---

## Story Blocks

### StoryCard

**File:** `src/components/news/StoryCard.astro`

The image-top promo unit. The workhorse of grids.

```astro
<StoryCard
  story={story}
  ratio="16/9"
  size="base"
  showExcerpt={false}
/>
```

**Composition:**
```
<a.group>
  ├─ Media (ratio, zoom)
  ├─ Kicker (category, azure)
  ├─ Headline (h3, size, clamp=3)
  ├─ [excerpt] (hidden sm:block)
  └─ timestamp (caption-text)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `Story` | required | Story data object |
| `ratio` | `string` | `'16/9'` | Image aspect ratio |
| `size` | `'base' \| 'lg'` | `'base'` | Headline size |
| `showExcerpt` | `boolean` | `false` | Show excerpt paragraph |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Trigger | Visual |
|-------|---------|--------|
| Default | — | Text: `text-text-primary`, Image: static |
| Hover | `group-hover` | Text: `text-azure`, Image: `scale-[1.03]` |
| Focus | `focus-visible` | 2px azure outline |

**Responsive Behavior:**
- Excerpt hidden on mobile (`hidden sm:block`)
- Image ratio constant across breakpoints

**Usage Notes:**
- Used inside PromoGrid (2-4 columns)
- The most common block on the homepage
- Excerpt adds vertical space — use sparingly in dense grids

---

### StoryRow

**File:** `src/components/news/StoryRow.astro`

Horizontal thumb + headline. The rail / list workhorse.

```astro
<StoryRow
  story={story}
  size="base"
  thumbRatio="4/3"
  showMeta={true}
/>
```

**Composition:**
```
<a.group.flex>
  ├─ Media (thumbRatio, w-24 sm:w-28)
  └─ div.flex-col
      ├─ Headline (h3, size, clamp=2)
      └─ [MetaRow] (category, date)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `Story` | required | Story data object |
| `size` | `'base' \| 'lg'` | `'base'` | Headline size |
| `thumbRatio` | `string` | `'4/3'` | Thumbnail aspect ratio |
| `showMeta` | `boolean` | `true` | Show MetaRow |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | `py-4`, `first:pt-0` |
| Hover | Headline: `text-azure`, Image: `scale-[1.03]` |

**Usage Notes:**
- Thumb width is fixed (`w-24 sm:w-28 shrink-0`) so all rows align
- Used inside StoryList with `divide-y` for rule separation
- `first:pt-0` removes top padding on the first item

---

### StoryList

**File:** `src/components/news/StoryList.astro`

Hairline-divided stack of StoryRows.

```astro
<StoryList items={stories} size="base" />
```

**Composition:**
```
div.divide-y.divide-rule
  └─ StoryRow × N
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Story[]` | required | Array of stories |
| `size` | `'base' \| 'lg'` | `'base'` | Headline size for all rows |
| `class` | `string` | `''` | Additional classes |

**Usage Notes:**
- The `divide-y` creates hairlines between rows without extra markup
- Consistent with the "hairlines, never shadows" principle

---

### ThumbRow

**File:** `src/components/home4/ThumbRow.astro`

The rail workhorse: headline left, fixed 88px square thumb right.

```astro
<ThumbRow
  story={story}
  time="9:03 PM"
  metaBelow={false}
  clamp={3}
/>
```

**Composition:**
```
<a.group.flex
  ├─ div.flex-1.flex-col
  │   ├─ [meta row] (category + time)
  │   ├─ h3.headline-deck
  │   └─ [metaBelow row] (category + time, moved under headline)
  └─ div.w-18.xl:w-22
      └─ Art (ratio="1/1", w=176, rounded-md)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `LiveStory` | required | Story data object |
| `time` | `string` | — | Override timestamp |
| `metaBelow` | `boolean` | `false` | Move meta under headline |
| `clamp` | `0 \| 2 \| 3` | `3` | Headline line clamp |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | Meta above headline, 3-line clamp |
| `metaBelow` | Meta moves under headline (for author rows) |
| Hover | Headline: `text-azure`, Image: `scale-[1.03]` |

**Responsive Behavior:**
- Thumb: `w-18` (72px) mobile → `xl:w-22` (88px) desktop
- Gap: `gap-3.5` → `xl:gap-[18px]`

**Usage Notes:**
- The thumb slot is fixed-width, non-shrinking so every row shares one vertical lane
- `metaBelow` is used for author rows where the category label belongs under the headline

---

### ArticleCard

**File:** `src/components/ArticleCard.astro`

Multi-variant card with four distinct layouts.

```astro
<ArticleCard
  title="..."
  category="Kerala"
  href="/story/..."
  date="June 12"
  image="..."
  variant="standard"
/>
```

**Variants:**

#### Lead
- Full-width hero layout
- Image: `aspect-[16/9]`
- Title: `article-title-lg` (large)
- Shows excerpt if available
- Used for top stories, hero sections

#### Standard
- Standard card layout
- Image: `aspect-[4/3]`
- Title: `article-title` with `line-clamp-3`
- Most common variant
- Used in grids and shelves

#### Compact
- Horizontal compact layout
- Image: `w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-20`
- Title: `article-title` with `line-clamp-2`
- No excerpt
- Used in lists and side rails

#### Overlay
- Text-over-image layout
- Image: `aspect-[16/10] lg:aspect-[3/4]`
- Gradient overlay: `from-black/80 via-black/20 to-transparent`
- Title: `text-headline` in white
- Category: `eyebrow text-azure-light`
- Used for featured stories, photo essays

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Article title |
| `excerpt` | `string` | — | Article excerpt |
| `category` | `string` | — | Category name |
| `href` | `string` | required | Link URL |
| `date` | `string` | — | Timestamp |
| `image` | `string` | — | Image URL |
| `variant` | `'lead' \| 'standard' \| 'compact' \| 'overlay'` | `'standard'` | Layout variant |
| `class` | `string` | `''` | Additional classes |

**States:**

| Variant | Default | Hover |
|---------|---------|-------|
| Lead | `text-text-primary` | `group-hover:text-azure` |
| Standard | `text-text-primary` | `group-hover:text-azure` |
| Compact | `text-text-primary` | `group-hover:text-azure` |
| Overlay | `text-white` | `group-hover:text-azure-light` |

**Usage Notes:**
- Each variant has its own image ratio, text size, and layout
- Overlay variant is the only one that uses `onDark` tones
- Compact uses `border-b` for list separation

---

### OverlayStory

**File:** `src/components/news/OverlayStory.astro`

Text-over-image lockup with scrim and optional badge. Heroes and featured cards.

```astro
<OverlayStory
  story={story}
  ratio="16/9"
  size="lg"
  badge="Breaking"
  badgeVariant="breaking"
/>
```

**Composition:**
```
<a.group.relative.block
  ├─ Media (overlay="strong", zoom)
  ├─ [Badge] (absolute top-3 left-3)
  └─ div.absolute.inset-x-0.bottom-0
      ├─ Kicker (tone="onDark")
      ├─ Headline (h2, size, tone="onDark", clamp=3)
      └─ [timestamp] (caption-text, white/55)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `Story` | required | Story data object |
| `ratio` | `string` | `'16/9'` | Image aspect ratio |
| `size` | `'hero' \| 'lg' \| 'base'` | `'lg'` | Headline size |
| `badge` | `string` | — | Badge label |
| `badgeVariant` | `'breaking' \| 'live' \| 'solid' \| 'outline'` | `'live'` | Badge style |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | Image with strong scrim, white text |
| Hover | Headline → `azure-light`, image zooms |

**Usage Notes:**
- The only block that uses `overlay="strong"` by default
- Badge positioned absolute top-left
- Text positioned absolute bottom with padding

---

### StoryLink

**File:** `src/components/news/StoryLink.astro`

Bare headline link, optionally bulleted. For dense title lists where thumbnails would be noise.

```astro
<StoryLink
  story={story}
  bullet={false}
  size="base"
  showMeta={true}
/>
```

**Composition:**
```
<a.group.block
  ├─ [bullet dot] (bg-azure, rounded-full)
  └─ span.min-w-0
      ├─ Headline (h3, size, clamp=2)
      └─ [MetaRow] (category, date)
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `story` | `Story` | required | Story data object |
| `bullet` | `boolean` | `false` | Show bullet dot |
| `size` | `'base' \| 'lg'` | `'base'` | Headline size |
| `showMeta` | `boolean` | `true` | Show MetaRow |
| `class` | `string` | `''` | Additional classes |

**States:**

| State | Visual |
|-------|--------|
| Default | Plain headline, optional bullet |
| Hover | Headline → `text-azure` |

**Usage Notes:**
- The densest unit after Timeline — no images, minimal chrome
- `bullet` creates a list-like appearance
- `first:pt-0` removes top padding on first item

---

### NumberedList

**File:** `src/components/news/NumberedList.astro`

Ranked rail for most-read stories. Numbers create implicit hierarchy.

```astro
<NumberedList items={stories} />
```

**Composition:**
```
div
  └─ div.flex.gap-3 (× N)
      ├─ span.rank-number (1, 2, 3...)
      └─ div.flex-1
          ├─ Headline (clamp=2)
          └─ [MetaRow]
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Story[]` | required | Array of stories |
| `class` | `string` | `''` | Additional classes |

**Visual:**
- Rank number: large, muted, tabular-nums
- Headline: standard size
- Separated by hairline rules

**Usage Notes:**
- Numbers are semantic — they signal popularity ranking
- Used in "Most Read" side rails

---

### Timeline

**File:** `src/components/news/Timeline.astro`

Timestamped spine for live feeds. LeadPackage renders its own timeline.

```astro
<Timeline items={stories} />
```

**Composition:**
```
div
  └─ div.flex.gap-3 (× N)
      ├─ div.time-column
      │   ├─ span.time (tabular-nums)
      │   └─ span.dot (bg-azure)
      └─ div.flex-1
          ├─ Headline (clamp=2)
          └─ [MetaRow]
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Story[]` | required | Array of stories |
| `class` | `string` | `''` | Additional classes |

**Visual:**
- Vertical line connecting dots
- Time on left, headline on right
- Azure dots mark each entry

**Usage Notes:**
- Used in live feeds, breaking news trackers
- Time is the primary metadata — more important than category

---

## Layout Blocks

### PromoGrid

**File:** `src/components/news/PromoGrid.astro`

Disciplined grid of StoryCards at 2-4 columns.

```astro
<PromoGrid
  items={stories}
  cols={3}
  ratio="16/9"
  showExcerpt={false}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Story[]` | required | Array of stories |
| `cols` | `2 \| 3 \| 4` | `3` | Column count |
| `ratio` | `string` | `'16/9'` | Image ratio for all cards |
| `showExcerpt` | `boolean` | `false` | Show excerpts |
| `class` | `string` | `''` | Additional classes |

**Responsive Behavior:**

| cols | Mobile | sm | lg |
|------|--------|-----|-----|
| 2 | 2-col | 2-col | 2-col |
| 3 | 2-col | 2-col | 3-col |
| 4 | 2-col | 2-col | 4-col |

---

### CardGrid

**File:** `src/components/CardGrid.astro`

Grid wrapper for ArticleCards (standard variant).

```astro
<CardGrid items={articles} cols={3} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArticleGridItem[]` | required | Array of articles |
| `cols` | `2 \| 3 \| 4` | `3` | Column count |
| `class` | `string` | `''` | Additional classes |

---

### ArticleList

**File:** `src/components/ArticleList.astro`

Compact list of ArticleCards.

```astro
<ArticleList items={articles} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ArticleListItem[]` | required | Array of articles |
| `class` | `string` | `''` | Additional classes |

---

## Band Sections

### FeatureBand

**File:** `src/components/home4/FeatureBand.astro`

Labelled band with tall feature + promo stack + deep rail.

**Layout:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-12`

| Region | Columns | Content |
|--------|---------|---------|
| Feature | `lg:col-span-5` | Large image + tinted caption panel |
| Stack | `lg:col-span-3` | Two promo cards |
| Rail | `lg:col-span-4` | 5 ThumbRows |

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Section label |
| `href` | `string` | Section link |
| `viewAllHref` | `string` | "View all" link |
| `feature` | `Story` | Lead story |
| `stack` | `Story[]` | Two supporting stories |
| `rail` | `Story[]` | Rail stories |

---

### ListBand

**File:** `src/components/home4/ListBand.astro`

"Latest News" — two-column run of thumbed rows, rule-separated.

**Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2/3`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Section label |
| `href` | `string` | — | Section link |
| `viewAllHref` | `string` | — | "View all" link |
| `stories` | `Story[]` | required | Stories |
| `cols` | `2 \| 3` | `2` | Column count |

---

### SplitBand

**File:** `src/components/home4/SplitBand.astro`

Mirrored split lead + four-up cards + optional rail.

**Layout:** `grid grid-cols-1 lg:grid-cols-12`

| Region | Columns | Condition |
|--------|---------|-----------|
| Main | `lg:col-span-8 xl:col-span-9` | With rail |
| Main | `lg:col-span-12` | Without rail |
| Rail | `lg:col-span-4 xl:col-span-3` | When rail exists |

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Section label (omit to continue previous band) |
| `href` | `string` | Section link |
| `viewAllHref` | `string` | "View all" link |
| `lead` | `Story` | Lead story |
| `cards` | `Story[]` | Four supporting stories |
| `rail` | `Story[]` | Rail stories |
| `authors` | `Story[]` | Author stories |

---

## State Reference

### Global State Classes

```css
/* Hover (structural — parent carries .group) */
.group-hover:text-azure           /* Light mode link hover */
.dark\:group-hover:text-azure-light  /* Dark mode link hover */
.group-hover:scale-[1.03]       /* Image zoom */

/* Focus (keyboard navigation) */
:focus-visible                    /* 2px outline, offset 2px */
.focus-ring                      /* Standardized focus ring */

/* Active */
:active                           /* Opacity 0.95 */

/* Disabled */
[disabled]                        /* Opacity 0.5, cursor-not-allowed */
```

### Dark Mode Classes

Every component uses `.dark` variants:

```astro
<!-- Light mode: text-text-primary | Dark mode: text-ivory -->
<h3 class="text-text-primary dark:text-ivory">

<!-- Light mode: border-rule | Dark mode: border-ivory/10 -->
<div class="border-b border-rule dark:border-ivory/10">

<!-- Light mode: bg-light-gray | Dark mode: bg-brand-elevated -->
<div class="bg-light-gray dark:bg-brand-elevated">
```

### Transition Tokens

| Property | Duration | Easing |
|----------|----------|--------|
| Color | 150ms | ease-out |
| Transform (zoom) | 700ms | ease-out |
| Opacity | 200ms | ease-out |
| Border | 200ms | ease-out |

---

## Focus & Accessibility

### Focus States

All interactive elements have visible focus states:

```css
/* Standard focus ring */
:focus-visible {
  outline: 2px solid var(--color-azure);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML

| Component | Tag | Notes |
|-----------|-----|-------|
| Headline | `h1` / `h2` / `h3` | Single H1 per page |
| Band | `section` | With `aria-labelledby` |
| Story link | `a` | With `href`, never `div` with click |
| Image | `img` | Always `alt` text |
| List | `div` with ARIA | Semantic grouping |

### ARIA Patterns

```astro
<!-- Band with labelled heading -->
<section aria-labelledby="section-latest">
  <BandHeading id="section-latest" label="Latest News" />
</section>

<!-- Image with alt text -->
<img src={image} alt={title} loading="lazy" />

<!-- Decorative elements -->
<div aria-hidden="true" class="h-px bg-rule"></div>
```

---

*Last updated: August 2026*
