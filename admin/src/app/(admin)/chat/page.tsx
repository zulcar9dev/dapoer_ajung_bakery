"use client";

import { useEffect, useState, useRef } from "react";
import { Send, User, Loader2, Circle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Suara Notifikasi standar
const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3";

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // Melacak ID user yang online via Presence
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND);
  }, []);

  // Load Conversations
  useEffect(() => {
    async function loadConversations() {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (error) {
        toast.error("Gagal memuat percakapan");
      } else {
        setConversations(data || []);
        if (data && data.length > 0 && !selectedConvo) setSelectedConvo(data[0].id);
      }
      setLoadingList(false);
    }
    loadConversations();
  }, [supabase]);

  // Load messages when selectedConvo changes
  useEffect(() => {
    if (!selectedConvo) return;
    async function loadMessages() {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConvo)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Gagal memuat pesan");
      } else {
        setMessages(data || []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
      setLoadingMessages(false);
      
      // Clear unread count for this conversation
      await supabase.from("conversations").update({ unread_count: 0 }).eq("id", selectedConvo);
      setConversations((prev) => prev.map(c => c.id === selectedConvo ? { ...c, unread_count: 0 } : c));
    }
    loadMessages();
  }, [selectedConvo, supabase]);

  // Realtime: Postgres Changes + Presence
  useEffect(() => {
    const channel = supabase.channel("realtime-chat-room", {
      config: {
        presence: {
          key: "admin-session", // Admin session key
        },
      },
    });

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newMsg = payload.new;

          // Putar Suara Notifikasi (Setiap ada pesan masuk dari user lain)
          if (newMsg.sender_type !== "ADMIN") {
            audioRef.current?.play().catch(() => {
              console.log("Audio autoplay blocked. Need user interaction.");
            });
          }
          
          // Logic append message
          if (newMsg.conversation_id === selectedConvo) {
            setMessages((prev) => [...prev, newMsg]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }

          // Update sidebar list
          setConversations((prev) => {
            const newList = prev.map((c) => {
              if (c.id === newMsg.conversation_id) {
                return {
                  ...c,
                  last_message: newMsg.message,
                  last_message_at: newMsg.created_at,
                  unread_count: newMsg.conversation_id === selectedConvo ? 0 : (c.unread_count || 0) + 1,
                };
              }
              return c;
            });
            return newList.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
          });
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // Ekstrak ID user yang online (berasumsi key presence user adalah ID mereka)
        const onlineIds = Object.keys(state);
        setOnlineUsers(onlineIds);
        console.log("Online Users Synced:", onlineIds);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }: any) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }: any) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status: any) => {
        if (status === "SUBSCRIBED") {
          // Track admin presence
          await channel.track({ online_at: new Date().toISOString(), user_type: "ADMIN" });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvo, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || !selectedConvo) return;

    const newMsgText = msg.trim();
    setMsg(""); 

    // Optimistic UI for smooth feeling
    const tempId = Math.random().toString();
    const optimisticMsg = {
      id: tempId,
      conversation_id: selectedConvo,
      sender_id: "admin-id",
      sender_name: "Admin",
      sender_type: "ADMIN",
      message: newMsgText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    // Actual Database Insert
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConvo,
      sender_id: "admin-id",
      sender_name: "Admin",
      sender_type: "ADMIN",
      message: newMsgText,
      is_read: true,
    });

    if (error) {
      toast.error("Gagal mengirim pesan");
      setMessages(prev => prev.filter(m => m.id !== tempId)); // Rollback
    } else {
      // Update convo tracker
      await supabase.from("conversations").update({
        last_message: newMsgText,
        last_message_at: new Date().toISOString()
      }).eq("id", selectedConvo);
    }
  };

  const activeConversation = conversations.find((c) => c.id === selectedConvo);
  // Cek apakah customer_id (atau field identitas) ada di daftar onlineUsers
  // Untuk keperluan demo/tutorial ini, kita cek customer_name atau field id-nya
  const isCustomerOnline = onlineUsers.some(uid => uid === activeConversation?.id || uid === activeConversation?.customer_name);

  if (loadingList) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Layanan Chat Live</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Circle className="h-2 w-2 fill-success text-success animate-pulse" />
            Sistem Realtime & Presence Aktif
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-0 border border-border rounded-xl overflow-hidden bg-surface h-[calc(100vh-220px)] shadow-lg">
        {/* Sidebar: Daftar Percakapan */}
        <div className="border-r border-border overflow-y-auto bg-muted/10">
          <div className="p-4 border-b border-border bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Percakapan Aktif</div>
          {conversations.map((c) => {
            const isOnline = onlineUsers.some(uid => uid === c.id || uid === c.customer_name);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedConvo(c.id)}
                className={cn(
                  "w-full p-4 text-left border-b border-border/50 hover:bg-muted/80 transition relative", 
                  selectedConvo === c.id && "bg-primary/5 border-r-4 border-r-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      <User className="h-5 w-5" />
                    </div>
                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold truncate">{c.customer_name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(c.last_message_at)}</span>
                    </div>
                    <p className={cn("text-xs truncate", c.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {c.last_message}
                    </p>
                  </div>
                  {c.unread_count > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground text-[10px] h-5 min-w-[20px] flex items-center justify-center rounded-full p-1 shrink-0 animate-bounce">
                      {c.unread_count}
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
          {conversations.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">Belum ada obrolan masuk hari ini.</div>}
        </div>

        {/* Jendela Obrolan Utama */}
        <div className="flex flex-col bg-background/30 relative">
          {/* Header Chat */}
          <div className="p-4 border-b border-border bg-surface/80 backdrop-blur-md shrink-0 z-10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="font-bold text-sm leading-tight">{activeConversation?.customer_name || "Pilih Pelanggan"}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", isCustomerOnline ? "bg-success animate-pulse" : "bg-muted-foreground/30")} />
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
                    {isCustomerOnline ? "Sedang Online" : "Terakhir aktif baru saja"}
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] opacity-70">ID: {selectedConvo.slice(0, 8)}</Badge>
          </div>

          {/* Body: Area Pesan */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            {loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 italic text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">Memulihkan riwayat pesan...</span>
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.sender_type === "ADMIN";
                return (
                  <div key={m.id} className={cn("flex", isAdmin ? "justify-end" : "justify-start animate-in slide-in-from-left-2")}>
                    <div className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative", 
                      isAdmin ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-surface border border-border rounded-tl-none"
                    )}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      <div className={cn(
                        "text-[9px] mt-1 flex justify-end gap-1 items-center font-medium", 
                        isAdmin ? "text-primary-foreground/60" : "text-muted-foreground"
                      )}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isAdmin && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} className="h-4" />
          </div>

          {/* Footer: Input Pesan */}
          <div className="p-4 border-t border-border bg-surface/50 backdrop-blur-md shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
              <Input 
                value={msg} 
                onChange={(e) => setMsg(e.target.value)} 
                placeholder="Ketik balasan Anda ke pembeli..." 
                className="flex-1 h-11 bg-background focus:ring-2 focus:ring-primary/20 border-border/50"
                disabled={!selectedConvo}
              />
              <Button 
                type="submit" 
                disabled={!selectedConvo || !msg.trim()} 
                className="h-11 px-6 shadow-md transition-all active:scale-95 bg-primary text-primary-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" /> 
                <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Kirim</span>
              </Button>
            </form>
            <p className="text-[9px] text-center text-muted-foreground mt-2 italic px-10">Pesan Anda terkirim secara instan via jalur Realtime WebSocket.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
