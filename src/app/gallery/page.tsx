import { Metadata } from 'next';
import GalleryClient from '@/components/pages/GalleryClient';
import { getDb, GalleryImage } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Image Gallery | FitZone Apparels',
  description: 'A visual journey through our state-of-the-art manufacturing facility and high-performance product range.',
};

export const revalidate = 60; // Revalidate every minute

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let images: GalleryImage[] = [];

  try {
    const db = getDb();
    if (db) {
      const { results } = (await db
        .prepare('SELECT * FROM gallery_images ORDER BY created_at DESC')
        .all()) as { results: GalleryImage[] };
      images = results || [];
    }
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
  }

  return <GalleryClient images={images} />;
}

