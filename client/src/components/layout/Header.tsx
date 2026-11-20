import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { BrandLogo } from '@/components/BrandLogo';
import { InstagramGlyph } from '@/components/ProductCard';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'The Collection' },
  { to: '/about', label: 'Our Story' },
  { to: '/gallery', label: 'Journal' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-300/40 bg-cream/95 backdrop-blur-md">
      {settings.announcements.enabled && settings.announcements.text ? (
        <div className="bg-brand-900 px-4 py-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-gold-200">
          {settings.announcements.text}
        </div>
      ) : null}

      <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-gold-400 after:transition-all after:duration-300 ${
                  isActive
                    ? 'text-brand-900 after:w-full'
                    : 'text-ink-soft after:w-0 hover:text-brand-800 hover:after:w-full'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {settings.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full p-2 text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 sm:block"
              aria-label="Instagram"
            >
              <InstagramGlyph className="h-[18px] w-[18px]" />
            </a>
          ) : null}

          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-ink transition-colors hover:bg-brand-50"
            aria-label={`Open cart (${count} items)`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[1.1rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-brand-950">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-ink transition-colors hover:bg-brand-50 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-fade-in border-t border-gold-300/40 bg-cream px-4 pb-6 pt-3 lg:hidden" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-brand-100/70 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] ${
                  isActive ? 'text-brand-900' : 'text-ink-soft'
                }`
              }
            >
              {item.label}
              <span className="text-gold-400" aria-hidden="true">→</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
