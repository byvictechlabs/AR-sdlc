"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Tag,
  Users,
  ChevronLeft,
  Box,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Methods",
    href: "/admin/methods",
    icon: BookOpen,
  },
  {
    label: "Steps",
    href: "/admin/steps",
    icon: Layers,
  },
  {
    label: "Materials",
    href: "/admin/materials",
    icon: Box,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-[oklch(0.2_0.04_264)] via-[oklch(0.17_0.035_264)] to-[oklch(0.14_0.03_264)]",
        "text-white/90 border-r border-white/[0.06]",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/[0.08]",
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.6_0.2_264)] to-[oklch(0.5_0.22_270)] text-white text-sm font-bold shadow-lg shadow-blue-500/20">
          <Box className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">AR SDLC</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-gradient-to-r from-[oklch(0.45_0.18_264)]/40 to-[oklch(0.5_0.2_264)]/20 text-white shadow-lg shadow-blue-500/10"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-[oklch(0.7_0.18_264)]"
                    : "text-white/30 group-hover:text-white/50"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.18_264)] shadow-[0_0_8px_oklch(0.7_0.18_264/0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/30",
            "hover:text-white/60 hover:bg-white/[0.05] transition-all duration-200"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
