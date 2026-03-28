export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_slug: string;
  description: string;
  price_inr?: number;
  moq: number;
  images: string[];
  is_enquiry_only: boolean;
  is_active: boolean;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface ProductCategory {
  name: string;
  slug: string;
  image: string;
  count?: number;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { name: 'T-Shirts & Jerseys', slug: 't-shirts-jerseys', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780' },
  { name: 'Shorts & Track Pants', slug: 'shorts-track-pants', image: 'https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=1887' },
  { name: 'Jackets & Hoodies', slug: 'jackets-hoodies', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935' },
  { name: 'Compression Wear', slug: 'compression-wear', image: 'https://images.unsplash.com/photo-1539185441755-769473a23a5e?q=80&w=2070' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1584931423298-c576fda54bd2?q=80&w=2070' },
];
