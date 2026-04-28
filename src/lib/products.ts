import { createSupabaseAdminClient } from './supabase-admin';
import { Product } from './product-types';

export * from './product-types';

// Fetch all active products from Supabase with pagination
export async function getAllProducts(limit?: number, offset?: number): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
  return data ?? [];
}

// Fetch products by category slug with pagination
export async function getProductsByCategory(categorySlug: string, limit?: number, offset?: number): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products by category:', error.message);
    return [];
  }
  return data ?? [];
}

// Fetch latest products for homepage gallery
export async function getLatestProducts(limit: number = 5): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest products:', error.message);
    return [];
  }
  return data ?? [];
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

