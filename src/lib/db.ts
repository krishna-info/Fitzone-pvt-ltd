import { getCloudflareContext } from '@opennextjs/cloudflare';
import { unstable_noStore } from 'next/cache';

export const getDb = () => {
  unstable_noStore();
  return getCloudflareContext().env.DB;
};

export const getBucket = () => {
  unstable_noStore();
  return getCloudflareContext().env.BUCKET;
};

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}
