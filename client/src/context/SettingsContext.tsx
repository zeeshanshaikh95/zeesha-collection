import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { publicApi } from '@/api/endpoints';
import type { PublicSettings } from '@/types';

const FALLBACK_SETTINGS: PublicSettings = {
  businessName: 'Zeesha Collection',
  // Ordering falls back to Instagram DM until a number is set in the admin.
  whatsappNumber: '',
  instagramUrl: 'https://www.instagram.com/zeesha.collection/',
  email: '',
  mapsUrl: '',
  whatsappTemplate:
    'Hi Zeesha Collection!\n' +
    'I would like to order:\n' +
    '{{ITEMS}}\n' +
    'Estimated total: {{TOTAL}}\n\n' +
    'Please share availability and delivery details.',
  whatsappSingleProductTemplate:
    'Hi Zeesha Collection!\n' +
    'I would like to order:\n' +
    '• {{PRODUCT}}\n' +
    '{{VARIANT_LINE}}{{QTY_LINE}}Price: {{PRICE}}\n\n' +
    'Please share availability and delivery details.',
  hero: {
    headline: 'Elegance, draped.',
    subheadline:
      'Premium abayas, burkhas, hijabs and pashmina — chosen for the woman who likes her modest dressing elegant, trend-forward and comfortable.',
    imageUrl: '',
  },
  about: {
    intro:
      'Zeesha Collection is a Surat-based abaya house built around one idea: modest dressing should feel elegant, current and comfortable — never like a compromise.',
    story: '',
    founderImageUrl: '',
  },
  announcements: {
    enabled: true,
    text: 'Delivery all over India · DM us for details and availability',
  },
};

interface SettingsContextValue {
  settings: PublicSettings;
  loading: boolean;
  error: string | null;
  whatsappConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: FALLBACK_SETTINGS,
  loading: true,
  error: null,
  whatsappConfigured: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .getSettings()
      .then(({ settings }) => {
        if (!cancelled) {
          setSettings({ ...FALLBACK_SETTINGS, ...settings });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load site settings');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const whatsappConfigured = Boolean(settings.whatsappNumber);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, whatsappConfigured }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
