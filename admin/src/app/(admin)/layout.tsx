"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Topbar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
