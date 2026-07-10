'use server';

import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';
import sharp from 'sharp';

async function processImages(formData: FormData): Promise<string[]> {
  const bucket = getBucket();
  const imageFiles = formData.getAll('images') as File[];
  const existingImagesRaw = formData.get('existing_images') as string;
  const finalImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      const imageKey = `products/${crypto.randomUUID()}.webp`;
      await bucket.put(imageKey, webpBuffer, {
        httpMetadata: { contentType: 'image/webp' }
      });
      finalImages.push(`/api/images/${imageKey}`);
    }
  }
  return finalImages;
}

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
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  const images = await processImages(formData);

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
    // In a real app we might also delete the images from R2 here.
    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function createProduct(formData: FormData) {
  const db = getDb();
  const id = crypto.randomUUID();
  
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const category_slug = formData.get('category_slug') as string;
  const price_inr = parseInt(formData.get('price_inr') as string);
  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  const images = await processImages(formData);

  try {
    await db.prepare(`
      INSERT INTO products (id, name, slug, category, category_slug, price_inr, moq, images, description, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, is_active
    ).run();
  } catch (error: any) {
    throw new Error(error.message);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
