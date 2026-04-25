'use client';

export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FitZone Apparels",
    "url": "https://fitzoneapparel.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fitzoneapparel.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
