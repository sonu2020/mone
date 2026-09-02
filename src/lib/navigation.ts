/**
 * Navigation data — single source of truth for Header + Footer.
 * Extracted from the live mediaoneonline.com site structure.
 */

/* ── Primary nav (header bar + mobile drawer) ─────────────────────── */
export const navLinks = [
  { label: 'Latest',        ml: 'പുതിയ വാർത്തകൾ', href: '/latest-news' },
  { label: 'Kerala',        ml: 'കേരളം',           href: '/kerala' },
  { label: 'India',         ml: 'ഇന്ത്യ',          href: '/india' },
  { label: 'World',         ml: 'ലോകം',            href: '/world' },
  { label: 'Gulf',          ml: 'ഗൾഫ്',            href: '/gulf' },
  { label: 'Entertainment', ml: 'വിനോദം',          href: '/entertainment' },
  { label: 'Sports',        ml: 'കായികം',           href: '/sports' },
  { label: 'Crime',         ml: 'ക്രൈം',            href: '/crime' },
  { label: 'Videos',        ml: 'വീഡിയോ',          href: '/videos' },
] as const;

/* ── Footer columns ───────────────────────────────────────────────── */
export const footerColumns = [
  {
    title: 'News',
    links: [
      { label: 'Latest',        href: '/latest-news' },
      { label: 'Kerala',        href: '/kerala' },
      { label: 'India',         href: '/india' },
      { label: 'World',         href: '/world' },
      { label: 'Sports',        href: '/sports' },
      { label: 'Entertainment', href: '/entertainment' },
      { label: 'Crime',         href: '/crime' },
    ],
  },
  {
    title: 'Gulf',
    links: [
      { label: 'UAE',           href: '/gulf/uae' },
      { label: 'Saudi',         href: '/gulf/saudi-arabia' },
      { label: 'Qatar',         href: '/gulf/qatar' },
      { label: 'Bahrain',       href: '/gulf/bahrain' },
      { label: 'Kuwait',        href: '/gulf/kuwait' },
      { label: 'Oman',          href: '/gulf/oman' },
    ],
  },
  {
    title: 'Shelf',
    links: [
      { label: 'Analysis',      href: '/mediaone-shelf/analysis' },
      { label: 'Interview',     href: '/mediaone-shelf/interview' },
      { label: 'Article',       href: '/mediaone-shelf/column' },
      { label: 'Explainer',     href: '/mediaone-shelf/explainer' },
      { label: 'Media Scan',    href: '/mediaone-shelf/media-scan' },
    ],
  },
  {
    title: 'Life',
    links: [
      { label: 'Health',        href: '/health' },
      { label: 'Tech',          href: '/tech' },
      { label: 'Education',     href: '/education' },
      { label: 'Business',      href: '/business' },
      { label: 'Agriculture',   href: '/agriculture' },
      { label: 'Auto',          href: '/auto' },
      { label: 'Travel',        href: '/travel' },
      { label: 'Food Map',      href: '/food-map' },
      { label: 'Lifestyle',     href: '/lifestyle' },
    ],
  },
  {
    title: 'TV Shows',
    links: [
      { label: 'Special Edition', href: '/programs/special-edition' },
      { label: 'News @ 1',       href: '/programs/news-at-1' },
      { label: 'Mid East Hour',  href: '/programs/mid-east-hour' },
      { label: 'Media Scan',     href: '/programs/media-scan' },
      { label: 'Nilapadu',       href: '/programs/nilapadu' },
      { label: 'Saudi Story',    href: '/programs/saudi-story' },
      { label: 'Weekend Arabia', href: '/programs/weekend-arabia' },
      { label: 'World With Us',  href: '/programs/world-with-us' },
      { label: 'Stethoscope',    href: '/programs/stethoscope' },
    ],
  },
  {
    title: 'Digital Shows',
    links: [
      { label: 'Out Of Focus',   href: '/programs/out-of-focus' },
      { label: "Editor's Take",  href: '/programs/editorstake' },
      { label: 'AjimShow',       href: '/programs/ajimshow' },
      { label: 'Deshantharam',   href: '/programs/deshantharam' },
      { label: 'Film Interview', href: '/programs/film-interview' },
    ],
  },
] as const;

/* ── Mobile footer (condensed link set) ───────────────────────────── */
export const mobileFooterLinks = [
  { label: 'Latest News', href: '/latest-news' },
  { label: 'Gulf',         href: '/gulf' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Sports',       href: '/sports' },
  { label: 'Videos',       href: '/videos' },
  { label: 'Shows',        href: '/programs' },
  { label: 'Crime',        href: '/crime' },
  { label: 'Health',       href: '/health' },
  { label: 'Tech',         href: '/tech' },
  { label: 'Education',    href: '/education' },
  { label: 'Business',     href: '/business' },
  { label: 'Agriculture',  href: '/agriculture' },
  { label: 'Auto',         href: '/auto' },
  { label: 'Travel',       href: '/travel' },
  { label: 'Lifestyle',    href: '/lifestyle' },
] as const;

/* ── Social links ─────────────────────────────────────────────────── */
export const socialLinks = [
  { label: 'Facebook',  href: 'https://www.facebook.com/MediaoneTV/' },
  { label: 'X',         href: 'https://twitter.com/MediaOneTVLive' },
  { label: 'YouTube',   href: 'https://www.youtube.com/channel/UCpt10lzibN9Ux-tFGVAnrBw' },
  { label: 'Instagram', href: 'https://www.instagram.com/mediaonetv.in/' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/mediaonetv/' },
  { label: 'Telegram',  href: 'https://t.me/s/MediaoneTV' },
] as const;

/* ── Legal / corporate links ──────────────────────────────────────── */
export const legalLinks = [
  { label: 'About Us',        href: '/about-us' },
  { label: 'Our Team',        href: '/our-team' },
  { label: 'Investor Care',   href: '/investor-care' },
  { label: 'Terms of Use',    href: '/terms-and-conditions' },
  { label: 'Privacy Policy',  href: '/privacy-policy' },
  { label: 'Contact Us',      href: '/contact-us' },
] as const;
