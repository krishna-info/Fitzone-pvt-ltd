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
