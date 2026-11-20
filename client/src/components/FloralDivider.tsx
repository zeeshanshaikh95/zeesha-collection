interface Props {
  className?: string;
}

/**
 * Quiet architectural divider: two hairlines meeting at a small gold lozenge.
 * (Kept under the original filename so existing imports stay valid.)
 */
export function FloralDivider({ className = '' }: Props) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-400/70" />
      <span className="flex items-center gap-1.5">
        <span className="h-1 w-1 rotate-45 bg-gold-400" />
        <span className="h-1.5 w-1.5 rotate-45 border border-gold-500" />
        <span className="h-1 w-1 rotate-45 bg-gold-400" />
      </span>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-400/70" />
    </div>
  );
}
