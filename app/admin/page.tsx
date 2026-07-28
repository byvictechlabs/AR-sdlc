"use client";

import { useEffect, useState } from "react";
import { BookOpen, Layers, Users, ArrowRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin";

interface Stats {
  methods: number;
  steps: number;
  users: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ methods: 0, steps: 0, users: 0 });

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) =>
        setStats({
          methods: d.methods ?? 0,
          steps: d.steps ?? 0,
          users: d.users ?? 0,
        })
      )
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your learning content."
        icon={BookOpen}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Methods"
          value={stats.methods}
          description="SDLC methods"
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Steps"
          value={stats.steps}
          description="Total learning steps"
          icon={Layers}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Users"
          value={stats.users}
          description="Admin users"
          icon={Users}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/admin/methods",
              icon: BookOpen,
              label: "Manage Methods",
              desc: "View and edit SDLC methods",
              color: "bg-blue-600",
            },
            {
              href: "/admin/steps",
              icon: Layers,
              label: "Manage Steps",
              desc: "Configure learning steps",
              color: "bg-indigo-600",
            },
            {
              href: "/admin/users",
              icon: Users,
              label: "Manage Users",
              desc: "Admin user accounts",
              color: "bg-violet-600",
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color} text-white`}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
