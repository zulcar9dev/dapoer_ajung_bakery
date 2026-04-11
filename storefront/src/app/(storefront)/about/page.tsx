import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Phone, Mail, Clock, Award, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { STORE_INFO } from "@shared/constants";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita Dapoer Ajung Cookies & Bakery — Handmade with Love in Gorontalo sejak 1990. Kenali sejarah, misi, dan nilai-nilai kami.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Cinta dalam Setiap Gigitan",
    description:
      "Setiap produk dibuat dengan penuh cinta dan perhatian terhadap detail, menggunakan resep keluarga yang autentik.",
  },
  {
    icon: Award,
    title: "Kualitas Tanpa Kompromi",
    description:
      "Kami hanya menggunakan bahan-bahan terbaik dan teknik tradisional yang telah disempurnakan selama puluhan tahun.",
  },
  {
    icon: Users,
    title: "Melayani Masyarakat",
    description:
      "Dari rumah ke rumah, dari generasi ke generasi — kami bangga menjadi bagian dari momen bahagia keluarga Gorontalo.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Tentang Kami" }]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Tentang Kami
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            {STORE_INFO.storeName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {STORE_INFO.tagline}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-dim">
              <Image
                src="/images/about-bakery.jpg"
                alt="Dapoer Ajung Bakery Gorontalo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg">
                <p className="text-3xl font-heading font-bold">1990</p>
                <p className="text-xs opacity-90">Tahun Berdiri</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Cerita Kami
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground mt-2 mb-4">
                Dari Dapur Keluarga ke Hati Masyarakat
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Berawal dari tahun 1990, Dapoer Ajung lahir dari dapur kecil
                  sebuah keluarga di Kota Gorontalo. Dengan resep Bingka Kentang
                  yang diwariskan dari ibu dan nenek, kami mulai memasak dengan
                  satu tujuan sederhana: membuat kue yang membawa kebahagiaan.
                </p>
                <p>
                  Seiring berjalannya waktu, cita rasa autentik Gorontalo yang
                  menjadi ciri khas kami mulai dikenal luas. Dari tetangga ke
                  tetangga, dari mulut ke mulut — Dapoer Ajung tumbuh menjadi
                  bakery yang dipercaya oleh ribuan keluarga di Gorontalo.
                </p>
                <p>
                  Kini, setelah lebih dari 30 tahun, kami terus berkomitmen
                  menghadirkan produk terbaik dengan cinta yang sama seperti hari
                  pertama. Setiap kue, roti, dan hampers yang kami buat adalah
                  wujud penghargaan terhadap warisan kuliner Gorontalo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Nilai-Nilai Kami
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground mt-2">
              Yang Membuat Kami Berbeda
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-background border border-border"
              >
                <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "36+", label: "Tahun Pengalaman" },
              { value: "15+", label: "Varian Produk" },
              { value: "10K+", label: "Pelanggan Puas" },
              { value: "4.9", label: "Rating Google" },
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <p className="text-4xl font-heading font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8">
            Kunjungi Kami
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-5 bg-surface rounded-xl border border-border text-center">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="font-medium text-sm">{STORE_INFO.address}</p>
            </div>
            <div className="p-5 bg-surface rounded-xl border border-border text-center">
              <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="font-medium text-sm">{STORE_INFO.phone}</p>
            </div>
            <div className="p-5 bg-surface rounded-xl border border-border text-center">
              <Clock className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="font-medium text-sm">
                {STORE_INFO.operatingHours.days}
              </p>
              <p className="text-xs text-muted-foreground">
                {STORE_INFO.operatingHours.open} - {STORE_INFO.operatingHours.close}
              </p>
            </div>
          </div>
          <Button
            className="mt-8 bg-primary text-primary-foreground hover:bg-primary-dark"
            render={<Link href="/products" />}
          >
            Mulai Belanja
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
