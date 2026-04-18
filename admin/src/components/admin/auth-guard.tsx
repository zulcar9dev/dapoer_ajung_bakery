"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, _initialized, initialize } = useAuthStore();

  // Initialize auth hanya jika belum pernah diinisialisasi
  useEffect(() => {
    if (!_initialized) {
      initialize();
    }
  }, [_initialized, initialize]);

  // Redirect jika sudah diinisialisasi & tidak terautentikasi
  useEffect(() => {
    if (_initialized && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_initialized, isLoading, isAuthenticated, router]);

  // Fast-path: jika sudah authenticated, langsung render
  if (_initialized && isAuthenticated) {
    return <>{children}</>;
  }

  // Loading spinner saat menunggu inisialisasi
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {!_initialized ? "Memuat..." : "Mengalihkan ke halaman login..."}
        </p>
      </div>
    </div>
  );
}
