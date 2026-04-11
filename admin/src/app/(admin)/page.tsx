"use client";

import { BarChart3, ShoppingBag, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { ChartCard } from "@/components/admin/chart-card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_DASHBOARD_STATS, MOCK_ORDERS, MOCK_PRODUCTS, MOCK_SALES_DATA } from "@shared/mock-data";
import { formatRupiah, formatRelativeTime } from "@shared/utils";
import { CURRENT_USER } from "@shared/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const recentOrders = MOCK_ORDERS.slice(0, 5);
const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.totalStock <= 15).slice(0, 5);

export default function DashboardPage() {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, {CURRENT_USER.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Berikut ringkasan aktivitas toko hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(MOCK_DASHBOARD_STATS.todayRevenue)}
          trend={12.5}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pesanan Hari Ini"
          value={String(MOCK_DASHBOARD_STATS.todayOrders)}
          trend={8}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Produk Aktif"
          value={String(MOCK_DASHBOARD_STATS.totalProducts)}
          icon={Package}
        />
        <StatsCard
          title="Pesanan Pending"
          value={String(MOCK_DASHBOARD_STATS.pendingOrders)}
          trend={-2}
          icon={BarChart3}
        />
      </div>

      {/* Charts + Low Stock */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <ChartCard title="Penjualan 7 Hari Terakhir" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_SALES_DATA.slice(0, 7)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [formatRupiah(Number(value)), "Pendapatan"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }}
              />
              <Bar dataKey="revenue" fill="var(--color-primary, #D4A574)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Semua produk stoknya aman 👍
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      p.totalStock <= 5
                        ? "border-destructive text-destructive"
                        : "border-warning text-warning"
                    }
                  >
                    {p.totalStock} pcs
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatRupiah(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatRelativeTime(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
