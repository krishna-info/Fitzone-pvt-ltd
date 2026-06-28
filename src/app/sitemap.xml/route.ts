export async function GET() {
  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.fitzoneapparels.com/sitemaps/static/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.fitzoneapparels.com/sitemaps/dynamic/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;

  return new Response(sitemapIndexXML, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
