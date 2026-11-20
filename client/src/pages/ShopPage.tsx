import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Seo } from '@/components/seo/Seo';
import { FloralDivider } from '@/components/FloralDivider';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'bestseller', label: 'Most loved' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
] as const;

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = (searchParams.get('sort') ?? 'featured') as string;

  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);

  const products = useApi(
    () => publicApi.listProducts({ search, category, sort: sort as never }).then((r) => r.products),
    [search, category, sort]
  );

  const [searchInput, setSearchInput] = useState(search);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  const hasFilters = Boolean(search || category || (sort && sort !== 'featured'));

  return (
    <>
      <Seo
        title="The Collection"
        description="Browse premium abayas, jacket abayas, embroidered pieces, burkhas, hijabs and pashmina from Zeesha Collection."
        canonicalPath="/shop"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <header className="text-center">
          <p className="eyebrow justify-center">The collection</p>
          <h1 className="section-title mt-3">Pieces to live in</h1>
          <FloralDivider className="mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            Signature abayas, open-front jackets, hand-finished occasion pieces and the layers that
            complete them. Prices are shared on enquiry.
          </p>
        </header>

        {/* Filters */}
        <div className="mt-9 flex flex-col gap-4 border-y border-gold-300/40 py-4 md:flex-row md:items-center md:justify-between">
          <form
            role="search"
            className="relative w-full md:max-w-xs"
            onSubmit={(e) => {
              e.preventDefault();
              setParam('search', searchInput.trim());
            }}
          >
            <input
              type="search"
              className="input !rounded-full !pl-10"
              placeholder="Search the collection…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search products"
            />
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setParam('category', '')}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                !category ? 'bg-brand-900 text-cream' : 'bg-white text-ink-soft ring-1 ring-brand-100 hover:bg-brand-50'
              }`}
            >
              All
            </button>
            {categories.data?.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => setParam('category', c.slug)}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  category === c.slug ? 'bg-brand-900 text-cream' : 'bg-white text-ink-soft ring-1 ring-brand-100 hover:bg-brand-50'
                }`}
              >
                {c.name}
              </button>
            ))}
            <select
              className="input !w-auto !rounded-full !py-2 text-xs"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {products.loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
            </div>
          ) : products.error ? (
            <EmptyState icon="error" title="Couldn't load products" description={products.error} action={<button className="btn-outline" onClick={() => products.refetch()}>Try again</button>} />
          ) : !products.data?.length ? (
            hasFilters ? (
              <EmptyState
                icon="search"
                title="No pieces match your filters"
                description="Try a different search term or edit."
                action={<button className="btn-outline" onClick={() => setSearchParams({})}>Clear filters</button>}
              />
            ) : (
              <EmptyState
                title="The collection is being prepared"
                description="Follow us on Instagram or send a message and we will help you personally."
                action={<WhatsAppButton message="Hi Zeesha Collection! I'd like to know what is available." label="Ask us" />}
              />
            )
          ) : (
            <>
              <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-ink-soft" aria-live="polite">
                {products.data.length} piece{products.data.length === 1 ? '' : 's'}
                {search ? ` matching “${search}”` : ''}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {products.data.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
