'use server';

import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

export async function upsertPost(formData: FormData) {
  const db = getDb();
  const bucket = getBucket();

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'true' ? 1 : 0;
  const author_name = formData.get('author_name') as string;
  const author_role = formData.get('author_role') as string;
  const author_avatar = formData.get('author_avatar') as string;
  const published_at = formData.get('published_at') as string || null;

  if (!slug && title) {
    slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  let image_url = formData.get('existing_image') as string || null;
  const file = formData.get('image_file') as File;

  if (file && file.size > 0) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      const uniqueId = crypto.randomUUID();
      const key = `articles/${uniqueId}.webp`;

      await bucket.put(key, webpBuffer, {
        httpMetadata: { contentType: 'image/webp' }
      });
      image_url = `/api/images/${key}`;
    } catch (e) {
      console.error('Failed to process image', e);
    }
  }

  try {
    if (id) {
      await db.prepare(`
        UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, image = ?, category = ?, author_name = ?, author_role = ?, author_avatar = ?, is_published = ?, published_at = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        title, slug, excerpt, content, image_url, category, author_name, author_role, author_avatar, is_published, published_at, new Date().toISOString(), id
      ).run();
    } else {
      const newId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO posts (id, title, slug, excerpt, content, image, category, author_name, author_role, author_avatar, is_published, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, title, slug, excerpt, content, image_url, category, author_name, author_role, author_avatar, is_published, published_at
      ).run();
    }
  } catch (error: any) {
    console.error('Error upserting post:', error);
    return { error: error.message };
  }

  revalidatePath('/article');
  revalidatePath(`/article/${slug}`);
  revalidatePath('/admin/blog');

  return { success: true };
}

export async function deletePost(id: string) {
  const db = getDb();

  try {
    await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return { error: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');

  return { success: true };
}

export async function getAvailableProducts() {
  const db = getDb();
  try {
    const { results } = await db.prepare('SELECT slug, name, category FROM products WHERE is_active = 1 ORDER BY name').all();
    return results;
  } catch (error) {
    console.error('Error fetching available products:', error);
    return [];
  }
}

export async function togglePostStatus(id: string, is_published: boolean) {
  const db = getDb();

  try {
    await db.prepare('UPDATE posts SET is_published = ? WHERE id = ?').bind(is_published ? 1 : 0, id).run();
  } catch (error: any) {
    console.error('Error toggling post status:', error);
    return { error: error.message };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');

  return { success: true };
}
