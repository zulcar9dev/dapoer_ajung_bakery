"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@shared/constants";
import { MOCK_PRODUCTS } from "@shared/mock-data";

export default function EditProductPage() {
  const params = useParams();
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);

  if (!product) return <div className="text-center py-20 text-muted-foreground">Produk tidak ditemukan.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/products" />}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Edit: {product.name}</h1>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Produk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nama Produk *</Label><Input id="name" defaultValue={product.name} className="mt-1.5" /></div>
              <div><Label htmlFor="category">Kategori *</Label>
                <Select defaultValue={product.categoryId}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label htmlFor="shortDesc">Deskripsi Singkat</Label><Input id="shortDesc" defaultValue={product.shortDescription} className="mt-1.5" /></div>
            <div><Label htmlFor="description">Deskripsi Lengkap</Label><Textarea id="description" defaultValue={product.description} className="mt-1.5" rows={4} /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label htmlFor="basePrice">Harga Dasar (Rp)</Label><Input id="basePrice" type="number" defaultValue={product.basePrice} className="mt-1.5" /></div>
              <div><Label htmlFor="discountPrice">Harga Diskon (Rp)</Label><Input id="discountPrice" type="number" defaultValue={product.discountPrice ?? ""} className="mt-1.5" /></div>
              <div><Label htmlFor="weight">Berat (gram)</Label><Input id="weight" type="number" defaultValue={product.weight} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Foto Produk</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Klik atau drag foto baru</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Detail Tambahan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="shelfLife">Daya Tahan</Label><Input id="shelfLife" defaultValue={product.shelfLife ?? ""} className="mt-1.5" /></div>
              <div><Label htmlFor="ingredients">Bahan</Label><Input id="ingredients" defaultValue={product.ingredients ?? ""} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3"><Switch id="preorder" defaultChecked={product.isPreOrderOnly} /><Label htmlFor="preorder">Pre-Order Only</Label></div>
            <div className="flex items-center gap-3"><Switch id="featured" defaultChecked={product.isFeatured} /><Label htmlFor="featured">Tampilkan di Best Seller</Label></div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" render={<Link href="/products" />}>Batal</Button>
          <Button type="submit" className="bg-primary text-primary-foreground">Simpan Perubahan</Button>
        </div>
      </form>
    </div>
  );
}
