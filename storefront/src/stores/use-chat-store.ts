"use client";

import { create } from "zustand";

export interface LiveChatMessage {
  id: string;
  text: string;
  sender: "customer" | "admin";
  timestamp: Date;
}

interface ChatStore {
  isOpen: boolean;
  messages: LiveChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  markAllRead: () => void;
}

const INITIAL_MESSAGES: LiveChatMessage[] = [
  {
    id: "sys-1",
    text: "Halo! 👋 Selamat datang di Dapoer Ajung. Ada yang bisa kami bantu?",
    sender: "admin",
    timestamp: new Date(Date.now() - 60_000),
  },
];

// Simulated auto-reply responses
const AUTO_REPLIES = [
  "Terima kasih atas pertanyaannya! Kami akan segera membalas. 😊",
  "Baik kak, mohon tunggu sebentar ya, kami cek dulu.",
  "Untuk informasi lebih lanjut, bisa langsung cek di halaman Produk kami ya kak!",
  "Noted kak! Admin kami akan segera membantu. 🙏",
  "Terima kasih sudah menghubungi Dapoer Ajung! Pesanan kak sedang kami proses.",
];

let replyIndex = 0;

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  messages: INITIAL_MESSAGES,
  unreadCount: 1,
  isTyping: false,

  toggleChat: () => {
    const wasOpen = get().isOpen;
    set({ isOpen: !wasOpen });
    if (!wasOpen) {
      set({ unreadCount: 0 });
    }
  },

  openChat: () => set({ isOpen: true, unreadCount: 0 }),
  closeChat: () => set({ isOpen: false }),

  markAllRead: () => set({ unreadCount: 0 }),

  sendMessage: (text: string) => {
    const newMsg: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: "customer",
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));

    // Simulate admin typing + auto reply
    set({ isTyping: true });

    setTimeout(() => {
      const reply: LiveChatMessage = {
        id: `reply-${Date.now()}`,
        text: AUTO_REPLIES[replyIndex % AUTO_REPLIES.length],
        sender: "admin",
        timestamp: new Date(),
      };
      replyIndex++;

      set((state) => ({
        messages: [...state.messages, reply],
        isTyping: false,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }));
    }, 1500 + Math.random() * 1500);
  },
}));
