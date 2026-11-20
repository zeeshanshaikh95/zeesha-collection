/**
 * Static catalogue used ONLY for the GitHub Pages demo build
 * (VITE_DEMO_MODE=true). It mirrors server/src/seed/catalogue.ts so the
 * storefront — browsing, product pages, cart and enquiry flow — works without
 * the API. The admin panel and live edits still require the Express API +
 * MongoDB; set VITE_DEMO_MODE=false (or unset it) once those are live.
 *
 * Product names follow the pieces shown on @zeesha.collection's own reels.
 * Prices are intentionally left "on request": the brand does not publish
 * prices — the bio says "DM for details" — so nothing is invented here.
 */
import type { Category, GalleryItem, Product, PublicSettings } from '@/types';

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const INSTAGRAM = 'https://www.instagram.com/zeesha.collection/';

const CATEGORY_SEEDS: Array<Omit<Category, 'createdAt' | 'updatedAt'>> = [
  {
    _id: 'demo-cat-signature',
    name: 'Signature Abayas',
    slug: 'signature-abayas',
    description: 'Our everyday-to-evening abayas — easy drapes in considered colours.',
    image: 'images/products/meher-cream-abaya.webp',
    displayOrder: 1,
  },
  {
    _id: 'demo-cat-jacket',
    name: 'Jacket Abayas',
    slug: 'jacket-abayas',
    description: 'Open-front layers with delicate trims — made for effortless styling.',
    image: 'images/products/zaria-taupe-jacket-abaya.webp',
    displayOrder: 2,
  },
  {
    _id: 'demo-cat-embroidered',
    name: 'Embroidered Abayas',
    slug: 'embroidered-abayas',
    description: 'Pieces with hand-finished detail, chosen for celebrations.',
    image: 'images/products/zohra-gold-tissue-abaya.webp',
    displayOrder: 3,
  },
  {
    _id: 'demo-cat-burkhas',
    name: 'Burkhas & Naqabs',
    slug: 'burkhas-naqabs',
    description: 'Soft, breathable everyday coverage in calm neutral tones.',
    image: 'images/products/layla-soft-grey-burkha.webp',
    displayOrder: 4,
  },
  {
    _id: 'demo-cat-hijabs',
    name: 'Hijabs & Dupattas',
    slug: 'hijabs-dupattas',
    description: 'Printed and textured drapes to finish the look.',
    image: 'images/products/sana-pearl-detail-dupatta.webp',
    displayOrder: 5,
  },
  {
    _id: 'demo-cat-pashmina',
    name: 'Pashmina & Shawls',
    slug: 'pashmina-shawls',
    description: 'Warm, feather-light wraps for cooler days and evening gatherings.',
    image: 'images/products/alia-stone-work-shawl.webp',
    displayOrder: 6,
  },
];

export const demoCategories: Category[] = CATEGORY_SEEDS.map((c) => ({
  ...c,
  createdAt: '',
  updatedAt: '',
}));

const category = (slug: string): Category => demoCategories.find((c) => c.slug === slug)!;

type Seed = {
  name: string;
  slug: string;
  categorySlug: string;
  image: string;
  description: string;
  size: string;
  benefits: string[];
  care: string;
  bestseller?: boolean;
  featured?: boolean;
};

const SEEDS: Seed[] = [
  {
    name: 'Meher Cream Abaya',
    slug: 'meher-cream-abaya',
    categorySlug: 'signature-abayas',
    image: 'images/products/meher-cream-abaya.webp',
    description:
      'An ivory abaya cut for an easy, fluid drape, with soft thread work across the front. Understated enough for every day and quietly beautiful for occasions.',
    size: 'Free size · Size 60 available',
    benefits: ['Fluid, non-clingy drape', 'Tonal thread-work front', 'Finished with a matching hijab'],
    care: 'Gentle hand wash in cold water or dry clean. Cool iron on reverse.',
    bestseller: true,
    featured: true,
  },
  {
    name: 'Noor Paisley Embroidered Abaya',
    slug: 'noor-paisley-embroidered-abaya',
    categorySlug: 'embroidered-abayas',
    image: 'images/products/noor-paisley-embroidered-abaya.webp',
    description:
      'A front-open jacket abaya in a muted lilac paisley, with a fine embroidered border running the length of the piece. Layered over its own inner for a complete look.',
    size: 'Free size · Size 60 available',
    benefits: ['All-over paisley print', 'Embroidered front border', 'Comes as a two-piece set'],
    care: 'Dry clean recommended to protect the embroidery. Cool iron on reverse only.',
    featured: true,
  },
  {
    name: 'Zohra Gold Tissue Abaya',
    slug: 'zohra-gold-tissue-abaya',
    categorySlug: 'embroidered-abayas',
    image: 'images/products/zohra-gold-tissue-abaya.webp',
    description:
      'A celebration piece in soft antique gold, with tonal embroidery along the front and cuffs. Light-catching without being loud — made for weddings and Eid.',
    size: 'Free size · Size 60 available',
    benefits: ['Antique-gold tissue finish', 'Tonal embroidery at front and cuffs', 'Lightweight for long wear'],
    care: 'Dry clean only. Store folded with the embroidery facing inward.',
    bestseller: true,
    featured: true,
  },
  {
    name: 'Sahar Steel Blue Abaya',
    slug: 'sahar-steel-blue-abaya',
    categorySlug: 'signature-abayas',
    image: 'images/products/sahar-steel-blue-abaya.webp',
    description:
      'A clean steel-blue abaya with a soft sheen and simple gold-tone closures. The kind of colour that works quietly from morning to evening.',
    size: 'Free size · Size 60 available',
    benefits: ['Soft sheen finish', 'Gold-tone button placket', 'Straight, comfortable cut'],
    care: 'Gentle hand wash separately in cold water. Line dry in shade.',
    bestseller: true,
  },
  {
    name: 'Midnight Bloom Abaya',
    slug: 'midnight-bloom-abaya',
    categorySlug: 'signature-abayas',
    image: 'images/products/midnight-bloom-abaya.webp',
    description:
      'Deep navy with a scattered white bloom print — an easy statement piece that stays comfortable through the day.',
    size: 'Free size · Size 60 available',
    benefits: ['Deep navy ground with floral print', 'Flowing, generous cut', 'Pairs with a plain navy hijab'],
    care: 'Gentle machine wash cold on a delicate cycle. Do not bleach.',
    featured: true,
  },
  {
    name: 'Ruqayya Floral Abaya',
    slug: 'ruqayya-floral-abaya',
    categorySlug: 'signature-abayas',
    image: 'images/products/ruqayya-floral-abaya.webp',
    description:
      'A soft grey-blue floral abaya finished with a contrast placket. Quietly patterned, easy to style and lovely for daytime gatherings.',
    size: 'Free size · Size 60 available',
    benefits: ['Fine floral print', 'Contrast button placket', 'Light, breathable fabric'],
    care: 'Gentle hand wash in cold water. Cool iron on reverse.',
  },
  {
    name: 'Amara Everyday Black Abaya',
    slug: 'amara-everyday-black-abaya',
    categorySlug: 'signature-abayas',
    image: 'images/products/amara-everyday-black-abaya.webp',
    description:
      'The dependable black abaya — clean lines, a fluid fall and just enough detail at the cuff. A wardrobe foundation.',
    size: 'Free size · Size 60 available',
    benefits: ['Classic black everyday drape', 'Subtle cuff detailing', 'Easy to layer or dress up'],
    care: 'Gentle machine wash cold. Line dry in shade.',
    bestseller: true,
  },
  {
    name: 'Ayzah Grey Printed Jacket Abaya',
    slug: 'ayzah-grey-printed-jacket-abaya',
    categorySlug: 'jacket-abayas',
    image: 'images/products/ayzah-grey-printed-abaya.webp',
    description:
      'A softly printed grey jacket abaya with a black trim edge. Wear it open over the matching inner for an effortless layered silhouette.',
    size: 'Free size · Size 60 available',
    benefits: ['Open-front jacket style', 'Black contrast trim', 'Includes matching inner'],
    care: 'Dry clean recommended. Cool iron on reverse only.',
    featured: true,
  },
  {
    name: 'Zaria Taupe Jacket Abaya',
    slug: 'zaria-taupe-jacket-abaya',
    categorySlug: 'jacket-abayas',
    image: 'images/products/zaria-taupe-jacket-abaya.webp',
    description:
      'A warm taupe jacket abaya with fine vertical embroidery. The neutral tone layers beautifully over cream, black or denim.',
    size: 'Free size · Size 60 available',
    benefits: ['Warm taupe neutral', 'Vertical embroidered panels', 'Relaxed open-front cut'],
    care: 'Dry clean recommended to protect the thread work.',
    bestseller: true,
  },
  {
    name: 'Hana Handwork Jacket Abaya',
    slug: 'hana-handwork-jacket-abaya',
    categorySlug: 'jacket-abayas',
    image: 'images/products/hana-handwork-jacket-abaya.webp',
    description:
      'A taupe jacket abaya with a delicate butterfly motif and a jewelled neckline detail. A quiet piece with a little sparkle for evening.',
    size: 'Free size · Size 60 available',
    benefits: ['Butterfly handwork motif', 'Jewelled neckline pin', 'Soft taupe shade'],
    care: 'Dry clean only. Store flat to protect the embellishment.',
    featured: true,
  },
  {
    name: 'Abeer Black & Blush Jacket Abaya',
    slug: 'abeer-black-blush-abaya',
    categorySlug: 'jacket-abayas',
    image: 'images/products/abeer-black-blush-abaya.webp',
    description:
      'Black crepe with blush-pink trim and a line of tonal sequin embroidery down the front. Understated from a distance, detailed up close.',
    size: 'Free size · Size 60 available',
    benefits: ['Blush contrast trim', 'Tonal sequin front panel', 'Soft crepe fall'],
    care: 'Dry clean only. Cool iron on reverse, avoiding the sequins.',
    bestseller: true,
  },
  {
    name: 'Layla Soft Grey Burkha',
    slug: 'layla-soft-grey-burkha',
    categorySlug: 'burkhas-naqabs',
    image: 'images/products/layla-soft-grey-burkha.webp',
    description:
      'A soft grey burkha with a front-opening cut and gently shaped sleeves. Breathable for daily wear and easy to move in.',
    size: 'Free size',
    benefits: ['Breathable everyday fabric', 'Front-opening design', 'Soft grey neutral'],
    care: 'Gentle machine wash cold. Line dry in shade.',
  },
  {
    name: 'Sana Paisley Dupatta',
    slug: 'sana-paisley-dupatta',
    categorySlug: 'hijabs-dupattas',
    image: 'images/products/sana-pearl-detail-dupatta.webp',
    description:
      'A fine paisley dupatta in muted lilac and sage, finished with a delicate fringed edge. Enough pattern to lift a plain abaya.',
    size: 'Approx. 2.25 m · 2.5 m',
    benefits: ['Fine paisley weave', 'Fringed edge finish', 'Lightweight, easy to drape'],
    care: 'Gentle hand wash in cold water. Cool iron on reverse.',
  },
  {
    name: 'Zoya Printed Scarf',
    slug: 'zoya-printed-scarf',
    categorySlug: 'hijabs-dupattas',
    image: 'images/products/zoya-printed-scarf.webp',
    description:
      'A soft printed scarf in a muted paisley — an easy way to bring pattern to an everyday abaya without overdoing it.',
    size: 'Approx. 2 m',
    benefits: ['Muted paisley print', 'Soft, non-slip finish', 'Everyday size'],
    care: 'Gentle hand wash separately. Cool iron on reverse.',
  },
  {
    name: 'Naira Taupe Pashmina',
    slug: 'naira-taupe-pashmina',
    categorySlug: 'pashmina-shawls',
    image: 'images/products/naira-taupe-pashmina.webp',
    description:
      'A feather-light taupe pashmina with a subtle stone-work border. Warm enough for winter evenings, fine enough to fold into a bag.',
    size: 'Approx. 2 m × 1 m',
    benefits: ['Feather-light warmth', 'Stone-work border', 'Pairs with the taupe jacket abaya'],
    care: 'Dry clean only. Store folded with a soft cloth.',
  },
  {
    name: 'Alia Stone-Work Shawl',
    slug: 'alia-stone-work-shawl',
    categorySlug: 'pashmina-shawls',
    image: 'images/products/alia-stone-work-shawl.webp',
    description:
      'A warm neutral shawl with fine stone-work running along the border — the finishing layer for a formal abaya.',
    size: 'Approx. 2 m × 1 m',
    benefits: ['Fine stone-work border', 'Warm neutral shade', 'Generous wrap size'],
    care: 'Dry clean only. Cool iron on reverse, avoiding the stones.',
    featured: true,
  },
];

export const demoProducts: Product[] = SEEDS.map((p, index) => ({
  _id: `demo-${p.slug}`,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: null,
  compareAtPrice: null,
  size: p.size,
  category: category(p.categorySlug),
  images: [p.image],
  ingredients: [],
  benefits: p.benefits,
  howToUse: p.care,
  warnings:
    'No exchange, no returns and no cash on delivery, as per the brand policy. Please confirm size, colour and availability before ordering.',
  variants: [],
  stockStatus: 'in_stock',
  bestseller: p.bestseller ?? false,
  featured: p.featured ?? false,
  seoTitle: `${p.name} | Zeesha Collection`,
  seoDescription: p.description.slice(0, 158),
  displayOrder: index + 1,
  archived: false,
  createdAt: '',
  updatedAt: '',
}));

const GALLERY_SEEDS: Array<Omit<GalleryItem, 'createdAt' | 'updatedAt'>> = [
  {
    _id: 'demo-g1',
    image: 'images/products/noor-paisley-embroidered-abaya.webp',
    caption: 'The Noor jacket abaya',
    externalUrl: INSTAGRAM,
    displayOrder: 1,
    active: true,
  },
  {
    _id: 'demo-g2',
    image: 'images/products/zohra-gold-tissue-abaya.webp',
    caption: 'Antique gold for the celebration season',
    externalUrl: INSTAGRAM,
    displayOrder: 2,
    active: true,
  },
  {
    _id: 'demo-g3',
    image: 'images/gallery/detail-pearl.webp',
    caption: 'Close-up: paisley and fine borders',
    externalUrl: INSTAGRAM,
    displayOrder: 3,
    active: true,
  },
  {
    _id: 'demo-g4',
    image: 'images/products/hana-handwork-jacket-abaya.webp',
    caption: 'The Hana jacket, up close',
    externalUrl: INSTAGRAM,
    displayOrder: 4,
    active: true,
  },
  {
    _id: 'demo-g5',
    image: 'images/products/meher-cream-abaya.webp',
    caption: 'Ivory thread work, every day',
    externalUrl: INSTAGRAM,
    displayOrder: 5,
    active: true,
  },
  {
    _id: 'demo-g6',
    image: 'images/gallery/detail-gold.webp',
    caption: 'Stone-work, up close',
    externalUrl: INSTAGRAM,
    displayOrder: 6,
    active: true,
  },
];

export const demoGallery: GalleryItem[] = GALLERY_SEEDS.map((g) => ({
  ...g,
  createdAt: '',
  updatedAt: '',
}));

export const demoPublicSettings: PublicSettings = {
  businessName: 'Zeesha Collection',
  // No public business number is listed on the brand's Instagram. Ordering
  // therefore falls back to Instagram DM until the owner sets a number in
  // Admin → Settings. Nothing is invented here.
  whatsappNumber: '',
  instagramUrl: INSTAGRAM,
  email: '',
  mapsUrl: '',
  whatsappTemplate:
    'Hi Zeesha Collection!\n' +
    'I would like to order:\n' +
    '{{ITEMS}}\n' +
    'Estimated total: {{TOTAL}}\n\n' +
    'Please share availability and delivery details.',
  whatsappSingleProductTemplate:
    'Hi Zeesha Collection!\n' +
    'I would like to order:\n' +
    '• {{PRODUCT}}\n' +
    '{{VARIANT_LINE}}{{QTY_LINE}}Price: {{PRICE}}\n\n' +
    'Please share availability and delivery details.',
  hero: {
    headline: 'Elegance, draped.',
    subheadline:
      'Premium abayas, burkhas, hijabs and pashmina — chosen for the woman who likes her modest dressing elegant, trend-forward and comfortable.',
    imageUrl: '',
  },
  about: {
    intro:
      'Zeesha Collection is a Surat-based abaya house built around one idea: modest dressing should feel elegant, current and comfortable — never like a compromise.',
    story:
      'Zeesha Collection began with a small rail of abayas and a simple belief: the right drape changes how a day feels. Today the collection brings together signature abayas, open-front jackets, hand-finished embroidered pieces, burkhas, hijabs and pashmina — each one chosen for its fall, its finish and how easy it is to live in.\n\nWe travel to exhibitions across India, from Surat to Mumbai, to meet customers in person and keep discovering pieces worth bringing home. Every order is handled personally: message us for availability, sizing and delivery, and we will help you find the one that feels like you.\n\nDelivery is available all over India. As per brand policy, we do not offer exchange, returns or cash on delivery.',
    founderImageUrl: '',
  },
  announcements: {
    enabled: true,
    text: 'Delivery all over India · DM us for details and availability',
  },
};
