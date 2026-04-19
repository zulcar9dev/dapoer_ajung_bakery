"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// App-level user profile (from our `users` table)
interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "OWNER" | "STAFF" | "KASIR";
  avatar: string | null;
  is_active: boolean;
}

interface AuthState {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _initialized: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

const supabase = createClient();

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  _initialized: false,

  initialize: async () => {
    // Fast-path: jika sudah pernah diinisialisasi, skip seluruhnya
    if (get()._initialized) return;

    try {
      // getSession() membaca dari local storage — CEPAT, tidak roundtrip ke server
      // Middleware sudah memvalidasi user via getUser(), jadi aman.
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile dari tabel users (hanya 1x saat pertama)
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile && profile.is_active) {
          set({
            supabaseUser: session.user,
            user: profile as AppUser,
            isAuthenticated: true,
            isLoading: false,
            _initialized: true,
          });
          return;
        }
      }

      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false, _initialized: true });
    } catch {
      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false, _initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false, error: "Email atau password salah." });
      return false;
    }

    if (data.user) {
      // Fetch profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        set({ isLoading: false, error: "Akun tidak ditemukan di sistem." });
        await supabase.auth.signOut();
        return false;
      }

      if (!profile.is_active) {
        set({ isLoading: false, error: "Akun Anda sudah dinonaktifkan." });
        await supabase.auth.signOut();
        return false;
      }

      set({
        supabaseUser: data.user,
        user: profile as AppUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        _initialized: true,
      });
      return true;
    }

    set({ isLoading: false, error: "Terjadi kesalahan saat login." });
    return false;
  },

  logout: async () => {
    // 1. Optimistic Update: Langsung hapus state lokal untuk merender ulang UI seketika
    set({ user: null, supabaseUser: null, isAuthenticated: false, error: null, _initialized: true });
    
    // 2. Tarik proses jaringan (network request) ke background
    supabase.auth.signOut().catch(console.error);
  },

  clearError: () => {
    set({ error: null });
  },
}));
