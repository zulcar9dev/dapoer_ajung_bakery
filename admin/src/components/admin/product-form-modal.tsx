"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any; // Jika null/undefined berarti mode Tambah
  onSuccess: () => void;
}

export function ProductFormModal({ open, onOpenChange, product, onSuccess }: ProductFormModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([]);
  const [newVariant, setNewVariant] = useState({ name: "", type: "SIZE", price: "", sku: "" });
  
  const [isPreorder, setIsPreorder] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingVariant, setIsSavingVariant] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any>(null);

  const isEditMode = !!product;

  useEffect(() => {
    if (!open) return;
    
    // Reset state tiap modal dibuka
    setSelectedCategory("");
    setVariants([]);
    setNewVariant({ name: "", type: "SIZE", price: "", sku: "" });
    setIsPreorder(false);
    setIsFeatured(false);
    setDetailProduct(null);
    setLoading(true);

    async function fetchData() {
      const supabase = createClient();
      
      const { data: cats } = await supabase.from("categories").select("id, name").order("name");
      if (cats) setCategories(cats);

      if (isEditMode && product?.id) {
        // Fetch full product detail and variants
        const [prodRes, varRes] = await Promise.all([
          supabase.from("products").select("*").eq("id", product.id).single(),
          supabase.from("product_variants").select("*").eq("product_id", product.id).order("created_at")
        ]);
        
        if (prodRes.data) {
          setDetailProduct(prodRes.data);
          setSelectedCategory(prodRes.data.category_id || "");
          setIsPreorder(!!prodRes.data.is_pre_order_only);
          setIsFeatured(!!prodRes.data.is_featured);
        }
        if (varRes.data) setVariants(varRes.data);
      }
      setLoading(false);
    }
    fetchData();
  }, [open, isEditMode, product?.id]);

  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.price) return alert("Nama dan Harga varian wajib diisi!");
    setIsSavingVariant(true);

    if (isEditMode) {
      // Langsung simpan ke DB karena product.id sudah ada
      const supabase = createClient();
      const { data, error } = await supabase.from("product_variants").insert({
        product_id: product.id,
        name: newVariant.name,
        type: newVariant.type,
        price: parseInt(newVariant.price),
        stock: 0,
        sku: newVariant.sku || null
      }).select().single();
      
      setIsSavingVariant(false);
      if (error) return alert("Gagal menambah varian: " + error.message);
      setVariants([...variants, data]);
    } else {
      // Simpan di local state dlu kalau mode Tambah
      setVariants([...variants, { ...newVariant, id: Date.now().toString() }]);
      setIsSavingVariant(false);
    }
    
    setNewVariant({ name: "", type: "SIZE", price: "", sku: "" });
  };

  const handleDeleteVariant = async (vid: string) => {
    if (isEditMode) {
      if (!confirm("Hapus varian ini?")) return;
      const supabase = createClient();
      const { error } = await supabase.from("product_variants").delete().eq("id", vid);
      if (error) return alert("Gagal menghapus varian: " + error.message);
    }
    setVariants(variants.filter(v => v.id !== vid));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Kategori wajib dipilih!");
    setIsSaving(true);
    
    const form = e.currentTarget;
    const getValue = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value || null;

    const basePrice = getValue("basePrice");
    const name = getValue("name");
    const defaultData = detailProduct || {};

    if (!isEditMode && (!name || !basePrice)) {
      setIsSaving(false);
      return alert("Nama dan harga dasar wajib diisi!");
    }

    const payload = {
      name: name || defaultData.name,
      category_id: selectedCategory || defaultData.category_id,
      short_description: getValue("shortDesc") || null,
      description: getValue("description") || null,
      base_price: basePrice ? parseInt(basePrice) : defaultData.base_price,
      discount_price: getValue("discountPrice") ? parseInt(getValue("discountPrice") as string) : null,
      weight: getValue("weight") ? parseInt(getValue("weight") as string) : null,
      shelf_life: getValue("shelfLife") || null,
      ingredients: getValue("ingredients") || null,
      is_pre_order_only: isPreorder,
      is_featured: isFeatured,
    };

    const supabase = createClient();

    if (isEditMode) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) {
        setIsSaving(false);
        return alert("Gagal menyimpan perubahan: " + error.message);
      }
    } else {
      // Hit slug
      const slug = (payload.name as string).toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
      const { data: newProd, error } = await supabase.from("products").insert({
        ...payload,
        slug
      }).select().single();

      if (error) {
        setIsSaving(false);
        return alert("Gagal menyimpan produk: " + error.message);
      }

      // Insert variants pending
      if (variants.length > 0) {
        const variantPayload = variants.map(v => ({
          product_id: newProd.id,
          name: v.name,
          type: v.type,
          price: parseInt(v.price),
          stock: 0,
          sku: v.sku || null
        }));
        await supabase.from("product_variants").insert(variantPayload);
      }
    }

    setIsSaving(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{isEditMode ? `Edit: ${detailProduct?.name || "Memuat..."}` : "Tambah Produk Baru"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Seluruh perubahan akan langsung tersimpan di database.
            </DialogDescription>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSave} id="productForm">
              <Card>
                <CardHeader><CardTitle className="text-base">Informasi Produk</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label htmlFor="name">Nama Produk *</Label><Input id="name" defaultValue={detailProduct?.name || ""} placeholder="Contoh: Bingka Kentang" className="mt-1.5" required={!isEditMode} /></div>
                    <div><Label htmlFor="category">Kategori *</Label>
                      <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v || "")}>
                        <SelectTrigger className="mt-1.5">
                          <span className="flex-1 text-left block truncate">
                            {selectedCategory 
                              ? (categories.find(c => c.id === selectedCategory)?.name || selectedCategory) 
                              : "Pilih kategori..."}
                          </span>
                        </SelectTrigger>
                        <SelectContent>{categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label htmlFor="shortDesc">Deskripsi Singkat *</Label><Input id="shortDesc" defaultValue={detailProduct?.short_description || ""} placeholder="Satu baris deskripsi produk" className="mt-1.5" required={!isEditMode} /></div>
                  <div><Label htmlFor="description">Deskripsi Lengkap</Label><Textarea id="description" defaultValue={detailProduct?.description || ""} placeholder="Deskripsi detail produk..." className="mt-1.5" rows={4} /></div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div><Label htmlFor="basePrice">Harga Dasar (Rp) *</Label><Input id="basePrice" type="number" defaultValue={detailProduct?.base_price || ""} placeholder="25000" className="mt-1.5" required={!isEditMode} /></div>
                    <div><Label htmlFor="discountPrice">Harga Diskon (Rp)</Label><Input id="discountPrice" type="number" defaultValue={detailProduct?.discount_price || ""} placeholder="Opsional" className="mt-1.5" /></div>
                    <div><Label htmlFor="weight">Berat (gram)</Label><Input id="weight" type="number" defaultValue={detailProduct?.weight || ""} placeholder="500" className="mt-1.5" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Foto Produk</CardTitle></CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Klik atau drag foto baru ke sini</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (Maks. 5MB)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Varian Produk</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableHeader><TableRow><TableHead>Nama Varian</TableHead><TableHead>Tipe</TableHead><TableHead>Harga</TableHead><TableHead>SKU</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                      <TableBody>
                        {variants.length === 0 ? (
                          <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">Belum ada varian produk.</TableCell></TableRow>
                        ) : (
                          variants.map((v) => (
                            <TableRow key={v.id}>
                              <TableCell className="font-medium">{v.name}</TableCell>
                              <TableCell>{v.type === "SIZE" ? "Ukuran" : v.type === "FLAVOR" ? "Rasa" : v.type}</TableCell>
                              <TableCell>Rp {parseInt(v.price).toLocaleString("id-ID")}</TableCell>
                              <TableCell>{v.sku || "-"}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-destructive" onClick={() => handleDeleteVariant(v.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border">
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <Label className="text-xs">Nama Varian (Cth: Coklat Keju)</Label>
                      <Input value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 w-[100px]">
                      <Label className="text-xs">Tipe</Label>
                      <Select value={newVariant.type} onValueChange={(v) => setNewVariant({ ...newVariant, type: v })}>
                        <SelectTrigger><span className="truncate">{newVariant.type === "SIZE" ? "Ukuran" : newVariant.type === "FLAVOR" ? "Rasa" : newVariant.type}</span></SelectTrigger>
                        <SelectContent><SelectItem value="SIZE">Ukuran</SelectItem><SelectItem value="FLAVOR">Rasa</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 w-[120px]">
                      <Label className="text-xs">Harga (Rp)</Label>
                      <Input type="number" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 w-[100px]">
                      <Label className="text-xs">SKU</Label>
                      <Input value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} />
                    </div>
                    <Button type="button" onClick={handleAddVariant} disabled={isSavingVariant} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                      {isSavingVariant ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tambah"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Detail Tambahan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label htmlFor="shelfLife">Daya Tahan</Label><Input id="shelfLife" defaultValue={detailProduct?.shelf_life || ""} placeholder="Contoh: 3 hari (suhu ruang)" className="mt-1.5" /></div>
                    <div><Label htmlFor="ingredients">Bahan</Label><Input id="ingredients" defaultValue={detailProduct?.ingredients || ""} placeholder="Tepung, telur, gula, susu..." className="mt-1.5" /></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="preorder" checked={isPreorder} onCheckedChange={setIsPreorder} /><Label htmlFor="preorder">Pre-Order Only</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} /><Label htmlFor="featured">Tampilkan di Best Seller</Label>
                  </div>
                </CardContent>
              </Card>

            </form>
          </div>
        )}
        
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4 flex gap-3 justify-end rounded-b-lg">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button form="productForm" type="submit" disabled={isSaving || loading} className="bg-primary text-primary-foreground min-w-[150px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan Produk")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
