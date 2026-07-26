'use server';

import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';

async function processImages(formData: FormData): Promise<string[]> {
  const imageFiles = formData.getAll('images') as File[];
  const existingImagesRaw = formData.get('existing_images') as string;
  let finalImages: string[] = [];

  try {
    finalImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
  } catch {
    finalImages = [];
  }

  try {
    const bucket = getBucket();
    if (bucket) {
      for (const file of imageFiles) {
        if (file && file.size > 0 && typeof file !== 'string') {
          const buffer = Buffer.from(await file.arrayBuffer());
          const imageKey = `products/${crypto.randomUUID()}.webp`;
          await bucket.put(imageKey, buffer, {
            httpMetadata: { contentType: 'image/webp' }
          });
          const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
          finalImages.push(`${r2BaseUrl.replace(/\/$/, '')}/${imageKey}`);
        }
      }
    }
  } catch (error) {
    console.error('Error processing product image files:', error);
  }

  return finalImages;
}

export async function updateProduct(formData: FormData) {
  const db = getDb();

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  let slug = (formData.get('slug') as string)?.trim();
  const category_slug = formData.get('category_slug') as string;
  const price_inr = parseInt(formData.get('price_inr') as string) || 0;
  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const colorsRaw = formData.get('colors') as string;
  const sizesRaw = formData.get('sizes') as string;

  const specifications: Record<string, string> = {
    _colors: colorsRaw || JSON.stringify(['Black', 'Navy', 'Heather Gray', 'White']),
    _sizes: sizesRaw || JSON.stringify(['S', 'M', 'L', 'XL', 'XXL'])
  };

  const images = await processImages(formData);

  try {
    await db.prepare(`
      UPDATE products SET name = ?, slug = ?, category = ?, category_slug = ?, price_inr = ?, moq = ?, images = ?, description = ?, specifications = ?, is_active = ?
      WHERE id = ?
    `).bind(
      name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, JSON.stringify(specifications), is_active, id
    ).run();
  } catch (error: any) {
    console.error('Failed to update product:', error);
    throw new Error(error.message || 'Failed to update product');
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
    console.error('Failed to delete product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function createProduct(formData: FormData) {
  const db = getDb();
  const id = crypto.randomUUID();

  const name = formData.get('name') as string;
  let slug = (formData.get('slug') as string)?.trim();
  const category_slug = formData.get('category_slug') as string;
  const price_inr = parseInt(formData.get('price_inr') as string) || 0;
  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const colorsRaw = formData.get('colors') as string;
  const sizesRaw = formData.get('sizes') as string;

  const specifications: Record<string, string> = {
    _colors: colorsRaw || JSON.stringify(['Black', 'Navy', 'Heather Gray', 'White']),
    _sizes: sizesRaw || JSON.stringify(['S', 'M', 'L', 'XL', 'XXL'])
  };

  const images = await processImages(formData);

  try {
    await db.prepare(`
      INSERT INTO products (id, name, slug, category, category_slug, price_inr, moq, images, description, specifications, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, JSON.stringify(specifications), is_active
    ).run();
  } catch (error: any) {
    console.error('Failed to create product:', error);
    throw new Error(error.message || 'Failed to create product');
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
