"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category } from "@shared/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border bg-surface-dim mb-3 group-hover:border-primary group-hover:shadow-md transition-all duration-300">
        <Image
          src={category.image || "/images/placeholder.jpg"}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="96px"
        />
      </div>
      <h3 className="font-heading text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      <p className="text-xs text-muted-foreground">
        {category.productCount} produk
      </p>
    </Link>
  );
}
