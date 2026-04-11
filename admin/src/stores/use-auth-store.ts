"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_USERS } from "@shared/mock-data";
import type { User } from "@shared/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Mock authentication — match by email
        const foundUser = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive
        );

        if (foundUser) {
          set({ user: foundUser, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: "Email atau password salah." });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "dapoer-ajung-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
