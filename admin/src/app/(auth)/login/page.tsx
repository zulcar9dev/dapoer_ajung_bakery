"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) return;

    setIsSubmitting(true);
    toast.loading("Mengecek kredensial akun...", { id: "login-toast" });
    
    const success = await login(email, password);
    setIsSubmitting(false);
    
    if (success) {
      toast.success("Otorisasi berhasil! Membuka dashboard...", { id: "login-toast", duration: 2500 });
      router.push("/");
    } else {
      toast.dismiss("login-toast");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo & Branding */}
      <div className="text-center mb-8">
        <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4 border-4 border-white">
          <img
            src="/images/logo.jpg"
            alt="Dapoer Ajung"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dapoer Ajung
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Admin Panel — Cookies & Bakery
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Masuk</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan email dan password Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@dapoerajung.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={isSubmitting || !email || !password}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Masuk
              </>
            )}
          </Button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Akun demo untuk testing:
          </p>
          <div className="space-y-2">
            {[
              { email: "ajung@dapoerajung.co.id", role: "Owner" },
              { email: "rahma@dapoerajung.co.id", role: "Staff" },
              { email: "deni@dapoerajung.co.id", role: "Kasir" },
            ].map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword("password123");
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs transition-colors text-left"
              >
                <span className="font-medium text-foreground">
                  {account.email}
                </span>
                <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                  {account.role}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Password: <code className="bg-muted px-1 py-0.5 rounded">password123</code>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        © 2026 Dapoer Ajung Cookies & Bakery. Gorontalo.
      </p>
    </div>
  );
}
