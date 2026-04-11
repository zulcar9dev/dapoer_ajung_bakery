// ═══════════════════════════════════════════════════════
// Dapoer Ajung Cookies & Bakery — Shared Type Definitions
// ═══════════════════════════════════════════════════════

// ─── User & Auth ───

export type UserRole = "OWNER" | "STAFF" | "KASIR";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ───

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;         // e.g., "Mini", "Regular", "Large"
  type: "SIZE" | "FLAVOR";
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category: Category;
  basePrice: number;
  discountPrice?: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];         // e.g., "Best Seller", "Heritage Recipe"
  rating: number;
  reviewCount: number;
  totalStock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isPreOrderOnly: boolean;
  preOrderLeadDays?: number; // days needed to prepare
  weight: number;          // in grams
  ingredients?: string;
  allergens?: string[];
  shelfLife?: string;      // e.g., "3 hari", "2 minggu"
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ───

export interface CartItem {
  id: string;              // productId or productId-variantId
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

// ─── Order ───

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentMethod = "TRANSFER" | "QRIS" | "COD";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";
export type DeliveryMethod = "DELIVERY" | "PICKUP";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;     // e.g., "DA-20260411-001"
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;

  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;

  voucherCode?: string;

  deliveryMethod: DeliveryMethod;
  deliveryDate: string;
  deliveryTimeSlot: string; // e.g., "09:00 - 12:00"

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;

  status: OrderStatus;
  statusHistory: OrderStatusHistory[];

  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

// ─── Review ───

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;          // 1-5
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
}

// ─── Promo & Voucher ───

export type VoucherType = "PERCENTAGE" | "FIXED";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: VoucherType;
  value: number;           // percentage or fixed amount
  minOrderAmount: number;
  maxDiscount?: number;    // max cap for percentage type
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

// ─── Chat ───

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: "CUSTOMER" | "ADMIN";
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isActive: boolean;
}

// ─── Reports ───

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImage: string;
  totalSold: number;
  revenue: number;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  topProduct: string;
  totalProducts: number;
  lowStockCount: number;
  weeklyGrowth: number;     // percentage
  monthlyRevenue: number;
}

// ─── Stock ───

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

// ─── Store Settings ───

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  province: string;
  operatingHours: {
    days: string;
    open: string;
    close: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  bankAccounts: BankAccount[];
  qrisImage?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

// ─── FAQ ───

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// ─── Testimonial ───

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  role?: string;           // e.g., "Pelanggan Setia"
  rating: number;
  comment: string;
  productName?: string;
}
