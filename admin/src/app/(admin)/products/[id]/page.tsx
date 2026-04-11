"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@shared/constants";
import { createClient } from "@/lib/supabase/client";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!params?.id) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id as string)
        .single();
      
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [params?.id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!product) return <div className="text-center py-20 text-muted-foreground">Produk tidak ditemukan.</div>;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement actual save mutation
    setTimeout(() => {
      setIsSaving(false);
      router.push("/products");
    }, 1000);
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
                <Select defaultValue={product.category_id}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
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
          <CardHeader><CardTitle className="text-base">Detail Tambahan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="shelfLife">Daya Tahan</Label><Input id="shelfLife" defaultValue={product.shelf_life || ""} className="mt-1.5" /></div>
              <div><Label htmlFor="ingredients">Bahan</Label><Input id="ingredients" defaultValue={product.ingredients || ""} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3"><Switch id="preorder" defaultChecked={product.is_pre_order_only} /><Label htmlFor="preorder">Pre-Order Only</Label></div>
            <div className="flex items-center gap-3"><Switch id="featured" defaultChecked={product.is_featured} /><Label htmlFor="featured">Tampilkan di Best Seller</Label></div>
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
