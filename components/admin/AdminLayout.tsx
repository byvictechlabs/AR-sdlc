"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
