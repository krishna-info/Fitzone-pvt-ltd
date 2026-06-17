import { getRequestContext } from '@cloudflare/next-on-pages';

export const getDb = () => {
  return getRequestContext().env.DB;
};

export const getBucket = () => {
  return getRequestContext().env.BUCKET;
};
