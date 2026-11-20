import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { OG_IMAGE_ABSOLUTE, SITE_URL } from '@/lib/brand';

interface Props {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  imageUrl?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const SITE_NAME = 'Zeesha Collection';

/** Finds (or creates) a <meta> tag in <head>. */
function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Per-page metadata. <Helmet> covers crawlers that execute JS; the effect also
 * writes the tags natively so the document title updates reliably in the
 * production SPA build.
 */
export function Seo({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  imageUrl,
  jsonLd,
  noIndex = false,
}: Props) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
  const canonical = `${SITE_URL}${canonicalPath ?? ''}`;
  // Falls back to the brand social image so every page shares something on-brand.
  const socialImage = imageUrl ?? OG_IMAGE_ABSOLUTE;

  useEffect(() => {
    document.title = fullTitle;
    if (description) setMeta('name', 'description', description);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', fullTitle);
    if (description) setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', socialImage);
    setMeta('name', 'twitter:image', socialImage);
    setMeta('name', 'twitter:card', 'summary_large_image');

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else if (robots) {
      robots.remove();
    }
  }, [fullTitle, description, ogType, canonical, socialImage, noIndex]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />

      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {jsonLd
        ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(obj)}
            </script>
          ))
        : null}
    </Helmet>
  );
}
