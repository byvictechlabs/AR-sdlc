"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  PanelLeftClose,
  PanelLeft,
  Box,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Methods", href: "/admin/methods", icon: BookOpen },
  { label: "Steps", href: "/admin/steps", icon: Layers },
  { label: "Users", href: "/admin/users", icon: Users },
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
        "flex flex-col bg-[#0f172a] text-slate-400 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/[0.06]",
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/25">
          <Box className="h-4.5 w-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-white leading-tight tracking-tight">
              AR SDLC
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-tight mt-0.5">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Navigation
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto space-y-1", collapsed ? "px-3 pt-4" : "px-3")}>
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
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                collapsed && "justify-center px-0 py-2.5",
                isActive
                  ? "bg-blue-500/15 text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300"
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={cn("border-t border-white/[0.06]", collapsed ? "px-3 py-3" : "px-3 py-4")}>
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors duration-200",
            "hover:text-slate-300 hover:bg-white/[0.04]",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </div>
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Logout */}
        {!collapsed && (
          <a
            href="/api/auth/logout"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors duration-200 hover:text-red-400 hover:bg-red-500/10"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Log Out</span>
          </a>
        )}
      </div>
    </aside>
  );
}
