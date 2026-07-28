import { cn } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "danger" | "secondary";

const statusStyles: Record<StatusVariant, { badge: string; dot: string }> = {
  default: {
    badge: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    dot: "bg-blue-600",
  },
  success: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    dot: "bg-emerald-600",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    dot: "bg-amber-600",
  },
  danger: {
    badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    dot: "bg-red-600",
  },
  secondary: {
    badge: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20",
    dot: "bg-slate-500",
  },
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
}

export function StatusBadge({ label, variant = "default", showDot = false }: StatusBadgeProps) {
  const styles = statusStyles[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.badge
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      )}
      {label}
    </span>
  );
}

export function getMethodStatusVariant(status: string): StatusVariant {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "secondary";
    default:
      return "default";
  }
}
