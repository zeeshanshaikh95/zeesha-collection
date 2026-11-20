import { Link } from 'react-router-dom';
import { LOGO_ORIGINAL } from '@/lib/brand';

interface Props {
  /** `md` is the navbar, `lg` the footer, `sm` the admin topbar. */
  size?: 'sm' | 'md' | 'lg';
  /** Render the wordmark next to the roundel. */
  showWordmark?: boolean;
  className?: string;
}

const MARK_SIZE = { sm: 'h-9 w-9', md: 'h-11 w-11 sm:h-12 sm:w-12', lg: 'h-16 w-16' };
const NAME_SIZE = { sm: 'text-lg', md: 'text-[1.45rem] sm:text-[1.6rem]', lg: 'text-3xl' };
const TAG_SIZE = { sm: 'text-[7px]', md: 'text-[8px] sm:text-[8.5px]', lg: 'text-[10px]' };

/** The brand lockup used across the storefront and admin. */
export function BrandLogo({ size = 'md', showWordmark = true, className = '' }: Props) {
  return (
    <Link
      to="/"
      className={`group flex shrink-0 items-center gap-3 ${className}`}
      aria-label="Zeesha Collection — home"
    >
      <span className="relative inline-flex shrink-0">
        <img
          src={LOGO_ORIGINAL}
          alt=""
          width={600}
          height={600}
          className={`${MARK_SIZE[size]} rounded-lg object-cover ring-1 ring-gold-400/50 transition-transform duration-500 group-hover:scale-[1.04]`}
        />
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className={`font-display font-semibold tracking-[0.02em] text-ink ${NAME_SIZE[size]}`}>
            Zeesha
          </span>
          <span
            className={`mt-1 font-medium uppercase tracking-[0.34em] text-brand-700 ${TAG_SIZE[size]}`}
          >
            Abaya Collection
          </span>
        </span>
      ) : null}
    </Link>
  );
}
