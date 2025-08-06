import Script from 'next/script';

export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VIT Placement Log 2026",
    "description": "Placement data tracker for Vellore Institute of Technology 2026 batch. Track VIT placements, company stats, salary packages, and placement experiences.",
    "url": "https://placement-log.vercel.app",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VIT Placement Log Team",
      "url": "https://placement-log.vercel.app"
    },
    "about": {
      "@type": "EducationalOrganization",
      "name": "Vellore Institute of Technology",
      "alternateName": ["VIT", "VIT University"],
      "url": "https://vit.ac.in",
      "location": {
        "@type": "Place",
        "name": "Vellore, Tamil Nadu, India"
      }
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "keywords": [
      "vit placement",
      "vit placement 2026",
      "vit placement 26",
      "vellore institute of technology placement",
      "vit placement statistics",
      "vit placement data",
      "vit placement tracker"
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};
