"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Search, Plus, Edit, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import { TableSkeleton } from "@/components/admin/loading-skeletons";
import { toast } from "sonner";

// ⚡ Lazy load modal berat (22KB) — hanya diunduh saat user klik Tambah/Edit
const ProductFormModal = dynamic(
  () => import("@/components/admin/product-form-modal").then((mod) => ({ default: mod.ProductFormModal })),
  { ssr: false }
);

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select(`
          *,
          category:categories(name),
          images:product_images(url)
        `)
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name")
    ]);

    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
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

  const confirmDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", deleteId);
      
      if (!error) {
        setProducts(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
        toast.success("Produk berhasil dihapus", { description: deleteName });
      } else {
        toast.error("Gagal menghapus produk", { description: error.message });
      }
    } catch (err: any) {
      toast.error("Kesalahan saat menghapus", { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><div className="h-7 w-24 bg-muted rounded animate-pulse" /><div className="h-4 w-40 bg-muted rounded animate-pulse mt-1" /></div>
          <div className="h-9 w-36 bg-muted rounded animate-pulse" />
        </div>
        <TableSkeleton rows={6} cols={7} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Produk</h1><p className="text-sm text-muted-foreground">Kelola katalog produk.</p></div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Tambah Produk
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={catFilter} onValueChange={(v) => setCatFilter(v ?? "all")}>
              <SelectTrigger className="w-[180px]">
                <span className="flex-1 text-left block truncate">
                  {catFilter === "all" ? "Semua Kategori" : (categories.find(c => c.id === catFilter)?.name || catFilter)}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => confirmDelete(p.id, p.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus produk <strong>{deleteName}</strong> secara permanen?</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tindakan ini tidak dapat dibatalkan. Varian dan foto terkait akan ikut terhapus, namun riwayat pesanan (invoice) pelanggan tetap aman.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Batal</Button>
            <Button variant="destructive" onClick={executeDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal Form Produk (Tambah & Edit) */}
      <ProductFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        product={selectedProduct} 
        onSuccess={fetchProducts} 
      />
    </div>
  );
}
