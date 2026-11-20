import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';
import { buildOrderLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { InstagramGlyph, WhatsAppGlyph } from '@/components/ProductCard';

/**
 * Persistent floating enquiry CTA — sits bottom-right, does not obstruct
 * content, hidden while the mini-cart is open.
 */
export function WhatsAppFloat() {
  const { settings } = useSettings();
  const { isOpen } = useCart();
  const order = buildOrderLink(
    settings,
    'Hi Zeesha Collection! I have a question about your collection.'
  );

  if (!order || isOpen) return null;

  const Glyph = order.channel === 'whatsapp' ? WhatsAppGlyph : InstagramGlyph;

  return (
    <a
      href={order.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent({ type: 'whatsapp_click' })}
      className={`fixed bottom-5 right-5 z-[60] hidden h-14 w-14 items-center justify-center rounded-full shadow-soft transition-transform hover:scale-105 active:scale-95 md:flex ${
        order.channel === 'whatsapp' ? 'bg-[#1FA855] text-white' : 'bg-brand-900 text-gold-200'
      }`}
      aria-label={order.label}
    >
      <Glyph className="h-6 w-6" />
    </a>
  );
}
