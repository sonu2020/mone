// ============================================================================
// Desk features — the one promo a desk may run above its own material.
//
// A desk page is a standard shell, so a bespoke feature can't be dropped into
// one page's markup without that page stopping being standard. This is the
// seam: a desk names a feature here, DeskPage renders it in a fixed slot, and
// every desk keeps the same code path whether it has one or not.
//
// One per desk on purpose. Two promos above the fold is a front page, and the
// desk already has one of those.
// ============================================================================

export interface DeskFeature {
  kicker: string;
  title: string;
  standfirst: string;
  href: string;
  image: string;
  /** Small facts printed under the standfirst — distance, duration, count. */
  facts?: { label: string; value: string }[];
  cta?: string;
}

export const deskFeatures: Record<string, DeskFeature> = {
  travel: {
    kicker: 'ട്രെക്ക് · Travelogue',
    title: 'കുമാരപർവതം — Kumara Parvatha',
    standfirst:
      'കുക്കെ സുബ്രഹ്മണ്യയിൽനിന്ന് പതിമൂന്ന് കിലോമീറ്റർ, 1712 മീറ്റർ ഉയരം. കർണാടകയിലെ ഏറ്റവും കഠിനമായ ട്രെക്കിലേക്ക് രണ്ട് ദിവസം.',
    href: '/travel/kumara-parvatha',
    image: 'https://www.mediaoneonline.com/h-upload/2026/08/02/500x300_1432284-untitled-1.webp',
    facts: [
      { label: 'Distance', value: '13 km' },
      { label: 'Summit', value: '1,712 m' },
      { label: 'Days', value: '2' },
    ],
    cta: 'Walk the route',
  },
};

export const featureFor = (deskId: string): DeskFeature | undefined => deskFeatures[deskId];
