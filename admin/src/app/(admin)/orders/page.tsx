"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
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
import { MOCK_ORDERS } from "@shared/mock-data";
import { formatRupiah, formatDateTime } from "@shared/utils";
import type { OrderStatus } from "@shared/types";

const ALL_STATUSES: OrderStatus[] = ["PENDING","CONFIRMED","PROCESSING","READY","SHIPPING","DELIVERED","COMPLETED","CANCELLED"];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let r = [...MOCK_ORDERS];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") r = r.filter((o) => o.status === statusFilter);
    return r;
  }, [search, statusFilter]);

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
                  <TableCell className="font-medium text-sm">{order.orderNumber}</TableCell>
                  <TableCell className="text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.items.length} item</TableCell>
                  <TableCell className="text-sm font-medium">{formatRupiah(order.total)}</TableCell>
                  <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</TableCell>
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
