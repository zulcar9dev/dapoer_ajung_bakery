"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { STORE_INFO } from "@shared/constants";
import { cn } from "@/lib/utils";

const FAQ_DATA = [
  {
    category: "Pemesanan",
    items: [
      {
        q: "Bagaimana cara memesan kue di Dapoer Ajung?",
        a: "Anda bisa memesan langsung melalui website kami. Pilih produk yang diinginkan, masukkan ke keranjang, lalu lanjutkan ke proses checkout. Anda juga bisa memesan via WhatsApp.",
      },
      {
        q: "Apakah bisa pre-order untuk acara besar?",
        a: "Ya, kami menerima pre-order untuk acara seperti pernikahan, ulang tahun, dan arisan. Silakan hubungi kami minimal 3 hari sebelumnya. Untuk pesanan dalam jumlah besar (>50 pcs), kami sarankan pesan 1 minggu sebelumnya.",
      },
      {
        q: "Berapa minimal pemesanan?",
        a: "Minimal pemesanan adalah Rp 25.000. Tidak ada batasan jumlah maksimal.",
      },
      {
        q: "Bisakah saya membatalkan pesanan?",
        a: "Pesanan bisa dibatalkan selama belum masuk proses produksi (status 'Dikonfirmasi'). Setelah masuk proses, pesanan tidak bisa dibatalkan.",
      },
    ],
  },
  {
    category: "Pembayaran",
    items: [
      {
        q: "Metode pembayaran apa saja yang tersedia?",
        a: "Kami menerima Transfer Bank (BRI & BNI), QRIS (bisa scan dari e-wallet manapun), dan Cash on Delivery (COD) untuk area Kota Gorontalo.",
      },
      {
        q: "Kapan batas waktu pembayaran?",
        a: "Untuk metode Transfer dan QRIS, batas waktu pembayaran adalah 2x24 jam setelah pesanan dikonfirmasi. Jika pembayaran melewati batas waktu, pesanan otomatis dibatalkan.",
      },
      {
        q: "Apakah ada biaya tambahan untuk COD?",
        a: "Tidak ada biaya tambahan untuk COD. Anda cukup membayar total pesanan plus ongkos kirim saat barang diterima.",
      },
    ],
  },
  {
    category: "Pengiriman",
    items: [
      {
        q: "Area mana saja yang bisa dijangkau pengiriman?",
        a: "Saat ini kami melayani pengiriman ke seluruh area Kota Gorontalo dan sekitarnya. Pengiriman dilakukan via kurir Grab, Gojek, atau Maxim.",
      },
      {
        q: "Berapa ongkos kirimnya?",
        a: "Ongkos kirim mengikuti tarif dari aplikasi kurir (Grab/Gojek/Maxim). Gratis ongkir untuk pesanan di atas Rp 200.000.",
      },
      {
        q: "Bisakah saya mengambil pesanan sendiri di toko?",
        a: `Ya, bisa! Pilih opsi "Ambil di Toko" saat checkout. Alamat toko kami di ${STORE_INFO.address}. Jam operasional: ${STORE_INFO.operatingHours.days}, ${STORE_INFO.operatingHours.open} - ${STORE_INFO.operatingHours.close}.`,
      },
      {
        q: "Bagaimana cara melacak pesanan saya?",
        a: 'Setelah pesanan dikonfirmasi, Anda akan menerima nomor pesanan. Gunakan fitur "Lacak Pesanan" di website kami untuk memantau status pesanan secara real-time.',
      },
    ],
  },
  {
    category: "Produk",
    items: [
      {
        q: "Berapa lama daya tahan kue?",
        a: "Daya tahan berbeda per produk: kue basah 2-3 hari (suhu ruang) atau 5-7 hari (kulkas), kue kering 2-4 minggu, dan roti 2-3 hari. Informasi detail ada di halaman masing-masing produk.",
      },
      {
        q: "Apakah produk mengandung bahan pengawet?",
        a: "Tidak. Semua produk kami dibuat fresh tanpa bahan pengawet. Karena itu, kami sarankan untuk mengonsumsi produk sesuai masa simpan yang tertera.",
      },
      {
        q: "Apakah ada informasi alergen?",
        a: "Ya, informasi alergen tertera di halaman detail setiap produk. Produk kami umumnya mengandung telur, tepung terigu, dan susu. Silakan periksa sebelum memesan.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-medium text-foreground pr-4 group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-sm text-muted-foreground leading-relaxed pl-0">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "FAQ" }]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-muted-foreground mt-2">
            Temukan jawaban atas pertanyaan umum seputar pemesanan, pembayaran,
            dan pengiriman.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {FAQ_DATA.map((section) => (
          <div
            key={section.category}
            className="bg-surface rounded-xl border border-border overflow-hidden"
          >
            <div className="p-5 bg-primary/5 border-b border-border">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {section.category}
              </h2>
            </div>
            <div className="px-5">
              {section.items.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Masih ada pertanyaan? Hubungi kami langsung.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              window.open(
                `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  "Halo Dapoer Ajung, saya ingin bertanya..."
                )}`,
                "_blank"
              )
            }
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
