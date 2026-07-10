'use client';

export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FitZone Apparels",
    "url": "https://fitzoneapparels.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fitzoneapparels.com/search?q={search_term_string}",
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
