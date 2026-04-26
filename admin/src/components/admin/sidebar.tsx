"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pin,
  PinOff,
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  Ticket,
  Users,
  Star,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/use-ui-store";
import { useAuthStore } from "@/stores/use-auth-store";

type UserRole = "OWNER" | "STAFF" | "KASIR";

const MENU_ITEMS: {
  group: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; roles?: UserRole[] }[];
}[] = [
  {
    group: "Utama",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Pesanan", href: "/orders", icon: ShoppingBag },
      { label: "Produk", href: "/products", icon: Package },
      { label: "Stok", href: "/stock", icon: Warehouse },
    ],
  },
  {
    group: "Pemasaran",
    items: [
      { label: "Promo", href: "/promos", icon: Ticket, roles: ["OWNER"] },
      { label: "Review", href: "/reviews", icon: Star, roles: ["OWNER", "STAFF"] },
    ],
  },
  {
    group: "Komunikasi",
    items: [
      { label: "Chat", href: "/chat", icon: MessageSquare },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      { label: "Laporan", href: "/reports", icon: BarChart3, roles: ["OWNER"] },
      { label: "Pengguna", href: "/users", icon: Users, roles: ["OWNER"] },
      { label: "Pengaturan", href: "/settings", icon: Settings, roles: ["OWNER"] },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { 
    isSidebarCollapsed, 
    isSidebarPinned, 
    setSidebarCollapsed, 
    setSidebarPinned 
  } = useUIStore();
  const { user } = useAuthStore();
  const userRole = user?.role || "KASIR";

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Jalankan timer saat mount hanya jika tidak sedang di-pin
    if (!isSidebarPinned) {
      timerRef.current = setTimeout(() => {
        setSidebarCollapsed(true);
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [setSidebarCollapsed, isSidebarPinned]);

  const handleMouseEnter = () => {
    if (isSidebarPinned) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSidebarCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (isSidebarPinned) return;
    timerRef.current = setTimeout(() => {
      setSidebarCollapsed(true);
    }, 5000);
  };

  // Filter menu items by role
  const filteredMenu = MENU_ITEMS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || item.roles.includes(userRole)
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300 z-40",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 border-b border-border transition-all duration-300",
        isSidebarCollapsed ? "justify-center" : "justify-between px-4"
      )}>
        {!isSidebarCollapsed && (
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <img
              src="/images/logo.jpg"
              alt="Dapoer Ajung"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <h2 className="font-heading text-sm font-bold text-foreground leading-tight truncate">
                Dapoer Ajung
              </h2>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            if (isSidebarCollapsed) {
              setSidebarCollapsed(false);
              setSidebarPinned(true);
            } else {
              setSidebarCollapsed(true);
              setSidebarPinned(false);
            }
          }}
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground shrink-0",
            isSidebarCollapsed && "hover:bg-muted"
          )}
          title={isSidebarPinned ? "Lepas Pin Sidebar" : "Pin Sidebar"}
        >
          {isSidebarPinned ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex-1 overflow-y-auto py-4 px-3 space-y-6"
      >
        {filteredMenu.map((group) => (
          <div key={group.group}>
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {group.group}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" &&
                    pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isSidebarCollapsed && "justify-center px-0"
                      )}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          isActive && "text-primary"
                        )}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
