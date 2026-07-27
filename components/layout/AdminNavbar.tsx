"use client";

import { signOut } from "next-auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminNavbarProps {
  title?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminNavbar({ title, user }: AdminNavbarProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="hidden h-8 w-1 rounded-full bg-gradient-to-b from-[oklch(0.45_0.2_264)] to-[oklch(0.55_0.18_264)]" />
        <h1 className="text-lg font-semibold text-[oklch(0.2_0.03_264)]">
          {title || "Dashboard"}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 hover:bg-muted/60 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-[oklch(0.45_0.2_264)] to-[oklch(0.55_0.2_270)] text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium leading-tight">
              {user?.name || "Admin"}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {user?.email || "admin@sdlc-ar.com"}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-[oklch(0.45_0.2_264)] to-[oklch(0.55_0.2_270)] text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "admin@sdlc-ar.com"}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 text-destructive cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
