import { getCloudflareContext } from '@opennextjs/cloudflare';
import { unstable_noStore } from 'next/cache';

export const getDb = () => {
  try {
    unstable_noStore();
    const ctx = getCloudflareContext();
    return ctx?.env?.DB || null;
  } catch (err) {
    console.error('Error accessing Cloudflare D1 DB binding:', err);
    return null;
  }
};

export const getBucket = () => {
  try {
    unstable_noStore();
    const ctx = getCloudflareContext();
    return ctx?.env?.BUCKET || null;
  } catch (err) {
    console.warn('R2 Bucket binding unavailable:', err);
    return null;
  }
};

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}
