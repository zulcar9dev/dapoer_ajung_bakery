// ═══════════════════════════════════════════════════════
// Dapoer Ajung Cookies & Bakery — App Constants
// ═══════════════════════════════════════════════════════

import type { StoreSettings, Category } from "./types";

// ─── Informasi Toko ───

export const STORE_INFO: StoreSettings = {
  storeName: "Dapoer Ajung Cookies & Bakery",
  tagline: "Handmade with Love in Gorontalo — Since 1990",
  phone: "+6281234567890",
  whatsapp: "6281234567890",
  email: "info@dapoerajung.co.id",
  address: "Jl. Nani Wartabone No. 123, Kota Gorontalo",
  city: "Gorontalo",
  province: "Gorontalo",
  operatingHours: {
    days: "Senin - Jumat",
    open: "08:00",
    close: "22:00",
  },
  socialMedia: {
    instagram: "https://instagram.com/dapoerajung",
    facebook: "https://facebook.com/dapoerajung",
    tiktok: "https://tiktok.com/@dapoerajung",
  },
  bankAccounts: [
    {
      id: "bank-1",
      bankName: "Bank BRI",
      accountNumber: "1234-5678-9012-3456",
      accountHolder: "Dapoer Ajung Bakery",
    },
    {
      id: "bank-2",
      bankName: "Bank BNI",
      accountNumber: "9876-5432-1098-7654",
      accountHolder: "Dapoer Ajung Bakery",
    },
  ],
  qrisImage: "/images/qris-dapoer-ajung.png",
};

// ─── Kategori Produk ───

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Kue Basah",
    slug: "kue-basah",
    description: "Kue basah modern & tradisional khas Gorontalo",
    image: "/images/categories/kue-basah.jpg",
    productCount: 5,
    order: 1,
  },
  {
    id: "cat-2",
    name: "Kue Kering",
    slug: "kue-kering",
    description: "Kue kering toples untuk momen spesial",
    image: "/images/categories/kue-kering.jpg",
    productCount: 4,
    order: 2,
  },
  {
    id: "cat-3",
    name: "Roti & Pastry",
    slug: "roti-pastry",
    description: "Roti segar dan pastry artisan harian",
    image: "/images/categories/roti-pastry.jpg",
    productCount: 3,
    order: 3,
  },
  {
    id: "cat-4",
    name: "Hampers & Paket",
    slug: "hampers-paket",
    description: "Hampers cantik untuk hadiah dan acara spesial",
    image: "/images/categories/hampers.jpg",
    productCount: 2,
    order: 4,
  },
  {
    id: "cat-5",
    name: "Bekal Sekolah",
    slug: "bekal-sekolah",
    description: "Paket bekal makan siang sehat untuk anak sekolah (MBG)",
    image: "/images/categories/bekal-sekolah.jpg",
    productCount: 1,
    order: 5,
  },
];

// ─── Order Status Config ───

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: "Menunggu Konfirmasi", color: "warning", icon: "Clock" },
  CONFIRMED: { label: "Dikonfirmasi", color: "info", icon: "CheckCircle" },
  PROCESSING: { label: "Sedang Diproses", color: "info", icon: "ChefHat" },
  READY: { label: "Siap", color: "success", icon: "Package" },
  SHIPPING: { label: "Sedang Dikirim", color: "info", icon: "Truck" },
  DELIVERED: { label: "Terkirim", color: "success", icon: "MapPin" },
  COMPLETED: { label: "Selesai", color: "success", icon: "CheckCircle2" },
  CANCELLED: { label: "Dibatalkan", color: "destructive", icon: "XCircle" },
} as const;

// ─── Payment Method Config ───

export const PAYMENT_METHODS = {
  TRANSFER: { label: "Transfer Bank", icon: "Landmark" },
  QRIS: { label: "QRIS", icon: "QrCode" },
  COD: { label: "Bayar di Tempat (COD)", icon: "Wallet" },
} as const;

// ─── Delivery Time Slots ───

export const DELIVERY_TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
];

// ─── Admin Sidebar Menu ───

export const ADMIN_MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: ["OWNER", "STAFF", "KASIR"] },
  { label: "Pesanan", href: "/orders", icon: "ShoppingBag", roles: ["OWNER", "STAFF", "KASIR"] },
  { label: "Produk", href: "/products", icon: "Package", roles: ["OWNER", "STAFF"] },
  { label: "Stok", href: "/stock", icon: "Warehouse", roles: ["OWNER", "STAFF"] },
  { label: "Promo & Voucher", href: "/promos", icon: "Ticket", roles: ["OWNER"] },
  { label: "Review", href: "/reviews", icon: "Star", roles: ["OWNER", "STAFF"] },
  { label: "Chat", href: "/chat", icon: "MessageSquare", roles: ["OWNER", "STAFF", "KASIR"] },
  { label: "Laporan", href: "/reports", icon: "BarChart3", roles: ["OWNER"] },
  { label: "Users", href: "/users", icon: "Users", roles: ["OWNER"] },
  { label: "Pengaturan", href: "/settings", icon: "Settings", roles: ["OWNER"] },
] as const;

// ─── Navigation (Storefront) ───

export const STOREFRONT_NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tentang Kami", href: "/about" },
  { label: "FAQ", href: "/faq" },
] as const;

// ─── WhatsApp ───

export const WHATSAPP_URL = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
  "Halo Dapoer Ajung! Saya ingin bertanya tentang produk Anda."
)}`;

// ─── Misc ───

export const ITEMS_PER_PAGE = 12;
export const MAX_CART_QUANTITY = 99;
export const MIN_ORDER_AMOUNT = 25_000;
export const FREE_DELIVERY_THRESHOLD = 200_000;
