"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, ArrowUpDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const { data: prodData } = await supabase
        .from("products")
        .select(`
          id, name, total_stock,
          category:categories(name),
          variants:product_variants(name, stock, sku)
        `);

      const { data: movData } = await supabase
        .from("stock_movements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      setProducts(prodData || []);
      setMovements(movData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stockSummary = products.map((p) => ({
    id: p.id, 
    name: p.name, 
    category: p.category?.[0]?.name || p.category?.name || "Kategori", 
    totalStock: p.total_stock || 0,
    variants: p.variants || [],
  })).sort((a, b) => a.totalStock - b.totalStock);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Manajemen Stok</h1><p className="text-sm text-muted-foreground">Pantau dan kelola stok produk.</p></div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center"><Package className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{stockSummary.reduce((a, p) => a + p.totalStock, 0)}</p><p className="text-sm text-muted-foreground">Total Stok</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><AlertTriangle className="h-8 w-8 mx-auto text-warning mb-2" /><p className="text-2xl font-bold">{stockSummary.filter((p) => p.totalStock <= 15 && p.totalStock > 0).length}</p><p className="text-sm text-muted-foreground">Stok Menipis</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-2" /><p className="text-2xl font-bold">{stockSummary.filter((p) => p.totalStock === 0).length}</p><p className="text-sm text-muted-foreground">Stok Habis</p></CardContent></Card>
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Stok per Produk</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Produk</TableHead><TableHead>Kategori</TableHead><TableHead>Varian</TableHead><TableHead className="text-right">Total Stok</TableHead></TableRow></TableHeader>
            <TableBody>
              {stockSummary.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-sm">{p.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.variants.map((v: any) => `${v.name}: ${v.stock}`).join(", ") || "—"}</TableCell>
                  <TableCell className="text-right"><Badge variant="outline" className={p.totalStock <= 5 ? "border-destructive text-destructive" : p.totalStock <= 15 ? "border-warning text-warning" : ""}>{p.totalStock}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Movement Log */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowUpDown className="h-4 w-4" />Riwayat Pergerakan Stok</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>Produk</TableHead><TableHead>Tipe</TableHead><TableHead>Jumlah</TableHead><TableHead>Keterangan</TableHead></TableRow></TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</TableCell>
                  <TableCell className="text-sm font-medium">{m.product_name} {m.variant_name ? `(${m.variant_name})` : ""}</TableCell>
                  <TableCell><Badge variant="outline" className={m.type === "IN" ? "text-success border-success/20" : m.type === "OUT" ? "text-destructive border-destructive/20" : "text-warning border-warning/20"}>{m.type === "IN" ? "Masuk" : m.type === "OUT" ? "Keluar" : "Koreksi"}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">{m.type === "IN" ? "+" : "-"}{Math.abs(m.quantity)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{m.reason || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
