"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const supabase = createClient();
      const { data } = await supabase
        .from("reviews")
        .select(`
          *,
          product:products(name)
        `)
        .order("created_at", { ascending: false });

      setReviews(data || []);
      setLoading(false);
    }
    fetchReviews();
  }, []);

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

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Moderasi Review</h1><p className="text-sm text-muted-foreground">Kelola ulasan pelanggan.</p></div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 text-center"><Star className="h-8 w-8 mx-auto text-secondary mb-2" /><p className="text-2xl font-bold">{averageRating}</p><p className="text-sm text-muted-foreground">Rating Rata-rata</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><ThumbsUp className="h-8 w-8 mx-auto text-success mb-2" /><p className="text-2xl font-bold">{positiveCount}</p><p className="text-sm text-muted-foreground">Review Positif</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><ThumbsDown className="h-8 w-8 mx-auto text-destructive mb-2" /><p className="text-2xl font-bold">{negativeCount}</p><p className="text-sm text-muted-foreground">Perlu Ditanggapi</p></CardContent></Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => {
          const productName = review.product?.[0]?.name || review.product?.name || "Produk";
          return (
            <Card key={review.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{review.customer_name}</span>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`} />))}</div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                    </div>
                    <p className="text-xs text-primary mt-1">{productName}</p>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="outline" size="sm">Balas</Button>
                    <Badge variant="outline" className={review.is_approved ? "text-success border-success/20" : "text-warning border-warning/20"}>{review.is_approved ? "Approved" : "Pending"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
