import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@shared/constants";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

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
  const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
  const label = config?.label || status;
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
