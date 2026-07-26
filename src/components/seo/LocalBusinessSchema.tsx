'use client';

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FitZone Apparels Pvt. Ltd.",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070",
    "@id": "https://fitzoneapparels.com",
    "url": "https://fitzoneapparels.com",
    "telephone": "+91 77422 31208",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Building No. 0, C/O RAVINDER, MOUJA ANAGPUR DAIRY, SARKARI SCHOOL",
      "addressLocality": "Faridabad",
      "addressRegion": "Haryana",
      "postalCode": "121002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.4089,
      "longitude": 77.3178
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://facebook.com/fitzoneindia",
      "https://instagram.com/fitzoneindia"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
