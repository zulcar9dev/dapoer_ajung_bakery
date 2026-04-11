// ═══════════════════════════════════════════════════════
// Dapoer Ajung Cookies & Bakery — Shared Utilities
// ═══════════════════════════════════════════════════════

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility: Merge Tailwind classes safely (cn helper for shadcn/ui).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format Rupiah Indonesia.
 * @example formatRupiah(150000) => "Rp 150.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia.
 * @example formatDate("2026-04-11") => "11 April 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Format tanggal dan waktu ke format Indonesia.
 * @example formatDateTime("2026-04-11T10:30:00") => "11 Apr 2026, 10:30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format waktu relatif (e.g., "2 jam lalu", "5 menit lalu").
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return formatDate(dateString);
}

/**
 * Buat slug dari string.
 * @example slugify("Bingka Kentang") => "bingka-kentang"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Truncate text dengan ellipsis.
 * @example truncate("Hello World", 5) => "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate order number.
 * @example generateOrderNumber() => "DA-20260411-001"
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `DA-${dateStr}-${random}`;
}

/**
 * Hitung persentase diskon.
 * @example getDiscountPercentage(100000, 75000) => 25
 */
export function getDiscountPercentage(
  originalPrice: number,
  discountPrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

/**
 * Render rating sebagai array bintang.
 * @example getRatingStars(4.5, 5) => [true, true, true, true, "half"]
 */
export function getRatingStars(
  rating: number,
  maxStars: number = 5
): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push("full");
    } else if (rating >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }
  return stars;
}

/**
 * Format nomor telepon Indonesia.
 * @example formatPhone("081234567890") => "+62 812-3456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const withCountryCode = cleaned.startsWith("0")
    ? "62" + cleaned.slice(1)
    : cleaned;

  if (withCountryCode.length >= 11) {
    const cc = withCountryCode.slice(0, 2);
    const area = withCountryCode.slice(2, 5);
    const part1 = withCountryCode.slice(5, 9);
    const part2 = withCountryCode.slice(9);
    return `+${cc} ${area}-${part1}-${part2}`;
  }
  return phone;
}

/**
 * Delay utility for async operations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check apakah toko sedang buka.
 */
export function isStoreOpen(openTime: string, closeTime: string): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Check if current day is weekday (Mon-Fri)
  const day = now.getDay();
  if (day === 0 || day === 6) return false; // Weekend (Sabtu-Minggu)

  return currentTime >= openMinutes && currentTime <= closeMinutes;
}
