import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard — Dapoer Ajung Cookies & Bakery",
    template: "%s | Admin Dapoer Ajung",
  },
  description: "Panel administrasi untuk mengelola toko, pesanan, produk, dan laporan Dapoer Ajung Cookies & Bakery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
