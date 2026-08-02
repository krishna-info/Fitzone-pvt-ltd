import { getDb } from './db';
import { Product } from './product-types';

export * from './product-types';

export const parseProduct = (p: any): Product => {
  if (!p) return p;

  let images: string[] = [];
  try {
    images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
  } catch {
    images = [];
  }

  let specifications: Record<string, string> = {};
  try {
    specifications = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : (p.specifications || {});
  } catch {
    specifications = {};
  }

  let colors: string[] = [];
  try {
    if (p.colors) {
      colors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
    } else if (specifications._colors) {
      colors = typeof specifications._colors === 'string' ? JSON.parse(specifications._colors) : specifications._colors;
    }
  } catch {
    colors = [];
  }

  let sizes: string[] = [];
  try {
    if (p.sizes) {
      sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
    } else if (specifications._sizes) {
      sizes = typeof specifications._sizes === 'string' ? JSON.parse(specifications._sizes) : specifications._sizes;
    }
  } catch {
    sizes = [];
  }

  let features: string[] = [];
  try {
    if (p.features) {
      features = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
    } else if (specifications._features) {
      features = typeof specifications._features === 'string' ? JSON.parse(specifications._features) : specifications._features;
    }
  } catch {
    features = [];
  }

  colors = Array.isArray(colors) ? colors : [];
  sizes = Array.isArray(sizes) ? sizes : [];
  features = Array.isArray(features) ? features : [];

  // Clean hidden internal keys from public specifications map
  const cleanSpecs = { ...specifications };
  delete cleanSpecs._colors;
  delete cleanSpecs._sizes;
  delete cleanSpecs._features;

  return {
    ...p,
    images,
    specifications: cleanSpecs,
    colors,
    sizes,
    features,
    is_enquiry_only: Boolean(p.is_enquiry_only),
    is_active: Boolean(p.is_active)
  };
};

// Fetch all active products with pagination
export async function getAllProducts(limit?: number, offset?: number): Promise<Product[]> {
  const limitClause = limit !== undefined ? ` LIMIT ${limit}` : '';
  const offsetClause = offset !== undefined ? ` OFFSET ${offset}` : '';

  try {
    const db = getDb();
    if (!db) return [];
    
    try {
      const { results } = await db.prepare(`SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC${limitClause}${offsetClause}`).all();
      return (results || []).map(parseProduct);
    } catch {
      const { results } = await db.prepare(`SELECT * FROM products WHERE is_active = 1 ORDER BY rowid DESC${limitClause}${offsetClause}`).all();
      return (results || []).map(parseProduct);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category slug with pagination
export async function getProductsByCategory(categorySlug: string, limit?: number, offset?: number): Promise<Product[]> {
  const limitClause = limit !== undefined ? ` LIMIT ${limit}` : '';
  const offsetClause = offset !== undefined ? ` OFFSET ${offset}` : '';

  try {
    const db = getDb();
    if (!db) return [];

    try {
      const { results } = await db.prepare(`SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY created_at DESC${limitClause}${offsetClause}`).bind(categorySlug).all();
      return (results || []).map(parseProduct);
    } catch {
      const { results } = await db.prepare(`SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY rowid DESC${limitClause}${offsetClause}`).bind(categorySlug).all();
      return (results || []).map(parseProduct);
    }
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Fetch latest products for homepage gallery
export async function getLatestProducts(limit = 6): Promise<Product[]> {
  try {
    const db = getDb();
    if (!db) return [];

    try {
      const { results } = await db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT ?')
        .bind(limit)
        .all();
      return (results || []).map(parseProduct);
    } catch {
      const { results } = await db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY rowid DESC LIMIT ?')
        .bind(limit)
        .all();
      return (results || []).map(parseProduct);
    }
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}

// Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const product = await db.prepare('SELECT * FROM products WHERE slug = ?')
      .bind(slug)
      .first();

    return product ? parseProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Fetch related products from the same category
export async function getRelatedProducts(categorySlug: string, currentSlug: string, limit = 4): Promise<Product[]> {
  try {
    const db = getDb();
    if (!db) return [];

    const { results } = await db.prepare('SELECT * FROM products WHERE category_slug = ? AND slug != ? AND is_active = 1 LIMIT ?')
      .bind(categorySlug, currentSlug, limit)
      .all();

    return (results || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
