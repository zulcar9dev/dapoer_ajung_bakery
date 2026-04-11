"use client";

import { Store, Clock, MapPin, Phone, Mail, Save, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STORE_INFO } from "@shared/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-2xl font-bold">Pengaturan Toko</h1><p className="text-sm text-muted-foreground">Konfigurasi profil dan informasi toko.</p></div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Store Profile */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" />Profil Toko</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Nama Toko</Label><Input defaultValue={STORE_INFO.storeName} className="mt-1.5" /></div>
              <div><Label>Tagline</Label><Input defaultValue={STORE_INFO.tagline} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" />Kontak</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Telepon</Label><Input defaultValue={STORE_INFO.phone} className="mt-1.5" /></div>
              <div><Label>WhatsApp</Label><Input defaultValue={STORE_INFO.whatsapp} className="mt-1.5" /></div>
            </div>
            <div><Label>Email</Label><Input defaultValue={STORE_INFO.email} className="mt-1.5" /></div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />Alamat</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Alamat Lengkap</Label><Textarea defaultValue={STORE_INFO.address} className="mt-1.5" rows={2} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Kota</Label><Input defaultValue={STORE_INFO.city} className="mt-1.5" /></div>
              <div><Label>Provinsi</Label><Input defaultValue={STORE_INFO.province} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Jam Operasional</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Hari Kerja</Label><Input defaultValue={STORE_INFO.operatingHours.days} className="mt-1.5" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Jam Buka</Label><Input type="time" defaultValue={STORE_INFO.operatingHours.open} className="mt-1.5" /></div>
              <div><Label>Jam Tutup</Label><Input type="time" defaultValue={STORE_INFO.operatingHours.close} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Media Sosial</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Instagram</Label><Input defaultValue={STORE_INFO.socialMedia.instagram} className="mt-1.5" /></div>
            <div><Label>Facebook</Label><Input defaultValue={STORE_INFO.socialMedia.facebook} className="mt-1.5" /></div>
            <div><Label>TikTok</Label><Input defaultValue={STORE_INFO.socialMedia.tiktok} className="mt-1.5" /></div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" />Rekening Bank</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {STORE_INFO.bankAccounts.map((bank, i) => (
              <div key={bank.id}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label>Nama Bank</Label><Input defaultValue={bank.bankName} className="mt-1.5" /></div>
                  <div><Label>No. Rekening</Label><Input defaultValue={bank.accountNumber} className="mt-1.5" /></div>
                  <div><Label>Atas Nama</Label><Input defaultValue={bank.accountHolder} className="mt-1.5" /></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-1" />Simpan Pengaturan</Button>
        </div>
      </form>
    </div>
  );
}
