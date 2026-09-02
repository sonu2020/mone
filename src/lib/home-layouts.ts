// Registry of homepage layout experiments exposed under /home/<id>.
// `signature` is the one-line design rationale shown in the switcher tooltip.
export interface HomeLayout {
  id: string;
  label: string;
  signature: string;
}

export const homeLayouts: HomeLayout[] = [
  { id: 'modular',   label: 'Modular Mix', signature: 'Live homepage — NYT + BBC 3-Col + Sky synthesis, dense & packed (current)' },
  { id: 'magazine',  label: 'Magazine',    signature: 'Previous homepage — large OverlayStory hero, EditorialShelf bands' },
  { id: 'ideal',     label: 'Editorial',   signature: 'The synthesis — image-led, calm rhythm, time-aware' },
  { id: 'nyt',       label: 'Broadsheet',  signature: 'NYT — rule-divided columns, text-forward hierarchy' },
  { id: 'guardian',  label: 'Pillars',     signature: 'Guardian — bold container blocks, accent top-borders' },
  { id: 'bbc',       label: 'Modular',     signature: 'BBC — uniform promo-card grid + numbered rail' },
  { id: 'bbc-3col',  label: 'Modular 3-Col', signature: 'BBC — 3-column asymmetric layout with sidebars' },
  { id: 'aljazeera', label: 'Spotlight',   signature: 'Al Jazeera — image-led hero cluster' },
  { id: 'sky',       label: 'Live',        signature: 'Sky News — breaking-led, timestamp-driven' },
];

export const defaultLayout = homeLayouts[0].id;
