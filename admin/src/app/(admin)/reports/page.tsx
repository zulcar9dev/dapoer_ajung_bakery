"use client";

import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/admin/chart-card";
import { StatsCard } from "@/components/admin/stats-card";
import { MOCK_SALES_DATA, MOCK_TOP_PRODUCTS, MOCK_DASHBOARD_STATS } from "@shared/mock-data";
import { formatRupiah } from "@shared/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#D4A574", "#B8956A", "#A0845E", "#8B7355", "#6F5B3E"];

const categoryData = MOCK_TOP_PRODUCTS.map((p) => ({
  name: p.productName.length > 12 ? p.productName.slice(0, 12) + "..." : p.productName,
  value: p.totalSold,
}));

export default function ReportsPage() {
  const totalRevenue = MOCK_SALES_DATA.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = MOCK_SALES_DATA.reduce((a, d) => a + d.orders, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Laporan</h1><p className="text-sm text-muted-foreground">Analisis performa toko.</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Pendapatan" value={formatRupiah(totalRevenue)} trend={15} icon={DollarSign} />
        <StatsCard title="Total Pesanan" value={String(totalOrders)} trend={8} icon={ShoppingBag} />
        <StatsCard title="Rata-rata Order" value={formatRupiah(Math.round(totalRevenue / totalOrders))} icon={TrendingUp} />
        <StatsCard title="Produk Aktif" value={String(MOCK_DASHBOARD_STATS.totalProducts)} icon={BarChart3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title="Pendapatan per Hari">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [formatRupiah(Number(value)), "Pendapatan"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-primary, #D4A574)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Orders Chart */}
        <ChartCard title="Pesanan per Hari">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [Number(value), "Pesanan"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }} />
              <Bar dataKey="orders" fill="var(--color-primary, #D4A574)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Produk Terlaris">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value)} terjual`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader><CardTitle className="text-base">Top 5 Produk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {MOCK_TOP_PRODUCTS.slice(0, 5).map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.productName}</p>
                  <p className="text-xs text-muted-foreground">{p.totalSold} terjual • {formatRupiah(p.revenue)}</p>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(p.totalSold / MOCK_TOP_PRODUCTS[0].totalSold) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
