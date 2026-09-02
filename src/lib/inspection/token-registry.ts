export type TokenKind = 'color' | 'type' | 'spacing' | 'radius' | 'axis' | 'utility' | 'structural';

export interface TokenDefinition {
  id: string;
  kind: TokenKind;
  source: string;
  note: string;
}

const SOURCE = 'src/styles/app.css';

export const TOKEN_REGISTRY: Record<string, TokenDefinition> = {
  'text-ink': { id: '--color-ink', kind: 'color', source: SOURCE, note: 'primary ink' },
  'text-ivory': { id: '--color-ivory', kind: 'color', source: SOURCE, note: 'inverse text' },
  'text-azure': { id: '--color-azure', kind: 'color', source: SOURCE, note: 'reserved accent' },
  'text-ink-muted': { id: '--color-ink-muted', kind: 'color', source: SOURCE, note: 'metadata text' },
  'text-text-primary': { id: '--color-text-primary', kind: 'color', source: SOURCE, note: 'primary text utility' },
  'text-text-secondary': { id: '--color-text-secondary', kind: 'color', source: SOURCE, note: 'secondary text utility' },
  'bg-rule': { id: '--color-rule', kind: 'color', source: SOURCE, note: 'rule surface' },
  'bg-azure': { id: '--color-azure', kind: 'color', source: SOURCE, note: 'accent surface' },
  'bg-placeholder': { id: '--color-placeholder', kind: 'color', source: SOURCE, note: 'placeholder surface' },
  'text-text-muted': { id: '--color-text-muted', kind: 'color', source: SOURCE, note: 'muted text utility' },
  'text-text-light': { id: '--color-text-light', kind: 'color', source: SOURCE, note: 'light metadata utility' },
  'text-text-navy-deep': { id: '--color-text-navy-deep', kind: 'color', source: SOURCE, note: 'navy headline utility' },
  'bg-bg-card': { id: '--color-bg-card', kind: 'color', source: SOURCE, note: 'card surface' },
  'bg-bg-page': { id: '--color-bg-page', kind: 'color', source: SOURCE, note: 'page surface' },
  'bg-ivory': { id: '--color-ivory', kind: 'color', source: SOURCE, note: 'light surface' },
  'bg-light-gray': { id: '--color-light-gray', kind: 'color', source: SOURCE, note: 'tinted surface' },
  'bg-brand-elevated': { id: '--color-brand-elevated', kind: 'color', source: SOURCE, note: 'dark elevated surface' },
  'bg-header-bg-deep': { id: '--color-header-bg-deep', kind: 'color', source: SOURCE, note: 'player surface' },
  'border-rule': { id: '--color-rule', kind: 'color', source: SOURCE, note: 'hairline' },
  'border-rule-light': { id: '--color-rule-light', kind: 'color', source: SOURCE, note: 'light hairline' },
  'text-display': { id: '--text-display', kind: 'type', source: SOURCE, note: 'display scale' },
  'text-hero': { id: '--text-hero', kind: 'type', source: SOURCE, note: 'hero scale' },
  'text-title': { id: '--text-title', kind: 'type', source: SOURCE, note: 'title scale' },
  'text-section': { id: '--text-section', kind: 'type', source: SOURCE, note: 'section scale' },
  'text-headline': { id: '--text-headline', kind: 'type', source: SOURCE, note: 'headline scale' },
  'text-lead': { id: '--text-lead', kind: 'type', source: SOURCE, note: 'lead scale' },
  'text-body': { id: '--text-body', kind: 'type', source: SOURCE, note: 'body scale' },
  'text-meta': { id: '--text-meta', kind: 'type', source: SOURCE, note: 'meta scale' },
  'text-eyebrow': { id: '--text-eyebrow', kind: 'type', source: SOURCE, note: 'eyebrow scale' },
  'text-caption': { id: '--text-caption', kind: 'type', source: SOURCE, note: 'caption scale' },
  'text-micro': { id: '--text-micro', kind: 'type', source: SOURCE, note: 'sub-caption badge scale (video theater overlays)' },
  'text-icon': { id: '--text-icon', kind: 'type', source: SOURCE, note: 'static icon-glyph scale (toolbar / share buttons)' },
  'text-deck': { id: '--text-deck', kind: 'type', source: SOURCE, note: 'dense deck scale' },
  'text-feature': { id: '--text-feature', kind: 'type', source: SOURCE, note: 'dense feature scale' },
  'text-lead-story': { id: '--text-lead-story', kind: 'type', source: SOURCE, note: 'dense lead scale' },
  'text-band': { id: '--text-band', kind: 'type', source: SOURCE, note: 'band label scale' },
  'headline-lead': { id: '--text-lead', kind: 'utility', source: SOURCE, note: 'LeadPackage headline utility' },
  'headline-deck': { id: '--text-deck', kind: 'utility', source: SOURCE, note: 'dense headline utility' },
  'caption-text': { id: '--text-caption', kind: 'utility', source: SOURCE, note: 'caption utility' },
  'row-meta': { id: '--text-meta', kind: 'utility', source: SOURCE, note: 'rail metadata utility' },
  'font-malayalam': { id: '--font-malayalam', kind: 'utility', source: SOURCE, note: 'Malayalam font stack' },
  'font-malayalam-alt': { id: '--font-malayalam-alt', kind: 'utility', source: SOURCE, note: 'alternate Malayalam font stack' },
  eyebrow: { id: 'eyebrow-utility', kind: 'utility', source: SOURCE, note: 'eyebrow utility' },
  'text-sm': { id: 'tailwind-text-sm', kind: 'structural', source: SOURCE, note: 'standard utility' },
  'text-balance': { id: 'text-wrap-balance', kind: 'structural', source: SOURCE, note: 'standard utility' },
  mc: { id: 'component-marker', kind: 'structural', source: 'src/styles/app.css', note: 'inert component marker' },
  'font-mono': { id: '--font-mono', kind: 'utility', source: SOURCE, note: 'code font stack' },
  'font-bold': { id: 'font-weight-700', kind: 'utility', source: SOURCE, note: 'approved weight utility' },
  'font-semibold': { id: 'font-weight-600', kind: 'utility', source: SOURCE, note: 'approved weight utility' },
  'font-medium': { id: 'font-weight-500', kind: 'utility', source: SOURCE, note: 'approved weight utility' },
  'rounded-none': { id: '--radius-none', kind: 'radius', source: SOURCE, note: 'square geometry' },
  'rounded-xs': { id: '--radius-sm', kind: 'radius', source: SOURCE, note: 'small radius' },
  'rounded-sm': { id: '--radius-sm', kind: 'radius', source: SOURCE, note: 'small radius' },
  'rounded-md': { id: '--radius-md', kind: 'radius', source: SOURCE, note: 'medium radius' },
  'size-2': { id: '--spacing-sm', kind: 'spacing', source: SOURCE, note: 'small square' },
};

export const STRUCTURAL_PREFIXES = [
  'grid-', 'grid', 'col-', 'row-', 'flex', 'items-', 'justify-', 'gap-', 'space-',
  'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-', 'm-', 'mx-', 'my-', 'mt-',
  'mb-', 'ml-', 'mr-', 'w-', 'h-', 'min-', 'max-', 'block', 'inline-', 'relative',
  'absolute', 'inset-', 'overflow-', 'object-', 'aspect-', 'line-clamp-', 'shrink-',
  'grow-', 'text-left', 'text-right', 'text-center', 'tabular-nums', 'transition-',
  'duration-', 'group', 'dark:', 'md:', 'lg:', 'xl:', 'sm:', 'leading-', 'tracking-',
  'uppercase', 'truncate', 'whitespace-', 'break-', 'align-', 'select-', 'z-', 'top-',
  'bottom-', 'left-', 'right-', 'translate-', 'opacity-', 'ring-', 'border-', 'last:',
  'first:', 'hover:', 'focus:', 'aria-',
];

export function tokenForClass(cls: string): TokenDefinition | null {
  return TOKEN_REGISTRY[cls] ?? null;
}

export function isStructuralClass(cls: string): boolean {
  return STRUCTURAL_PREFIXES.some((prefix) => cls === prefix || cls.startsWith(prefix));
}
