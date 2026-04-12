"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

export interface Notification {
  id: string;
  type: "NEW_ORDER" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEW_REVIEW" | "NEW_CHAT";
  title: string;
  message: string;
  reference_id: string | null;
  reference_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  subscribeRealtime: () => void;
  unsubscribeRealtime: () => void;
}

const supabase = createClient();
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: true,

  fetchNotifications: async () => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data) {
      const unread = data.filter((n: Notification) => !n.is_read).length;
      set({ notifications: data as Notification[], unreadCount: unread, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    const unreadIds = get()
      .notifications.filter((n) => !n.is_read)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
  },

  subscribeRealtime: () => {
    if (realtimeChannel) return;

    realtimeChannel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          set((state) => ({
            notifications: [newNotif, ...state.notifications].slice(0, 30),
            unreadCount: state.unreadCount + 1,
          }));
        }
      )
      .subscribe();
  },

  unsubscribeRealtime: () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  },
}));
