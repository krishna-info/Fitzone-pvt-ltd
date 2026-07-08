import { Metadata } from 'next';
import GalleryClient from '@/components/pages/GalleryClient';
import { getDb, GalleryImage } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Image Gallery | FitZone Apparels',
  description: 'A visual journey through our state-of-the-art manufacturing facility and high-performance product range.',
};

export const revalidate = 60; // Revalidate every minute

export default async function GalleryPage() {
  const db = getDb();
  
  const { results } = await db
    .prepare('SELECT * FROM gallery_images ORDER BY created_at DESC')
    .all();
  const images = results as unknown as GalleryImage[];
    
  return <GalleryClient images={images} />;
}
