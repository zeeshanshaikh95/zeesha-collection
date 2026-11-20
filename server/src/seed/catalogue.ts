/**
 * First-party catalogue for Zeesha Collection.
 *
 * Source of truth: the brand's own Instagram (@zeesha.collection) reels and
 * exhibition footage. Names and copy describe the pieces actually shown there.
 * Prices are intentionally `null` ("price on request") because the brand does
 * not publish prices — its bio says "DM for details". Update them in /admin
 * once the client confirms the price list.
 *
 * Idempotent: existing categories, products and gallery items are never
 * overwritten, so edits made in /admin are preserved.
 */
import { Category, GalleryItem, Product } from '../models/index.js';

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

type ProductSeed = {
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

const INSTAGRAM = 'https://www.instagram.com/zeesha.collection/';

const CATEGORIES: CategorySeed[] = [
  {
    name: 'Signature Abayas',
    slug: 'signature-abayas',
    description: 'Our everyday-to-evening abayas — easy drapes in considered colours.',
    image: 'images/products/meher-cream-abaya.webp',
  },
  {
    name: 'Jacket Abayas',
    slug: 'jacket-abayas',
    description: 'Open-front layers with delicate trims — made for effortless styling.',
    image: 'images/products/zaria-taupe-jacket-abaya.webp',
  },
  {
    name: 'Embroidered Abayas',
    slug: 'embroidered-abayas',
    description: 'Pieces with hand-finished detail, chosen for celebrations.',
    image: 'images/products/zohra-gold-tissue-abaya.webp',
  },
  {
    name: 'Burkhas & Naqabs',
    slug: 'burkhas-naqabs',
    description: 'Soft, breathable everyday coverage in calm neutral tones.',
    image: 'images/products/layla-soft-grey-burkha.webp',
  },
  {
    name: 'Hijabs & Dupattas',
    slug: 'hijabs-dupattas',
    description: 'Printed and textured drapes to finish the look.',
    image: 'images/products/sana-pearl-detail-dupatta.webp',
  },
  {
    name: 'Pashmina & Shawls',
    slug: 'pashmina-shawls',
    description: 'Warm, feather-light wraps for cooler days and evening gatherings.',
    image: 'images/products/alia-stone-work-shawl.webp',
  },
];

const PRODUCTS: ProductSeed[] = [
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

const GALLERY = [
  { image: 'images/products/noor-paisley-embroidered-abaya.webp', caption: 'The Noor jacket abaya' },
  { image: 'images/products/zohra-gold-tissue-abaya.webp', caption: 'Antique gold for the celebration season' },
  { image: 'images/gallery/detail-pearl.webp', caption: 'Close-up: paisley and fine borders' },
  { image: 'images/products/hana-handwork-jacket-abaya.webp', caption: 'The Hana jacket, up close' },
  { image: 'images/products/meher-cream-abaya.webp', caption: 'Ivory thread work, every day' },
  { image: 'images/gallery/detail-gold.webp', caption: 'Stone-work, up close' },
];

const POLICY =
  'No exchange, no returns and no cash on delivery, as per the brand policy. Please confirm size, colour and availability before ordering.';

export async function seedCatalogue(): Promise<void> {
  const categoryIds = new Map<string, unknown>();
  let createdCategories = 0;
  let createdProducts = 0;

  for (const [index, category] of CATEGORIES.entries()) {
    let doc = await Category.findOne({ slug: category.slug });
    if (!doc) {
      doc = await Category.create({ ...category, displayOrder: index + 1 });
      createdCategories++;
    }
    categoryIds.set(category.slug, doc._id);
  }

  for (const [index, product] of PRODUCTS.entries()) {
    const exists = await Product.findOne({ slug: product.slug });
    if (exists) continue;

    await Product.create({
      name: product.name,
      slug: product.slug,
      description: product.description,
      // Price on request until the client shares the price list.
      price: null,
      compareAtPrice: null,
      size: product.size,
      category: categoryIds.get(product.categorySlug) ?? null,
      images: [product.image],
      ingredients: [],
      benefits: product.benefits,
      howToUse: product.care,
      warnings: POLICY,
      variants: [],
      stockStatus: 'in_stock',
      bestseller: product.bestseller ?? false,
      featured: product.featured ?? false,
      seoTitle: `${product.name} | Zeesha Collection`,
      seoDescription: product.description.slice(0, 158),
      displayOrder: index + 1,
      archived: false,
    });
    createdProducts++;
  }

  let createdGallery = 0;
  if (createdProducts > 0) {
    for (const [index, item] of GALLERY.entries()) {
      const exists = await GalleryItem.findOne({ image: item.image });
      if (exists) continue;
      await GalleryItem.create({
        ...item,
        externalUrl: INSTAGRAM,
        displayOrder: index + 1,
        active: true,
      });
      createdGallery++;
    }
  }

  console.log(
    `Catalogue: ${createdCategories} categories, ${createdProducts} products and ${createdGallery} gallery items created` +
      (createdCategories || createdProducts || createdGallery ? '' : ' (already present)')
  );
}
