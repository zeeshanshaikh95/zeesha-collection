import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { buildCartMessage, buildOrderLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { PlaceholderImage } from './PlaceholderImage';
import { InstagramGlyph, WhatsAppGlyph } from './ProductCard';

/**
 * Mini-bag slide-over. The multi-product enquiry message is generated from the
 * editable template in Settings, then sent via WhatsApp or Instagram DM.
 */
export function MiniCart() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    count,
  } = useCart();
  const { settings } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close + focus management for accessibility.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const message = buildCartMessage(settings, items);
  const order = buildOrderLink(settings, message);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div
        className="absolute inset-0 animate-fade-in bg-brand-950/50 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col bg-cream shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-gold-300/40 px-5 py-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-gold-600">Zeesha Collection</p>
            <h2 className="mt-1 font-display text-2xl font-medium">
              Your Bag {count > 0 && <span className="text-gold-600">({count})</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-ink-soft hover:bg-brand-50"
            aria-label="Close bag"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <svg viewBox="0 0 48 48" className="h-12 w-12 text-brand-200" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16h24l-2 24H14L12 16z" />
              <path d="M18 16v-3a6 6 0 0 1 12 0v3" />
            </svg>
            <p className="font-display text-xl font-medium text-ink">Your bag is empty</p>
            <p className="max-w-xs text-sm text-ink-soft">
              Add the pieces you love, then send one enquiry with everything together.
            </p>
            <button type="button" onClick={closeCart} className="btn-primary mt-3">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="scrollbar-thin flex-1 divide-y divide-brand-100/70 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                    {item.image ? (
                      <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <PlaceholderImage seed={item.slug} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-display text-base font-semibold leading-tight text-ink hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                    {item.variantName ? (
                      <p className="mt-0.5 text-xs text-ink-soft">{item.variantName}</p>
                    ) : null}
                    <p className="mt-1 text-[12px] font-medium tracking-wide text-gold-700">
                      {formatPrice(item.unitPrice)}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <div className="flex items-center rounded-full border border-brand-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="px-2.5 py-1 text-ink-soft hover:text-brand-700"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-[1.75rem] text-center text-sm font-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="px-2.5 py-1 text-ink-soft hover:text-brand-700"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="ml-auto text-[11px] font-medium text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-3 border-t border-gold-300/40 bg-blush/60 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">Estimated subtotal</span>
                <span className="font-display text-xl font-semibold text-ink">
                  {subtotal === null ? 'On request' : formatPrice(subtotal)}
                </span>
              </div>
              {subtotal === null ? (
                <p className="text-[11px] leading-relaxed text-ink-soft">
                  Some pieces are price-on-request — final totals are confirmed over message.
                </p>
              ) : null}

              {order ? (
                <a
                  href={order.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent({ type: 'order_whatsapp_click' });
                  }}
                  className="btn-primary w-full !py-3.5"
                >
                  {order.channel === 'whatsapp' ? <WhatsAppGlyph className="h-4 w-4" /> : <InstagramGlyph className="h-4 w-4" />}
                  {order.label}
                </a>
              ) : null}

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-medium text-red-500 hover:text-red-700"
                >
                  Clear bag
                </button>
                <button type="button" onClick={closeCart} className="font-medium text-brand-700 hover:text-brand-800">
                  Continue shopping
                </button>
              </div>
              <p className="text-center text-[10px] leading-relaxed text-ink-soft">
                Availability, delivery and payment are confirmed personally by the team.
                No exchange, no returns, no cash on delivery.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
