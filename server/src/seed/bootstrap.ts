/**
 * Idempotent bootstrap logic shared by the seed CLI and the server's
 * AUTO_SEED startup hook. Creates ONLY what the application needs to run:
 *   • the first admin account (from ADMIN_EMAIL / ADMIN_PASSWORD)
 *   • the singleton SiteSettings document with default enquiry templates
 *
 * The catalogue is seeded separately in seed/catalogue.ts (also idempotent).
 */
import bcrypt from 'bcryptjs';
import { AdminUser, SiteSettings } from '../models/index.js';
import { config } from '../config/env.js';

export async function bootstrapAdmin(): Promise<void> {
  const existing = await AdminUser.findOne({ email: config.adminEmail });
  if (existing) {
    console.log(`Admin already exists: ${config.adminEmail}`);
    // Self-heal: if the account still authenticates with the bootstrap password
    // but the first-login flag was cleared (e.g. by an API smoke run), re-arm it.
    if (
      !existing.mustChangePassword &&
      (await bcrypt.compare(config.adminPassword, existing.passwordHash))
    ) {
      existing.mustChangePassword = true;
      await existing.save();
      console.log('  Bootstrap password still in use — first-login password change re-armed.');
    }
    return;
  }

  if (config.adminPassword === '[CHANGE_ME_BEFORE_PRODUCTION]') {
    console.log(
      '! ADMIN_PASSWORD is still the placeholder from .env.example — set a real password first.'
    );
  }

  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await AdminUser.create({
    email: config.adminEmail,
    passwordHash,
    role: 'admin',
    // Bootstrap credentials (ADMIN_PASSWORD) must be rotated on first login.
    mustChangePassword: true,
  });
  console.log(`Admin created: ${config.adminEmail}`);
}

export async function bootstrapSettings(): Promise<void> {
  const existing = await SiteSettings.findOne();
  if (existing) {
    console.log('Site settings already exist');
    return;
  }

  await SiteSettings.create({
    businessName: 'Zeesha Collection',
    // Intentionally empty: the brand has not published a WhatsApp number.
    // Ordering falls back to Instagram DM until the owner adds one in /admin.
    whatsappNumber: '',
    instagramUrl: 'https://www.instagram.com/zeesha.collection/',
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
        'Zeesha Collection began with a small rail of abayas and a simple belief: the right drape changes how a day feels. Today the collection brings together signature abayas, open-front jackets, hand-finished embroidered pieces, burkhas, hijabs and pashmina — each one chosen for its fall, its finish and how easy it is to live in.\n\nWe travel to exhibitions across India to meet customers in person and keep discovering pieces worth bringing home. Every order is handled personally: message us for availability, sizing and delivery, and we will help you find the one that feels like you.\n\nDelivery is available all over India. As per brand policy, we do not offer exchange, returns or cash on delivery.',
      founderImageUrl: '',
    },
    announcements: {
      enabled: true,
      text: 'Delivery all over India · DM us for details and availability',
    },
  });
  console.log('Site settings created with Zeesha Collection defaults');
}
