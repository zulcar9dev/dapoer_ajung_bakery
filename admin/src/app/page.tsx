import { STORE_INFO } from "@shared/constants";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground text-2xl font-bold mb-4">
          DA
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {STORE_INFO.storeName}
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary-dark transition-colors mt-4"
        >
          Masuk ke Dashboard →
        </a>
      </div>
    </main>
  );
}
