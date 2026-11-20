import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { formatPrice, truncate } from '@/lib/format';
import { PlaceholderImage } from './PlaceholderImage';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { settings } = useSettings();
  const outOfStock = product.stockStatus === 'out_of_stock';

  const order = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: product.name,
      variantName: product.variants[0]?.name ?? null,
      quantity: 1,
      price: product.price,
    })
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.1rem] border border-brand-100/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300/70 hover:shadow-soft">
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-brand-50"
        aria-label={`View ${product.name}`}
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderImage seed={product.slug} />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.bestseller && (
            <span className="rounded-full bg-brand-900/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-cream backdrop-blur">
              Loved
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-cream/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-gold-700 ring-1 ring-gold-300/60 backdrop-blur">
              New
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-stone-800/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
              Sold out
            </span>
          )}
        </div>

        {product.category ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-brand-800 backdrop-blur">
            {product.category.name}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link to={`/product/${product.slug}`} className="focus-visible:rounded">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink transition-colors hover:text-brand-700">
            {truncate(product.name, 46)}
          </h3>
        </Link>

        <p className="mt-1.5 text-[11px] text-ink-soft">
          {product.size || 'Made to drape beautifully'}
        </p>

        <p className="mt-2 font-body text-[13px] font-medium tracking-wide text-gold-700">
          {formatPrice(product.price)}
        </p>

        <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:flex-row sm:gap-2">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className="btn-outline w-full whitespace-nowrap !px-3 !py-2 !text-[10px] sm:flex-1"
          >
            Add to bag
          </button>
          {order ? (
            <a
              href={order.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent({ type: 'whatsapp_click', productSlug: product.slug })}
              className="btn-primary w-full whitespace-nowrap !px-3 !py-2 !text-[10px] sm:flex-1"
              aria-label={`${order.label} — ${product.name}`}
            >
              {order.channel === 'whatsapp' ? (
                <WhatsAppGlyph className="h-3.5 w-3.5" />
              ) : (
                <InstagramGlyph className="h-3.5 w-3.5" />
              )}
              Enquire
            </a>
          ) : (
            <Link
              to={`/product/${product.slug}`}
              className="btn-primary w-full whitespace-nowrap !px-3 !py-2 !text-[10px] sm:flex-1"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function WhatsAppGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2 22l4.9-1.6A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9 1 1-2.9-.2-.3a8.2 8.2 0 1 1 6.6 3.6zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.7 3.4.6 1.7 2 3.3 3.6 4.2 1.7.9 2.9 1.1 3.9.8.6-.2 1.4-.7 1.6-1.3.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export function InstagramGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .4.4.7.9 1 1.5.1.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.4 2.3-.3.6-.6 1-1 1.5-.5.4-.9.7-1.5 1-.4.1-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.3-.4-.6-.3-1-.6-1.5-1-.4-.5-.7-.9-1-1.5-.1-.4-.3-1.1-.4-2.3-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.9.4-2.3.3-.6.6-1 1-1.5.5-.4.9-.7 1.5-1 .4-.1 1.1-.3 2.3-.4 1.3-.1 1.7-.1 4.9-.1zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm6.4-2.1a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  );
}
