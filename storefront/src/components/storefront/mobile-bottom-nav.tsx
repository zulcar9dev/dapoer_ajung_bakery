"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/use-cart-store";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Produk", href: "/products", icon: Grid3X3 },
  { label: "Cari", href: "#search", icon: Search, action: "search" },
  { label: "Keranjang", href: "#cart", icon: ShoppingCart, action: "cart" },
  { label: "Akun", href: "/about", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { setCartOpen, setSearchOpen } = useUIStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : !item.action && pathname.startsWith(item.href);

          const handleClick = (e: React.MouseEvent) => {
            if (item.action === "search") {
              e.preventDefault();
              setSearchOpen(true);
            } else if (item.action === "cart") {
              e.preventDefault();
              setCartOpen(true);
            }
          };

          return (
            <Link
              key={item.label}
              href={item.action ? "#" : item.href}
              onClick={handleClick}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full text-[10px] font-medium transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive && "text-primary"
                  )}
                />
                {item.action === "cart" && totalItems > 0 && (
                  <Badge className="absolute -top-1.5 -right-2.5 h-4 min-w-4 px-0.5 flex items-center justify-center bg-secondary text-secondary-foreground text-[8px] font-bold rounded-full">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
