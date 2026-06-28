import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fitzoneapparels.com';
  let posts: any[] = [];
  
  try {
    const db = getDb();
    if (db) {
      const { results } = await db.prepare('SELECT slug, updated_at FROM posts WHERE is_published = 1').all();
      posts = results || [];
    }
  } catch (error) {
    console.error("Database connection or query failed in sitemap:", error);
  }

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return blogUrls;
}
