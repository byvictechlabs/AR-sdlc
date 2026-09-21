import Link from "next/link";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import ModelPreloader from "@/components/ModelPreloader";
import {
  ArrowLeft,
  RefreshCw,
  Settings,
  Zap,
  MonitorSmartphone,
  RotateCw,
  RotateCcw,
  TrendingUp,
  Network,
  Infinity,
  List,
  type LucideIcon,
} from "lucide-react";

const getMethodIcon = (name: string): LucideIcon => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("waterfall")) return List;
  if (lowerName.includes("agile")) return RefreshCw;
  if (lowerName.includes("scrum")) return Settings;
  if (lowerName.includes("big-bang") || lowerName.includes("big bang")) return Zap;
  if (lowerName.includes("prototype")) return MonitorSmartphone;
  if (lowerName.includes("spiral")) return RotateCw;
  if (lowerName.includes("iterative")) return RotateCcw;
  if (lowerName.includes("incremental")) return TrendingUp;
  if (lowerName.includes("lean")) return Network;
  if (lowerName.includes("devops")) return Infinity;
  return RefreshCw;
};

const getPublishedMethods = unstable_cache(
  async () =>
    db
      .select()
      .from(sdlcMethods)
      .where(eq(sdlcMethods.status, "published"))
      .orderBy(asc(sdlcMethods.sortOrder)),
  ["published-methods"],
  { revalidate: 3600, tags: ["methods"] }
);

export default async function MulaiBelajarPage() {
  const methods = await getPublishedMethods();
  const modelPaths = methods.map((m) => m.modelPath).filter(Boolean);

  return (
    <div className="relative flex h-dvh flex-col bg-white overflow-hidden">
      <ModelPreloader modelPaths={modelPaths} />

      {/* --- HEADER --- */}
      <header className="relative z-50 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md shrink-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        </div>
        <div className="relative mx-auto flex h-14 max-w-lg items-center px-4">
          <Link
            href="/home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white active:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="ml-3 text-base font-bold text-white tracking-wide">
            Pilih Metode SDLC
          </h1>
        </div>
      </header>

      {/* --- KONTEN --- */}
      <div className="flex-1 flex flex-col mx-auto w-full max-w-lg px-5 pt-4 pb-20 overflow-y-auto">
        {methods.length === 0 ? (
          <div className="flex-1 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Belum ada metode yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {methods.map((method, index) => {
              const Icon = getMethodIcon(method.name);
              return (
                <Link
                  key={method.id}
                  href={`/learn/ar.html?method=${method.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md active:scale-95"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
                  <div className="flex flex-1 flex-col items-center px-3 pt-4 pb-3 text-center">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-md shadow-blue-500/30 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-gray-800 leading-tight">
                      {method.name}
                    </h3>
                    {method.description ? (
                      <p className="mt-1 text-[10px] font-medium leading-relaxed text-gray-500 line-clamp-2">
                        {method.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 pt-2.5 pb-4 flex flex-col items-center justify-center z-20 shrink-0">
        <p className="text-[9px] text-white/90 font-medium tracking-wide">
          © 2026 SDLC AR — Media Pembelajaran Interaktif
        </p>
        <div className="w-32 h-1 bg-white/50 rounded-full mt-2" />
      </div>
    </div>
  );
}
