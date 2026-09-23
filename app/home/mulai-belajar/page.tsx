import Link from "next/link";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import ModelPreloader from "@/components/ModelPreloader";
import { MethodCard } from "./MethodCard";
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
              const lowerName = method.name.toLowerCase();
              let iconName = "agile";
              if (lowerName.includes("waterfall")) iconName = "waterfall";
              else if (lowerName.includes("agile")) iconName = "agile";
              else if (lowerName.includes("scrum")) iconName = "scrum";
              else if (lowerName.includes("big-bang") || lowerName.includes("big bang")) iconName = "big-bang";
              else if (lowerName.includes("prototype")) iconName = "prototype";
              else if (lowerName.includes("spiral")) iconName = "spiral";
              else if (lowerName.includes("iterative")) iconName = "iterative";
              else if (lowerName.includes("incremental")) iconName = "incremental";
              else if (lowerName.includes("lean")) iconName = "lean";
              else if (lowerName.includes("devops")) iconName = "devops";

              return (
                <MethodCard
                  key={method.id}
                  id={method.id}
                  slug={method.slug}
                  name={method.name}
                  description={method.description}
                  modelPath={method.modelPath}
                  index={index}
                  iconName={iconName}
                />
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
