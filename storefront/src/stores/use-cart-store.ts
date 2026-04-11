"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@shared/types";

interface CartState {
  items: CartItem[];
  voucherCode: string | null;
  voucherDiscount: number;

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string, discount: number) => void;
  removeVoucher: () => void;

  // Computed (accessed as functions for Zustand compatibility)
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      voucherCode: null,
      voucherDiscount: 0,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        const itemId = variant ? `${product.id}-${variant.id}` : product.id;

        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            productName: product.name,
            productImage: product.images[0] || "",
            variantId: variant?.id,
            variantName: variant?.name,
            quantity,
            unitPrice: variant?.price ?? product.discountPrice ?? product.basePrice,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], voucherCode: null, voucherDiscount: 0 });
      },

      applyVoucher: (code, discount) => {
        set({ voucherCode: code, voucherDiscount: discount });
      },

      removeVoucher: () => {
        set({ voucherCode: null, voucherDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        return get().getSubtotal() - get().voucherDiscount;
      },
    }),
    {
      name: "dapoer-ajung-cart",
    }
  )
);
