'use server';

import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function uploadGalleryImage(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const file = formData.get('image') as File | null;
    const manualUrl = formData.get('manual_url') as string;

    if (!title || !category || ((!file || file.size === 0) && !manualUrl)) {
      return { error: 'Title, category, and either an image file or URL are required' };
    }

    let imageUrl = manualUrl;
    let uniqueId = crypto.randomUUID();

    if (file && file.size > 0) {
      const bucket = getBucket();
      const buffer = Buffer.from(await file.arrayBuffer());
      // The file is already converted to WebP on the client side

      const key = `gallery/${uniqueId}.webp`;

      await bucket.put(key, buffer, {
        httpMetadata: { contentType: 'image/webp' }
      });

      const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-c2f493365c1443249039e863c4f1a5e3.r2.dev';
      imageUrl = `${r2BaseUrl.replace(/\/$/, '')}/${key}`;
    }

    const db = getDb();
    await db.prepare(`
      INSERT INTO gallery_images (id, title, category, image_url)
      VALUES (?, ?, ?, ?)
    `).bind(uniqueId, title, category, imageUrl).run();

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true };
  } catch (error) {
    console.error('Failed to upload gallery image:', error);
    return { error: 'Failed to upload image' };
  }
}

export async function deleteGalleryImage(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const imageUrl = formData.get('image_url') as string;

    if (!id) return { error: 'ID is required' };

    const db = getDb();
    const bucket = getBucket();

    await db.prepare('DELETE FROM gallery_images WHERE id = ?').bind(id).run();

    // Try to delete from R2 if it's an R2 URL (handle both old and new formats)
    if (imageUrl) {
      const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
      const cleanBase = r2BaseUrl.replace(/\/$/, '');
      let key = null;
      if (imageUrl.startsWith('/api/images/')) {
        key = imageUrl.replace('/api/images/', '');
      } else if (imageUrl.startsWith(`${cleanBase}/`)) {
        key = imageUrl.replace(`${cleanBase}/`, '');
      }

      if (key) {
        try {
          await bucket.delete(key);
        } catch (e) {
          console.error('Failed to delete from R2:', e);
        }
      }
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return { error: 'Failed to delete image' };
  }
}
