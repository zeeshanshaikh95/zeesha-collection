import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

/**
 * Horizontal, snap-scrolling product rail. Native touch scrolling on phones;
 * arrow controls on larger screens. Cards stay real links, so the rail is
 * keyboard-navigable without custom key handling.
 */
export function ProductRail({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.8, 520), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-900 transition-colors hover:border-brand-700 hover:bg-brand-50"
          aria-label="Scroll products left"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-900 transition-colors hover:border-brand-700 hover:bg-brand-50"
          aria-label="Scroll products right"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-thin -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[68vw] shrink-0 snap-start sm:w-[43%] lg:w-[23.2%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-1 text-right">
        <Link
          to="/shop"
          className="link-underline text-[11px] font-medium uppercase tracking-[0.18em] text-brand-800"
        >
          View the full collection
        </Link>
      </div>
    </div>
  );
}
