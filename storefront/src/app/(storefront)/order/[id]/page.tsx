"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Truck,
  MapPin,
  XCircle,
  Phone,
  Copy,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { MOCK_ORDERS } from "@shared/mock-data";
import { formatRupiah } from "@shared/utils";
import { STORE_INFO } from "@shared/constants";

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: ChefHat,
  READY: Package,
  SHIPPING: Truck,
  DELIVERED: MapPin,
  COMPLETED: CheckCheck,
  CANCELLED: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-warning",
  CONFIRMED: "text-info",
  PROCESSING: "text-info",
  READY: "text-success",
  SHIPPING: "text-info",
  DELIVERED: "text-success",
  COMPLETED: "text-success",
  CANCELLED: "text-destructive",
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [copied, setCopied] = useState(false);

  // Find order by ID or order number
  const order = MOCK_ORDERS.find(
    (o) => o.id === orderId || o.orderNumber === orderId
  );

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-dim flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="font-heading text-xl font-semibold mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Pastikan nomor pesanan yang Anda masukkan sudah benar.
          </p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = order.statusHistory.length - 1;

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Lacak Pesanan" }]} />
          <h1 className="font-heading text-3xl font-bold text-foreground mt-4">
            Lacak Pesanan
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Order Header */}
        <div className="bg-surface p-6 rounded-xl border border-border mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Nomor Pesanan</p>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="font-heading text-xl font-bold">
                  {order.orderNumber}
                </h2>
                <button
                  onClick={copyOrderNumber}
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Copy"
                >
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Badge
              className={`${
                order.status === "COMPLETED" || order.status === "DELIVERED"
                  ? "bg-success/10 text-success border-success/20"
                  : order.status === "CANCELLED"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-primary/10 text-primary border-primary/20"
              }`}
              variant="outline"
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Dipesan pada{" "}
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="bg-surface p-6 rounded-xl border border-border mb-6">
          <h3 className="font-heading text-base font-bold mb-6">
            Status Pesanan
          </h3>
          <div className="space-y-0">
            {order.statusHistory.map((entry, i) => {
              const Icon = STATUS_ICONS[entry.status] || Clock;
              const isLast = i === currentStatusIndex;
              const color = STATUS_COLORS[entry.status] || "text-muted-foreground";

              return (
                <div key={i} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isLast
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-dim"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isLast ? "" : color}`} />
                    </div>
                    {i < order.statusHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-border" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-8">
                    <p className={`font-medium ${isLast ? "text-foreground" : "text-muted-foreground"}`}>
                      {entry.status.replace("_", " ")}
                    </p>
                    {entry.note && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.note}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {new Date(entry.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface p-6 rounded-xl border border-border mb-6">
          <h3 className="font-heading text-base font-bold mb-4">
            Detail Pesanan
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{item.productName}</span>
                  {item.variantName && (
                    <span className="text-muted-foreground"> — {item.variantName}</span>
                  )}
                  <span className="text-muted-foreground"> x{item.quantity}</span>
                </div>
                <span className="font-medium">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span>{formatRupiah(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Diskon</span>
                <span>-{formatRupiah(order.discount)}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary text-lg">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-surface p-6 rounded-xl border border-border text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Butuh bantuan? Hubungi kami via WhatsApp
          </p>
          <Button
            variant="outline"
            onClick={() =>
              window.open(
                `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  `Halo Dapoer Ajung, saya ingin menanyakan pesanan ${order.orderNumber}`
                )}`,
                "_blank"
              )
            }
          >
            <Phone className="h-4 w-4 mr-2" />
            Hubungi WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
