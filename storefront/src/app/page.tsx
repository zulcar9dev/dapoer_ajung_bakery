import { STORE_INFO } from "@shared/constants";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      {/* Hero Section Placeholder */}
      <div className="text-center space-y-6 px-4">
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-dark tracking-tight">
          {STORE_INFO.storeName}
        </h1>
        <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {STORE_INFO.tagline}
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary-dark transition-colors"
          >
            Lihat Produk
          </a>
          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-8 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-surface-dim transition-colors"
          >
            Tentang Kami
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-12">
          📍 {STORE_INFO.address} &bull; 🕐 {STORE_INFO.operatingHours.days}, {STORE_INFO.operatingHours.open} — {STORE_INFO.operatingHours.close}
        </p>
      </div>
    </main>
  );
}
