"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUIState {
  isSidebarCollapsed: boolean;
  isSidebarPinned: boolean;
  isMobileSidebarOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<AdminUIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isSidebarPinned: false,
      isMobileSidebarOpen: false,

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),
      setSidebarPinned: (pinned) =>
        set({ isSidebarPinned: pinned }),

      toggleMobileSidebar: () =>
        set((state) => ({
          isMobileSidebarOpen: !state.isMobileSidebarOpen,
        })),
      setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
    }),
    {
      name: "dapoer-ajung-admin-ui",
    }
  )
);
