import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { BrandLogo } from '@/components/BrandLogo';
import { DEMO_MODE } from '@/lib/demoCatalogue';
import { buildOrderLink } from '@/lib/whatsapp';
import { InstagramGlyph, WhatsAppGlyph } from '@/components/ProductCard';

export function Footer() {
  const { settings } = useSettings();
  const order = buildOrderLink(settings, 'Hi Zeesha Collection! I would like to know more about your collection.');

  return (
    <footer className="mt-20 bg-brand-950 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="inline-flex rounded-lg bg-cream p-2">
            <BrandLogo size="md" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/70">
            Premium abayas, burkhas, hijabs and pashmina for modest dressing that feels
            elegant, current and comfortable. Based in Surat, delivering all over India.
          </p>
          {settings.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-300 hover:text-gold-200"
            >
              <InstagramGlyph className="h-4 w-4" />
              @zeesha.collection
            </a>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li><Link to="/shop" className="transition-colors hover:text-cream">The collection</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-cream">Our story</Link></li>
            <li><Link to="/gallery" className="transition-colors hover:text-cream">Journal</Link></li>
            <li><Link to="/reviews" className="transition-colors hover:text-cream">Reviews</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-cream">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300">Visit &amp; enquire</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li>Surat, Gujarat · India</li>
            <li>Delivery all over India</li>
            {order ? (
              <li>
                <a
                  href={order.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-gold-300 hover:text-gold-200"
                >
                  {order.channel === 'whatsapp' ? (
                    <WhatsAppGlyph className="h-4 w-4" />
                  ) : (
                    <InstagramGlyph className="h-4 w-4" />
                  )}
                  {order.channel === 'whatsapp' ? 'WhatsApp us' : 'DM us on Instagram'}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-cream">
                  {settings.email}
                </a>
              </li>
            ) : null}
            <li className="pt-1 text-xs leading-relaxed text-cream/50">
              No exchange · No returns · No cash on delivery.
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-px bg-gold-400/25" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-[11px] text-cream/45 sm:flex-row sm:px-6 sm:text-left">
        <p>© {new Date().getFullYear()} Zeesha Collection. All rights reserved.</p>
        {!DEMO_MODE ? (
          <Link
            to="/admin/login"
            className="text-cream/40 underline decoration-transparent underline-offset-2 transition-colors hover:text-cream/70 hover:decoration-current"
          >
            Admin Login
          </Link>
        ) : (
          <span className="text-cream/40">Elegant · Trendy · Comfortable</span>
        )}
      </div>
    </footer>
  );
}
