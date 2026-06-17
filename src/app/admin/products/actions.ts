'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';

export async function updateProduct(formData: FormData) {
  const db = getDb();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const category_slug = formData.get('category_slug') as string;
  const price_inr = parseInt(formData.get('price_inr') as string);
  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const images_list = formData.get('images_list') as string;
  const images = images_list ? images_list.split(',').map(s => s.trim()).filter(Boolean) : [];
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  try {
    await db.prepare(`
      UPDATE products SET name = ?, slug = ?, category = ?, category_slug = ?, price_inr = ?, moq = ?, images = ?, description = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, is_active, new Date().toISOString(), id
    ).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath(`/products/${category_slug}`);
  revalidatePath(`/products/${category_slug}/${slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const db = getDb();
  
  try {
    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

import { Product } from '@/lib/product-types';

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
  const db = getDb();
  
  try {
    await db.prepare(`
      INSERT INTO products (name, slug, category, category_slug, price_inr, moq, images, description, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productData.name, productData.slug, productData.category, productData.category_slug, productData.price_inr, productData.moq, JSON.stringify(productData.images), productData.description, productData.is_active ? 1 : 0
    ).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
