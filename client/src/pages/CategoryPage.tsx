import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { FloralDivider } from '@/components/FloralDivider';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const { data, loading, error } = useApi(
    () => publicApi.getCategory(slug),
    [slug]
  );

  return (
    <>
      {data ? (
        <Seo
          title={data.category.name}
          description={data.category.description || `Browse ${data.category.name} from Zeesha Collection.`}
          canonicalPath={`/category/${data.category.slug}`}
        />
      ) : (
        <Seo title="The collection" canonicalPath={`/category/${slug}`} />
      )}

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        {loading ? (
          <>
            <div className="skeleton mx-auto h-8 w-64" />
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
            </div>
          </>
        ) : error || !data ? (
          <div className="py-10">
            <EmptyState
              icon="error"
              title="Edit not found"
              description={error ?? 'It may have been removed or renamed.'}
              action={<Link to="/shop" className="btn-primary">Browse the collection</Link>}
            />
          </div>
        ) : (
          <>
            <header className="text-center">
              <p className="eyebrow justify-center">The collection</p>
              <h1 className="section-title mt-3">{data.category.name}</h1>
              {data.category.description ? (
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {data.category.description}
                </p>
              ) : null}
              <FloralDivider className="mt-4" />
            </header>

            {data.category.image ? (
              <div className="mx-auto mt-8 flex max-w-3xl justify-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-t-[11rem] rounded-b-[1rem] border border-gold-300/50 bg-brand-50 shadow-card">
                  <img
                    src={data.category.image}
                    alt={data.category.name}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-0 right-0 text-center font-display text-2xl italic text-cream">
                    {data.category.name}
                  </p>
                </div>
              </div>
            ) : null}

            {data.products.length === 0 ? (
              <div className="mt-10">
                <EmptyState
                  title="Pieces are on their way"
                  description="This edit is being prepared. Message us and we will show you what is available."
                  action={
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link to="/shop" className="btn-outline">Browse the collection</Link>
                      <WhatsAppButton message="Hi Zeesha Collection! I'd like to know what is available." label="Ask us" />
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link to="/shop" className="btn-outline">← Browse the collection</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
