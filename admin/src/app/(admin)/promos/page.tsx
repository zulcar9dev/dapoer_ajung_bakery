"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, Calendar, Percent, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { formatRupiah, formatDate } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function PromosPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [deletingVoucher, setDeletingVoucher] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "FIXED",
    value: "",
    min_order_amount: "0",
    max_discount: "",
    usage_limit: "0",
    is_active: true,
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });

  const fetchVouchers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });

    setVouchers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "FIXED",
      value: "",
      min_order_amount: "0",
      max_discount: "",
      usage_limit: "0",
      is_active: true,
      start_date: undefined,
      end_date: undefined,
    });
    setEditingVoucher(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (voucher: any) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description || "",
      type: voucher.type,
      value: voucher.value.toString(),
      min_order_amount: voucher.min_order_amount.toString(),
      max_discount: voucher.max_discount ? voucher.max_discount.toString() : "",
      usage_limit: voucher.usage_limit.toString(),
      is_active: voucher.is_active,
      start_date: voucher.start_date ? new Date(voucher.start_date) : undefined,
      end_date: voucher.end_date ? new Date(voucher.end_date) : undefined,
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingVoucher) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("vouchers").delete().eq("id", deletingVoucher.id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Gagal menghapus voucher: " + error.message);
      } else {
        toast.success("Voucher berhasil dihapus");
        await fetchVouchers();
      }
    } catch (err: any) {
      console.error("Delete exception:", err);
      toast.error("Terjadi kesalahan sistem saat menghapus");
    } finally {
      setIsDeleting(false);
      setDeletingVoucher(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    
    const payload = {
      code: formData.code.toUpperCase(),
      name: formData.name,
      description: formData.description,
      type: formData.type,
      value: parseInt(formData.value),
      min_order_amount: parseInt(formData.min_order_amount),
      max_discount: formData.max_discount ? parseInt(formData.max_discount) : null,
      usage_limit: parseInt(formData.usage_limit),
      is_active: formData.is_active,
      start_date: formData.start_date ? formData.start_date.toISOString() : null,
      end_date: formData.end_date ? formData.end_date.toISOString() : null,
    };

    let error;
    if (editingVoucher) {
      const { error: err } = await supabase
        .from("vouchers")
        .update(payload)
        .eq("id", editingVoucher.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("vouchers")
        .insert(payload);
      error = err;
    }

    if (error) {
      toast.error("Gagal menyimpan voucher: " + error.message);
      setIsSubmitting(false);
    } else {
      toast.success(`Voucher berhasil ${editingVoucher ? "diperbarui" : "dibuat"}`);
      setIsDialogOpen(false);
      resetForm();
      fetchVouchers();
      setIsSubmitting(false);
    }
  };

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
        <div>
          <h1 className="text-2xl font-bold">Promo & Voucher</h1>
          <p className="text-sm text-muted-foreground">Kelola kode voucher dan promosi.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" />
          Buat Voucher
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Ticket className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{vouchers.length}</p>
            <p className="text-sm text-muted-foreground">Total Voucher</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Percent className="h-8 w-8 mx-auto text-warning mb-2" />
            <p className="text-2xl font-bold">{totalUsed}</p>
            <p className="text-sm text-muted-foreground">Digunakan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Voucher</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Min. Order</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold text-sm">{v.code}</TableCell>
                  <TableCell className="text-sm">
                    {v.type === "PERCENTAGE" ? `${v.value}%` : formatRupiah(v.value)}
                    {v.max_discount ? ` (maks. ${formatRupiah(v.max_discount)})` : ""}
                  </TableCell>
                  <TableCell className="text-sm">{formatRupiah(v.min_order_amount)}</TableCell>
                  <TableCell className="text-sm">{v.used_count}/{v.usage_limit || "∞"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {v.start_date ? formatDate(v.start_date) : "-"} — {v.end_date ? formatDate(v.end_date) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={v.is_active ? "text-success border-success/20" : "text-muted-foreground"}>
                      {v.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(v)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-primary hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingVoucher(v)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vouchers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Belum ada voucher.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingVoucher ? "Edit Voucher" : "Buat Voucher Baru"}</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk {editingVoucher ? "memperbarui" : "membuat"} voucher promo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Kode Voucher</Label>
                  <Input 
                    id="code" 
                    placeholder="E.g. HEMAT20" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Promo</Label>
                  <Input 
                    id="name" 
                    placeholder="E.g. Diskon Awal Tahun" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea 
                  id="description" 
                  placeholder="Opsional" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipe Diskon</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({...formData, type: val || "FIXED"})}
                  >
                    <SelectTrigger id="type" className="w-full">
                      <span className="flex-1 text-left block truncate">
                        {formData.type === "FIXED" ? "Nominal" : 
                         formData.type === "PERCENTAGE" ? "Persentase (%)" : "Pilih tipe diskon"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED">Nominal</SelectItem>
                      <SelectItem value="PERCENTAGE">Persentase (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Nilai Diskon</Label>
                  <Input 
                    id="value" 
                    type="number"
                    placeholder={formData.type === "PERCENTAGE" ? "E.g. 10" : "E.g. 50000"} 
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="min_order">Min. Pembelian (Rp)</Label>
                  <Input 
                    id="min_order" 
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({...formData, min_order_amount: e.target.value})}
                    required
                  />
                </div>
                {formData.type === "PERCENTAGE" && (
                  <div className="grid gap-2">
                    <Label htmlFor="max_discount">Maks. Diskon (Rp)</Label>
                    <Input 
                      id="max_discount" 
                      type="number"
                      placeholder="E.g. 50000 (Kosongkan jika tak terbatas)"
                      value={formData.max_discount}
                      onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="usage_limit">Limit Penggunaan</Label>
                  <Input 
                    id="usage_limit" 
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">Isi 0 untuk tanpa batas.</p>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch 
                    id="active" 
                    checked={formData.is_active}
                    onCheckedChange={(val) => setFormData({...formData, is_active: val})}
                  />
                  <Label htmlFor="active">Aktifkan Voucher</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Mulai Berlaku</Label>
                  <DateTimePicker
                    value={formData.start_date}
                    onChange={(date) => setFormData({...formData, start_date: date})}
                    placeholder="Pilih tanggal mulai"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Berakhir</Label>
                  <DateTimePicker
                    value={formData.end_date}
                    onChange={(date) => setFormData({...formData, end_date: date})}
                    placeholder="Pilih tanggal berakhir"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingVoucher ? "Simpan Perubahan" : "Buat Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deletingVoucher} onOpenChange={(open) => { if (!open) setDeletingVoucher(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Voucher</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus voucher <strong>{deletingVoucher?.code}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeletingVoucher(null)}>Batal</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

