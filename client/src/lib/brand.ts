/**
 * Brand assets for Zeesha Collection.
 *
 * The mark is the client's own Instagram emblem: a gold "Z" monogram with an
 * abaya-clad figure on deep emerald. All URLs honour Vite's BASE_URL so they
 * resolve both locally and under a hosted sub-path.
 */
const BASE = import.meta.env.BASE_URL;

/** Square house mark (wordmark included). */
export const LOGO_ORIGINAL = `${BASE}brand/zeesha-logo.png`;

/** JPEG fallback of the same mark. */
export const LOGO_JPG = `${BASE}brand/zeesha-logo.jpg`;

/** Emblem-only crop — best for small UI slots (admin topbar, avatars). */
export const LOGO_TRIMMED = `${BASE}brand/zeesha-logo.png`;

/** Kept for API compatibility with shared components. */
export const LOGO_TRANSPARENT = LOGO_ORIGINAL;
export const LOGO_SVG = LOGO_ORIGINAL;

/** Editorial hero photography, extracted from the brand's own reels. */
export const HERO_IMAGE = `${BASE}images/hero/hero-01.webp`;

/** Atelier visual used on the About page. */
export const ABOUT_IMAGE = `${BASE}images/products/sahar-steel-blue-abaya.webp`;

/** Social sharing image (1200×630). */
export const OG_IMAGE = `${BASE}og-image.png`;

/** Absolute URL of the social image, as crawlers require. */
export const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:5173';
export const OG_IMAGE_ABSOLUTE = new URL(OG_IMAGE, SITE_URL).href;
