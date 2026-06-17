import { getDb } from './db';
import { Product } from './product-types';

export * from './product-types';

// Fetch all active products from Supabase with pagination
export async function getAllProducts(limit?: number, offset?: number): Promise<Product[]> {
  const db = getDb();
  let queryStr = 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC';
  
  if (limit) {
    queryStr += ` LIMIT ${limit}`;
    if (offset) {
      queryStr += ` OFFSET ${offset}`;
    }
  }

  try {
    const { results } = await db.prepare(queryStr).all<Product>();
    return results;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category slug with pagination
export async function getProductsByCategory(categorySlug: string, limit?: number, offset?: number): Promise<Product[]> {
  const db = getDb();
  let queryStr = 'SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY created_at DESC';
  
  if (limit) {
    queryStr += ` LIMIT ${limit}`;
    if (offset) {
      queryStr += ` OFFSET ${offset}`;
    }
  }

  try {
    const { results } = await db.prepare(queryStr).bind(categorySlug).all<Product>();
    return results;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Fetch latest products for homepage gallery
export async function getLatestProducts(limit: number = 5): Promise<Product[]> {
  const db = getDb();
  try {
    const { results } = await db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT ?')
      .bind(limit).all<Product>();
    return results;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  try {
    const product = await db.prepare('SELECT * FROM products WHERE slug = ?')
      .bind(slug).first<Product>();
    return product || null;
  } catch (error) {
    return null;
  }
}

