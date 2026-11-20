import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { FloralDivider } from '@/components/FloralDivider';
import { ProductCard } from '@/components/ProductCard';
import { InstagramGlyph, WhatsAppGlyph } from '@/components/ProductCard';
import { Stars } from '@/components/Stars';
import { Seo } from '@/components/seo/Seo';
import { EmptyState } from '@/components/EmptyState';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { addItem } = useCart();
  const { settings } = useSettings();

  const { data, loading, error } = useApi(
    () => publicApi.getProduct(slug).then((r) => r.product),
    [slug]
  );
  const related = useApi(
    () => publicApi.getRelated(slug).then((r) => r.products).catch(() => []),
    [slug]
  );
  const reviews = useApi(() => publicApi.listReviews().then((r) => r.reviews), []);

  const product = data;
  const [activeImage, setActiveImage] = useState(0);
  const [variantName, setVariantName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reset selections when the product changes.
  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setLightboxOpen(false);
  }, [slug]);

  useEffect(() => {
    if (product?.variants.length) {
      setVariantName((prev) =>
        prev && product.variants.some((v) => v.name === prev) ? prev : product.variants[0].name
      );
    } else {
      setVariantName(null);
    }
  }, [product?.variants]);

  useEffect(() => {
    if (product) trackEvent({ type: 'product_view', productSlug: product.slug });
  }, [product?.slug]);

  const selectedVariant = useMemo(
    () => product?.variants.find((v) => v.name === variantName) ?? null,
    [product, variantName]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="skeleton aspect-[4/5]" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon="error"
          title="Piece not found"
          description={error ?? 'It may have been removed or renamed.'}
          action={<Link to="/shop" className="btn-primary">Back to the collection</Link>}
        />
      </div>
    );
  }

  const outOfStock = product.stockStatus === 'out_of_stock';
  const variantOutOfStock = selectedVariant?.stockStatus === 'out_of_stock';
  const canOrder = !outOfStock && !variantOutOfStock;

  const effectivePrice = selectedVariant?.price ?? product.price;

  const orderMessage = buildSingleProductMessage(settings, {
    productName: product.name,
    variantName: selectedVariant?.name ?? null,
    quantity,
    price: effectivePrice,
  });
  const order = canOrder ? buildOrderLink(settings, orderMessage) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: product.images.length ? product.images : undefined,
    sku: product._id,
    brand: { '@type': 'Brand', name: settings.businessName },
    ...(effectivePrice !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: effectivePrice,
            priceCurrency: 'INR',
            availability: outOfStock
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <>
      <Seo
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description.slice(0, 160)}
        canonicalPath={`/product/${product.slug}`}
        ogType="product"
        imageUrl={product.images[0]}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-brand-800">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/shop" className="hover:text-brand-800">Collection</Link></li>
            {product.category ? (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={`/category/${product.category.slug}`} className="hover:text-brand-800">
                    {product.category.name}
                  </Link>
                </li>
              </>
            ) : null}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-900">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-7 grid gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <button
              type="button"
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-[9rem] rounded-b-[1rem] border border-gold-300/40 bg-brand-50"
              onClick={() => setLightboxOpen(true)}
              aria-label="Open image gallery"
            >
              {product.images[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PlaceholderImage seed={product.slug} />
              )}
            </button>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      i === activeImage ? 'border-gold-500' : 'border-transparent'
                    }`}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === activeImage}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 hidden items-center gap-4 border-t border-gold-300/40 pt-4 text-[10px] uppercase tracking-[0.14em] text-ink-soft sm:flex">
              <span>Delivery all over India</span>
              <span className="h-1 w-1 rounded-full bg-gold-400" />
              <span>Personally packed</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.bestseller && <span className="badge-pink">Most loved</span>}
              {product.featured && <span className="badge-leaf">New in</span>}
              {outOfStock && <span className="badge-stone">Sold out</span>}
            </div>

            {product.category ? (
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-700">
                {product.category.name}
              </p>
            ) : null}
            <h1 className="mt-1.5 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 font-body text-lg font-medium tracking-wide text-brand-900">
              {formatPrice(effectivePrice)}
            </p>
            {effectivePrice === null ? (
              <p className="mt-1 text-xs text-ink-soft">
                Final price, availability and delivery are confirmed personally.
              </p>
            ) : null}
            {product.compareAtPrice && effectivePrice !== null && product.compareAtPrice > effectivePrice ? (
              <p className="mt-1 text-sm text-ink-soft">
                <s>{formatPrice(product.compareAtPrice)}</s>{' '}
                <span className="font-semibold text-brand-700">
                  Save {formatPrice(product.compareAtPrice - (effectivePrice ?? 0))}
                </span>
              </p>
            ) : null}
            {product.size ? <p className="mt-2 text-sm text-ink-soft">{product.size}</p> : null}

            <div className="mt-5 h-px bg-gold-300/50" />

            {product.variants.length > 0 && (
              <fieldset className="mt-6">
                <legend className="label">Choose an option</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setVariantName(v.name)}
                      disabled={v.stockStatus === 'out_of_stock'}
                      aria-pressed={variantName === v.name}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                        variantName === v.name
                          ? 'border-brand-900 bg-brand-900 text-cream'
                          : 'border-brand-200 bg-white text-ink hover:border-brand-500'
                      } ${v.stockStatus === 'out_of_stock' ? 'cursor-not-allowed line-through opacity-50' : ''}`}
                    >
                      {v.name}
                      {v.price !== null ? ` · ${formatPrice(v.price)}` : ''}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-brand-200 bg-white">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-ink-soft hover:text-brand-700" aria-label="Decrease quantity">−</button>
                <span className="min-w-[2rem] text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="px-4 py-2.5 text-ink-soft hover:text-brand-700" aria-label="Increase quantity">+</button>
              </div>

              <button
                type="button"
                disabled={!canOrder}
                onClick={() => addItem(product, { variantName, quantity })}
                className="btn-outline flex-1"
              >
                Add to bag
              </button>
            </div>

            <div className="mt-3">
              {order ? (
                <a
                  href={order.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ type: 'order_whatsapp_click', productSlug: product.slug })}
                  className="btn-primary w-full !py-4"
                >
                  {order.channel === 'whatsapp' ? <WhatsAppGlyph className="h-4 w-4" /> : <InstagramGlyph className="h-4 w-4" />}
                  {order.label}
                </a>
              ) : (
                <span className="btn bg-stone-200 w-full !py-4 cursor-not-allowed justify-center text-stone-600" aria-disabled="true">
                  Currently unavailable
                </span>
              )}
            </div>

            {outOfStock ? (
              <p className="mt-3 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                This piece is currently unavailable — message us and we will let you know when it is back.
              </p>
            ) : null}

            <ul className="mt-6 grid gap-2.5 text-xs text-ink-soft">
              {[
                'Every enquiry answered personally — no call centre',
                'Availability confirmed before dispatch',
                'Delivery all over India · no COD',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="h-px w-4 bg-gold-400" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>

            {product.description ? (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold">The piece</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.description}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Detail tabs */}
        <section className="mt-16 grid gap-10 border-t border-gold-300/40 pt-10 md:grid-cols-2" aria-label="Product information">
          <div className="space-y-8">
            {product.benefits.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold">The details</h2>
                <FloralDivider className="mt-2 justify-start" />
                <ul className="mt-3 space-y-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-ink-soft">
                      <span className="mt-2 h-1 w-4 shrink-0 bg-gold-400" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.ingredients.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold">Fabric notes</h2>
                <FloralDivider className="mt-2 justify-start" />
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li key={ing} className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-medium text-leaf-700">{ing}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-8">
            {product.howToUse && (
              <div>
                <h2 className="font-display text-xl font-semibold">Fabric &amp; care</h2>
                <FloralDivider className="mt-2 justify-start" />
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.howToUse}</p>
              </div>
            )}
            {product.warnings && (
              <div>
                <h2 className="font-display text-xl font-semibold">Good to know</h2>
                <FloralDivider className="mt-2 justify-start" />
                <p className="mt-3 rounded-xl border border-gold-300/60 bg-gold-100/40 px-4 py-3 text-sm leading-relaxed text-gold-700">{product.warnings}</p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews */}
        {reviews.data?.length ? (
          <section className="mt-16" aria-labelledby="pdp-reviews">
            <h2 id="pdp-reviews" className="section-title">Customer notes</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {reviews.data.slice(0, 6).map((r) => (
                <figure key={r._id} className="card p-6">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-ink-soft">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-brand-800">— {r.customerName}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Related products */}
        {related.data?.length ? (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title">Complete the look</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.data.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        ) : null}
      </div>

      {/* Lightbox */}
      {lightboxOpen && product.images.length > 0 && (
        <div
          className="fixed inset-0 z-[80] flex animate-fade-in items-center justify-center bg-brand-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image gallery`}
          onClick={() => setLightboxOpen(false)}
        >
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close gallery">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
          <img
            src={product.images[activeImage]}
            alt={`${product.name} — image ${activeImage + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-12 w-10 overflow-hidden rounded border-2 ${i === activeImage ? 'border-gold-400' : 'border-transparent opacity-60'}`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
