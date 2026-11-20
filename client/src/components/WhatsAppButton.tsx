import { useSettings } from '@/context/SettingsContext';
import { buildOrderLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { InstagramGlyph, WhatsAppGlyph } from './ProductCard';

interface Props {
  message: string;
  event?: 'whatsapp_click' | 'order_whatsapp_click';
  productSlug?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Central ordering CTA. Uses WhatsApp when the owner has configured a number,
 * and otherwise falls back to the brand's own Instagram DM ("DM for details").
 * Nothing is ever sent to a guessed number.
 */
export function WhatsAppButton({
  message,
  event = 'whatsapp_click',
  productSlug,
  label,
  className = '',
  size = 'md',
}: Props) {
  const { settings } = useSettings();
  const order = buildOrderLink(settings, message);

  const sizeCls =
    size === 'lg' ? 'px-8 py-4 text-[12px]' : size === 'sm' ? '!px-4 !py-2 text-[10px]' : '';

  if (!order) {
    return null;
  }

  const Glyph = order.channel === 'whatsapp' ? WhatsAppGlyph : InstagramGlyph;

  return (
    <a
      href={order.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent({ type: event, productSlug })}
      className={`${order.channel === 'whatsapp' ? 'btn-whatsapp' : 'btn-primary'} ${sizeCls} ${className}`}
    >
      <Glyph className="h-4 w-4" />
      {label ?? (order.channel === 'whatsapp' ? 'Order on WhatsApp' : 'Enquire on Instagram')}
    </a>
  );
}
