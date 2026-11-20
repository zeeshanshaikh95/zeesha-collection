import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

export interface HeroSlide {
  image: string;
  title: string;
  note: string;
  href: string;
}

interface Props {
  slides: HeroSlide[];
}

/**
 * Arch-framed editorial slider for the hero. Auto-advances, pauses on hover or
 * keyboard focus, and exposes arrow + dot controls for touch and keyboard.
 */
export function HeroSlider({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  if (!slides.length) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);
  const active = slides[index];

  return (
    <div
      className="relative mx-auto w-full max-w-[30rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured pieces"
    >
      {/* Thin gold offset frame — the "double border" of a lookbook plate. */}
      <div className="pointer-events-none absolute -inset-2.5 rounded-t-[16rem] rounded-b-[1.4rem] border border-gold-300/50 sm:-inset-3" />

      <div className="relative overflow-hidden rounded-t-[15rem] rounded-b-[1.25rem] border border-brand-200/60 bg-brand-100 shadow-glow">
        <div className="relative aspect-[4/5] overflow-hidden">
          {slides.map((slide, i) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
                i === index ? 'scale-100 opacity-100' : 'scale-[1.05] opacity-0'
              }`}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/75 via-brand-950/10 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
            <span className="rounded-full border border-cream/40 bg-brand-950/30 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-cream backdrop-blur-sm">
              The collection
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-cream/80">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-6">
            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-gold-300">
              {active.note}
            </p>
            <div className="mt-1.5 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-medium leading-tight sm:text-[1.75rem]">
                {active.title}
              </h2>
              <Link
                to={active.href}
                onClick={() => trackEvent({ type: 'product_view', productSlug: active.href.replace('/product/', '') })}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/50 bg-cream/10 text-cream backdrop-blur transition-colors hover:bg-cream hover:text-brand-900"
                aria-label={`View ${active.title}`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute -left-3 top-[58%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300 bg-cream text-brand-900 shadow-soft transition-colors hover:bg-brand-900 hover:text-cream sm:flex"
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute -right-3 top-[58%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300 bg-cream text-brand-900 shadow-soft transition-colors hover:bg-brand-900 hover:text-cream sm:flex"
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="mt-5 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${slide.title}`}
            aria-pressed={i === index}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? 'w-9 bg-brand-800' : 'w-4 bg-brand-200 hover:bg-gold-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
