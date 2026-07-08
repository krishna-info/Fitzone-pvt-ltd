'use server';

import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

export async function uploadGalleryImage(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const file = formData.get('image') as File;

    if (!title || !category || !file || file.size === 0) {
      return { error: 'Title, category, and image are required' };
    }

    const bucket = getBucket();
    const db = getDb();
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    
    const uniqueId = crypto.randomUUID();
    const key = `gallery/${uniqueId}.webp`;

    await bucket.put(key, webpBuffer, {
      httpMetadata: { contentType: 'image/webp' }
    });

    const imageUrl = `/api/images/${key}`;

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

    // Try to delete from R2 if it's an R2 URL
    if (imageUrl && imageUrl.startsWith('/api/images/')) {
      const key = imageUrl.replace('/api/images/', '');
      try {
        await bucket.delete(key);
      } catch (e) {
        console.error('Failed to delete from R2:', e);
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
