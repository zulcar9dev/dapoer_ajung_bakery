"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart3, ShoppingBag, Package, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { ChartCard } from "@/components/admin/chart-card";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatRelativeTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState(0);
  const [ordersTrend, setOrdersTrend] = useState(0);
  
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      
      // 1. Get current admin
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase.from("users").select("name").eq("id", session.user.id).single();
        if (userData) setAdminName(userData.name);
        else setAdminName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Admin");
      }

      // 2. Fetch today's boundaries
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      
      const startOfYesterday = new Date(startOfDay);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      
      const endOfYesterday = new Date(startOfDay);
      endOfYesterday.setMilliseconds(endOfYesterday.getMilliseconds() - 1);

      // 3. Aggregate Orders
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total, status, created_at, customer_name, order_number")
        .order("created_at", { ascending: false });

      if (orders) {
        let rev = 0;
        let ords = 0;
        let yesterdayRev = 0;
        let yesterdayOrds = 0;
        
        const tempSales: Record<string, number> = {};

        orders.forEach(o => {
          const createdAt = new Date(o.created_at);
          
          // Today & Yesterday stats
          if (createdAt >= startOfDay) {
            ords += 1;
            if (["COMPLETED", "DELIVERED", "READY"].includes(o.status)) {
              rev += o.total;
            }
          } else if (createdAt >= startOfYesterday && createdAt <= endOfYesterday) {
            yesterdayOrds += 1;
            if (["COMPLETED", "DELIVERED", "READY"].includes(o.status)) {
              yesterdayRev += o.total;
            }
          }
          
          // Sales chart (all time grouped by date)
          if (["COMPLETED", "DELIVERED", "READY"].includes(o.status)) {
            const dateStr = createdAt.toLocaleDateString("id-ID", { day: '2-digit', month: 'short' });
            tempSales[dateStr] = (tempSales[dateStr] || 0) + o.total;
          }
        });

        const calcTrend = (today: number, yest: number) => yest === 0 ? (today > 0 ? 100 : 0) : ((today - yest) / yest) * 100;

        setTodayRevenue(rev);
        setTodayOrders(ords);
        setRevenueTrend(parseFloat(calcTrend(rev, yesterdayRev).toFixed(1)));
        setOrdersTrend(parseFloat(calcTrend(ords, yesterdayOrds).toFixed(1)));
        setRecentOrders(orders.slice(0, 5));
        
        setSalesData(Object.keys(tempSales).map(k => ({ date: k, revenue: tempSales[k] })));
      }

      // 4. Products & Low Stock
      const { data: products } = await supabase
        .from("products")
        .select("id, name, total_stock, is_active");
        
      if (products) {
        setActiveProducts(products.filter(p => p.is_active).length);
        setLowStockProducts(
          products.filter(p => p.total_stock <= 15).sort((a,b) => a.total_stock - b.total_stock).slice(0, 5)
        );
      }

      setLoading(false);
    }
    
    loadDashboard();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, {adminName.split(" ")[0]}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Berikut ringkasan aktivitas toko hari ini dari live database.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(todayRevenue)}
          trend={revenueTrend}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pesanan Hari Ini"
          value={String(todayOrders)}
          trend={ordersTrend}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Pesanan Aktif"
          value={String(recentOrders.filter(o => !["COMPLETED", "CANCELLED"].includes(o.status)).length)}
          icon={Package}
        />
        <StatsCard
          title="Produk Aktif"
          value={String(activeProducts)}
          icon={BarChart3}
        />
      </div>

      {/* Main Charts & Tables Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (Main Chart) */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Grafik Penjualan">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dx={-10} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [formatRupiah(Number(value)), "Pendapatan"]}
                  />
                  <Bar dataKey="revenue" fill="var(--color-primary, #D4A574)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground">Belum ada data cukup</div>}
          </ChartCard>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">Pesanan Terbaru</CardTitle>
              <Badge variant="secondary" className="font-normal text-xs">Hari ini</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pesanan</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{order.order_number}</div>
                        <div className="text-[10px] text-muted-foreground">{formatRelativeTime(order.created_at)}</div>
                      </TableCell>
                      <TableCell className="text-sm">{order.customer_name}</TableCell>
                      <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                      <TableCell className="text-right font-medium text-sm">{formatRupiah(order.total)}</TableCell>
                    </TableRow>
                  ))}
                  {recentOrders.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Belum ada pesanan terbaru</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Side Widgets) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" /> Peringatan Stok
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Sisa stok menipis</p>
                    </div>
                    <Badge variant="outline" className={product.total_stock === 0 ? "border-destructive text-destructive" : "border-warning text-warning"}>
                      {product.total_stock}
                    </Badge>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <div className="text-sm text-center text-muted-foreground">Semua stok aman 🎉</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
