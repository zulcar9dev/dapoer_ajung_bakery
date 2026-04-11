"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, ChefHat, Package, Truck, MapPin, CheckCheck, XCircle, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatRupiah, formatDateTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

const STATUS_ICONS: Record<string, React.ElementType> = { PENDING: Clock, CONFIRMED: CheckCircle2, PROCESSING: ChefHat, READY: Package, SHIPPING: Truck, DELIVERED: MapPin, COMPLETED: CheckCheck, CANCELLED: XCircle };

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!params?.id) return;
      const supabase = createClient();
      
      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*),
          history:order_status_history(*)
        `)
        .eq("id", params.id as string)
        .order("created_at", { referencedTable: "order_status_history", ascending: true })
        .single();
      
      setOrder(data);
      if (data) setSelectedStatus(data.status);
      setLoading(false);
    }
    fetchOrder();
  }, [params?.id]);

  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === order.status) return;
    setIsUpdating(true);
    
    const supabase = createClient();
    
    // 1. Update orders table
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: selectedStatus })
      .eq("id", order.id);

    if (!updateError) {
      // 2. Insert into history log
      await supabase.from("order_status_history").insert({
        order_id: order.id,
        status: selectedStatus,
        note: "Updated by Admin"
      });

      // Optimistic upate on UI
      setOrder({
        ...order,
        status: selectedStatus,
        history: [...(order.history || []), { status: selectedStatus, created_at: new Date().toISOString(), note: "Updated by Admin" }]
      });
    }

    setIsUpdating(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!order) return <div className="text-center py-20 text-muted-foreground">Pesanan tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/orders" />}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.created_at)}</p>
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
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{item.product_name}</span>
                    {item.variant_name && <span className="text-muted-foreground"> — {item.variant_name}</span>}
                    <span className="text-muted-foreground"> x{item.quantity}</span>
                  </div>
                  <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ongkir</span><span>{formatRupiah(order.delivery_fee)}</span></div>
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
              {order.history?.map((entry: any, i: number) => {
                const Icon = STATUS_ICONS[entry.status] || Clock;
                const isLast = i === order.history.length - 1;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isLast ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {i < order.history.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${isLast ? "" : "text-muted-foreground"}`}>{entry.status}</p>
                      {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                      <p className="text-xs text-muted-foreground/60">{formatDateTime(entry.created_at)}</p>
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
              <Select value={selectedStatus} onValueChange={(v) => { if (v) setSelectedStatus(v) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(STATUS_ICONS).map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdateStatus} 
                disabled={isUpdating || selectedStatus === order.status} 
                className="w-full bg-primary text-primary-foreground"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan Status
              </Button>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader><CardTitle className="text-base">Info Pelanggan</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-muted-foreground">{order.customer_phone}</p>
              <p className="text-muted-foreground">{order.customer_address || "—"}</p>
              <Separator />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{order.delivery_method}</Badge>
                <Badge variant="outline">{order.payment_method}</Badge>
              </div>
              {order.customer_phone && (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => window.open(`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`, "_blank")}>
                  <Phone className="h-3 w-3 mr-1" /> Hubungi
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
