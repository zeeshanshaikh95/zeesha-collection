import { placeholderGradient } from '@/lib/format';

interface Props {
  seed?: string;
  /** Short caption shown over the placeholder. Defaults to a customer-friendly label. */
  label?: string;
  className?: string;
}

/**
 * Brand-styled placeholder shown whenever real client imagery is not yet
 * available. Deliberately NOT stock photography — a simple abaya silhouette
 * stands in until the client supplies photos.
 */
export function PlaceholderImage({ seed = 'zeesha', label = 'Photo coming soon', className = '' }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${placeholderGradient(seed)} ${className}`}
    >
      <svg viewBox="0 0 120 120" className="h-2/5 w-2/5 text-brand-500/50" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M60 24c-5 0-8 3-8 7 0 3 2 5 4 6l-12 37c-1 4 2 7 6 7h20c4 0 7-3 6-7L64 37c2-1 4-3 4-6 0-4-3-7-8-7z" />
          <path d="M54 68h12M50 84c6 3 14 3 20 0" />
        </g>
        <circle cx="60" cy="30" r="2" fill="currentColor" />
      </svg>
      {label ? (
        <span className="absolute bottom-2 left-0 right-0 px-2 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-brand-800/50">
          {label}
        </span>
      ) : null}
    </div>
  );
}
