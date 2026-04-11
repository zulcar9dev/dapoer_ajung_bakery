// ═══════════════════════════════════════════════════════
// Dapoer Ajung Cookies & Bakery — Zod Validators
// ═══════════════════════════════════════════════════════

import { z } from "zod";

// ─── Checkout Form ───

export const customerInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^(\+62|62|0)[0-9]+$/, "Format nomor telepon tidak valid"),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
});

export const deliveryInfoSchema = z.object({
  method: z.enum(["DELIVERY", "PICKUP"], {
    error: "Pilih metode pengiriman",
  }),
  date: z.string().min(1, "Pilih tanggal pengiriman"),
  timeSlot: z.string().min(1, "Pilih jam pengiriman"),
});

export const paymentInfoSchema = z.object({
  method: z.enum(["TRANSFER", "QRIS", "COD"], {
    error: "Pilih metode pembayaran",
  }),
});

export const checkoutSchema = z.object({
  customer: customerInfoSchema,
  delivery: deliveryInfoSchema,
  payment: paymentInfoSchema,
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  voucherCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ─── Product Form (Admin) ───

export const productVariantSchema = z.object({
  name: z.string().min(1, "Nama varian wajib diisi"),
  type: z.enum(["SIZE", "FLAVOR"]),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
  sku: z.string().min(1, "SKU wajib diisi"),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nama produk minimal 3 karakter")
    .max(200, "Nama produk maksimal 200 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  shortDescription: z
    .string()
    .max(200, "Deskripsi singkat maksimal 200 karakter")
    .optional(),
  categoryId: z.string().min(1, "Pilih kategori"),
  basePrice: z.number().min(1000, "Harga minimal Rp 1.000"),
  discountPrice: z
    .number()
    .min(0, "Harga diskon tidak boleh negatif")
    .optional(),
  variants: z.array(productVariantSchema).optional(),
  tags: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPreOrderOnly: z.boolean().default(false),
  preOrderLeadDays: z.number().int().min(1).optional(),
  weight: z.number().min(1, "Berat minimal 1 gram"),
  ingredients: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  shelfLife: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Voucher Form (Admin) ───

export const voucherSchema = z.object({
  code: z
    .string()
    .min(3, "Kode minimal 3 karakter")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z0-9]+$/, "Kode hanya boleh huruf besar dan angka"),
  name: z.string().min(3, "Nama voucher wajib diisi"),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(1, "Nilai voucher wajib diisi"),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1, "Batas penggunaan minimal 1"),
  isActive: z.boolean().default(true),
  startDate: z.string().min(1, "Pilih tanggal mulai"),
  endDate: z.string().min(1, "Pilih tanggal berakhir"),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;

// ─── Login Form ───

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Review Form ───

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z
    .string()
    .min(10, "Ulasan minimal 10 karakter")
    .max(1000, "Ulasan maksimal 1000 karakter"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ─── Store Settings Form (Admin) ───

export const storeSettingsSchema = z.object({
  storeName: z.string().min(3, "Nama toko wajib diisi"),
  tagline: z.string().optional(),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
  email: z.string().email("Format email tidak valid"),
  address: z.string().min(10, "Alamat wajib diisi"),
  operatingDays: z.string().min(1, "Hari operasional wajib diisi"),
  openTime: z.string().min(1, "Jam buka wajib diisi"),
  closeTime: z.string().min(1, "Jam tutup wajib diisi"),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
