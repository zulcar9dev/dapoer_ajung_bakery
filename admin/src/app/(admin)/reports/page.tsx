"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import { DashboardSkeleton } from "@/components/admin/loading-skeletons";
import { formatRupiah } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

const COLORS = ["#D4A574", "#B8956A", "#A0845E", "#8B7355", "#6F5B3E", "#A0522D", "#8B4513"];

// ⚡ Lazy load chart components — hanya diunduh jika data sudah tersedia
import { ChartCard } from "@/components/admin/chart-card";

const LazyLineChart = dynamic(
  () => import("recharts").then((mod) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
    return {
      default: ({ data }: { data: any[] }) => (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => [formatRupiah(Number(value)), "Pendapatan"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }} />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary, #D4A574)" strokeWidth={2} dot={true} />
          </LineChart>
        </ResponsiveContainer>
      ),
    };
  }),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground">Memuat grafik...</div> }
);

const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
    return {
      default: ({ data }: { data: any[] }) => (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => [Number(value), "Pesanan"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }} />
            <Bar dataKey="orders" fill="var(--color-primary, #D4A574)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    };
  }),
  { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground">Memuat grafik...</div> }
);

const LazyPieChart = dynamic(
  () => import("recharts").then((mod) => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;
    return {
      default: ({ data, colors }: { data: any[]; colors: string[] }) => (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="totalSold">
              {data.map((_, index) => (<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ),
    };
  }),
  { ssr: false, loading: () => <div className="h-[250px] flex items-center justify-center text-muted-foreground">Memuat grafik...</div> }
);

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      // ⚡ PARALEL: kedua query dijalankan bersamaan
      const [oRes, cRes] = await Promise.all([
        supabase
          .from("orders")
          .select(`
            id, total, created_at,
            items:order_items(product_name, quantity, subtotal)
          `)
          .in("status", ["COMPLETED", "DELIVERED", "READY"]),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),
      ]);

      setOrders(oRes.data || []);
      setProductsCount(cRes.count || 0);
      setLoading(false);
    }
    fetchData();
  }, []);

  const { salesData, topProducts, totalRevenue, totalOrders } = useMemo(() => {
    if (orders.length === 0) return { salesData: [], topProducts: [], totalRevenue: 0, totalOrders: 0 };
    
    let tRev = 0;
    const daily: Record<string, { revenue: number; orders: number }> = {};
    const productStats: Record<string, { totalSold: number; revenue: number }> = {};

    orders.forEach((o) => {
      tRev += o.total;
      
      const date = new Date(o.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' });
      if (!daily[date]) daily[date] = { revenue: 0, orders: 0 };
      daily[date].revenue += o.total;
      daily[date].orders += 1;

      if (o.items) {
        o.items.forEach((item: any) => {
          if (!productStats[item.product_name]) productStats[item.product_name] = { totalSold: 0, revenue: 0 };
          productStats[item.product_name].totalSold += item.quantity;
          productStats[item.product_name].revenue += item.subtotal;
        });
      }
    });

    const sData = Object.keys(daily).map(k => ({ date: k, ...daily[k] }));
    const tProducts = Object.keys(productStats)
      .map(k => ({
        name: k.length > 15 ? k.slice(0, 15) + "..." : k,
        productName: k,
        totalSold: productStats[k].totalSold,
        revenue: productStats[k].revenue
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    return { salesData: sData, topProducts: tProducts, totalRevenue: tRev, totalOrders: orders.length };
  }, [orders]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Laporan</h1><p className="text-sm text-muted-foreground">Analisis performa toko berdasarkan pesanan sukses.</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Pendapatan" value={formatRupiah(totalRevenue)} trend={10} icon={DollarSign} />
        <StatsCard title="Total Pesanan" value={String(totalOrders)} trend={5} icon={ShoppingBag} />
        <StatsCard title="Rata-rata Order" value={formatRupiah(totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0)} icon={TrendingUp} />
        <StatsCard title="Produk Katalog" value={String(productsCount)} icon={BarChart3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Pendapatan per Hari">
          {salesData.length > 0 ? (
            <LazyLineChart data={salesData} />
          ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">Belum ada data cukup</div>}
        </ChartCard>

        <ChartCard title="Pesanan per Hari">
          {salesData.length > 0 ? (
            <LazyBarChart data={salesData} />
          ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">Belum ada data cukup</div>}
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Produk Terlaris</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">{i + 1}</div>
                    <div><p className="font-medium text-sm">{product.productName}</p><p className="text-xs text-muted-foreground">{product.totalSold} terjual</p></div>
                  </div>
                  <div className="font-medium text-sm">{formatRupiah(product.revenue)}</div>
                </div>
              ))}
              {topProducts.length === 0 && <div className="text-center text-sm text-muted-foreground">Belum ada produk terjual.</div>}
            </div>
          </CardContent>
        </Card>

        <ChartCard title="Komposisi Penjualan">
          {topProducts.length > 0 ? (
            <LazyPieChart data={topProducts} colors={COLORS} />
          ) : <div className="h-[250px] flex items-center justify-center text-muted-foreground">Belum ada data cukup</div>}
        </ChartCard>
      </div>
    </div>
  );
}
