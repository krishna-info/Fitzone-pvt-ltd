import { getCloudflareContext } from '@opennextjs/cloudflare';

export const getDb = () => {
  return getCloudflareContext().env.DB;
};

export const getBucket = () => {
  return getCloudflareContext().env.BUCKET;
};
