const REAL_IMAGES = [
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557623-untitled-1-recovered.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557609-trump-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557606-untitled-1-recovered.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557579-ram-charan.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557575-1000507312.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557546-mammootyyyt.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557519-neww.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557505-sanjeev-kapoor-reveals-rejecting-masterchef-india-for-not-being-paid-more-than-akshay-kumar.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557590-whatsapp-image-2026-06-24-at-151433.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557560-kldfhb.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557552-fdbvb.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557547-fgfg.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557520-colombia.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557618-riyadh.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557604-sharjah.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557582-alain.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/01/500x300_1552422-midday-break-oman.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557562-hip.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557645-passport1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/19/500x500_1556567-uddav-2.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557639-untitled-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/14/500x500_1555314-ayodhya-temple.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557601-mahuva-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x500_1557572-bnk.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557569-caption.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557563-john.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557549-fcra.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557670-untitled-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557675-text-thumb.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557666-untitled-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557663-beef-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557661-untitled-1.webp',
  'https://www.mediaoneonline.com/h-upload/2026/06/23/500x300_1557413-untitled-1-recovered-recovered-recovered-recovered-recovered-recovered.webp',
];

const DEFAULT_IMAGE = 'https://www.mediaoneonline.com/h-upload/2026/06/24/500x300_1557675-text-thumb.webp';

export const articleImages: Record<string, string> = {
  'hero': REAL_IMAGES[0],
  'kl-1': REAL_IMAGES[1],
  'kl-2': REAL_IMAGES[2],
  'kl-3': REAL_IMAGES[3],
  'kl-4': REAL_IMAGES[4],
  'kl-5': REAL_IMAGES[5],
  'kl-6': REAL_IMAGES[6],
  'rain': REAL_IMAGES[7],
  'hospital': REAL_IMAGES[8],
  'reshuffle-top': REAL_IMAGES[9],
  'pala': REAL_IMAGES[10],
  'vote-buying': REAL_IMAGES[11],
  'sabarimala': REAL_IMAGES[12],
  'ind-1': REAL_IMAGES[13],
  'ind-2': REAL_IMAGES[14],
  'ind-3': REAL_IMAGES[15],
  'ind-4': REAL_IMAGES[16],
  'ind-5': REAL_IMAGES[17],
  'gold': REAL_IMAGES[18],
  'trade': REAL_IMAGES[19],
  'cricket': REAL_IMAGES[20],
  'g7': REAL_IMAGES[21],
  'world-1': REAL_IMAGES[22],
  'world-2': REAL_IMAGES[23],
  'world-3': REAL_IMAGES[24],
  'world-4': REAL_IMAGES[25],
  'world-5': REAL_IMAGES[26],
  'qatar': REAL_IMAGES[27],
  'saudi': REAL_IMAGES[28],
  'kuwait': REAL_IMAGES[29],
  'gulf-1': REAL_IMAGES[30],
  'gulf-2': REAL_IMAGES[31],
  'gulf-3': REAL_IMAGES[0],
  'gulf-4': REAL_IMAGES[1],
  'gulf-5': REAL_IMAGES[2],
  'ent-1': REAL_IMAGES[3],
  'ent-2': REAL_IMAGES[4],
  'ent-3': REAL_IMAGES[5],
  'ent-4': REAL_IMAGES[6],
  'ent-5': REAL_IMAGES[7],
  'bollywood': REAL_IMAGES[8],
  'sport-1': REAL_IMAGES[9],
  'sport-2': REAL_IMAGES[10],
  'sport-3': REAL_IMAGES[11],
  'sport-4': REAL_IMAGES[12],
  'sport-5': REAL_IMAGES[13],
  'cricket-aus': REAL_IMAGES[14],
  'thumb': DEFAULT_IMAGE,
  'magazine': REAL_IMAGES[15],
  'analysis': REAL_IMAGES[16],
  'life-story': REAL_IMAGES[17],
  'eyecatcher': REAL_IMAGES[18],
  'face-to-face': REAL_IMAGES[19],
  'crime': REAL_IMAGES[20],
  'health': REAL_IMAGES[21],
  'tech': REAL_IMAGES[22],
  'business': REAL_IMAGES[23],
  'auto': REAL_IMAGES[24],
  'travel': REAL_IMAGES[25],
  'lifestyle': REAL_IMAGES[26],
};

export function getArticleImage(key: string | undefined): string {
  if (!key) return DEFAULT_IMAGE;
  if (key.startsWith('http')) return key;
  return articleImages[key] || DEFAULT_IMAGE;
}

// Stable seed → dummy image URL. Mirrors the picker in components/DummyImage.astro
// so a poster resolved in JS (e.g. the video modal) matches the same seed's
// on-page thumbnail. Keep this list/logic in sync with DummyImage.
function stableIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export function dummyImageUrl(seed: string): string {
  return REAL_IMAGES[stableIndex(seed) % REAL_IMAGES.length];
}
