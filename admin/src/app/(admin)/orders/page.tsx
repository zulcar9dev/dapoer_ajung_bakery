"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { formatRupiah, formatDateTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@shared/types";

const ALL_STATUSES: OrderStatus[] = ["PENDING","CONFIRMED","PROCESSING","READY","SHIPPING","DELIVERED","COMPLETED","CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(id)
        `)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let r = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((o) => (o.order_number?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q)));
    }
    if (statusFilter !== "all") r = r.filter((o) => o.status === statusFilter);
    return r;
  }, [search, statusFilter, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pesanan</h1>
        <p className="text-sm text-muted-foreground">Kelola semua pesanan masuk.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari no. pesanan atau nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {ALL_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-sm">{order.order_number}</TableCell>
                  <TableCell className="text-sm">{order.customer_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.items?.length || 0} item</TableCell>
                  <TableCell className="text-sm font-medium">{formatRupiah(order.total)}</TableCell>
                  <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/orders/${order.id}`} />}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Tidak ada pesanan ditemukan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
