import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dapoer Ajung Cookies & Bakery — Handmade with Love in Gorontalo",
    template: "%s | Dapoer Ajung Cookies & Bakery",
  },
  description:
    "Kue tradisional khas Gorontalo sejak 1990. Bingka Kentang, Nastar, Kastengel, Lapis Legit, Hampers, dan Bekal Sekolah. Pesan online, kirim area Gorontalo.",
  keywords: [
    "kue gorontalo",
    "bakery gorontalo",
    "bingka kentang",
    "kue tradisional",
    "hampers lebaran",
    "dapoer ajung",
    "cookies bakery",
    "toko kue online",
    "bekal sekolah gorontalo",
  ],
  authors: [{ name: "Dapoer Ajung Cookies & Bakery" }],
  creator: "Dapoer Ajung Cookies & Bakery",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dapoerajung.co.id",
    siteName: "Dapoer Ajung Cookies & Bakery",
    title: "Dapoer Ajung Cookies & Bakery — Handmade with Love in Gorontalo",
    description:
      "Kue tradisional khas Gorontalo sejak 1990. Pesan online, kirim area Gorontalo.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dapoer Ajung Cookies & Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dapoer Ajung Cookies & Bakery",
    description: "Kue tradisional khas Gorontalo sejak 1990.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfairDisplay.variable} ${poppins.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
