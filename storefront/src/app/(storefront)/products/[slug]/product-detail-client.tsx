"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { ProductCard } from "@/components/storefront/product-card";
import { useCartStore } from "@/stores/use-cart-store";
import { useUIStore } from "@/stores/use-ui-store";
import { formatRupiah } from "@shared/utils";
import { MOCK_REVIEWS } from "@shared/mock-data";
import type { Product, ProductVariant } from "@shared/types";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { setCartOpen } = useUIStore();

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.discountPrice ?? product.basePrice;

  const originalPrice = selectedVariant
    ? undefined
    : product.discountPrice
      ? product.basePrice
      : undefined;

  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.totalStock;

  const productReviews = MOCK_REVIEWS.filter(
    (r) => r.productId === product.id
  );

  const handleAddToCart = () => {
    addItem(product, selectedVariant ?? undefined, quantity);
    setCartOpen(true);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: "Produk", href: "/products" },
              { label: product.category.name, href: `/products?category=${product.categoryId}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-dim group">
              <Image
                src={product.images[selectedImage] || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i === 0 ? product.images.length - 1 : i - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-surface/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-surface transition opacity-0 group-hover:opacity-100"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((i) =>
                        i === product.images.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-surface transition opacity-0 group-hover:opacity-100"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              {/* Tags */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-primary text-primary-foreground text-[10px]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/products?category=${product.categoryId}`}
                className="text-sm text-primary font-medium hover:underline"
              >
                {product.category.name}
              </Link>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-1">
                {product.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? "fill-secondary text-secondary"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {product.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} ulasan)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatRupiah(currentPrice)}
              </span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatRupiah(originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            <Separator />

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Pilih Varian
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                          : v.stock === 0
                            ? "border-border bg-muted text-muted-foreground/50 cursor-not-allowed"
                            : "border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {v.name}
                      <span className="block text-xs mt-0.5 opacity-70">
                        {formatRupiah(v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Jumlah
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() =>
                      setQuantity((q) => Math.min(currentStock, q + 1))
                    }
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Stok: {currentStock}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary-dark text-base font-semibold"
                onClick={handleAddToCart}
                disabled={!product.isAvailable || currentStock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tambah ke Keranjang
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Info badges */}
            <div className="grid grid-cols-2 gap-3">
              {product.shelfLife && (
                <div className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-border">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Daya Tahan</p>
                    <p className="text-sm font-medium">{product.shelfLife}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-border">
                <Package className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Berat</p>
                  <p className="text-sm font-medium">{product.weight}g</p>
                </div>
              </div>
              {product.isPreOrderOnly && (
                <div className="flex items-center gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20 col-span-2">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <p className="text-sm text-warning font-medium">
                    Pre-Order — Siap dalam {product.preOrderLeadDays} hari kerja
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description & Reviews ── */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 gap-6">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none pb-3 px-0 font-medium"
              >
                Deskripsi
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none pb-3 px-0 font-medium"
              >
                Ulasan ({productReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                {product.ingredients && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-primary" /> Bahan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.ingredients}
                    </p>
                  </div>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-warning" /> Alergen
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.allergens.map((a) => (
                        <Badge key={a} variant="outline">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              {productReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Belum ada ulasan untuk produk ini.
                </p>
              ) : (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg bg-surface border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {review.customerName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {review.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? "fill-secondary text-secondary"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {new Date(review.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
