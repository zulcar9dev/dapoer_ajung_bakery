"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/storefront/hero-carousel";
import { ProductCard } from "@/components/storefront/product-card";
import { CategoryCard } from "@/components/storefront/category-card";
import { TestimonialSection } from "@/components/storefront/testimonial-section";
import { LocalBusinessJsonLd } from "@/components/storefront/json-ld";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { MOCK_PRODUCTS, MOCK_BANNERS, MOCK_TESTIMONIALS } from "@shared/mock-data";
import { CATEGORIES, STORE_INFO } from "@shared/constants";

const bestSellers = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

export default function HomePage() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <LocalBusinessJsonLd />
      {/* ── Hero Carousel ── */}
      <section>
        <HeroCarousel banners={MOCK_BANNERS} />
      </section>

      {/* ── Kategori Produk ── */}
      <section className="py-16 bg-background reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Kategori Produk
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Jelajahi berbagai pilihan kue dan roti khas Gorontalo
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Seller ── */}
      <section className="py-16 bg-surface reveal">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Paling Favorit
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-1">
                Best Seller
              </h2>
            </div>
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              render={<Link href="/products" />}
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="sm:hidden mt-8 text-center">
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/products" />}
            >
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Tentang Kami Teaser ── */}
      <section className="py-16 bg-background-alt reveal">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-dim">
              <Image
                src="/images/about-bakery.jpg"
                alt="Dapoer Ajung bakery"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Badge overlay */}
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                <p className="text-2xl font-heading font-bold">Sejak 1990</p>
                <p className="text-xs opacity-90">Gorontalo Heritage</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Cerita Kami
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {STORE_INFO.storeName}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Berawal dari resep keluarga yang diwariskan secara turun-temurun,
                Dapoer Ajung telah menemani masyarakat Gorontalo selama lebih
                dari 30 tahun. Setiap kue dibuat dengan bahan pilihan terbaik
                dan sentuhan cinta yang tak pernah berubah.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Dari Bingka Kentang yang legendaris hingga Hampers cantik untuk
                momen spesial — kami hadir untuk membawa kebahagiaan di setiap
                gigitan.
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">36+</p>
                  <p className="text-xs text-muted-foreground">Tahun Pengalaman</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <p className="text-2xl font-heading font-bold text-primary">15+</p>
                  <p className="text-xs text-muted-foreground">Varian Produk</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-secondary text-secondary" />
                  <p className="text-2xl font-heading font-bold text-primary">4.9</p>
                  <p className="text-xs text-muted-foreground mt-1">Rating</p>
                </div>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary-dark"
                render={<Link href="/about" />}
              >
                Selengkapnya
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <TestimonialSection testimonials={MOCK_TESTIMONIALS} />
    </div>
  );
}
