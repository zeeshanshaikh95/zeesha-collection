import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductRail } from '@/components/ProductRail';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Stars } from '@/components/Stars';
import { Seo } from '@/components/seo/Seo';
import { EmptyState } from '@/components/EmptyState';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { HeroSlider, type HeroSlide } from '@/components/HeroSlider';
import { trackEvent } from '@/lib/analytics';
import { truncate } from '@/lib/format';
import { ABOUT_IMAGE } from '@/lib/brand';
import { buildOrderLink } from '@/lib/whatsapp';

const BASE = import.meta.env.BASE_URL;
const asset = (path: string) => `${BASE}${path}`;

const HERO_SLIDES: HeroSlide[] = [
  {
    image: asset('images/hero/hero-01.webp'),
    title: 'Meher Cream Abaya',
    note: 'Signature · Ivory thread work',
    href: '/product/meher-cream-abaya',
  },
  {
    image: asset('images/hero/hero-02.webp'),
    title: 'Zohra Gold Tissue Abaya',
    note: 'Occasion · Antique gold',
    href: '/product/zohra-gold-tissue-abaya',
  },
  {
    image: asset('images/hero/hero-03.webp'),
    title: 'Noor Paisley Abaya',
    note: 'Embroidered · Muted lilac',
    href: '/product/noor-paisley-embroidered-abaya',
  },
  {
    image: asset('images/hero/hero-04.webp'),
    title: 'Midnight Bloom Abaya',
    note: 'Everyday · Deep navy',
    href: '/product/midnight-bloom-abaya',
  },
];

const VALUES = [
  {
    title: 'Chosen for the drape',
    text: 'Every piece is picked for its fall, finish and comfort — not just how it photographs.',
    icon: (
      <>
        <path d="M8 4h8l4 4v12H4V8l4-4z" />
        <path d="M8 4v4h8V4M8 20v-6h8v6" />
      </>
    ),
  },
  {
    title: 'Delivered across India',
    text: 'Orders are packed personally and shipped anywhere in India. Message us for timelines.',
    icon: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </>
    ),
  },
  {
    title: 'A personal stylist',
    text: 'Tell us the occasion, your size and the colours you love — we will suggest the piece.',
    icon: (
      <>
        <path d="M12 3l2.2 5.3L20 9l-4.2 3.9L17 19l-5-2.9L7 19l1.2-6.1L4 9l5.8-.7L12 3z" />
      </>
    ),
  },
];

export function HomePage() {
  const { settings } = useSettings();
  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);
  const products = useApi(() => publicApi.listProducts().then((r) => r.products), []);
  const reviews = useApi(() => publicApi.listReviews().then((r) => r.reviews), []);
  const gallery = useApi(() => publicApi.listGallery().then((r) => r.items), []);

  useEffect(() => {
    trackEvent({ type: 'page_view', path: '/' });
  }, []);

  const allProducts = products.data ?? [];
  const bestsellers = allProducts.filter((p) => p.bestseller);
  // The occasion edit deliberately excludes pieces already shown as house
  // favourites, so the homepage does not repeat the same four cards.
  const featured = allProducts.filter((p) => p.featured && !p.bestseller);
  const rail = (allProducts.length ? allProducts : featured).slice(0, 8);
  const order = buildOrderLink(
    settings,
    'Hi Zeesha Collection! I would like help choosing a piece.'
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: settings.businessName,
    description:
      'Premium abayas, burkhas, hijabs and pashmina. Delivery all over India.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
  };

  return (
    <>
      <Seo
        title="Premium Abayas & Burkhas"
        description="Zeesha Collection — premium abayas, burkhas, hijabs and pashmina for elegant, trend-forward modest dressing. Delivery all over India."
        canonicalPath="/"
        jsonLd={jsonLd}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream">
        <div className="pointer-events-none absolute inset-0 bg-emerald-linen" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:gap-10 md:pb-24 md:pt-20">
          <div className="animate-fade-up">
            <p className="eyebrow">Premium abayas &amp; burkhas</p>
            <h1 className="mt-5 text-balance font-display text-[3.4rem] font-medium leading-[0.92] tracking-[-0.02em] text-ink sm:text-7xl lg:text-[5.2rem]">
              Elegance,
              <br />
              <em className="font-normal italic text-brand-700">draped.</em>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {settings.hero.subheadline ||
                'Premium abayas, burkhas, hijabs and pashmina — chosen for the woman who likes her modest dressing elegant, trend-forward and comfortable.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="btn-primary">
                Explore the collection
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <WhatsAppButton
                message="Hi Zeesha Collection! I would like help choosing a piece."
                label="DM to order"
                className="!bg-transparent !text-brand-900 !border !border-brand-300 hover:!bg-brand-50"
              />
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-gold-300/50 pt-5">
              {[
                ['All-India', 'Delivery'],
                ['Size 60', '& free size'],
                ['1:1', 'Styling help'],
              ].map(([top, bottom]) => (
                <div key={top}>
                  <dt className="font-display text-xl font-semibold text-brand-900">{top}</dt>
                  <dd className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-soft">{bottom}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroSlider slides={HERO_SLIDES} />
        </div>

        {/* Gold marquee */}
        <div className="relative overflow-hidden border-y border-gold-300/50 bg-brand-950 py-3.5">
          <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.28em] text-gold-200">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-8" aria-hidden={dup === 1}>
                <span>Elegant</span>
                <span className="text-gold-500">✦</span>
                <span>Trendy</span>
                <span className="text-gold-500">✦</span>
                <span>Comfortable</span>
                <span className="text-gold-500">✦</span>
                <span>Delivery all over India</span>
                <span className="text-gold-500">✦</span>
                <span>DM for details</span>
                <span className="text-gold-500">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20" aria-labelledby="values-heading">
        <div className="text-center">
          <p className="eyebrow eyebrow-center justify-center">The house promise</p>
          <h2 id="values-heading" className="section-title mt-3">
            Modest dressing, <em className="font-normal italic text-brand-700">considered.</em>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            A small, carefully chosen collection — the kind you reach for again and again.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {VALUES.map((item) => (
            <article key={item.title} className="card p-6 transition-shadow hover:shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/70 bg-gold-100/60 text-brand-800">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="border-y border-gold-300/30 bg-blush/40 py-16 md:py-20" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Find your piece</p>
              <h2 id="categories-heading" className="section-title mt-3">Shop by edit</h2>
            </div>
            <Link to="/shop" className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-brand-800">
              View all
            </Link>
          </div>

          {categories.loading ? (
            <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
            </div>
          ) : categories.error ? (
            <div className="mt-8">
              <EmptyState icon="error" title="Couldn't load the collection" description={categories.error} action={<button className="btn-outline" onClick={() => categories.refetch()}>Try again</button>} />
            </div>
          ) : !categories.data?.length ? (
            <div className="mt-8">
              <EmptyState
                title="The collection is being prepared"
                description="Message us on Instagram and we will help you find the right piece."
              />
            </div>
          ) : (
            <div className="scrollbar-thin -mx-4 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
              {categories.data.map((cat, index) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="group relative w-[62vw] shrink-0 snap-start overflow-hidden rounded-[1rem] border border-brand-100 bg-white sm:w-auto"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-50">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <PlaceholderImage seed={cat.slug} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
                    <span className="absolute left-3 top-3 font-display text-lg text-cream/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-3.5">
                      <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-cream">
                        {truncate(cat.name, 30)}
                      </h3>
                      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gold-300">
                        Explore
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Product slider ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20" aria-labelledby="rail-heading">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Just in</p>
            <h2 id="rail-heading" className="section-title mt-3">The new edit</h2>
          </div>
          <Link to="/shop" className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-brand-800">
            Shop all pieces
          </Link>
        </div>

        {products.loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-80" />)}
          </div>
        ) : products.error ? (
          <div className="mt-8"><EmptyState icon="error" title="Couldn't load products" description={products.error} /></div>
        ) : !rail.length ? (
          <div className="mt-8">
            <EmptyState
              title="New pieces are on the way"
              description="Follow @zeesha.collection on Instagram for the latest arrivals."
            />
          </div>
        ) : (
          <div className="mt-8">
            <ProductRail products={rail} />
          </div>
        )}
      </section>

      {/* ── Brand band ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-cream md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-emerald-linen opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -inset-2 rounded-t-[12rem] rounded-b-[1rem] border border-gold-400/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] rounded-b-[0.8rem]">
              <img
                src={ABOUT_IMAGE}
                alt="Zeesha Collection steel-blue abaya"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow !text-gold-300 before:!bg-gold-500">From Surat, with love</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-cream sm:text-5xl">
              Pieces you meet in person,
              <br className="hidden sm:block" /> then keep for years.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/70">
              We take the collection to exhibitions across India — Surat, Mumbai and beyond — so
              customers can feel the fabric, check the fall and find their size before they buy.
              What you see here is the same rail, brought online.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-gold-400/30 pt-5">
              {[
                ['Exhibitions', 'Across India'],
                ['Signature', 'Size 60'],
                ['Orders', 'Personally packed'],
              ].map(([top, bottom]) => (
                <div key={top}>
                  <p className="font-display text-lg font-semibold text-gold-200">{top}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-cream/50">{bottom}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-gold">Read our story</Link>
              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !border !border-cream/30 !bg-transparent !text-cream hover:!bg-cream/10"
                >
                  See us on Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      {bestsellers.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20" aria-labelledby="bestsellers-heading">
          <div className="text-center">
            <p className="eyebrow eyebrow-center justify-center">Most requested</p>
            <h2 id="bestsellers-heading" className="section-title mt-3">House favourites</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ink-soft">
              The pieces our customers ask for again and again.
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {bestsellers.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      ) : null}

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      {featured.length ? (
        <section className="border-y border-gold-300/30 bg-blush/40 py-16 md:py-20" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Newly added</p>
                <h2 id="featured-heading" className="section-title mt-3">The occasion edit</h2>
              </div>
              <Link to="/shop" className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-brand-800">
                Shop all
              </Link>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {featured.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── About teaser ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20" aria-labelledby="about-heading">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <div className="pointer-events-none absolute -inset-2 rounded-t-[14rem] rounded-b-[1rem] border border-gold-300/60" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[13rem] rounded-b-[0.9rem] bg-brand-50 sm:aspect-[4/4.2]">
              {settings.about.founderImageUrl ? (
                <img
                  src={settings.about.founderImageUrl}
                  alt="Zeesha Collection"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <img
                  src={asset('images/hero/hero-01.webp')}
                  alt="Zeesha Collection ivory thread-work detail"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="absolute bottom-4 left-4 rounded-lg border border-gold-300/60 bg-cream/95 px-4 py-3 shadow-card backdrop-blur sm:left-6">
              <p className="font-display text-xl font-semibold text-brand-900">Surat · India</p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-ink-soft">Atelier &amp; exhibitions</p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="eyebrow">Our story</p>
            <h2 id="about-heading" className="section-title mt-3">
              A quieter kind of <em className="font-normal italic text-brand-700">luxury.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              {settings.about.intro ||
                'Zeesha Collection is a Surat-based abaya house built around one idea: modest dressing should feel elegant, current and comfortable — never like a compromise.'}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              {[
                'Signature abayas, open-front jackets and hand-finished occasion pieces',
                'Burkhas, hijabs and pashmina chosen to layer together',
                'Ordering handled personally, with honest styling advice',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-5 shrink-0 bg-gold-400" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/about" className="btn-outline">Read our story</Link>
              {order ? (
                <a
                  href={order.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !text-brand-800"
                >
                  Ask a question
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews (only real, approved reviews) ────────────────────────── */}
      {reviews.data?.length ? (
        <section className="border-y border-gold-300/30 bg-blush/40 py-16 md:py-20" aria-labelledby="reviews-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <p className="eyebrow eyebrow-center justify-center">In their words</p>
              <h2 id="reviews-heading" className="section-title mt-3">Customer notes</h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {reviews.data.slice(0, 6).map((r) => (
                <figure key={r._id} className="card flex flex-col p-6">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-800">
                    — {r.customerName}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/reviews" className="btn-outline">See all reviews</Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      {gallery.data?.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20" aria-labelledby="gallery-heading">
          <div className="text-center">
            <p className="eyebrow eyebrow-center justify-center">The journal</p>
            <h2 id="gallery-heading" className="section-title mt-3">From the rail</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              New arrivals, exhibition days and close-ups of the detail.
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {gallery.data.slice(0, 6).map((g) => {
              const inner = g.image ? (
                <img src={g.image} alt={g.caption || 'Zeesha Collection'} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <PlaceholderImage seed={`ig-${g._id}`} />
              );
              return g.externalUrl ? (
                <a key={g._id} href={g.externalUrl} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden rounded-lg bg-brand-50">
                  {inner}
                </a>
              ) : (
                <div key={g._id} className="group relative aspect-square overflow-hidden rounded-lg bg-brand-50">
                  {inner}
                </div>
              );
            })}
          </div>
          {settings.instagramUrl ? (
            <div className="mt-8 text-center">
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Follow @zeesha.collection
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-900 py-16 text-cream md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-emerald-linen opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-300">A personal service</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
            Not sure which piece?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/70">
            Send us the occasion, your size and the colours you like. We will reply with what is
            available — and help you choose with no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <WhatsAppButton
              message="Hi Zeesha Collection! I would like help choosing a piece."
              label="Message us"
              size="lg"
              className="!bg-cream !text-brand-900 hover:!bg-gold-100"
            />
            <Link to="/shop" className="btn !border !border-cream/30 !bg-transparent !text-cream hover:!bg-cream/10">
              Browse the collection
            </Link>
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-cream/40">
            No exchange · No returns · No cash on delivery
          </p>
        </div>
      </section>
    </>
  );
}
