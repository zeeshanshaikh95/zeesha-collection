import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { FloralDivider } from '@/components/FloralDivider';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function GalleryPage() {
  const { data, loading, error, refetch } = useApi(
    () => publicApi.listGallery().then((r) => r.items),
    []
  );
  const { settings } = useSettings();

  return (
    <>
      <Seo
        title="Journal"
        description="New arrivals, exhibition days and close-ups of the detail from Zeesha Collection's Instagram."
        canonicalPath="/gallery"
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <header className="text-center">
          <p className="eyebrow justify-center">The journal</p>
          <h1 className="section-title mt-3">From the rail</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
            New arrivals, exhibition days and close-ups of the detail — straight from our Instagram.
          </p>
          <FloralDivider className="mt-4" />
        </header>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton aspect-square" />)}
          </div>
        ) : error ? (
          <div className="mt-10">
            <EmptyState icon="error" title="Couldn't load the journal" description={error} action={<button className="btn-outline" onClick={() => refetch()}>Try again</button>} />
          </div>
        ) : !data?.length ? (
          <div className="mt-10">
            <EmptyState
              title="The journal is being prepared"
              description="Follow along on Instagram in the meantime."
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {data.map((g) => {
              const body = (
                <>
                  {g.image ? (
                    <img src={g.image} alt={g.caption || 'Zeesha Collection'} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <PlaceholderImage seed={`ig-${g._id}`} />
                  )}
                  {g.caption ? (
                    <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-3 pt-10 text-[11px] font-medium leading-snug text-cream">
                      {g.caption}
                    </p>
                  ) : null}
                </>
              );
              return g.externalUrl ? (
                <a key={g._id} href={g.externalUrl} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden rounded-lg bg-brand-50">
                  {body}
                </a>
              ) : (
                <div key={g._id} className="group relative aspect-square overflow-hidden rounded-lg bg-brand-50">
                  {body}
                </div>
              );
            })}
          </div>
        )}

        {settings.instagramUrl ? (
          <div className="mt-10 text-center">
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Follow @zeesha.collection
            </a>
          </div>
        ) : null}
      </div>
    </>
  );
}
