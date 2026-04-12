"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([]);
  const [newVariant, setNewVariant] = useState({ name: "", type: "SIZE", price: "", stock: "", sku: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, name").order("name");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleAddVariant = () => {
    if (!newVariant.name || !newVariant.price) return alert("Nama dan Harga varian wajib diisi!");
    setVariants([...variants, { ...newVariant, id: Date.now().toString() }]);
    setNewVariant({ name: "", type: "SIZE", price: "", stock: "", sku: "" });
  };

  const handleDeleteVariant = (vid: string) => {
    setVariants(variants.filter(v => v.id !== vid));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Kategori wajib dipilih!");
    setIsSaving(true);
    
    const form = e.currentTarget;
    const getValue = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value || null;
    const isChecked = (id: string) => form.querySelector(`button#${id}`)?.getAttribute('data-state') === 'checked';

    const basePrice = getValue("basePrice");
    const name = getValue("name");
    
    if (!name || !basePrice) {
      setIsSaving(false);
      return alert("Nama dan harga dasar wajib diisi!");
    }

    const supabase = createClient();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const { data: newProduct, error } = await supabase.from("products").insert({
      name: name,
      slug,
      category_id: selectedCategory,
      short_description: getValue("shortDesc"),
      description: getValue("description"),
      base_price: parseInt(basePrice),
      discount_price: getValue("discountPrice") ? parseInt(getValue("discountPrice") as string) : null,
      weight: getValue("weight") ? parseInt(getValue("weight") as string) : null,
      shelf_life: getValue("shelfLife"),
      ingredients: getValue("ingredients"),
      is_pre_order_only: isChecked("preorder"),
      is_featured: isChecked("featured"),
    }).select().single();

    if (error) {
      setIsSaving(false);
      return alert("Gagal menyimpan produk: " + error.message);
    }

    if (variants.length > 0) {
      const variantPayload = variants.map(v => ({
        product_id: newProduct.id,
        name: v.name,
        type: v.type,
        price: parseInt(v.price),
        stock: v.stock ? parseInt(v.stock) : 0,
        sku: v.sku || null
      }));
      await supabase.from("product_variants").insert(variantPayload);
    }

    setIsSaving(false);
    router.push(`/products`);
  };
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/products" />}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Produk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nama Produk *</Label><Input id="name" placeholder="Contoh: Bingka Kentang" className="mt-1.5" required /></div>
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
            <div><Label htmlFor="shortDesc">Deskripsi Singkat *</Label><Input id="shortDesc" placeholder="Satu baris deskripsi produk" className="mt-1.5" required /></div>
            <div><Label htmlFor="description">Deskripsi Lengkap</Label><Textarea id="description" placeholder="Deskripsi detail produk..." className="mt-1.5" rows={4} /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label htmlFor="basePrice">Harga Dasar (Rp) *</Label><Input id="basePrice" type="number" placeholder="25000" className="mt-1.5" required /></div>
              <div><Label htmlFor="discountPrice">Harga Diskon (Rp)</Label><Input id="discountPrice" type="number" placeholder="Opsional" className="mt-1.5" /></div>
              <div><Label htmlFor="weight">Berat (gram)</Label><Input id="weight" type="number" placeholder="500" className="mt-1.5" /></div>
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
                <TableHeader><TableRow><TableHead>Nama Varian</TableHead><TableHead>Tipe</TableHead><TableHead>Harga</TableHead><TableHead>Stok</TableHead><TableHead>SKU</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                <TableBody>
                  {variants.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">Belum ada varian produk.</TableCell></TableRow>
                  ) : (
                    variants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>{v.type}</TableCell>
                        <TableCell>Rp {parseInt(v.price).toLocaleString("id-ID")}</TableCell>
                        <TableCell>{v.stock}</TableCell>
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
                  <SelectTrigger><span className="truncate">{newVariant.type}</span></SelectTrigger>
                  <SelectContent><SelectItem value="SIZE">SIZE</SelectItem><SelectItem value="FLAVOR">FLAVOR</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 w-[120px]">
                <Label className="text-xs">Harga (Rp)</Label>
                <Input type="number" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />
              </div>
              <div className="space-y-1.5 w-[80px]">
                <Label className="text-xs">Stok</Label>
                <Input type="number" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })} />
              </div>
              <div className="space-y-1.5 w-[100px]">
                <Label className="text-xs">SKU</Label>
                <Input value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} />
              </div>
              <Button type="button" onClick={handleAddVariant} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">Tambah</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Detail Tambahan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="shelfLife">Daya Tahan</Label><Input id="shelfLife" placeholder="Contoh: 3 hari (suhu ruang)" className="mt-1.5" /></div>
              <div><Label htmlFor="ingredients">Bahan</Label><Input id="ingredients" placeholder="Tepung, telur, gula, susu..." className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="preorder" /><Label htmlFor="preorder">Pre-Order Only</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="featured" /><Label htmlFor="featured">Tampilkan di Best Seller</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" render={<Link href="/products" />}>Batal</Button>
          <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground min-w-[150px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </div>
  );
}
