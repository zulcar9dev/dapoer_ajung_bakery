"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Menu, LogOut, ShoppingCart,
  AlertTriangle, AlertOctagon, Star, MessageSquare, CheckCheck, Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUIStore } from "@/stores/use-ui-store";
import { useNotificationStore, type Notification } from "@/stores/use-notification-store";

// Format waktu relatif (misal: "2 menit lalu")
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// Ikon berdasarkan tipe notifikasi
function NotifIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "NEW_ORDER":
      return <ShoppingCart className="h-4 w-4 text-primary shrink-0" />;
    case "LOW_STOCK":
      return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
    case "OUT_OF_STOCK":
      return <AlertOctagon className="h-4 w-4 text-destructive shrink-0" />;
    case "NEW_REVIEW":
      return <Star className="h-4 w-4 text-yellow-500 shrink-0" />;
    case "NEW_CHAT":
      return <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground shrink-0" />;
  }
}

export function Topbar() {
  const router = useRouter();
  const { toggleMobileSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteAllRead,
    subscribeRealtime,
    unsubscribeRealtime,
  } = useNotificationStore();

  // Fetch & subscribe saat mount
  useEffect(() => {
    fetchNotifications();
    subscribeRealtime();
    return () => unsubscribeRealtime();
  }, [fetchNotifications, subscribeRealtime, unsubscribeRealtime]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    if (notif.reference_url) {
      router.push(notif.reference_url);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-card/95 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="lg:hidden text-muted-foreground"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative text-muted-foreground hover:text-foreground"
            )}
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full border-2 border-card">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-card">
              <span className="text-sm font-semibold">Notifikasi</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    markAllAsRead();
                  }}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tandai Dibaca
                </Button>
              )}
            </div>
            <Separator />

            {/* Daftar Notifikasi */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer rounded-none border-b border-border/50 last:border-0 ${
                      !notif.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="mt-0.5">
                      <NotifIcon type={notif.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-tight ${!notif.is_read ? "font-semibold" : "font-medium"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
            
            {/* Footer Actions */}
            {notifications.length > 0 && notifications.some(n => n.is_read) && (
              <>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteAllRead();
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Hapus History
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex items-center gap-2 px-2 hover:bg-muted/50 transition-colors rounded-full h-10"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar-ajung.jpg" alt="Ajung" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">A</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-none pr-1 text-left hidden sm:flex">
              <span className="text-xs font-bold text-foreground">Ajung (Owner)</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Owner</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            <DropdownMenuItem
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground cursor-pointer font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
