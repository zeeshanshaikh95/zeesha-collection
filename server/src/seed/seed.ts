/**
 * Database bootstrap CLI.
 *
 * Usage:
 *   npm run seed          idempotent — skips whatever already exists
 *   npm run seed:reset    deletes all catalogue content first, then re-bootstraps
 *                         (use to clear test records; the admin account is kept)
 *
 * The catalogue seeded here is derived from the client's own Instagram
 * (@zeesha.collection): the pieces shown in the brand's reels, with prices left
 * "on request" until the owner supplies a price list. It is idempotent, so
 * re-running never overwrites edits made in /admin. Reviews stay empty — only
 * real, approved testimonials are shown, managed from the admin panel. Gallery
 * items use the brand's own photography.
 */
import mongoose from 'mongoose';
import { Category, GalleryItem, Product, Review } from '../models/index.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { bootstrapAdmin, bootstrapSettings } from './bootstrap.js';
import { seedCatalogue } from './catalogue.js';

const RESET = process.argv.slice(2).includes('--reset');

/** Removes all catalogue content — never touches AdminUser or SiteSettings. */
async function resetCatalogue(): Promise<void> {
  const [products, categories, reviews, gallery] = await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Review.deleteMany({}),
    GalleryItem.deleteMany({}),
  ]);

  console.log(
    `⟳ Cleared catalogue: ${products.deletedCount} products, ${categories.deletedCount} categories, ` +
      `${reviews.deletedCount} reviews, ${gallery.deletedCount} gallery items`
  );
}

async function main(): Promise<void> {
  await connectDatabase();

  if (RESET) {
    await resetCatalogue();
  }

  await bootstrapAdmin();
  await bootstrapSettings();
  await seedCatalogue();

  const [products, categories, reviews, gallery] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Review.countDocuments(),
    GalleryItem.countDocuments(),
  ]);

  console.log('\nCatalogue state:');
  console.log(`  products: ${products}`);
  console.log(`  categories: ${categories}`);
  console.log(`  reviews: ${reviews}`);
  console.log(`  gallery items: ${gallery}`);
  console.log('\nCatalogue ready. Reviews stay empty until real approved feedback is added in /admin.\n');
}

main()
  .catch((err: unknown) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
    await mongoose.disconnect();
  });
