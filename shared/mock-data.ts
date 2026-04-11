// ═══════════════════════════════════════════════════════
// Dapoer Ajung Cookies & Bakery — Mock Data
// ═══════════════════════════════════════════════════════

import type {
  Product,
  Category,
  Order,
  Review,
  Voucher,
  Banner,
  Testimonial,
  FAQItem,
  ChatConversation,
  ChatMessage,
  SalesDataPoint,
  TopProduct,
  DashboardStats,
  StockMovement,
  User,
} from "./types";

// Local category references (mirrors CATEGORIES from constants.ts)
// Defined here to avoid cross-file relative imports that break Turbopack SSR
const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Kue Basah", slug: "kue-basah", description: "Kue basah modern & tradisional khas Gorontalo", image: "/images/categories/kue-basah.jpg", productCount: 5, order: 1 },
  { id: "cat-2", name: "Kue Kering", slug: "kue-kering", description: "Kue kering toples untuk momen spesial", image: "/images/categories/kue-kering.jpg", productCount: 4, order: 2 },
  { id: "cat-3", name: "Roti & Pastry", slug: "roti-pastry", description: "Roti segar dan pastry artisan harian", image: "/images/categories/roti-pastry.jpg", productCount: 3, order: 3 },
  { id: "cat-4", name: "Hampers & Paket", slug: "hampers-paket", description: "Hampers cantik untuk hadiah dan acara spesial", image: "/images/categories/hampers.jpg", productCount: 2, order: 4 },
  { id: "cat-5", name: "Bekal Sekolah", slug: "bekal-sekolah", description: "Paket bekal makan siang sehat untuk anak sekolah (MBG)", image: "/images/categories/bekal-sekolah.jpg", productCount: 1, order: 5 },
];

// ─── Products ───

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Bingka Kentang",
    slug: "bingka-kentang",
    description:
      "Kue tradisional khas Gorontalo yang terbuat dari kentang pilihan, santan kelapa, dan telur ayam kampung, dipanggang hingga kecoklatan sempurna dengan bagian atas yang charred khas. Resep turun-temurun dari tahun 1990.",
    shortDescription: "Kue tradisional Gorontalo dengan kentang dan santan",
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    basePrice: 25000,
    images: ["/images/products/bingka-kentang-1.jpg", "/images/products/bingka-kentang-2.jpg"],
    variants: [
      { id: "v1-1", name: "Mini", type: "SIZE", price: 15000, stock: 30, sku: "BK-MINI" },
      { id: "v1-2", name: "Regular", type: "SIZE", price: 25000, stock: 20, sku: "BK-REG" },
      { id: "v1-3", name: "Large", type: "SIZE", price: 45000, stock: 10, sku: "BK-LRG" },
    ],
    tags: ["Best Seller", "Heritage Recipe"],
    rating: 4.8,
    reviewCount: 124,
    totalStock: 60,
    isAvailable: true,
    isFeatured: true,
    isPreOrderOnly: false,
    weight: 500,
    ingredients: "Kentang, santan kelapa, telur, gula pasir, tepung terigu, margarin",
    allergens: ["Telur", "Gluten", "Susu"],
    shelfLife: "3 hari",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Nastar Klasik",
    slug: "nastar-klasik",
    description:
      "Nastar premium isi selai nanas homemade yang lembut dan buttery. Dibuat dengan mentega Wijsman asli dan dipanggang sempurna. Favorit pelanggan saat Lebaran dan Natal.",
    shortDescription: "Nastar premium dengan selai nanas homemade",
    categoryId: "cat-2",
    category: MOCK_CATEGORIES[1],
    basePrice: 85000,
    images: ["/images/products/nastar-1.jpg", "/images/products/nastar-2.jpg"],
    variants: [
      { id: "v2-1", name: "Toples Kecil (250g)", type: "SIZE", price: 85000, stock: 25, sku: "NS-S" },
      { id: "v2-2", name: "Toples Besar (500g)", type: "SIZE", price: 150000, stock: 15, sku: "NS-L" },
    ],
    tags: ["Best Seller", "Seasonal"],
    rating: 4.9,
    reviewCount: 89,
    totalStock: 40,
    isAvailable: true,
    isFeatured: true,
    isPreOrderOnly: false,
    weight: 250,
    ingredients: "Tepung terigu, mentega Wijsman, gula halus, kuning telur, susu bubuk, selai nanas",
    allergens: ["Telur", "Gluten", "Susu"],
    shelfLife: "2 minggu",
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-04-09T14:00:00Z",
  },
  {
    id: "prod-3",
    name: "Kastengel Keju",
    slug: "kastengel-keju",
    description:
      "Kastengel premium double cheese dengan keju Edam dan Parmesan asli. Renyah di luar, gurih meleleh di dalam. Wajib ada di setiap perayaan.",
    shortDescription: "Kastengel double cheese Edam & Parmesan",
    categoryId: "cat-2",
    category: MOCK_CATEGORIES[1],
    basePrice: 90000,
    images: ["/images/products/kastengel-1.jpg"],
    variants: [
      { id: "v3-1", name: "Toples Kecil (250g)", type: "SIZE", price: 90000, stock: 20, sku: "KS-S" },
      { id: "v3-2", name: "Toples Besar (500g)", type: "SIZE", price: 165000, stock: 12, sku: "KS-L" },
    ],
    tags: ["Premium"],
    rating: 4.7,
    reviewCount: 56,
    totalStock: 32,
    isAvailable: true,
    isFeatured: true,
    isPreOrderOnly: false,
    weight: 250,
    ingredients: "Tepung terigu, mentega, keju Edam, keju Parmesan, kuning telur",
    allergens: ["Telur", "Gluten", "Susu"],
    shelfLife: "2 minggu",
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-04-08T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "Roti Abon",
    slug: "roti-abon",
    description:
      "Roti manis lembut bertabur abon sapi premium dan mayonnaise. Freshly baked setiap pagi. Cocok untuk sarapan dan bekal.",
    shortDescription: "Roti manis lembut dengan abon sapi premium",
    categoryId: "cat-3",
    category: MOCK_CATEGORIES[2],
    basePrice: 12000,
    images: ["/images/products/roti-abon-1.jpg"],
    variants: [],
    tags: ["Daily Fresh"],
    rating: 4.5,
    reviewCount: 34,
    totalStock: 50,
    isAvailable: true,
    isFeatured: false,
    isPreOrderOnly: false,
    weight: 120,
    ingredients: "Tepung terigu, ragi, gula, mentega, telur, susu, abon sapi, mayonnaise",
    allergens: ["Telur", "Gluten", "Susu"],
    shelfLife: "2 hari",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-04-11T06:00:00Z",
  },
  {
    id: "prod-5",
    name: "Lapis Legit",
    slug: "lapis-legit",
    description:
      "Lapis legit 20 lapis premium. Dibuat dengan resep tradisional menggunakan mentega Wijsman, rempah-rempah pilihan, dan dipanggang lapis demi lapis secara manual.",
    shortDescription: "Lapis legit 20 lapis premium resep tradisional",
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    basePrice: 250000,
    discountPrice: 225000,
    images: ["/images/products/lapis-legit-1.jpg", "/images/products/lapis-legit-2.jpg"],
    variants: [
      { id: "v5-1", name: "Setengah Loyang", type: "SIZE", price: 250000, stock: 5, sku: "LL-HALF" },
      { id: "v5-2", name: "Full Loyang", type: "SIZE", price: 450000, stock: 3, sku: "LL-FULL" },
    ],
    tags: ["Premium", "Heritage Recipe"],
    rating: 4.9,
    reviewCount: 42,
    totalStock: 8,
    isAvailable: true,
    isFeatured: true,
    isPreOrderOnly: true,
    preOrderLeadDays: 2,
    weight: 800,
    ingredients: "Mentega Wijsman, kuning telur, gula pasir, tepung terigu, susu kental manis, kayu manis, cengkeh, pala",
    allergens: ["Telur", "Gluten", "Susu"],
    shelfLife: "5 hari",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-04-10T12:00:00Z",
  },
  {
    id: "prod-6",
    name: "Kue Sabongi",
    slug: "kue-sabongi",
    description:
      "Kue khas Gorontalo yang unik dengan cita rasa manis legit. Dibuat dari resep warisan keluarga dengan bahan-bahan pilihan lokal.",
    shortDescription: "Kue tradisional khas Gorontalo warisan keluarga",
    categoryId: "cat-1",
    category: MOCK_CATEGORIES[0],
    basePrice: 35000,
    images: ["/images/products/sabongi-1.jpg"],
    variants: [
      { id: "v6-1", name: "Original", type: "FLAVOR", price: 35000, stock: 15, sku: "SB-ORI" },
      { id: "v6-2", name: "Pandan", type: "FLAVOR", price: 35000, stock: 10, sku: "SB-PND" },
    ],
    tags: ["Heritage Recipe", "Gorontalo Special"],
    rating: 4.6,
    reviewCount: 28,
    totalStock: 25,
    isAvailable: true,
    isFeatured: false,
    isPreOrderOnly: false,
    weight: 400,
    shelfLife: "3 hari",
    createdAt: "2026-02-15T08:00:00Z",
    updatedAt: "2026-04-09T08:00:00Z",
  },
  {
    id: "prod-7",
    name: "Hampers Lebaran Exclusive",
    slug: "hampers-lebaran-exclusive",
    description:
      "Paket hampers premium berisi 4 toples kue kering pilihan (Nastar, Kastengel, Putri Salju, Lidah Kucing) dalam kemasan eksklusif. Cocok untuk hadiah dan silaturahmi.",
    shortDescription: "Hampers 4 toples kue kering premium",
    categoryId: "cat-4",
    category: MOCK_CATEGORIES[3],
    basePrice: 450000,
    discountPrice: 399000,
    images: ["/images/products/hampers-lebaran-1.jpg", "/images/products/hampers-lebaran-2.jpg"],
    variants: [
      { id: "v7-1", name: "Silver Package", type: "SIZE", price: 399000, stock: 10, sku: "HL-SLV" },
      { id: "v7-2", name: "Gold Package", type: "SIZE", price: 599000, stock: 5, sku: "HL-GLD" },
    ],
    tags: ["Seasonal", "Gift Set"],
    rating: 4.8,
    reviewCount: 18,
    totalStock: 15,
    isAvailable: true,
    isFeatured: true,
    isPreOrderOnly: true,
    preOrderLeadDays: 3,
    weight: 2000,
    shelfLife: "2 minggu",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-04-10T16:00:00Z",
  },
  {
    id: "prod-8",
    name: "Paket Bekal Sekolah",
    slug: "paket-bekal-sekolah",
    description:
      "Paket bekal makan siang bergizi untuk anak sekolah. Berisi nasi, lauk pilihan, sayur, dan snack sehat. Mendukung program Makan Bergizi Gratis (MBG).",
    shortDescription: "Paket bekal bergizi untuk anak sekolah",
    categoryId: "cat-5",
    category: MOCK_CATEGORIES[4],
    basePrice: 20000,
    images: ["/images/products/bekal-sekolah-1.jpg"],
    variants: [
      { id: "v8-1", name: "Paket A (Ayam)", type: "FLAVOR", price: 20000, stock: 30, sku: "BS-A" },
      { id: "v8-2", name: "Paket B (Ikan)", type: "FLAVOR", price: 20000, stock: 25, sku: "BS-B" },
      { id: "v8-3", name: "Paket C (Telur)", type: "FLAVOR", price: 18000, stock: 35, sku: "BS-C" },
    ],
    tags: ["Daily Fresh", "MBG"],
    rating: 4.4,
    reviewCount: 15,
    totalStock: 90,
    isAvailable: true,
    isFeatured: false,
    isPreOrderOnly: true,
    preOrderLeadDays: 1,
    weight: 350,
    shelfLife: "1 hari",
    createdAt: "2026-03-15T08:00:00Z",
    updatedAt: "2026-04-11T06:00:00Z",
  },
];

// ─── Orders ───

export const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    orderNumber: "DA-20260411-001",
    customerName: "Fatimah Hasan",
    customerPhone: "081234567891",
    customerEmail: "fatimah@gmail.com",
    customerAddress: "Jl. Sultan Botutihe No. 45, Kota Gorontalo",
    items: [
      { id: "oi-1", productId: "prod-1", productName: "Bingka Kentang (Regular)", productImage: "/images/products/bingka-kentang-1.jpg", quantity: 3, unitPrice: 25000, subtotal: 75000 },
      { id: "oi-2", productId: "prod-2", productName: "Nastar Klasik (Toples Kecil)", productImage: "/images/products/nastar-1.jpg", quantity: 2, unitPrice: 85000, subtotal: 170000 },
    ],
    subtotal: 245000,
    deliveryFee: 15000,
    discount: 0,
    total: 260000,
    deliveryMethod: "DELIVERY",
    deliveryDate: "2026-04-12",
    deliveryTimeSlot: "10:00 - 12:00",
    paymentMethod: "TRANSFER",
    paymentStatus: "PAID",
    status: "PROCESSING",
    statusHistory: [
      { status: "PENDING", timestamp: "2026-04-11T08:00:00Z" },
      { status: "CONFIRMED", timestamp: "2026-04-11T08:30:00Z", note: "Pembayaran dikonfirmasi" },
      { status: "PROCESSING", timestamp: "2026-04-11T09:00:00Z", note: "Sedang diproses" },
    ],
    createdAt: "2026-04-11T08:00:00Z",
    updatedAt: "2026-04-11T09:00:00Z",
  },
  {
    id: "order-2",
    orderNumber: "DA-20260411-002",
    customerName: "Ahmad Rizal",
    customerPhone: "081234567892",
    customerEmail: "ahmad.rizal@gmail.com",
    customerAddress: "Jl. Agus Salim No. 12, Kota Gorontalo",
    items: [
      { id: "oi-3", productId: "prod-5", productName: "Lapis Legit (Setengah Loyang)", productImage: "/images/products/lapis-legit-1.jpg", quantity: 1, unitPrice: 225000, subtotal: 225000 },
    ],
    subtotal: 225000,
    deliveryFee: 0,
    discount: 25000,
    total: 200000,
    voucherCode: "WELCOME25K",
    deliveryMethod: "PICKUP",
    deliveryDate: "2026-04-13",
    deliveryTimeSlot: "14:00 - 16:00",
    paymentMethod: "QRIS",
    paymentStatus: "PAID",
    status: "PENDING",
    statusHistory: [
      { status: "PENDING", timestamp: "2026-04-11T09:30:00Z" },
    ],
    createdAt: "2026-04-11T09:30:00Z",
    updatedAt: "2026-04-11T09:30:00Z",
  },
  {
    id: "order-3",
    orderNumber: "DA-20260410-005",
    customerName: "Sri Wahyuni",
    customerPhone: "081234567893",
    customerEmail: "sri.w@gmail.com",
    customerAddress: "Jl. Nani Wartabone No. 78, Kota Gorontalo",
    items: [
      { id: "oi-4", productId: "prod-7", productName: "Hampers Lebaran (Gold Package)", productImage: "/images/products/hampers-lebaran-1.jpg", quantity: 5, unitPrice: 599000, subtotal: 2995000 },
    ],
    subtotal: 2995000,
    deliveryFee: 25000,
    discount: 0,
    total: 3020000,
    deliveryMethod: "DELIVERY",
    deliveryDate: "2026-04-14",
    deliveryTimeSlot: "08:00 - 10:00",
    paymentMethod: "TRANSFER",
    paymentStatus: "PAID",
    status: "CONFIRMED",
    statusHistory: [
      { status: "PENDING", timestamp: "2026-04-10T14:00:00Z" },
      { status: "CONFIRMED", timestamp: "2026-04-10T15:00:00Z", note: "Pesanan untuk acara kantor" },
    ],
    createdAt: "2026-04-10T14:00:00Z",
    updatedAt: "2026-04-10T15:00:00Z",
  },
  {
    id: "order-4",
    orderNumber: "DA-20260409-003",
    customerName: "Dewi Lestari",
    customerPhone: "081234567894",
    customerEmail: "dewi@gmail.com",
    customerAddress: "Jl. Pangeran Hidayat No. 33, Kota Gorontalo",
    items: [
      { id: "oi-5", productId: "prod-4", productName: "Roti Abon", productImage: "/images/products/roti-abon-1.jpg", quantity: 10, unitPrice: 12000, subtotal: 120000 },
      { id: "oi-6", productId: "prod-6", productName: "Kue Sabongi (Original)", productImage: "/images/products/sabongi-1.jpg", quantity: 2, unitPrice: 35000, subtotal: 70000 },
    ],
    subtotal: 190000,
    deliveryFee: 10000,
    discount: 0,
    total: 200000,
    deliveryMethod: "DELIVERY",
    deliveryDate: "2026-04-10",
    deliveryTimeSlot: "16:00 - 18:00",
    paymentMethod: "COD",
    paymentStatus: "PAID",
    status: "COMPLETED",
    statusHistory: [
      { status: "PENDING", timestamp: "2026-04-09T10:00:00Z" },
      { status: "CONFIRMED", timestamp: "2026-04-09T10:30:00Z" },
      { status: "PROCESSING", timestamp: "2026-04-09T12:00:00Z" },
      { status: "READY", timestamp: "2026-04-10T08:00:00Z" },
      { status: "SHIPPING", timestamp: "2026-04-10T16:00:00Z" },
      { status: "DELIVERED", timestamp: "2026-04-10T17:00:00Z" },
      { status: "COMPLETED", timestamp: "2026-04-10T17:30:00Z" },
    ],
    createdAt: "2026-04-09T10:00:00Z",
    updatedAt: "2026-04-10T17:30:00Z",
  },
  {
    id: "order-5",
    orderNumber: "DA-20260408-002",
    customerName: "Budi Santoso",
    customerPhone: "081234567895",
    customerEmail: "",
    customerAddress: "",
    items: [
      { id: "oi-7", productId: "prod-3", productName: "Kastengel Keju (Toples Besar)", productImage: "/images/products/kastengel-1.jpg", quantity: 1, unitPrice: 165000, subtotal: 165000 },
    ],
    subtotal: 165000,
    deliveryFee: 0,
    discount: 0,
    total: 165000,
    deliveryMethod: "PICKUP",
    deliveryDate: "2026-04-09",
    deliveryTimeSlot: "12:00 - 14:00",
    paymentMethod: "QRIS",
    paymentStatus: "REFUNDED",
    status: "CANCELLED",
    statusHistory: [
      { status: "PENDING", timestamp: "2026-04-08T11:00:00Z" },
      { status: "CANCELLED", timestamp: "2026-04-08T14:00:00Z", note: "Dibatalkan oleh pelanggan" },
    ],
    createdAt: "2026-04-08T11:00:00Z",
    updatedAt: "2026-04-08T14:00:00Z",
  },
];

// ─── Reviews ───

export const MOCK_REVIEWS: Review[] = [
  { id: "rev-1", productId: "prod-1", productName: "Bingka Kentang", customerName: "Aisyah R.", rating: 5, comment: "Bingka kentang terenak yang pernah saya coba! Teksturnya lembut, aromanya wangi, dan rasa tradisionalnya benar-benar terasa. Akan order lagi!", isApproved: true, createdAt: "2026-04-10T10:00:00Z" },
  { id: "rev-2", productId: "prod-2", productName: "Nastar Klasik", customerName: "Muhammad F.", rating: 5, comment: "Nastar-nya premium banget, selai nanasnya homemade dan tidak terlalu manis. Cocok untuk Lebaran. Sudah pesan 10 toples untuk dibagikan ke keluarga.", isApproved: true, createdAt: "2026-04-09T14:00:00Z" },
  { id: "rev-3", productId: "prod-5", productName: "Lapis Legit", customerName: "Indah S.", rating: 5, comment: "Lapis legit Dapoer Ajung tidak pernah mengecewakan. 20 lapis sempurna, empuk dan rich. Worth every penny!", isApproved: true, createdAt: "2026-04-08T09:00:00Z" },
  { id: "rev-4", productId: "prod-4", productName: "Roti Abon", customerName: "Herman W.", rating: 4, comment: "Roti-nya enak dan fresh, abon-nya banyak. Pengiriman juga cepat. Cuma kadang rotinya agak kempes kalau antar jauh.", isApproved: true, createdAt: "2026-04-07T16:00:00Z" },
  { id: "rev-5", productId: "prod-3", productName: "Kastengel Keju", customerName: "Yuliana M.", rating: 5, comment: "Kastengel paling gurih! Keju-nya kerasa banget, renyah di luar lembut di dalam. Packaging-nya juga cantik.", isApproved: true, createdAt: "2026-04-06T11:00:00Z" },
];

// ─── Vouchers ───

export const MOCK_VOUCHERS: Voucher[] = [
  { id: "vc-1", code: "WELCOME25K", name: "Diskon Pelanggan Baru", description: "Potongan Rp 25.000 untuk pembelian pertama", type: "FIXED", value: 25000, minOrderAmount: 100000, usageLimit: 100, usedCount: 45, isActive: true, startDate: "2026-01-01", endDate: "2026-12-31" },
  { id: "vc-2", code: "LEBARAN15", name: "Diskon Lebaran 15%", description: "Diskon 15% untuk semua produk selama Ramadhan", type: "PERCENTAGE", value: 15, minOrderAmount: 150000, maxDiscount: 75000, usageLimit: 200, usedCount: 78, isActive: true, startDate: "2026-03-01", endDate: "2026-04-30" },
  { id: "vc-3", code: "HAMPERS50K", name: "Potongan Hampers", description: "Potongan Rp 50.000 khusus pembelian hampers", type: "FIXED", value: 50000, minOrderAmount: 300000, usageLimit: 50, usedCount: 12, isActive: true, startDate: "2026-03-15", endDate: "2026-05-15" },
  { id: "vc-4", code: "GRATIS10", name: "Diskon 10%", description: "Diskon 10% untuk semua produk", type: "PERCENTAGE", value: 10, minOrderAmount: 50000, maxDiscount: 30000, usageLimit: 500, usedCount: 234, isActive: false, startDate: "2026-01-01", endDate: "2026-03-31" },
  { id: "vc-5", code: "BEKAL20", name: "Promo Bekal Sekolah", description: "Potongan Rp 20.000 untuk paket bekal sekolah", type: "FIXED", value: 20000, minOrderAmount: 80000, usageLimit: 100, usedCount: 8, isActive: true, startDate: "2026-04-01", endDate: "2026-06-30" },
];

// ─── Banners ───

export const MOCK_BANNERS: Banner[] = [
  { id: "bn-1", title: "Artisanal Goodness Since 1990", subtitle: "Handmade with Love in Gorontalo", image: "/images/banners/hero-main.jpg", ctaText: "Lihat Produk", ctaLink: "/products", isActive: true, order: 1 },
  { id: "bn-2", title: "Hampers Lebaran 2026", subtitle: "Pesan sekarang, dapatkan diskon hingga 15%", image: "/images/banners/hampers-promo.jpg", ctaText: "Pesan Hampers", ctaLink: "/products?category=hampers-paket", isActive: true, order: 2 },
  { id: "bn-3", title: "Paket Bekal Sekolah", subtitle: "Makan bergizi untuk si buah hati", image: "/images/banners/bekal-sekolah.jpg", ctaText: "Pesan Sekarang", ctaLink: "/products?category=bekal-sekolah", isActive: true, order: 3 },
];

// ─── Testimonials ───

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "test-1", name: "Ibu Siti Rahayu", role: "Pelanggan Setia sejak 2015", rating: 5, comment: "Dapoer Ajung sudah jadi langganan keluarga kami. Setiap Lebaran pasti pesan nastar dan kastengel. Rasanya konsisten enak dari dulu!", productName: "Nastar Klasik" },
  { id: "test-2", name: "Pak Hendra Gorontalo", role: "Pelanggan Korporat", rating: 5, comment: "Saya selalu pesan hampers dari Dapoer Ajung untuk klien kantor. Packaging-nya elegan, rasa kue-nya premium. Tidak pernah mengecewakan!", productName: "Hampers Lebaran Exclusive" },
  { id: "test-3", name: "Maya Putri", role: "Ibu Rumah Tangga", rating: 5, comment: "Bingka kentang-nya benar-benar rasa asli Gorontalo. Anak-anak suka sekali! Pengiriman juga cepat dan rapi.", productName: "Bingka Kentang" },
];

// ─── FAQ ───

export const MOCK_FAQS: FAQItem[] = [
  { id: "faq-1", question: "Bagaimana cara memesan?", answer: "Anda bisa memesan langsung melalui website kami atau melalui WhatsApp. Pilih produk, masukkan ke keranjang, dan lanjutkan ke checkout. Atau hubungi kami via WhatsApp untuk pemesanan custom.", category: "Pemesanan", order: 1 },
  { id: "faq-2", question: "Apakah bisa pesan dalam jumlah banyak untuk acara?", answer: "Tentu! Kami menerima pesanan dalam jumlah besar untuk hajatan, acara kantor, dan event. Silakan hubungi kami minimal 3 hari sebelumnya agar kami bisa mempersiapkan pesanan Anda dengan baik.", category: "Pemesanan", order: 2 },
  { id: "faq-3", question: "Apa saja metode pembayaran yang tersedia?", answer: "Kami menerima pembayaran via Transfer Bank (BRI, BNI), QRIS (semua e-wallet), dan COD (bayar di tempat) untuk area Kota Gorontalo.", category: "Pembayaran", order: 3 },
  { id: "faq-4", question: "Berapa biaya pengiriman?", answer: "Biaya pengiriman menyesuaikan tarif kurir (Grab, Gojek, Maxim). Gratis ongkir untuk pembelian di atas Rp 200.000 dalam area Kota Gorontalo.", category: "Pengiriman", order: 4 },
  { id: "faq-5", question: "Berapa lama ketahanan kue?", answer: "Ketahanan bervariasi tergantung jenis: Kue basah 2-3 hari (suhu ruang), kue kering 2-3 minggu (toples tertutup rapat), roti 1-2 hari. Detail ada di halaman masing-masing produk.", category: "Produk", order: 5 },
  { id: "faq-6", question: "Apakah ada produk yang mengandung allergen?", answer: "Ya, sebagian besar produk kami mengandung telur, gluten, dan susu. Informasi allergen lengkap tersedia di halaman detail setiap produk. Jika Anda memiliki alergi khusus, silakan hubungi kami.", category: "Produk", order: 6 },
];

// ─── Chat Conversations ───

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  { id: "conv-1", customerName: "Fatimah Hasan", lastMessage: "Terima kasih ya kak, sudah diterima kue-nya 😊", lastMessageAt: "2026-04-11T10:30:00Z", unreadCount: 0, isActive: true },
  { id: "conv-2", customerName: "Ahmad Rizal", lastMessage: "Kak, bisa dikonfirmasi pembayaran saya?", lastMessageAt: "2026-04-11T09:45:00Z", unreadCount: 1, isActive: true },
  { id: "conv-3", customerName: "Sri Wahyuni", lastMessage: "Untuk 5 hampers gold bisa ready kapan ya?", lastMessageAt: "2026-04-10T16:00:00Z", unreadCount: 2, isActive: true },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: "msg-1", conversationId: "conv-2", senderId: "cust-2", senderName: "Ahmad Rizal", senderType: "CUSTOMER", message: "Halo kak, saya sudah transfer untuk pesanan DA-20260411-002", isRead: true, createdAt: "2026-04-11T09:35:00Z" },
  { id: "msg-2", conversationId: "conv-2", senderId: "admin-1", senderName: "Admin", senderType: "ADMIN", message: "Baik kak, mohon kirimkan bukti transfernya ya 🙏", isRead: true, createdAt: "2026-04-11T09:40:00Z" },
  { id: "msg-3", conversationId: "conv-2", senderId: "cust-2", senderName: "Ahmad Rizal", senderType: "CUSTOMER", message: "Kak, bisa dikonfirmasi pembayaran saya?", isRead: false, createdAt: "2026-04-11T09:45:00Z" },
];

// ─── Dashboard Stats ───

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  todayOrders: 12,
  todayRevenue: 2450000,
  pendingOrders: 3,
  topProduct: "Bingka Kentang",
  totalProducts: 8,
  lowStockCount: 2,
  weeklyGrowth: 12.5,
  monthlyRevenue: 45_600_000,
};

// ─── Sales Data (7 days) ───

export const MOCK_SALES_DATA: SalesDataPoint[] = [
  { date: "2026-04-05", revenue: 1250000, orders: 8 },
  { date: "2026-04-06", revenue: 980000, orders: 5 },
  { date: "2026-04-07", revenue: 2100000, orders: 12 },
  { date: "2026-04-08", revenue: 1850000, orders: 10 },
  { date: "2026-04-09", revenue: 3200000, orders: 18 },
  { date: "2026-04-10", revenue: 2750000, orders: 15 },
  { date: "2026-04-11", revenue: 2450000, orders: 12 },
];

// ─── Top Products ───

export const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { productId: "prod-1", productName: "Bingka Kentang", productImage: "/images/products/bingka-kentang-1.jpg", totalSold: 245, revenue: 6125000 },
  { productId: "prod-2", productName: "Nastar Klasik", productImage: "/images/products/nastar-1.jpg", totalSold: 180, revenue: 15300000 },
  { productId: "prod-5", productName: "Lapis Legit", productImage: "/images/products/lapis-legit-1.jpg", totalSold: 42, revenue: 10500000 },
  { productId: "prod-3", productName: "Kastengel Keju", productImage: "/images/products/kastengel-1.jpg", totalSold: 156, revenue: 14040000 },
  { productId: "prod-7", productName: "Hampers Lebaran", productImage: "/images/products/hampers-lebaran-1.jpg", totalSold: 35, revenue: 15750000 },
];

// ─── Stock Movements ───

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  { id: "sm-1", productId: "prod-1", productName: "Bingka Kentang", variantName: "Regular", type: "IN", quantity: 20, reason: "Produksi pagi", createdBy: "Admin", createdAt: "2026-04-11T06:00:00Z" },
  { id: "sm-2", productId: "prod-1", productName: "Bingka Kentang", variantName: "Regular", type: "OUT", quantity: 3, reason: "Pesanan DA-20260411-001", createdBy: "System", createdAt: "2026-04-11T08:00:00Z" },
  { id: "sm-3", productId: "prod-4", productName: "Roti Abon", type: "IN", quantity: 50, reason: "Produksi pagi", createdBy: "Admin", createdAt: "2026-04-11T05:30:00Z" },
  { id: "sm-4", productId: "prod-5", productName: "Lapis Legit", variantName: "Setengah Loyang", type: "ADJUSTMENT", quantity: -2, reason: "Koreksi stok (rusak)", createdBy: "Admin", createdAt: "2026-04-10T14:00:00Z" },
];

// ─── Users ───

export const MOCK_USERS: User[] = [
  { id: "user-1", name: "Ajung (Owner)", email: "ajung@dapoerajung.co.id", phone: "081234567890", role: "OWNER", isActive: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-04-11T00:00:00Z" },
  { id: "user-2", name: "Rahma (Staff)", email: "rahma@dapoerajung.co.id", phone: "081234567896", role: "STAFF", isActive: true, createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-04-11T00:00:00Z" },
  { id: "user-3", name: "Deni (Kasir)", email: "deni@dapoerajung.co.id", phone: "081234567897", role: "KASIR", isActive: true, createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-04-11T00:00:00Z" },
];

// ─── Current User (Mock Auth) ───

export const CURRENT_USER: User = MOCK_USERS[0]; // Owner role for demo
