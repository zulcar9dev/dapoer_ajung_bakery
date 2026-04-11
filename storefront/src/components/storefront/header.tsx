"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STORE_INFO, STOREFRONT_NAV_ITEMS } from "@shared/constants";
import { useCartStore } from "@/stores/use-cart-store";
import { useUIStore } from "@/stores/use-ui-store";

export function Header() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const { isMobileMenuOpen, toggleMobileMenu, setCartOpen, setSearchOpen } =
    useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo.jpg"
              alt="Dapoer Ajung"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
            <div className="hidden sm:block">
              <h1 className="font-heading text-lg md:text-xl font-bold text-foreground leading-tight">
                {STORE_INFO.storeName.split(" — ")[0] || STORE_INFO.storeName}
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground tracking-wider uppercase">
                Cookies & Bakery
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {STOREFRONT_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-dim rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari produk"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              aria-label="Keranjang belanja"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full border-2 border-surface">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Menu"
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface animate-slide-down">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {STOREFRONT_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => toggleMobileMenu()}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-dim rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
