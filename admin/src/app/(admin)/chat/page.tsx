"use client";

import { useEffect, useState, useRef } from "react";
import { Send, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@shared/utils";
import { createClient } from "@/lib/supabase/client";

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load Conversations once
  useEffect(() => {
    async function loadConversations() {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false });

      setConversations(data || []);
      if (data && data.length > 0) setSelectedConvo(data[0].id);
      setLoadingList(false);
    }
    loadConversations();
  }, []);

  // Load messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedConvo) return;
    async function loadMessages() {
      setLoadingMessages(true);
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConvo)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      setLoadingMessages(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      
      // Clear unread count for this conversation
      await supabase.from("conversations").update({ unread_count: 0 }).eq("id", selectedConvo);
      setConversations((prev) => prev.map(c => c.id === selectedConvo ? { ...c, unread_count: 0 } : c));
    }
    loadMessages();
  }, [selectedConvo]);

  // Handle Realtime Subscription
  useEffect(() => {
    const channel = supabase.channel("realtime-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newMsg = payload.new;
          
          // If the message belongs to current convo, append it to view
          if (newMsg.conversation_id === selectedConvo) {
            setMessages((prev) => [...prev, newMsg]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }

          // Update latest message in sidebar
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
            // Re-sort to put latest on top
            return newList.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvo, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || !selectedConvo) return;

    const newMsgText = msg.trim();
    setMsg(""); // immediate clear for UX

    // Determine current user context (dummy admin for now if auth not connected, or fetch from auth)
    const activeConvo = conversations.find(c => c.id === selectedConvo);
    
    // Insert message into DB
    await supabase.from("messages").insert({
      conversation_id: selectedConvo,
      sender_id: "admin-1",
      sender_name: "Admin",
      sender_type: "ADMIN",
      message: newMsgText,
      is_read: true,
    });

    // Update conversation's last message tracker explicitly just in case Realtime delays
    await supabase.from("conversations").update({
      last_message: newMsgText,
      last_message_at: new Date().toISOString()
    }).eq("id", selectedConvo);
  };

  const activeConversation = conversations.find((c) => c.id === selectedConvo);

  if (loadingList) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Chat Live</h1><p className="text-sm text-muted-foreground">Terkoneksi dengan Supabase Realtime.</p></div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-0 border border-border rounded-xl overflow-hidden bg-surface h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <div className="border-r border-border overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConvo(c.id)}
              className={cn("w-full p-4 text-left border-b border-border/50 hover:bg-muted/50 transition", selectedConvo === c.id && "bg-primary/5")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0"><User className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{c.customer_name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(c.last_message_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.last_message}</p>
                </div>
                {c.unread_count > 0 && <Badge className="bg-primary text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0 shrink-0">{c.unread_count}</Badge>}
              </div>
            </button>
          ))}
          {conversations.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">Belum ada percakapan.</div>}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-background/50 relative">
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface shrink-0 z-10">
            <p className="font-medium text-sm">{activeConversation?.customer_name || "Pilih percakapan"}</p>
            <p className="text-xs text-success">{activeConversation?.is_active ? "Online" : "Sistem Aktif"}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex", m.sender_type === "ADMIN" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[70%] rounded-lg px-3 py-2", m.sender_type === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-sm">{m.message}</p>
                    <p className={cn("text-[10px] mt-1 text-right", m.sender_type === "ADMIN" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-surface shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input 
                value={msg} 
                onChange={(e) => setMsg(e.target.value)} 
                placeholder="Ketik balasan Anda..." 
                className="flex-1"
                disabled={!selectedConvo}
              />
              <Button type="submit" disabled={!selectedConvo || !msg.trim()} className="shrink-0 bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
