"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Ticket,
  Users,
  Star,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const userRole = user?.role || "KASIR";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
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
        "hidden lg:flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <img
            src="/images/logo.jpg"
            alt="Dapoer Ajung"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <h2 className="font-heading text-sm font-bold text-foreground leading-tight truncate">
                Dapoer Ajung
              </h2>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
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

      <Separator />

      {/* Collapse toggle & Logout */}
      <div className="p-3 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            isSidebarCollapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isSidebarCollapsed && "rotate-180"
            )}
          />
          {!isSidebarCollapsed && <span className="ml-2">Tutup Sidebar</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full text-destructive hover:text-destructive hover:bg-destructive/10",
            isSidebarCollapsed ? "justify-center px-0" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isSidebarCollapsed && <span className="ml-2">Keluar</span>}
        </Button>
      </div>
    </aside>
  );
}
