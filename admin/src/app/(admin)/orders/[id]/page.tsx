"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, ChefHat, Package, Truck, MapPin, CheckCheck, XCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { MOCK_ORDERS } from "@shared/mock-data";
import { formatRupiah, formatDateTime } from "@shared/utils";

const STATUS_ICONS: Record<string, React.ElementType> = { PENDING: Clock, CONFIRMED: CheckCircle2, PROCESSING: ChefHat, READY: Package, SHIPPING: Truck, DELIVERED: MapPin, COMPLETED: CheckCheck, CANCELLED: XCircle };

export default function OrderDetailPage() {
  const params = useParams();
  const order = MOCK_ORDERS.find((o) => o.id === params.id);

  if (!order) return <div className="text-center py-20 text-muted-foreground">Pesanan tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/orders" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="ml-auto"><OrderStatusBadge status={order.status} /></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle className="text-base">Item Pesanan</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{item.productName}</span>
                    {item.variantName && <span className="text-muted-foreground"> — {item.variantName}</span>}
                    <span className="text-muted-foreground"> x{item.quantity}</span>
                  </div>
                  <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ongkir</span><span>{formatRupiah(order.deliveryFee)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-success"><span>Diskon</span><span>-{formatRupiah(order.discount)}</span></div>}
              </div>
              <Separator />
              <div className="flex justify-between font-bold"><span>Total</span><span className="text-lg">{formatRupiah(order.total)}</span></div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle className="text-base">Riwayat Status</CardTitle></CardHeader>
            <CardContent>
              {order.statusHistory.map((entry, i) => {
                const Icon = STATUS_ICONS[entry.status] || Clock;
                const isLast = i === order.statusHistory.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isLast ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < order.statusHistory.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${isLast ? "" : "text-muted-foreground"}`}>{entry.status}</p>
                      {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                      <p className="text-xs text-muted-foreground/60">{formatDateTime(entry.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select defaultValue={order.status}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(STATUS_ICONS).map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
              <Button className="w-full bg-primary text-primary-foreground">Simpan Status</Button>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader><CardTitle className="text-base">Info Pelanggan</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted-foreground">{order.customerPhone}</p>
              <p className="text-muted-foreground">{order.customerAddress}</p>
              <Separator />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{order.deliveryMethod}</Badge>
                <Badge variant="outline">{order.paymentMethod}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`, "_blank")}>
                <Phone className="h-3 w-3 mr-1" /> Hubungi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
