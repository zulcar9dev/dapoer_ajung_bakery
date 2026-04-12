"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { CATEGORIES } from "@shared/constants";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([]);
  const [newVariant, setNewVariant] = useState({ name: "", type: "SIZE", price: "", sku: "" });
  const [isSavingVariant, setIsSavingVariant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPreorder, setIsPreorder] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!params?.id) return;
      const supabase = createClient();
      
      const [productRes, categoriesRes, variantsRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", params.id as string).single(),
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("product_variants").select("*").eq("product_id", params.id as string).order("created_at")
      ]);
      
      setProduct(productRes.data);
      if (productRes.data?.category_id) {
        setSelectedCategory(productRes.data.category_id);
      }
      setIsPreorder(!!productRes.data?.is_pre_order_only);
      setIsFeatured(!!productRes.data?.is_featured);
      
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (variantsRes.data) setVariants(variantsRes.data);
      
      setLoading(false);
    }
    fetchProduct();
  }, [params?.id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!product) return <div className="text-center py-20 text-muted-foreground">Produk tidak ditemukan.</div>;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const form = e.currentTarget;
    const getValue = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement)?.value || null;

    const basePrice = getValue("basePrice");
    const discountPrice = getValue("discountPrice");
    const weight = getValue("weight");

    const updatePayload = {
      name: getValue("name") || product.name,
      category_id: selectedCategory || product.category_id,
      short_description: getValue("shortDesc"),
      description: getValue("description"),
      base_price: basePrice ? parseInt(basePrice) : product.base_price,
      discount_price: discountPrice ? parseInt(discountPrice) : null,
      weight: weight ? parseInt(weight) : null,
      shelf_life: getValue("shelfLife"),
      ingredients: getValue("ingredients"),
      is_pre_order_only: isPreorder,
      is_featured: isFeatured,
    };

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", params.id as string);

    setIsSaving(false);
    
    if (error) {
      alert("Gagal menyimpan perubahan: " + error.message);
    } else {
      router.push("/products");
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.price) return alert("Nama dan Harga varian wajib diisi!");
    setIsSavingVariant(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("product_variants").insert({
      product_id: params?.id,
      name: newVariant.name,
      type: newVariant.type,
      price: parseInt(newVariant.price),
      stock: 0,
      sku: newVariant.sku || null
    }).select().single();
    
    setIsSavingVariant(false);
    if (error) return alert("Gagal menambah varian: " + error.message);
    setVariants([...variants, data]);
    setNewVariant({ name: "", type: "SIZE", price: "", sku: "" });
  };

  const handleDeleteVariant = async (vid: string) => {
    if (!confirm("Hapus varian ini?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("product_variants").delete().eq("id", vid);
    if (error) return alert("Gagal menghapus varian: " + error.message);
    setVariants(variants.filter(v => v.id !== vid));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/products" />}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Edit: {product.name}</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Produk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nama Produk *</Label><Input id="name" defaultValue={product.name} className="mt-1.5" required /></div>
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
            <div><Label htmlFor="shortDesc">Deskripsi Singkat</Label><Input id="shortDesc" defaultValue={product.short_description || ""} className="mt-1.5" /></div>
            <div><Label htmlFor="description">Deskripsi Lengkap</Label><Textarea id="description" defaultValue={product.description || ""} className="mt-1.5" rows={4} /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label htmlFor="basePrice">Harga Dasar (Rp) *</Label><Input id="basePrice" type="number" defaultValue={product.base_price} className="mt-1.5" required /></div>
              <div><Label htmlFor="discountPrice">Harga Diskon (Rp)</Label><Input id="discountPrice" type="number" defaultValue={product.discount_price || ""} className="mt-1.5" /></div>
              <div><Label htmlFor="weight">Berat (gram)</Label><Input id="weight" type="number" defaultValue={product.weight || ""} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Foto Produk</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Klik atau drag foto baru ke sini</p>
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
                        <TableCell>Rp {v.price.toLocaleString("id-ID")}</TableCell>
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
              <div><Label htmlFor="shelfLife">Daya Tahan</Label><Input id="shelfLife" defaultValue={product.shelf_life || ""} className="mt-1.5" /></div>
              <div><Label htmlFor="ingredients">Bahan</Label><Input id="ingredients" defaultValue={product.ingredients || ""} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3"><Switch id="preorder" checked={isPreorder} onCheckedChange={setIsPreorder} /><Label htmlFor="preorder">Pre-Order Only</Label></div>
            <div className="flex items-center gap-3"><Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} /><Label htmlFor="featured">Tampilkan di Best Seller</Label></div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" render={<Link href="/products" />}>Batal</Button>
          <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground min-w-[150px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
