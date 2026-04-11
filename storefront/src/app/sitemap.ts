import type { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@shared/mock-data";

const BASE_URL = "https://dapoerajung.co.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  // Product pages
  const productPages: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
