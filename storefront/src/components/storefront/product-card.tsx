"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@shared/utils";
import { useCartStore } from "@/stores/use-cart-store";
import type { Product } from "@shared/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const displayPrice = product.discountPrice ?? product.basePrice;
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice!) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, defaultVariant);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <Card className="overflow-hidden border-border/50 bg-surface hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface-dim">
          <Image
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-medium bg-secondary/90 text-secondary-foreground backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
            {hasDiscount && (
              <Badge className="text-[10px] font-bold bg-destructive text-destructive-foreground">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Pre-order indicator */}
          {product.isPreOrderOnly && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="outline"
                className="text-[10px] bg-surface/90 backdrop-blur-sm border-primary text-primary font-medium"
              >
                Pre-Order {product.preOrderLeadDays}+ hari
              </Badge>
            </div>
          )}

          {/* Quick Add Button */}
          {product.isAvailable && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                onClick={handleAddToCart}
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary-dark"
                aria-label={`Tambah ${product.name} ke keranjang`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Category */}
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="font-heading text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-medium text-foreground">
              {product.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price — pushed to bottom */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="font-body text-lg font-bold text-primary">
              {formatRupiah(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.basePrice)}
              </span>
            )}
          </div>

          {/* Out of stock */}
          {!product.isAvailable && (
            <p className="text-xs text-destructive font-medium mt-2">
              Stok habis
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
