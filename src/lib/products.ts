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
      colors = JSON.parse(specifications._colors);
    }
  } catch {
    colors = [];
  }

  let sizes: string[] = [];
  try {
    if (p.sizes) {
      sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
    } else if (specifications._sizes) {
      sizes = JSON.parse(specifications._sizes);
    }
  } catch {
    sizes = [];
  }

  // Sensible defaults if not explicitly set
  if (!colors || colors.length === 0) {
    colors = ['Black', 'Navy', 'Heather Gray', 'White'];
  }
  if (!sizes || sizes.length === 0) {
    sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  }

  // Clean hidden internal keys from public specifications map
  const cleanSpecs = { ...specifications };
  delete cleanSpecs._colors;
  delete cleanSpecs._sizes;

  return {
    ...p,
    images,
    specifications: cleanSpecs,
    colors,
    sizes
  };
};

// Fetch all active products with pagination
export async function getAllProducts(limit?: number, offset?: number): Promise<Product[]> {
  let queryStr = 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC';
  
  if (limit) {
    queryStr += ` LIMIT ${limit}`;
    if (offset) {
      queryStr += ` OFFSET ${offset}`;
    }
  }

  try {
    const db = getDb();
    if (!db) return [];
    const { results } = await db.prepare(queryStr).all();
    return (results || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category slug with pagination
export async function getProductsByCategory(categorySlug: string, limit?: number, offset?: number): Promise<Product[]> {
  let queryStr = 'SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY created_at DESC';
  
  if (limit) {
    queryStr += ` LIMIT ${limit}`;
    if (offset) {
      queryStr += ` OFFSET ${offset}`;
    }
  }

  try {
    const db = getDb();
    if (!db) return [];
    const { results } = await db.prepare(queryStr).bind(categorySlug).all();
    return (results || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Fetch latest products for homepage gallery
export async function getLatestProducts(limit: number = 5): Promise<Product[]> {
  try {
    const db = getDb();
    if (!db) return [];
    const { results } = await db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT ?')
      .bind(limit).all();
    return (results || []).map(parseProduct);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const db = getDb();
    if (!db) return null;
    const product = await db.prepare('SELECT * FROM products WHERE slug = ?')
      .bind(slug).first();
    return product ? parseProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

