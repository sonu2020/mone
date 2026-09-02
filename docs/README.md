# MediaOne Design System Documentation

*Comprehensive documentation for the MediaOne editorial design system — atoms, blocks, bands, tokens, states, and layout theory.*

---

## Quick Start

| Document | What you'll find | Read this if... |
|----------|-----------------|-----------------|
| **[Design System](design-system.md)** | Atomic architecture, tokens, composition patterns, state system | You need the big picture |
| **[Components](components.md)** | Complete component catalog with props, states, and usage | You're building or modifying UI |
| **[Layout Theory](layout-theory.md)** | Density, depth, rhythm, grid architecture, responsive patterns | You're designing page layouts |
| **[Video Subsystem](video-subsystem.md)** | Video-specific components and patterns | You're working with video content |
| **[Homepage Patterns](homepage-patterns.md)** | The / band set — composition, anatomy, per-band API | You're building or modifying a homepage band |
| **[Inspector](inspector.md)** | Internal LeadPackage token/provenance inspection and preview rules | You're auditing the canonical homepage component |
---

## Design System at a Glance

### Atomic Hierarchy

```
ATOM → BLOCK → BAND → PAGE

Atom:   Media, Headline, Kicker, MetaRow, BandHeading
Block:  StoryCard, StoryRow, ThumbRow, VideoCard, ArticleCard
Band:   FeatureBand, ListBand, SplitBand, ShelfBand, VideoBand
Page:   Thin conductor — imports bands, passes data, inserts ads
```

### Key Tokens

| Category | Token | Value |
|----------|-------|-------|
| **Primary accent** | `--color-azure` | `oklch(0.527 0.153 253)` (#166bc0) |
| **Dark text** | `--color-ink` | `oklch(0.376 0.065 262)` |
| **Light surface** | `--color-off-white` | `#fffeff` |
| **Hairline** | `--color-rule` | `oklch(0.905 0.006 250)` |
| **Hero type** | `--text-hero` | 24px → 44px |
| **Headline type** | `--text-headline` | 14px → 18px |

### The One Rule

> **Hierarchy is density, not chrome.**
>
> Importance = size of type + size of image + amount of space. Never borders, shadows, or decorative color.

---

## File Organization

```
docs/
├── README.md                 ← You are here
├── design-system.md          ← Atoms, tokens, patterns, states
├── components.md             ← Full component reference
├── layout-theory.md          ← Density, depth, rhythm, grids
└── video-subsystem.md        ← Video-specific components
```

---

## Contributing

When adding new components or modifying existing ones:

1. **Read [design-system.md](design-system.md)** to understand the atomic hierarchy
2. **Check [components.md](components.md)** for existing patterns and props conventions
3. **Consult [layout-theory.md](layout-theory.md)** for density/depth placement
4. **Follow the state system**: default → hover → focus → active → disabled
5. **Use tokens**: Never hardcode colors, spacing, or type sizes
6. **Respect the rhythm**: Sparse → Dense → Moderate → Sparse → Dense

---

*Last updated: August 2026*
