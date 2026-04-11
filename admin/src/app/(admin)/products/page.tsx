"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Edit, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORIES } from "@shared/constants";
import { formatRupiah } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name),
          images:product_images(url)
        `)
        .order("created_at", { ascending: false });

      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let r = [...products];
    if (search.trim()) { 
      const q = search.toLowerCase(); 
      r = r.filter((p) => p.name.toLowerCase().includes(q)); 
    }
    if (catFilter !== "all") r = r.filter((p) => p.category_id === catFilter);
    return r;
  }, [search, catFilter, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              {filtered.map((p) => {
                const imgUrl = p.images?.[0]?.url || "/images/placeholder.jpg";
                const catName = p.category?.[0]?.name || p.category?.name || "Kategori";
                const tags = p.tags || [];

                return (
                  <TableRow key={p.id}>
                    <TableCell><div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted"><Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="40px" /></div></TableCell>
                    <TableCell><p className="text-sm font-medium">{p.name}</p> {tags.length > 0 && <p className="text-xs text-muted-foreground">{tags.join(", ")}</p>}</TableCell>
                    <TableCell className="text-sm">{catName}</TableCell>
                    <TableCell className="text-sm font-medium">{formatRupiah(p.discount_price || p.base_price)}</TableCell>
                    <TableCell><Badge variant="outline" className={p.total_stock <= 10 ? "border-destructive text-destructive" : ""}>{p.total_stock}</Badge></TableCell>
                    <TableCell><Badge variant={p.is_available ? "default" : "outline"} className={p.is_available ? "bg-success/10 text-success border-success/20" : ""}>{p.is_available ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" render={<Link href={`/products/${p.id}`} />}><Edit className="h-4 w-4" /></Button></div></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
