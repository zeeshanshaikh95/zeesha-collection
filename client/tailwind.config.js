export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /**
         * Palette taken from the house mark: deep emerald ground, antique gold
         * line-work, warm ivory cloth. Emerald is the brand colour (CTAs, links,
         * the storefront's dark bands); gold is reserved for hairlines and
         * small luxury accents so it never becomes noisy.
         */
        brand: {
          50: '#F2FAF6',
          100: '#DDF1E7',
          200: '#BCE3D3',
          300: '#8ACDB6',
          400: '#52B094',
          500: '#2C9275',
          600: '#0E7257',
          700: '#0A5B47',
          800: '#084839',
          900: '#073A2F',
          950: '#03261F',
        },
        // Warm near-black for body copy on ivory.
        ink: '#13241E',
        'ink-soft': '#5B6F65',
        // Surfaces.
        cream: '#FCF9F2',
        blush: '#F5EDDF',
        sand: '#F5EDDF',
        // Secondary sage — used only for quiet supporting notes.
        leaf: {
          50: '#F4F8F4',
          100: '#E5EEE6',
          500: '#6D8A72',
          600: '#55705B',
          700: '#405846',
        },
        // Antique gold.
        gold: {
          100: '#F8F0DA',
          200: '#F0DFB5',
          300: '#E4C98C',
          400: '#D3AE65',
          500: '#BE9548',
          600: '#9C7531',
          700: '#7A5A25',
        },
      },
      fontFamily: {
        // High-contrast editorial serif for the collection, geometric sans
        // for navigation, labels and body copy.
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px -24px rgba(7, 58, 47, 0.42)',
        card: '0 2px 18px -6px rgba(19, 36, 30, 0.12)',
        glow: '0 26px 60px -30px rgba(7, 58, 47, 0.55)',
      },
      borderRadius: {
        blob: '1.25rem',
        arch: '50% 50% 1.25rem 1.25rem / 32% 32% 1.25rem 1.25rem',
      },
      backgroundImage: {
        'emerald-linen':
          "radial-gradient(circle at 20% 10%, rgba(211,174,101,0.10), transparent 42%), radial-gradient(circle at 85% 80%, rgba(82,176,148,0.14), transparent 46%)",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translateX(0)' },
          '100%': { transform: 'scale(1.08) translateX(-1.5%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fade-up 0.55s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-in-right': 'slide-in-right 0.28s ease-out both',
        float: 'float 6s ease-in-out infinite',
        kenburns: 'kenburns 12s ease-out both',
      },
    },
  },
  plugins: [],
};
