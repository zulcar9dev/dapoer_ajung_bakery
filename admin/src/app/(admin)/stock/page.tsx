"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, ArrowUpDown, Loader2, Plus, Trash2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/use-auth-store";

export default function StockPage() {
  const { user } = useAuthStore();
  const isOwner = user?.role === "OWNER";

  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fitur Riwayat States
  const [timeFilter, setTimeFilter] = useState("all");
  const [deleteMovementId, setDeleteMovementId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Dialog & Form states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const fetchData = async () => {
    const supabase = createClient();
    
    const { data: prodData } = await supabase
      .from("products")
      .select(`
        id, name, total_stock,
        category:categories(name),
        variants:product_variants(id, name, stock, sku)
      `);

    let query = supabase.from("stock_movements").select("*").order("created_at", { ascending: false });
    
    if (timeFilter !== "all") {
      const date = new Date();
      if (timeFilter === "today") date.setHours(0, 0, 0, 0);
      else if (timeFilter === "7days") date.setDate(date.getDate() - 7);
      else if (timeFilter === "30days") date.setDate(date.getDate() - 30);
      
      query = query.gte("created_at", date.toISOString());
    }

    const { data: movData } = await query.limit(50);

    setProducts(prodData || []);
    setMovements(movData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const handleDeleteMovement = async () => {
    if (!deleteMovementId) return;
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("stock_movements").delete().eq("id", deleteMovementId);
    if (error) alert("Gagal menghapus riwayat: " + error.message);
    else await fetchData();
    setIsDeleting(false);
    setDeleteMovementId(null);
  };

  const handleResetMovements = async () => {
    if (resetConfirmText !== "RESET") return;
    setIsResetting(true);
    const supabase = createClient();
    const { error } = await supabase.from("stock_movements").delete().not("id", "is", null);
    if (error) alert("Gagal mereset riwayat: " + error.message);
    else await fetchData();
    setIsResetting(false);
    setResetDialogOpen(false);
    setResetConfirmText("");
  };

  const handleOpenDialog = () => {
    setSelectedProduct("");
    setSelectedVariant("");
    setMovementType("IN");
    setQuantity("");
    setReason("");
    setDialogOpen(true);
  };

  const handleSubmitStock = async () => {
    if (!selectedProduct || !quantity || isNaN(parseInt(quantity))) {
      return alert("Produk dan jumlah harus diisi dengan benar.");
    }
    
    setSubmitting(true);
    const supabase = createClient();
    const qty = parseInt(quantity);
    
    const product = products.find(p => p.id === selectedProduct);
    const variant = selectedVariant ? product?.variants?.find((v:any) => v.id === selectedVariant) : null;
    
    // 1. Insert Movement
    const { data: authData } = await supabase.auth.getUser();
    const { error: moveError } = await supabase.from("stock_movements").insert({
      product_id: selectedProduct,
      product_name: product?.name || "",
      variant_name: variant?.name || null,
      type: movementType,
      quantity: qty,
      reason: reason,
      created_by: authData.user?.id
    });

    if (moveError) {
      setSubmitting(false);
      return alert("Gagal mencatat mutasi: " + moveError.message);
    }

    // 2. Update Product Total Stock
    let newTotalStock = product?.total_stock || 0;
    if (movementType === "IN") newTotalStock += qty;
    else if (movementType === "OUT") newTotalStock -= qty;
    else if (movementType === "ADJUSTMENT") newTotalStock = qty;

    await supabase.from("products").update({ total_stock: newTotalStock }).eq("id", selectedProduct);

    // 3. Update Variant Stock if chosen
    if (variant) {
      let newVarStock = variant.stock || 0;
      if (movementType === "IN") newVarStock += qty;
      else if (movementType === "OUT") newVarStock -= qty;
      else if (movementType === "ADJUSTMENT") newVarStock = qty;
      
      await supabase.from("product_variants").update({ stock: newVarStock }).eq("id", variant.id);
    }

    await fetchData();
    setSubmitting(false);
    setDialogOpen(false);
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold">Manajemen Stok</h1><p className="text-sm text-muted-foreground">Pantau dan kelola stok produk.</p></div>
        <Button onClick={handleOpenDialog}><Plus className="h-4 w-4 mr-2" /> Sesuaikan Stok</Button>
      </div>

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
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
          <CardTitle className="text-base flex items-center gap-2"><ArrowUpDown className="h-4 w-4" />Riwayat Pergerakan Stok</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                {timeFilter === "today" ? "Hari Ini" : timeFilter === "7days" ? "7 Hari Terakhir" : timeFilter === "30days" ? "30 Hari Terakhir" : "Semua Waktu"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                <SelectItem value="all">Semua Waktu</SelectItem>
              </SelectContent>
            </Select>
            {isOwner && (
              <Button variant="outline" size="sm" className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => setResetDialogOpen(true)}>
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>Produk</TableHead><TableHead>Tipe</TableHead><TableHead>Jumlah</TableHead><TableHead>Keterangan</TableHead>{isOwner && <TableHead className="text-right">Aksi</TableHead>}</TableRow></TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(m.created_at)}</TableCell>
                  <TableCell className="text-sm font-medium">{m.product_name} {m.variant_name ? `(${m.variant_name})` : ""}</TableCell>
                  <TableCell><Badge variant="outline" className={m.type === "IN" ? "text-success border-success/20" : m.type === "OUT" ? "text-destructive border-destructive/20" : "text-warning border-warning/20"}>{m.type === "IN" ? "Masuk" : m.type === "OUT" ? "Keluar" : "Koreksi"}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">{m.type === "IN" ? "+" : "-"}{Math.abs(m.quantity)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">{m.reason || "—"}</TableCell>
                  {isOwner && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteMovementId(m.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isOwner ? 6 : 5} className="text-center py-6 text-muted-foreground">Tidak ada riwayat pergerakan stok.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Sesuaikan Stok */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Sesuaikan Stok</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Produk</Label>
              <Select value={selectedProduct} onValueChange={(v) => { setSelectedProduct(v); setSelectedVariant(""); }}>
                <SelectTrigger><span className="truncate text-left block">{selectedProduct ? products.find(p => p.id === selectedProduct)?.name : "Pilih produk..."}</span></SelectTrigger>
                <SelectContent>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && products.find(p => p.id === selectedProduct)?.variants?.length > 0 && (
              <div className="space-y-2">
                <Label>Varian (Opsional)</Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger><span className="truncate text-left block">{selectedVariant ? products.find(p => p.id === selectedProduct)?.variants?.find((v:any) => v.id === selectedVariant)?.name : "Tanpa varian / akumulasi"}</span></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tanpa varian / akumulasi</SelectItem>
                    {products.find(p => p.id === selectedProduct)?.variants?.map((v:any) => (
                      <SelectItem key={v.id} value={v.id}>{v.name} (Stok: {v.stock})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger><span className="truncate">{movementType === "IN" ? "Masuk (+)" : movementType === "OUT" ? "Keluar (-)" : "Koreksi (=)"}</span></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Masuk (+)</SelectItem>
                    <SelectItem value="OUT">Keluar (-)</SelectItem>
                    <SelectItem value="ADJUSTMENT">Koreksi (=)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jumlah</Label>
                <Input type="number" min="0" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Keterangan / Alasan</Label>
              <Textarea placeholder="Contoh: Produksi Pagi" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmitStock} disabled={submitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {submitting ? "Menyimpan..." : "Simpan Mutasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus Baris */}
      <Dialog open={!!deleteMovementId} onOpenChange={(open) => !open && setDeleteMovementId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Hapus Entri Riwayat</DialogTitle></DialogHeader>
          <div className="py-2">
            <p className="text-sm">Apakah Anda yakin ingin menghapus catatan mutasi stok ini?</p>
            <p className="text-xs text-muted-foreground mt-2">Peringatan: Stok utama produk tidak akan berubah, hanya riwayat ini yang dihapus.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMovementId(null)} disabled={isDeleting}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteMovement} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Reset Semua */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-destructive/20">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Bersihkan Seluruh Riwayat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm">Anda akan menghapus <strong>SEMUA</strong> catatan pergerakan stok secara permanen. Tindakan ini tidak dapat dikembalikan.</p>
            <p className="text-sm text-muted-foreground">Angka total stok produk tidak akan berubah.</p>
            <div className="space-y-2 mt-4 pt-4 border-t">
              <Label className="text-xs font-semibold">Ketik "RESET" untuk melanjutkan konfirmasi</Label>
              <Input value={resetConfirmText} onChange={(e) => setResetConfirmText(e.target.value)} placeholder="Ketik RESET di sini..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetDialogOpen(false); setResetConfirmText(""); }}>Batal</Button>
            <Button variant="destructive" onClick={handleResetMovements} disabled={resetConfirmText !== "RESET" || isResetting}>
              {isResetting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isResetting ? "Mereset..." : "Hapus Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
