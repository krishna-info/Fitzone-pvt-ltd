'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function upsertPost(postData: any) {
  const db = getDb();

  const formattedData = {
    ...postData,
    is_published: postData.is_published === 'true' || postData.is_published === true ? 1 : 0
  };

  let data;
  try {
    if (formattedData.id) {
      await db.prepare(`
        UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, image = ?, category = ?, author_name = ?, author_image = ?, is_published = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        formattedData.title, formattedData.slug, formattedData.excerpt, formattedData.content, formattedData.image, formattedData.category, formattedData.author_name, formattedData.author_image, formattedData.is_published, new Date().toISOString(), formattedData.id
      ).run();
      data = formattedData;
    } else {
      const id = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO posts (id, title, slug, excerpt, content, image, category, author_name, author_image, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, formattedData.title, formattedData.slug, formattedData.excerpt, formattedData.content, formattedData.image, formattedData.category, formattedData.author_name, formattedData.author_image, formattedData.is_published
      ).run();
      data = { ...formattedData, id };
    }
  } catch (error: any) {
    console.error('Error upserting post:', error);
    return { error: error.message };
  }

  revalidatePath('/article');
  revalidatePath(`/article/${data.slug}`);
  revalidatePath('/admin/blog');

  return { data };
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
    const { results } = await db.prepare('SELECT slug, name, category FROM products WHERE is_active = 1 ORDER BY name').all<any>();
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
