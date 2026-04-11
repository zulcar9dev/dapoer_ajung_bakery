"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/use-cart-store";
import { useUIStore } from "@/stores/use-ui-store";
import { formatRupiah } from "@shared/utils";

export function CartSheet() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems } =
    useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-surface">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Keranjang ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-surface-dim flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Yuk, mulai belanja kue favorit kamu!
            </p>
            <Button
              onClick={() => setCartOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary-dark"
              render={<Link href="/products" />}
            >
              Lihat Produk
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-background rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-surface-dim shrink-0">
                    <Image
                      src={item.productImage || "/images/placeholder.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item.productName}
                    </h4>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatRupiah(item.unitPrice)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                        aria-label="Hapus item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Footer */}
            <SheetFooter className="flex-col gap-3 pt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary-dark h-12 text-base font-semibold"
                onClick={() => setCartOpen(false)}
                render={<Link href="/checkout" />}
              >
                Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCartOpen(false)}
                render={<Link href="/cart" />}
              >
                Lihat Keranjang
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
