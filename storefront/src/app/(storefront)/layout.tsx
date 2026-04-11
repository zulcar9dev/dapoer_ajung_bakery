import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppFAB } from "@/components/storefront/whatsapp-fab";
import { CartSheet } from "@/components/storefront/cart-sheet";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSheet />
      <WhatsAppFAB />
    </div>
  );
}
