import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { FloralDivider } from '@/components/FloralDivider';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { InstagramGlyph, WhatsAppGlyph } from '@/components/ProductCard';
import { instagramHandle } from '@/lib/whatsapp';

const STEPS = [
  { title: 'Browse', text: 'Open any piece to see the details, fabric notes and available sizes.' },
  { title: 'Message', text: 'Tap Enquire — the piece details are pre-filled for you.' },
  { title: 'Confirm', text: 'We reply with availability, final pricing and delivery details.' },
];

export function ContactPage() {
  const { settings, whatsappConfigured } = useSettings();
  const instagram = settings.instagramUrl || 'https://www.instagram.com/zeesha.collection/';
  const handle = `@${instagramHandle(settings) || 'zeesha.collection'}`;

  return (
    <>
      <Seo
        title="Contact"
        description="Reach Zeesha Collection on Instagram for orders, sizing and delivery details."
        canonicalPath="/contact"
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <header className="text-center">
          <p className="eyebrow justify-center">Get in touch</p>
          <h1 className="section-title mt-3">We would love to help you choose</h1>
          <FloralDivider className="mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            The quickest way to reach us is Instagram DM. Ask about a piece, your size, or delivery
            — we answer personally.
          </p>
        </header>

        <div className="mt-10 space-y-4">
          <div className="card flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-gold-200">
              <InstagramGlyph className="h-7 w-7" />
            </span>
            <h2 className="font-display text-2xl font-semibold">Instagram DM</h2>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Message us directly for availability, sizing and delivery. We reply with the details
              you need before you order.
            </p>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <InstagramGlyph className="h-4 w-4" />
              {handle}
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6 text-center">
              <h2 className="font-display text-xl font-semibold">WhatsApp</h2>
              {whatsappConfigured ? (
                <>
                  <p className="mt-2 text-sm text-ink-soft">Message us with your enquiry.</p>
                  <div className="mt-4 flex justify-center">
                    <WhatsAppButton
                      message="Hi Zeesha Collection! I have a question about your collection."
                      label="Chat on WhatsApp"
                    />
                  </div>
                </>
              ) : (
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-ink-soft">
                  <WhatsAppGlyph className="h-4 w-4 text-ink-soft/60" />
                  Coming soon — DM us on Instagram for now.
                </p>
              )}
            </div>

            <div className="card p-6 text-center">
              <h2 className="font-display text-xl font-semibold">Where to find us</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Surat, Gujarat · India
                <br />
                Exhibitions across India
                <br />
                Delivery all over India
              </p>
              {settings.mapsUrl ? (
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 hover:text-brand-800"
                >
                  Open in Google Maps →
                </a>
              ) : null}
            </div>
          </div>

          {settings.email ? (
            <div className="card p-6 text-center">
              <h2 className="font-display text-lg font-semibold">Email</h2>
              <a href={`mailto:${settings.email}`} className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">
                {settings.email}
              </a>
            </div>
          ) : null}
        </div>

        <div className="mt-14">
          <h2 className="text-center font-display text-2xl font-semibold">How ordering works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card p-5 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-[11px] font-semibold text-gold-200">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] leading-relaxed text-ink-soft/80">
          Prices are shared on enquiry. Availability and final pricing are confirmed personally
          before your order is placed. No exchange, no returns and no cash on delivery.
        </p>
      </div>
    </>
  );
}
