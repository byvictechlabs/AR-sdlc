import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  iconBg = "bg-slate-100",
  iconColor = "text-slate-400",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      )}
      <h3 className="mt-4 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
