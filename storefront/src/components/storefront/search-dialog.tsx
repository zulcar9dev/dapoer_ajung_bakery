"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/use-ui-store";
import { MOCK_PRODUCTS } from "@shared/mock-data";
import { formatRupiah } from "@shared/utils";
import { useState } from "react";

export function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");

  const filtered = query.length > 1
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (slug: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-surface">
        <DialogTitle className="sr-only">Cari Produk</DialogTitle>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Cari kue, roti, hampers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 h-14 text-base placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length > 1 && filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Tidak ditemukan produk untuk &ldquo;{query}&rdquo;
            </div>
          )}
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-dim transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-md bg-surface-dim shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0] || "/images/placeholder.jpg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category?.name}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary shrink-0">
                {formatRupiah(product.discountPrice ?? product.basePrice)}
              </span>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-border bg-surface-dim">
          <p className="text-xs text-muted-foreground">
            Ketik minimal 2 karakter untuk mencari...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
