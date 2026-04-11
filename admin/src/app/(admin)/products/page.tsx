"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Edit, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_PRODUCTS } from "@shared/mock-data";
import { CATEGORIES } from "@shared/constants";
import { formatRupiah } from "@shared/utils";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = useMemo(() => {
    let r = [...MOCK_PRODUCTS];
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((p) => p.name.toLowerCase().includes(q)); }
    if (catFilter !== "all") r = r.filter((p) => p.categoryId === catFilter);
    return r;
  }, [search, catFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Produk</h1><p className="text-sm text-muted-foreground">Kelola katalog produk.</p></div>
        <Button className="bg-primary text-primary-foreground" render={<Link href="/products/new" />}><Plus className="h-4 w-4 mr-1" />Tambah Produk</Button>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={catFilter} onValueChange={(v) => setCatFilter(v ?? "all")}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Semua Kategori</SelectItem>{CATEGORIES.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent></Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead className="w-[50px]"></TableHead><TableHead>Produk</TableHead><TableHead>Kategori</TableHead><TableHead>Harga</TableHead><TableHead>Stok</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell><div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted"><Image src={p.images[0] || "/images/placeholder.jpg"} alt={p.name} fill className="object-cover" sizes="40px" /></div></TableCell>
                  <TableCell><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.tags.join(", ")}</p></TableCell>
                  <TableCell className="text-sm">{p.category.name}</TableCell>
                  <TableCell className="text-sm font-medium">{formatRupiah(p.basePrice)}</TableCell>
                  <TableCell><Badge variant="outline" className={p.totalStock <= 10 ? "border-destructive text-destructive" : ""}>{p.totalStock}</Badge></TableCell>
                  <TableCell><Badge variant={p.isAvailable ? "default" : "outline"} className={p.isAvailable ? "bg-success/10 text-success border-success/20" : ""}>{p.isAvailable ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                  <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/products/${p.id}`} />}><Edit className="h-4 w-4" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
