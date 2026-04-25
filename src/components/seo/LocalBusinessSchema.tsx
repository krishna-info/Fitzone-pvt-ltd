'use client';

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FitZone Apparels Pvt. Ltd.",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070",
    "@id": "https://fitzone.in",
    "url": "https://fitzone.in",
    "telephone": "+91 77422 31208",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "P NO. 35B, SECTOR A, JODHPUR K.U.M. BHAGAT KI KOTHI, Rameshwar Nagar",
      "addressLocality": "Jodhpur",
      "addressRegion": "Rajasthan",
      "postalCode": "342005",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.2389,
      "longitude": 73.0243
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
