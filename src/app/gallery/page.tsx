import { Metadata } from 'next';
import GalleryClient from '@/components/pages/GalleryClient';

export const metadata: Metadata = {
  title: 'Image Gallery | FitZone Apparels',
  description: 'A visual journey through our state-of-the-art manufacturing facility and high-performance product range.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
