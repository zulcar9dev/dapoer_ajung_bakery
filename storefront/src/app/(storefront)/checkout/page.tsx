"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Truck,
  Store,
  CreditCard,
  QrCode,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { useCartStore } from "@/stores/use-cart-store";
import { formatRupiah } from "@shared/utils";
import { DELIVERY_TIME_SLOTS, STORE_INFO } from "@shared/constants";
import type { DeliveryMethod, PaymentMethod } from "@shared/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("TRANSFER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = deliveryMethod === "DELIVERY" ? 15000 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate order submission
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    router.push("/order/DA-20260411-001");
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-xl font-semibold mb-2">
            Keranjang kosong
          </h2>
          <p className="text-muted-foreground mb-4">
            Tambahkan produk ke keranjang terlebih dahulu.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-primary text-primary-foreground"
          >
            Lihat Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Keranjang", href: "/cart" }, { label: "Checkout" }]} />
          <h1 className="font-heading text-3xl font-bold text-foreground mt-4">
            Checkout
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Data Pelanggan */}
              <section className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-primary" />
                  Data Penerima
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input id="name" required placeholder="Nama penerima" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">No. WhatsApp *</Label>
                    <Input id="phone" required placeholder="08xxxxxxxxx" className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@contoh.com" className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Textarea
                      id="address"
                      required
                      placeholder="Jl. nama jalan, RT/RW, kelurahan, kecamatan"
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Metode Pengiriman */}
              <section className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-5">
                  <Truck className="h-5 w-5 text-primary" />
                  Metode Pengiriman
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("DELIVERY")}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      deliveryMethod === "DELIVERY"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Truck className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium">Delivery</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Diantar ke alamat via Grab/Gojek/Maxim
                    </p>
                    <p className="text-sm font-semibold text-primary mt-2">
                      {formatRupiah(15000)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("PICKUP")}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      deliveryMethod === "PICKUP"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Store className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium">Ambil di Toko</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {STORE_INFO.address}
                    </p>
                    <p className="text-sm font-semibold text-success mt-2">Gratis</p>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="deliveryDate">Tanggal *</Label>
                    <Input id="deliveryDate" type="date" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="timeSlot">Jam *</Label>
                    <Select required>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Pilih jam" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* 3. Metode Pembayaran */}
              <section className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-5">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Metode Pembayaran
                </h2>
                <div className="space-y-3">
                  {[
                    { method: "TRANSFER" as PaymentMethod, icon: CreditCard, label: "Transfer Bank", desc: "BRI / BNI" },
                    { method: "QRIS" as PaymentMethod, icon: QrCode, label: "QRIS", desc: "Scan QR dari e-wallet apapun" },
                    { method: "COD" as PaymentMethod, icon: Wallet, label: "Bayar di Tempat (COD)", desc: "Bayar saat barang diterima" },
                  ].map(({ method, icon: Icon, label, desc }) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                        paymentMethod === method
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      {paymentMethod === method && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Notes */}
              <section className="bg-surface p-6 rounded-xl border border-border">
                <Label htmlFor="notes">Catatan Pesanan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan khusus untuk pesanan Anda (opsional)"
                  className="mt-1.5"
                  rows={3}
                />
              </section>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-surface p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-heading text-lg font-bold">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-surface-dim shrink-0">
                        <Image
                          src={item.productImage || "/images/placeholder.jpg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x {formatRupiah(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({getTotalItems()} item)
                    </span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkos kirim</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-success font-medium">Gratis</span>
                      ) : (
                        formatRupiah(deliveryFee)
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatRupiah(total)}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary-dark text-base font-semibold"
                >
                  {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                </Button>

                <p className="text-[10px] text-muted-foreground text-center">
                  Dengan menekan &quot;Buat Pesanan&quot;, Anda menyetujui syarat dan ketentuan
                  kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
