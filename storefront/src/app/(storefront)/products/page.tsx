import type { Metadata } from "next";
import { CatalogClient } from "./catalog-client";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description:
    "Jelajahi semua produk kue dan roti dari Dapoer Ajung Cookies & Bakery. Filter berdasarkan kategori, harga, dan rating.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}
