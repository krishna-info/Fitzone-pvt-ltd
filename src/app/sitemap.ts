import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fitzoneapparel.in'; // Replace with actual domain
  const db = getDb();

  // Fetch blog posts
  const { results: posts } = await db.prepare('SELECT slug, updated_at FROM posts WHERE is_published = 1').all<any>();

  const blogUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/article/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/article`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...blogUrls];
}
