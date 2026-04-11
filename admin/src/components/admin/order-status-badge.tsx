import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Sedang Diproses",
  READY: "Siap",
  SHIPPING: "Sedang Dikirim",
  DELIVERED: "Terkirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  CONFIRMED: "bg-info/10 text-info border-info/20",
  PROCESSING: "bg-primary/10 text-primary border-primary/20",
  READY: "bg-secondary/10 text-secondary-dark border-secondary/20",
  SHIPPING: "bg-info/10 text-info border-info/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const label = STATUS_LABELS[status] || status;
  const style = statusStyles[status] || "bg-muted text-muted-foreground border-border";

  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium capitalize", style, className)}
    >
      {label}
    </Badge>
  );
}
