/**
 * Brand asset pipeline for Zeesha Collection.
 *
 * Source of truth: client/public/brand/zeesha-logo.png — the client's own
 * Instagram mark (gold "Z" monogram with an abaya figure on deep emerald).
 *
 * Produces:
 *   favicon-32.png, favicon-48.png, apple-touch-icon.png   (emblem crop)
 *   og-image.png                                           1200×630 social card
 *
 *   node scripts/brand-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BRAND_DIR = path.join(ROOT, 'client/public/brand');
const PUBLIC_DIR = path.join(ROOT, 'client/public');
const LOGO = path.join(BRAND_DIR, 'zeesha-logo.png');
const HERO = path.join(PUBLIC_DIR, 'images/hero/hero-02.webp');

const EMERALD = '#073A2F';
const GOLD = '#D3AE65';

async function main() {
  if (!fs.existsSync(LOGO)) throw new Error(`Brand mark missing: ${LOGO}`);

  const meta = await sharp(LOGO).metadata();
  const width = meta.width ?? 600;
  const height = meta.height ?? 600;

  // Emblem occupies the top ~59% of the square mark. Keep full width, then
  // centre-crop to a square so the monogram stays legible at 32 px.
  const emblemHeight = Math.round(height * 0.59);
  const emblem = await sharp(LOGO)
    .extract({ left: 0, top: 0, width, height: emblemHeight })
    .toBuffer();

  for (const [size, name] of [
    [32, 'favicon-32.png'],
    [48, 'favicon-48.png'],
    [180, 'apple-touch-icon.png'],
  ]) {
    await sharp(emblem)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(path.join(PUBLIC_DIR, name));
  }

  // Social card: emerald field, editorial headline, hero image on the right.
  const w = 1200;
  const h = 630;
  const heroWidth = 520;

  const hero = await sharp(HERO)
    .resize(heroWidth, h, { fit: 'cover', position: 'attention' })
    .toBuffer();

  const logo = await sharp(LOGO).resize(168, 168).png().toBuffer();

  const overlay = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${EMERALD}" stop-opacity="1"/>
          <stop offset="0.55" stop-color="${EMERALD}" stop-opacity="0.85"/>
          <stop offset="1" stop-color="${EMERALD}" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.15" cy="0.15" r="0.6">
          <stop offset="0" stop-color="${GOLD}" stop-opacity="0.18"/>
          <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#glow)"/>
      <rect x="${w - heroWidth}" y="0" width="${heroWidth}" height="${h}" fill="url(#fade)"/>
      <rect x="87.5" y="95.5" width="169" height="169" fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1.5"/>
      <rect x="88" y="352" width="72" height="1.5" fill="${GOLD}"/>
      <text x="88" y="324" font-family="Jost, Arial, sans-serif" font-size="17" letter-spacing="7"
            fill="${GOLD}">ZEESHA COLLECTION</text>
      <text x="86" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="76"
            fill="#FCF9F2">Elegance,</text>
      <text x="86" y="518" font-family="Georgia, 'Times New Roman', serif" font-size="76"
            font-style="italic" fill="${GOLD}">draped.</text>
      <text x="90" y="568" font-family="Jost, Arial, sans-serif" font-size="18"
            letter-spacing="1.5" fill="#FCF9F2" fill-opacity="0.72">Premium abayas · burkhas · hijabs · pashmina</text>
      <text x="90" y="600" font-family="Jost, Arial, sans-serif" font-size="15"
            letter-spacing="2.5" fill="${GOLD}" fill-opacity="0.8">DELIVERY ALL OVER INDIA</text>
    </svg>
  `);

  await sharp({
    create: { width: w, height: h, channels: 4, background: EMERALD },
  })
    .composite([
      { input: hero, left: w - heroWidth, top: 0 },
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 88, top: 96 },
    ])
    .png({ quality: 92 })
    .toFile(path.join(PUBLIC_DIR, 'og-image.png'));

  console.log('Brand assets written: favicons + og-image.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
