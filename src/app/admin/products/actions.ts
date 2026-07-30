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

  const bucket = getBucket();
  if (bucket) {
    for (const file of imageFiles) {
      if (file && file.size > 0 && typeof file !== 'string') {
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageKey = `products/${crypto.randomUUID()}.webp`;
        try {
          await bucket.put(imageKey, buffer, {
            httpMetadata: { contentType: 'image/webp' }
          });
          const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
          finalImages.push(`${r2BaseUrl.replace(/\/$/, '')}/${imageKey}`);
        } catch (error) {
          console.error('Failed to upload image file to R2 bucket:', error);
          throw new Error('Image upload failed. Product changes were not saved.');
        }
      }
    }
  }

  return finalImages;
}

async function generateUniqueSlug(db: any, rawSlug: string, name: string, currentId?: string): Promise<string> {
  let base = (rawSlug || '').trim().toLowerCase();
  if (!base && name) {
    base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (!base) {
    base = 'product';
  }
  let candidate = base;
  let counter = 1;

  while (db) {
    try {
      let query = 'SELECT id FROM products WHERE slug = ?';
      const params: any[] = [candidate];
      if (currentId) {
        query += ' AND id != ?';
        params.push(currentId);
      }
      const { results } = await db.prepare(query).bind(...params).all();
      if (!results || results.length === 0) {
        return candidate;
      }
      candidate = `${base}-${counter++}`;
    } catch {
      break;
    }
  }

  return candidate;
}

export async function updateProduct(formData: FormData) {
  const db = getDb();
  if (!db) {
    throw new Error('Database connection unavailable.');
  }

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  const category_slug = formData.get('category_slug') as string;

  const rawPrice = formData.get('price_inr') as string;
  const price_inr = parseFloat(rawPrice);
  if (isNaN(price_inr) || price_inr < 0) {
    throw new Error('Please submit a valid non-negative numeric price.');
  }

  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  const slug = await generateUniqueSlug(db, rawSlug, name, id);

  const colorsRaw = formData.get('colors') as string;
  const sizesRaw = formData.get('sizes') as string;

  // Retrieve existing specifications to preserve custom entries
  let existingSpecs: Record<string, string> = {};
  if (db) {
    try {
      const { results } = await db.prepare('SELECT specifications FROM products WHERE id = ?').bind(id).all();
      if (results && results[0]?.specifications) {
        existingSpecs = JSON.parse(results[0].specifications as string);
      }
    } catch {
      existingSpecs = {};
    }
  }

  const colorsArray = colorsRaw ? JSON.parse(colorsRaw) : ['Black', 'Navy', 'Heather Gray', 'White'];
  const sizesArray = sizesRaw ? JSON.parse(sizesRaw) : ['S', 'M', 'L', 'XL', 'XXL'];

  const specifications: Record<string, string> = {
    ...existingSpecs,
    _colors: JSON.stringify(colorsArray),
    _sizes: JSON.stringify(sizesArray)
  };

  const images = await processImages(formData);

  try {
    await db.prepare(`
      UPDATE products SET name = ?, slug = ?, category = ?, category_slug = ?, price_inr = ?, moq = ?, images = ?, description = ?, specifications = ?, colors = ?, sizes = ?, is_active = ?
      WHERE id = ?
    `).bind(
      name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, JSON.stringify(specifications), JSON.stringify(colorsArray), JSON.stringify(sizesArray), is_active, id
    ).run();
  } catch (error: any) {
    console.error('Failed to update product:', error);
    if (error.message?.includes('UNIQUE constraint failed') || error.message?.includes('sqlite_stat')) {
      throw new Error('A product with this slug or identifier already exists. Please choose a unique name/slug.');
    }
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
  if (!db) {
    throw new Error('Database connection unavailable.');
  }

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
  if (!db) {
    throw new Error('Database connection unavailable.');
  }
  const id = crypto.randomUUID();

  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  const category_slug = formData.get('category_slug') as string;

  const rawPrice = formData.get('price_inr') as string;
  const price_inr = parseFloat(rawPrice);
  if (isNaN(price_inr) || price_inr < 0) {
    throw new Error('Please submit a valid non-negative numeric price.');
  }

  const moq = parseInt(formData.get('moq') as string) || 1;
  const description = formData.get('description') as string;
  const is_active = formData.get('is_active') === 'true' ? 1 : 0;
  const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';

  const slug = await generateUniqueSlug(db, rawSlug, name);

  const colorsRaw = formData.get('colors') as string;
  const sizesRaw = formData.get('sizes') as string;

  const colorsArray = colorsRaw ? JSON.parse(colorsRaw) : ['Black', 'Navy', 'Heather Gray', 'White'];
  const sizesArray = sizesRaw ? JSON.parse(sizesRaw) : ['S', 'M', 'L', 'XL', 'XXL'];

  const specifications: Record<string, string> = {
    _colors: JSON.stringify(colorsArray),
    _sizes: JSON.stringify(sizesArray)
  };

  const images = await processImages(formData);

  try {
    await db.prepare(`
      INSERT INTO products (id, name, slug, category, category_slug, price_inr, moq, images, description, specifications, colors, sizes, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, name, slug, category, category_slug, price_inr, moq, JSON.stringify(images), description, JSON.stringify(specifications), JSON.stringify(colorsArray), JSON.stringify(sizesArray), is_active
    ).run();
  } catch (error: any) {
    console.error('Failed to create product:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('A product with this slug or identifier already exists. Please choose a unique name/slug.');
    }
    throw new Error(error.message || 'Failed to create product');
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
