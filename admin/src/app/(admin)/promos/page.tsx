"use client";

import { Ticket, Plus, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_VOUCHERS } from "@shared/mock-data";
import { formatRupiah, formatDate } from "@shared/utils";

export default function PromosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Promo & Voucher</h1><p className="text-sm text-muted-foreground">Kelola kode voucher dan promosi.</p></div>
        <Button className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Buat Voucher</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center"><Ticket className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{MOCK_VOUCHERS.length}</p><p className="text-sm text-muted-foreground">Total Voucher</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Calendar className="h-8 w-8 mx-auto text-success mb-2" /><p className="text-2xl font-bold">{MOCK_VOUCHERS.filter((v) => v.isActive).length}</p><p className="text-sm text-muted-foreground">Aktif</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Percent className="h-8 w-8 mx-auto text-warning mb-2" /><p className="text-2xl font-bold">{MOCK_VOUCHERS.reduce((a, v) => a + v.usedCount, 0)}</p><p className="text-sm text-muted-foreground">Digunakan</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daftar Voucher</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Diskon</TableHead><TableHead>Min. Order</TableHead><TableHead>Penggunaan</TableHead><TableHead>Periode</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {MOCK_VOUCHERS.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold text-sm">{v.code}</TableCell>
                  <TableCell className="text-sm">{v.type === "PERCENTAGE" ? `${v.value}%` : formatRupiah(v.value)}{v.maxDiscount ? ` (maks. ${formatRupiah(v.maxDiscount)})` : ""}</TableCell>
                  <TableCell className="text-sm">{formatRupiah(v.minOrderAmount)}</TableCell>
                  <TableCell className="text-sm">{v.usedCount}/{v.usageLimit ?? "∞"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(v.startDate)} — {formatDate(v.endDate)}</TableCell>
                  <TableCell><Badge variant="outline" className={v.isActive ? "text-success border-success/20" : "text-muted-foreground"}>{v.isActive ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
