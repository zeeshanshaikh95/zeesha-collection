import { api, resolveAssetUrl } from './client';
import {
  DEMO_MODE,
  demoCategories,
  demoGallery,
  demoProducts,
  demoPublicSettings,
} from '@/lib/demoCatalogue';
import type {
  AdminSettings,
  AnalyticsSummary,
  Category,
  GalleryItem,
  PublicSettings,
  Product,
  Review,
} from '@/types';

// ── Image normalisation ─────────────────────────────────────────
// Seeded catalogue placeholders use markers like "[CLIENT IMAGE REQUIRED]".
// Those must NOT render as broken <img> tags — the UI shows its branded
// placeholder instead. Real URLs are resolved against the API origin.

function cleanImage(url: unknown): string {
  const value = String(url ?? '').trim();
  if (!value) return '';
  // Bundled storefront assets (seeded catalogue photography) live under
  // /images and /brand, so they must resolve against the frontend's BASE_URL
  // rather than the API origin — with or without a leading slash.
  if (/^(images|brand)\//i.test(value)) {
    return `${import.meta.env.BASE_URL}${value}`;
  }
  if (/^\/(images|brand)\//i.test(value)) {
    return `${import.meta.env.BASE_URL}${value.slice(1)}`;
  }
  if (/^(https?:|data:|blob:)/i.test(value) || value.startsWith('/')) {
    return resolveAssetUrl(value);
  }
  return '';
}

function normProduct<T extends Product>(p: T): T {
  return { ...p, images: (p.images ?? []).map(cleanImage).filter(Boolean) };
}

function normCategory<T extends Category>(c: T): T {
  return { ...c, image: cleanImage(c.image) };
}

function normReview<T extends Review>(r: T): T {
  return { ...r, image: cleanImage(r.image) };
}

function normGallery<T extends GalleryItem>(g: T): T {
  return { ...g, image: cleanImage(g.image) };
}

function normSettings(s: PublicSettings): PublicSettings {
  return {
    ...s,
    hero: { ...s.hero, imageUrl: cleanImage(s.hero?.imageUrl) },
    about: { ...s.about, founderImageUrl: cleanImage(s.about?.founderImageUrl) },
  };
}

// ── Public ──────────────────────────────────────────────────────

function demoProductList(params: ProductQueryParams): Product[] {
  let list = demoProducts.map(normProduct);

  if (params.search) {
    const term = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (params.category) {
    list = list.filter((p) => p.category?.slug === params.category);
  }

  switch (params.sort) {
    case 'price_asc':
      list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case 'price_desc':
      list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'bestseller':
      list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
      break;
    case 'featured':
    default:
      list = [...list].sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder
      );
  }

  return list;
}

const realPublicApi = {
  getSettings: () =>
    api.get<{ settings: PublicSettings }>('/settings').then((r) => ({
      settings: normSettings(r.settings),
    })),
  listProducts: (params: ProductQueryParams = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.category) qs.set('category', params.category);
    if (params.sort) qs.set('sort', params.sort);
    const s = qs.toString();
    return api
      .get<{ products: Product[] }>(`/products${s ? `?${s}` : ''}`)
      .then((r) => ({ products: r.products.map(normProduct) }));
  },
  getProduct: (slug: string) =>
    api
      .get<{ product: Product }>(`/products/${encodeURIComponent(slug)}`)
      .then((r) => ({ product: normProduct(r.product) })),
  getRelated: (slug: string) =>
    api
      .get<{ products: Product[] }>(`/products/${encodeURIComponent(slug)}/related`)
      .then((r) => ({ products: r.products.map(normProduct) })),
  listCategories: () =>
    api
      .get<{ categories: Category[] }>('/categories')
      .then((r) => ({ categories: r.categories.map(normCategory) })),
  getCategory: (slug: string) =>
    api
      .get<{ category: Category; products: Product[] }>(`/categories/${encodeURIComponent(slug)}`)
      .then((r) => ({
        category: normCategory(r.category),
        products: r.products.map(normProduct),
      })),
  listReviews: () =>
    api.get<{ reviews: Review[] }>('/reviews').then((r) => ({ reviews: r.reviews.map(normReview) })),
  listGallery: () =>
    api
      .get<{ items: GalleryItem[] }>('/gallery')
      .then((r) => ({ items: r.items.map(normGallery) })),
  track: (event: TrackPayload) => api.post('/analytics/events', event),
};

const demoApi = {
  getSettings: () => Promise.resolve({ settings: normSettings(demoPublicSettings) }),
  listProducts: (params: ProductQueryParams = {}) =>
    Promise.resolve({ products: demoProductList(params) }),
  getProduct: (slug: string) => {
    const product = demoProducts.map(normProduct).find((p) => p.slug === slug);
    return product
      ? Promise.resolve({ product })
      : Promise.reject(new Error('Product not found'));
  },
  getRelated: (slug: string) => {
    const source = demoProducts.find((p) => p.slug === slug);
    const products = demoProductList({})
      .filter((p) => p.slug !== slug && p.category?.slug === source?.category?.slug)
      .sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || Number(b.featured) - Number(a.featured))
      .slice(0, 4);
    return Promise.resolve({ products });
  },
  listCategories: () =>
    Promise.resolve({ categories: demoCategories.map(normCategory) }),
  getCategory: (slug: string) => {
    const category = demoCategories.map(normCategory).find((c) => c.slug === slug);
    if (!category) return Promise.reject(new Error('Category not found'));
    return Promise.resolve({
      category,
      products: demoProductList({ category: slug }),
    });
  },
  listReviews: () => Promise.resolve({ reviews: [] as Review[] }),
  listGallery: () =>
    Promise.resolve({ items: demoGallery.map(normGallery) }),
  track: (_event: TrackPayload) => Promise.resolve({ ok: true }),
};

export const publicApi = DEMO_MODE ? demoApi : realPublicApi;

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: 'featured' | 'bestseller' | 'price_asc' | 'price_desc' | 'newest';
}

export function toQuery(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export interface TrackPayload {
  type: 'page_view' | 'product_view' | 'whatsapp_click' | 'cart_add' | 'order_whatsapp_click';
  productSlug?: string;
  path?: string;
  referrer?: string;
  sessionId?: string;
}

// ── Admin ───────────────────────────────────────────────────────

export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number | null;
  compareAtPrice: number | null;
  size: string;
  category: string | null;
  images: string[];
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  warnings: string;
  variants: Array<{ name: string; price: number | null; stockStatus: 'in_stock' | 'out_of_stock' }>;
  stockStatus: 'in_stock' | 'out_of_stock';
  bestseller: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  displayOrder: number;
  archived: boolean;
}

export interface AdminSessionUser {
  id: string;
  email: string;
  /** True while bootstrap credentials are still in use — forces a password change. */
  mustChangePassword?: boolean;
}

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; admin: AdminSessionUser }>(
      '/admin/auth/login',
      { email, password }
    ),
  me: () => api.get<{ admin: AdminSessionUser }>('/admin/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<{ ok: boolean; admin?: AdminSessionUser }>('/admin/auth/password', {
      currentPassword,
      newPassword,
    }),

  listProducts: () =>
    api.get<{ products: Product[] }>('/admin/products').then((r) => ({
      products: r.products.map(normProduct),
    })),
  getProduct: (id: string) =>
    api
      .get<{ product: Product }>(`/admin/products/${id}`)
      .then((r) => ({ product: normProduct(r.product) })),
  createProduct: (input: ProductInput) => api.post<{ product: Product }>('/admin/products', input),
  updateProduct: (id: string, input: ProductInput) =>
    api.put<{ product: Product }>(`/admin/products/${id}`, input),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  archiveProduct: (id: string) =>
    api.post<{ product: Product }>(`/admin/products/${id}/archive`),
  restoreProduct: (id: string) =>
    api.post<{ product: Product }>(`/admin/products/${id}/restore`),

  listCategories: () =>
    api
      .get<{ categories: Category[] }>('/admin/categories')
      .then((r) => ({ categories: r.categories.map(normCategory) })),
  createCategory: (input: Partial<Category>) =>
    api.post<{ category: Category }>('/admin/categories', input),
  updateCategory: (id: string, input: Partial<Category>) =>
    api.put<{ category: Category }>(`/admin/categories/${id}`, input),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  reorderCategories: (items: Array<{ id: string; displayOrder: number }>) =>
    api.put('/admin/categories/reorder', { items }),

  listReviews: () =>
    api.get<{ reviews: Review[] }>('/admin/reviews').then((r) => ({ reviews: r.reviews.map(normReview) })),
  createReview: (input: Partial<Review>) => api.post<{ review: Review }>('/admin/reviews', input),
  updateReview: (id: string, input: Partial<Review>) =>
    api.put<{ review: Review }>(`/admin/reviews/${id}`, input),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
  setReviewStatus: (id: string, status: Review['status']) =>
    api.post<{ review: Review }>(`/admin/reviews/${id}/status`, { status }),

  listGallery: () =>
    api.get<{ items: GalleryItem[] }>('/admin/gallery').then((r) => ({ items: r.items.map(normGallery) })),
  createGalleryItem: (input: Partial<GalleryItem>) =>
    api.post<{ item: GalleryItem }>('/admin/gallery', input),
  updateGalleryItem: (id: string, input: Partial<GalleryItem>) =>
    api.put<{ item: GalleryItem }>(`/admin/gallery/${id}`, input),
  deleteGalleryItem: (id: string) => api.delete(`/admin/gallery/${id}`),

  getAnalytics: (range: '7' | '30' | '90' = '30') =>
    api.get<AnalyticsSummary>(`/admin/analytics?range=${range}`),

  getSettings: () =>
    api
      .get<{ settings: AdminSettings }>('/admin/settings')
      .then((r) => ({ settings: { ...normSettings(r.settings), updatedAt: r.settings.updatedAt } })),
  updateSettings: (input: AdminSettings) =>
    api.put<{ settings: AdminSettings }>('/admin/settings', input),
};

export type { AdminSettings, AnalyticsSummary, Category, GalleryItem, Product, Review };
