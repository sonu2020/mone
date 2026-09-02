export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  fontFamily: 'sans' | 'serif';
  fontFamilyName: string;
  logoText: string;
}

export const themes: Theme[] = [
  {
    id: 'mediaone',
    name: 'MediaOne',
    primary: 'oklch(0.4 0.164 29.234)',     /* #8B0000 */
    secondary: 'oklch(0.214 0.002 67.693)', /* #1A1918 */
    accent: 'oklch(0.735 0.146 84.267)',    /* #D4A017 */
    bgLight: 'oklch(0.97 0.007 88.642)',    /* #F7F5F0 */
    bgDark: 'oklch(0.146 0.006 69.198)',    /* #0C0A08 */
    fontFamily: 'serif',
    fontFamilyName: '"Noto Serif Malayalam", "Noto Serif", Georgia, serif',
    logoText: 'MediaOne',
  },
  {
    id: 'bbc',
    name: 'BBC News',
    primary: 'oklch(0.491 0.202 29.234)',   /* #B80000 */
    secondary: 'oklch(0.145 0 0)',          /* #0A0A0A */
    accent: 'oklch(0.735 0.146 84.267)',    /* #D4A017 */
    bgLight: 'oklch(0.985 0.001 106.423)',  /* #FAFAF9 */
    bgDark: 'oklch(0.128 0.003 106.79)',    /* #070706 */
    fontFamily: 'sans',
    fontFamilyName: '"Noto Sans Malayalam", "Noto Sans", system-ui, sans-serif',
    logoText: 'BBC NEWS',
  },
  {
    id: 'skynews',
    name: 'Sky News',
    primary: 'oklch(0.225 0.066 262.424)',  /* #0A1A3A */
    secondary: 'oklch(0.628 0.258 29.234)', /* #FF0000 */
    accent: 'oklch(0.887 0.182 95.33)',     /* #FFD700 */
    bgLight: 'oklch(0.985 0.001 106.423)',  /* #FAFAF9 */
    bgDark: 'oklch(0.127 0.009 253.655)',   /* #05070A */
    fontFamily: 'sans',
    fontFamilyName: '"Noto Sans Malayalam", "Noto Sans", system-ui, sans-serif',
    logoText: 'sky news',
  },
  {
    id: 'guardian',
    name: 'The Guardian',
    primary: 'oklch(0.437 0.109 244.541)',  /* #005689 */
    secondary: 'oklch(0.145 0 0)',          /* #0A0A0A */
    accent: 'oklch(0.519 0.006 67.694)',    /* #6B6865 */
    bgLight: 'oklch(0.964 0.004 91.447)',   /* #F4F3F0 */
    bgDark: 'oklch(0.115 0 0)',             /* #050505 */
    fontFamily: 'serif',
    fontFamilyName: '"Noto Serif Malayalam", "Noto Serif", Georgia, serif',
    logoText: 'the guardian',
  },
  {
    id: 'manorama',
    name: 'Manorama Online',
    primary: 'oklch(0.584 0.227 26.869)',   /* #E31B23 */
    secondary: 'oklch(0.214 0.002 67.693)', /* #1A1918 */
    accent: 'oklch(0.735 0.146 84.267)',    /* #D4A017 */
    bgLight: 'oklch(0.97 0.007 88.642)',    /* #F7F5F0 */
    bgDark: 'oklch(0.146 0.006 69.198)',    /* #0C0A08 */
    fontFamily: 'serif',
    fontFamilyName: '"Noto Serif Malayalam", "Noto Serif", Georgia, serif',
    logoText: 'manorama',
  },
];