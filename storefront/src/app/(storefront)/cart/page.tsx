"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { useCartStore } from "@/stores/use-cart-store";
import { formatRupiah } from "@shared/utils";
import { FREE_DELIVERY_THRESHOLD, MIN_ORDER_AMOUNT } from "@shared/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getTotalItems, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const meetsMinOrder = subtotal >= MIN_ORDER_AMOUNT;

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Keranjang" }]} />
          <h1 className="font-heading text-3xl font-bold text-foreground mt-4">
            Keranjang Belanja
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-surface-dim flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <h2 className="font-heading text-xl font-semibold mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Belum ada produk di keranjang. Yuk, mulai belanja kue favorit kamu!
            </p>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary-dark"
              render={<Link href="/products" />}
            >
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {totalItems} item di keranjang
                </p>
                <button
                  onClick={clearCart}
                  className="text-sm text-destructive hover:underline"
                >
                  Hapus Semua
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-surface rounded-xl border border-border"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface-dim shrink-0">
                    <Image
                      src={item.productImage || "/images/placeholder.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.productName}
                        </h3>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">
                            Varian: {item.variantName}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8"
                        onClick={() => removeItem(item.id)}
                        aria-label="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-end justify-between mt-3">
                      <div className="flex items-center gap-1 border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-base font-semibold text-primary">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="mt-4"
                render={<Link href="/products" />}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Lanjut Belanja
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-surface p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-heading text-lg font-bold">
                  Ringkasan Pesanan
                </h2>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({totalItems} item)
                    </span>
                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-sm">
                      {isFreeDelivery ? (
                        <span className="text-success font-medium">Gratis</span>
                      ) : (
                        "Dihitung saat checkout"
                      )}
                    </span>
                  </div>
                </div>

                {/* Free delivery progress */}
                {!isFreeDelivery && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs text-muted-foreground mb-2">
                      Tambah{" "}
                      <span className="font-semibold text-primary">
                        {formatRupiah(FREE_DELIVERY_THRESHOLD - subtotal)}
                      </span>{" "}
                      lagi untuk gratis ongkir!
                    </p>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / FREE_DELIVERY_THRESHOLD) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Voucher */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Kode Voucher
                  </label>
                  <div className="flex gap-2">
                    <Input placeholder="Masukkan kode" className="flex-1" />
                    <Button variant="outline">Pakai</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <Button
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary-dark text-base font-semibold"
                  disabled={!meetsMinOrder}
                  render={meetsMinOrder ? <Link href="/checkout" /> : undefined}
                >
                  Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                {!meetsMinOrder && (
                  <p className="text-xs text-destructive text-center">
                    Minimum pembelian {formatRupiah(MIN_ORDER_AMOUNT)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
