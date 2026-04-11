"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, Calendar, Percent, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah, formatDate } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

export default function PromosPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVouchers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      setVouchers(data || []);
      setLoading(false);
    }
    fetchVouchers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCount = vouchers.filter((v) => v.is_active).length;
  const totalUsed = vouchers.reduce((a, v) => a + (v.used_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Promo & Voucher</h1><p className="text-sm text-muted-foreground">Kelola kode voucher dan promosi.</p></div>
        <Button className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Buat Voucher</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center"><Ticket className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">{vouchers.length}</p><p className="text-sm text-muted-foreground">Total Voucher</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Calendar className="h-8 w-8 mx-auto text-success mb-2" /><p className="text-2xl font-bold">{activeCount}</p><p className="text-sm text-muted-foreground">Aktif</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><Percent className="h-8 w-8 mx-auto text-warning mb-2" /><p className="text-2xl font-bold">{totalUsed}</p><p className="text-sm text-muted-foreground">Digunakan</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daftar Voucher</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Diskon</TableHead><TableHead>Min. Order</TableHead><TableHead>Penggunaan</TableHead><TableHead>Periode</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold text-sm">{v.code}</TableCell>
                  <TableCell className="text-sm">{v.type === "PERCENTAGE" ? `${v.value}%` : formatRupiah(v.value)}{v.max_discount ? ` (maks. ${formatRupiah(v.max_discount)})` : ""}</TableCell>
                  <TableCell className="text-sm">{formatRupiah(v.min_order_amount)}</TableCell>
                  <TableCell className="text-sm">{v.used_count}/{v.usage_limit ?? "∞"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(v.start_date)} — {formatDate(v.end_date)}</TableCell>
                  <TableCell><Badge variant="outline" className={v.is_active ? "text-success border-success/20" : "text-muted-foreground"}>{v.is_active ? "Aktif" : "Nonaktif"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
