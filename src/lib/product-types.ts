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
  { name: 'T-Shirts & Jerseys', slug: 't-shirts-jerseys', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1780' },
  { name: 'Shorts & Track Pants', slug: 'shorts-track-pants', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1780' },
  { name: 'Jackets & Hoodies', slug: 'jackets-hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1780' },
  { name: 'Compression Wear', slug: 'compression-wear', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1780' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1514994667787-b48ca37155f0?q=80&w=1780' },
];

