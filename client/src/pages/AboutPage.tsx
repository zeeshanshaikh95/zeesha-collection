import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { FloralDivider } from '@/components/FloralDivider';
import { Link } from 'react-router-dom';
import { ABOUT_IMAGE } from '@/lib/brand';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const PROMISES = [
  {
    title: 'Chosen for the drape',
    text: 'Every abaya, burkha and shawl is picked for its fall, finish and comfort — not just how it looks on a hanger.',
  },
  {
    title: 'A small, honest edit',
    text: 'We keep the collection tight. If it is here, it is because we would wear it ourselves.',
  },
  {
    title: 'Personal service',
    text: 'Every enquiry is answered personally — sizing, colour and delivery, without a call centre in between.',
  },
];

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <>
      <Seo
        title="Our Story"
        description="The story behind Zeesha Collection — a Surat-based abaya house for elegant, trend-forward modest dressing."
        canonicalPath="/about"
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <header className="text-center">
          <p className="eyebrow justify-center">Our story</p>
          <h1 className="section-title mt-3 text-balance">
            Modest dressing, <em className="font-normal italic text-brand-700">considered.</em>
          </h1>
          <FloralDivider className="mt-5" />
        </header>

        <div className="mx-auto mt-10 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-t-[9rem] rounded-b-[1rem] border border-gold-300/50 bg-brand-50 shadow-card">
          <img
            src={settings.about.founderImageUrl || ABOUT_IMAGE}
            alt="Zeesha Collection exhibition rail"
            width={1100}
            height={825}
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-5 text-center">
          <p className="font-display text-2xl leading-snug text-ink sm:text-[1.65rem]">
            {settings.about.intro ||
              'Zeesha Collection is a Surat-based abaya house built around one idea: modest dressing should feel elegant, current and comfortable — never like a compromise.'}
          </p>

          {settings.about.story ? (
            <p className="whitespace-pre-line leading-relaxed text-ink-soft">
              {settings.about.story}
            </p>
          ) : (
            <p className="leading-relaxed text-ink-soft">
              The collection brings together signature abayas, open-front jackets, hand-finished
              embroidered pieces, burkhas, hijabs and pashmina. We travel to exhibitions across
              India so customers can feel the fabric and find their size in person — and everything
              on this site comes from that same rail. Delivery is available all over India.
            </p>
          )}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {PROMISES.map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/70 bg-gold-100/60 text-brand-800" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l2.4 5.2 5.6.7-4.1 3.9 1 5.6-4.9-2.8-4.9 2.8 1-5.6L4 8.9l5.6-.7L12 3z" />
                </svg>
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">Shop the collection</Link>
          <WhatsAppButton
            message="Hi Zeesha Collection! I would like to know more about your collection."
            label="Ask us a question"
          />
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.16em] text-ink-soft/70">
          Surat, Gujarat · Exhibitions across India · Delivery all over India
        </p>
      </div>
    </>
  );
}
