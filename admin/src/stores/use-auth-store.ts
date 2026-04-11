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

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile from our users table
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
          });
          return;
        }
      }

      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ user: null, supabaseUser: null, isAuthenticated: false, isLoading: false });
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
      });
      return true;
    }

    set({ isLoading: false, error: "Terjadi kesalahan saat login." });
    return false;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, supabaseUser: null, isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
