import { STORE_INFO } from "@shared/constants";

// ─── LocalBusiness JSON-LD ───
export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Dapoer Ajung Cookies & Bakery",
    description:
      "Kue tradisional khas Gorontalo sejak 1990. Bingka Kentang, Nastar, Kastengel, Lapis Legit, Hampers, dan Bekal Sekolah.",
    url: "https://dapoerajung.co.id",
    telephone: STORE_INFO.whatsappNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE_INFO.address,
      addressLocality: "Gorontalo",
      addressRegion: "Gorontalo",
      postalCode: "96100",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 0.5435,
      longitude: 123.0568,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    priceRange: "Rp 12.000 - Rp 450.000",
    servesCuisine: "Indonesian Bakery",
    image: "/images/logo.jpg",
    sameAs: [STORE_INFO.instagramUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Product JSON-LD ───
export function ProductJsonLd({
  name,
  description,
  image,
  price,
  slug,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  rating: number;
  reviewCount: number;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `https://dapoerajung.co.id/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Dapoer Ajung Cookies & Bakery",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Dapoer Ajung Cookies & Bakery",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── BreadcrumbList JSON-LD ───
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
