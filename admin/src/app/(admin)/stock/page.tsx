"use client";

import { Package, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS } from "@shared/mock-data";
import { formatRupiah, formatDateTime } from "@shared/utils";

const stockSummary = MOCK_PRODUCTS.map((p) => ({
  id: p.id, name: p.name, category: p.category.name, totalStock: p.totalStock,
  variants: p.variants.map((v) => ({ name: v.name, stock: v.stock, sku: v.sku })),
})).sort((a, b) => a.totalStock - b.totalStock);

export default function StockPage() {
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
                  <TableCell className="text-xs text-muted-foreground">{p.variants.map((v) => `${v.name}: ${v.stock}`).join(", ") || "—"}</TableCell>
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
              {MOCK_STOCK_MOVEMENTS.slice(0, 10).map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</TableCell>
                  <TableCell className="text-sm font-medium">{m.productName}</TableCell>
                  <TableCell><Badge variant="outline" className={m.type === "IN" ? "text-success border-success/20" : "text-destructive border-destructive/20"}>{m.type === "IN" ? "Masuk" : "Keluar"}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">{m.type === "IN" ? "+" : "-"}{m.quantity}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{m.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
