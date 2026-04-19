"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Check, X, Loader2, MessageSquareReply, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Balasan State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        product:products(name)
      `)
      .order("is_approved", { ascending: true }) // Sorortir fitur: Pending di posisi awal
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memanggil data ulasan", { description: error.message });
    }
    setReviews(data || []);
    setLoading(false);
  }

  // 1. Fitur Optimistic Moderasi (Sembunyikan/Terbitkan)
  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    
    // Optimistic Update Lokal (0 detik delay)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: nextStatus } : r));

    // Kirim perubahan di latar belakang
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: nextStatus })
      .eq("id", id);

    if (error) {
      // Revert ke status awal jika pengiriman jaringan gagal
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: currentStatus } : r));
      toast.error("Gagal mengubah publisitas ulasan", { description: error.message });
    } else {
      toast.success(nextStatus ? "Ulasan berhasil diterbitkan" : "Ulasan disembunyikan dari aplikasi");
    }
  };

  // 2. Fungsi Komponen Modal Balasan
  const openReplyModal = (review: any) => {
    setSelectedReview(review);
    setReplyText(review.admin_reply || "");
    setReplyModalOpen(true);
  };

  const submitReply = async () => {
    if (!selectedReview) return;
    
    setIsSubmittingReply(true);
    const supabase = createClient();
    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from("reviews")
      .update({ 
        admin_reply: replyText,
        replied_at: timestamp
      })
      .eq("id", selectedReview.id);

    setIsSubmittingReply(false);

    if (error) {
      toast.error("Gagal mengirimkan balasan", { description: error.message });
      return;
    }

    toast.success("Balasan resmi Anda terkirim");
    setReviews(prev => prev.map(r => 
      r.id === selectedReview.id 
        ? { ...r, admin_reply: replyText, replied_at: timestamp } 
        : r
    ));
    setReplyModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const positiveCount = reviews.filter((r) => r.rating >= 4).length;
  const negativeCount = reviews.filter((r) => r.rating < 4).length;
  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderasi Review</h1>
          <p className="text-sm text-muted-foreground">Kelola persetujuan dan balas ulasan pelanggan.</p>
        </div>
      </div>

      {/* Tampilan Summary Metrik */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><Star className="h-8 w-8 mx-auto text-secondary mb-2" /><p className="text-2xl font-bold">{averageRating}</p><p className="text-sm text-muted-foreground">Rating Rata-rata</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><ThumbsUp className="h-8 w-8 mx-auto text-success mb-2" /><p className="text-2xl font-bold">{positiveCount}</p><p className="text-sm text-muted-foreground">Review Positif</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><ThumbsDown className="h-8 w-8 mx-auto text-destructive mb-2" /><p className="text-2xl font-bold">{negativeCount}</p><p className="text-sm text-muted-foreground">Perlu Perhatian</p></CardContent></Card>
        <Card className="bg-primary/5 border-primary/20"><CardContent className="pt-6 text-center"><div className="relative w-8 h-8 mx-auto mb-2"><MessageSquareReply className="absolute inset-0 h-8 w-8 text-primary" />{pendingCount > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span></span>}</div><p className="text-2xl font-bold text-primary">{pendingCount}</p><p className="text-sm text-muted-foreground font-medium">Belum Diulas</p></CardContent></Card>
      </div>

      {/* List / Daftar Review */}
      <div className="space-y-4">
        {reviews.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">Belum ada review produk sejauh ini.</div>
        )}

        {reviews.map((review) => {
          const productName = review.product?.[0]?.name || review.product?.name || "Produk Varian";
          
          return (
            <Card key={review.id} className={`transition-colors ${!review.is_approved ? "border-l-4 border-l-warning shadow-sm" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Blok Konten Kiri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-base text-card-foreground">{review.customer_name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{formatDate(review.created_at)}</span>
                      {!review.is_approved && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>}
                    </div>
                    
                    <p className="text-xs font-semibold text-primary/80 mb-3 bg-primary/5 w-fit px-2 py-0.5 rounded-md">Beli: {productName}</p>
                    <p className="text-sm text-foreground/90 leading-relaxed max-w-3xl">{review.comment}</p>
                    
                    {/* Munculkan balasan jika sudah ada balasannya */}
                    {review.admin_reply && (
                      <div className="mt-4 bg-muted/50 border-l-2 border-l-primary p-3 rounded-r-md text-sm">
                        <div className="flex justify-between items-end mb-1">
                          <p className="font-semibold text-xs text-primary">Balasan Anda (Tim Dapoer Ajung)</p>
                          <span className="text-[10px] text-muted-foreground">{review.replied_at ? formatDate(review.replied_at) : ""}</span>
                        </div>
                        <p className="text-muted-foreground mt-1">{review.admin_reply}</p>
                      </div>
                    )}
                  </div>

                  {/* Blok Aksi Kanan */}
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      onClick={() => toggleApproval(review.id, review.is_approved)}
                      className={`w-32 justify-start ${review.is_approved ? 'text-muted-foreground hover:text-destructive' : 'text-success hover:bg-success/10 border-success/30'}`}
                    >
                      {review.is_approved ? <><EyeOff className="h-4 w-4 mr-2" /> Sembunyikan</> : <><Check className="h-4 w-4 mr-2" /> Terbitkan</>}
                    </Button>
                    <Button 
                      onClick={() => openReplyModal(review)}
                      variant={review.admin_reply ? "secondary" : "default"}
                      className="w-28"
                    >
                      <MessageSquareReply className="h-4 w-4 mr-2" />
                      {review.admin_reply ? "Edit Balas" : "Balas"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Balasan */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Balas Ulasan</DialogTitle>
            <DialogDescription>
              Tulis tanggapan untuk <span className="font-semibold text-foreground">{selectedReview?.customer_name}</span>. Balasan ini akan terlihat oleh pengunjung secara publik.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="py-4">
              <div className="bg-muted p-3 rounded-md mb-4 border border-input">
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: selectedReview.rating || 0 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm italic text-muted-foreground">&quot;{selectedReview.comment}&quot;</p>
              </div>
              
              <div className="space-y-2">
                <Textarea 
                  placeholder="Terima kasih Kak atas ulasannya..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[120px] resize-none focus-visible:ring-primary/50"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setReplyModalOpen(false)} disabled={isSubmittingReply}>
              Batal
            </Button>
            <Button onClick={submitReply} disabled={isSubmittingReply || !replyText.trim()}>
              {isSubmittingReply ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
              ) : (
                "Kirim Balasan Resmi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
