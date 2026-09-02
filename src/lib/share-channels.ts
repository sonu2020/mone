// The share affordance's channels. Icon classes are Tabler webfont glyphs
// (loaded globally through app.css); the readable name rides on
// aria-label/title, so the button itself stays a square glyph.
export const shareChannels = [
  { name: 'Facebook', icon: 'ti-brand-facebook' },
  { name: 'X', icon: 'ti-brand-x' },
  { name: 'WhatsApp', icon: 'ti-brand-whatsapp' },
] as const;

// Name → glyph lookup for surfaces that receive channel names (e.g. the
// StoryArticle `share` prop) rather than iterating the list itself.
export const shareIconByName: Record<string, string> = Object.fromEntries(
  shareChannels.map((c) => [c.name, c.icon]),
);
