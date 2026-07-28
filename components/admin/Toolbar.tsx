import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      {children}
    </div>
  );
}
