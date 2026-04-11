import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { LiveChatWidget } from "@/components/storefront/live-chat-widget";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { SearchDialog } from "@/components/storefront/search-dialog";

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
      <SearchDialog />
      <LiveChatWidget />
    </div>
  );
}
