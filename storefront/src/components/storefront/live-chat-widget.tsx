"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, ChevronRight } from "lucide-react";
import { useChatStore } from "@/stores/use-chat-store";
import { cn } from "@/lib/utils";
import { STORE_INFO } from "@shared/constants";

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ViewState = "closed" | "launcher" | "chat";

export function LiveChatWidget() {
  const {
    messages,
    isTyping,
    sendMessage,
    unreadCount,
  } = useChatStore();

  const [view, setView] = useState<ViewState>("closed");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, view, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [view]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openLauncher = () => setView("launcher");
  const startChat = () => setView("chat");
  const close = () => setView("closed");

  return (
    <>
      {/* ═══ STATE 1: Vertical "Chat with us" tab on right edge ═══ */}
      <button
        onClick={openLauncher}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
          view !== "closed"
            ? "opacity-0 pointer-events-none translate-x-full"
            : "opacity-100 translate-x-0"
        )}
        aria-label="Buka chat"
      >
        <div className="flex items-center gap-2 bg-[#3A3A2E] text-white py-3 px-2 rounded-l-lg shadow-xl hover:shadow-2xl hover:pr-3 transition-all duration-300 cursor-pointer writing-vertical">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
            Hubungi Kami
          </span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* ═══ Overlay (for mobile) ═══ */}
      {view !== "closed" && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:bg-transparent lg:backdrop-blur-none lg:pointer-events-none"
          onClick={close}
        />
      )}

      {/* ═══ Right Sidebar Panel ═══ */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[360px] max-w-[90vw] bg-card shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          view !== "closed" ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ═══ STATE 2: Launcher view (Welcome + Start chat + WhatsApp) ═══ */}
        {view === "launcher" && (
          <div className="flex flex-col h-full">
            {/* Welcome section */}
            <div className="px-6 pt-10 pb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Selamat Datang 👋
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Ada yang bisa kami bantu hari ini?
              </p>
            </div>

            {/* Agent card + Start chat */}
            <div className="px-6 flex-1">
              <div className="border border-border rounded-xl overflow-hidden">
                {/* Agent info */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Dapoer Ajung
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Customer Support • Online
                    </p>
                  </div>
                  {/* Online indicator */}
                  <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                </div>

                {/* Start chat button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={startChat}
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold text-sm py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mulai Chat
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-6 mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Hubungi kami juga melalui
                </p>
              </div>

              {/* WhatsApp option */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  "Halo Dapoer Ajung, saya ingin bertanya tentang produk kue."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#25D366]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    WhatsApp
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chat via WhatsApp
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>

              {/* Instagram DM option */}
              <a
                href={`https://instagram.com/${STORE_INFO.socialMedia?.instagram || "dapoerajung"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors group mt-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#DD2A7B]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Instagram
                  </p>
                  <p className="text-xs text-muted-foreground">
                    DM via Instagram
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border mt-auto">
              <p className="text-[11px] text-muted-foreground text-center">
                Dapoer Ajung Cookies & Bakery • Gorontalo
              </p>
            </div>
          </div>
        )}

        {/* ═══ STATE 3: Live Chat conversation view ═══ */}
        {view === "chat" && (
          <div className="flex flex-col h-full">
            {/* Chat header */}
            <div className="bg-foreground text-background px-5 py-4 flex items-center gap-3 shrink-0">
              <button
                onClick={() => setView("launcher")}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Kembali"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                DA
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Dapoer Ajung</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[11px] opacity-80">Online</span>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {/* Date label */}
              <div className="flex justify-center">
                <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Hari ini
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "customer"
                      ? "justify-end"
                      : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm",
                      msg.sender === "customer"
                        ? "bg-foreground text-background rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    )}
                  >
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] mt-1 text-right",
                        msg.sender === "customer"
                          ? "text-background/50"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick reply chips (only shown early) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2.5 border-t border-border bg-card flex gap-2 flex-wrap shrink-0">
                {[
                  "Mau pesan kue 🎂",
                  "Cek pesanan",
                  "Promo?",
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-3 bg-card shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0",
                    input.trim()
                      ? "bg-foreground text-background hover:opacity-90 shadow-md"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
