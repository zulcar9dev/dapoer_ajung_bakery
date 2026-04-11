"use client";

import { useState } from "react";
import { Send, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_CONVERSATIONS, MOCK_CHAT_MESSAGES } from "@shared/mock-data";
import { formatRelativeTime } from "@shared/utils";

export default function ChatPage() {
  const [selectedConvo, setSelectedConvo] = useState(MOCK_CONVERSATIONS[0]?.id || "");
  const [msg, setMsg] = useState("");

  const currentMessages = MOCK_CHAT_MESSAGES.filter((m) => m.conversationId === selectedConvo);
  const selectedConversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConvo);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Chat</h1><p className="text-sm text-muted-foreground">Pesan dari pelanggan via WhatsApp.</p></div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-0 border border-border rounded-xl overflow-hidden bg-surface h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <div className="border-r border-border overflow-y-auto">
          {MOCK_CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConvo(c.id)}
              className={cn("w-full p-4 text-left border-b border-border/50 hover:bg-muted/50 transition", selectedConvo === c.id && "bg-primary/5")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0"><User className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{c.customerName}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                </div>
                {c.unreadCount > 0 && <Badge className="bg-primary text-primary-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0 shrink-0">{c.unreadCount}</Badge>}
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface">
            <p className="font-medium text-sm">{selectedConversation?.customerName || "Pilih percakapan"}</p>
            <p className="text-xs text-muted-foreground">{selectedConversation?.isActive ? "Online" : "Offline"}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.map((m) => (
              <div key={m.id} className={cn("flex", m.senderType === "ADMIN" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[70%] rounded-lg px-3 py-2", m.senderType === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p className="text-sm">{m.message}</p>
                  <p className={cn("text-[10px] mt-1", m.senderType === "ADMIN" ? "text-primary-foreground/60" : "text-muted-foreground/60")}>{formatRelativeTime(m.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input placeholder="Ketik pesan..." value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setMsg(""); } }} />
              <Button className="bg-primary text-primary-foreground shrink-0" onClick={() => setMsg("")}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
