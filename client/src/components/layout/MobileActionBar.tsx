import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { buildOrderLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { InstagramGlyph, WhatsAppGlyph } from '@/components/ProductCard';

/** Thumb-friendly bottom bar for phones: shop, enquiry channel and bag one tap away. */
export function MobileActionBar() {
  const { count, openCart } = useCart();
  const { settings } = useSettings();
  const order = buildOrderLink(
    settings,
    'Hi Zeesha Collection! I have a question about your collection.'
  );

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-3 bottom-3 z-[60] flex items-center justify-between gap-2 rounded-full border border-gold-300/50 bg-cream/95 p-2 shadow-glow backdrop-blur md:hidden"
    >
      <Link
        to="/shop"
        className="flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7l8-4 8 4v10l-8 4-8-4V7zm8 12V11m8-4l-8 4-8-4" />
        </svg>
        Shop
      </Link>

      {order ? (
        <a
          href={order.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ type: 'whatsapp_click' })}
          className="-mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-900 text-gold-200 shadow-soft ring-4 ring-cream"
          aria-label={order.label}
        >
          {order.channel === 'whatsapp' ? (
            <WhatsAppGlyph className="h-7 w-7" />
          ) : (
            <InstagramGlyph className="h-7 w-7" />
          )}
        </a>
      ) : null}

      <button
        type="button"
        onClick={openCart}
        className="relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft"
        aria-label={`Open bag (${count} items)`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
        Bag
        {count > 0 ? (
          <span className="absolute right-2 top-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-brand-950">
            {count}
          </span>
        ) : null}
      </button>
    </nav>
  );
}
