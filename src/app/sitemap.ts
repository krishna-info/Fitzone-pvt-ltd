import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fitzone.in';

  const staticRoutes = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/manufacturing`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/certifications`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/gallery`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/products`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  return staticRoutes;
}
