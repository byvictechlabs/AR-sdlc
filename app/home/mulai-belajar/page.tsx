import Link from "next/link";
import { db } from "@/db";
import { sdlcMethods } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import ModelPreloader from "@/components/ModelPreloader";
import { 
  ArrowLeft, 
  Lightbulb,
  List, 
  RefreshCw, 
  Settings, 
  Zap, 
  MonitorSmartphone, 
  RotateCw, 
  RotateCcw, 
  TrendingUp, 
  Network, 
  Infinity, 
  type LucideIcon 
} from "lucide-react";

// Helper function untuk mencocokkan nama metode dengan ikon yang sesuai
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
  return RefreshCw; // Default icon
};

export default async function MulaiBelajarPage() {
  const methods = await db
    .select()
    .from(sdlcMethods)
    .where(eq(sdlcMethods.status, "published"))
    .orderBy(asc(sdlcMethods.sortOrder));

  return (
    // Background putih bersih menyesuaikan gambar referensi
    <div className="relative min-h-dvh bg-white pb-20 overflow-hidden">
      <ModelPreloader />
      
      {/* --- HEADER (Biru Gradasi) --- */}
      <header className="relative z-50 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md">
        {/* Pola Bokeh di Header (opsional, untuk efek seperti gambar) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
        </div>

        <div className="relative mx-auto flex h-16 max-w-lg items-center justify-center px-4">
          <Link
            href="/home"
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white active:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-white tracking-wide">
            Pilih Metode SDLC
          </h1>
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <div className="mx-auto max-w-lg px-6 py-8">

        {/* --- JUDUL & SUBTITLE --- */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
            Menu Metode SDLC
          </h2>
          <p className="mt-1.5 text-xs font-medium text-gray-500 leading-relaxed">
            Pilih salah satu metode untuk melihat visualisasi 3D beserta penjelasan dan audio narasi.
          </p>
        </div>

        {methods.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-sm text-gray-500">Belum ada metode yang dipublikasikan.</p>
          </div>
        ) : (
          /* GRID 2 KOLOM KARTU METODE */
          <div className="grid grid-cols-2 gap-4">
            {methods.map((method, index) => {
              const Icon = getMethodIcon(method.name);

              return (
                <Link
                  key={method.id}
                  href={`/learn/ar.html?method=${method.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md active:scale-95"
                >
                  {/* Garis Aksen Atas */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-blue-400" />

                  <div className="flex flex-1 flex-col items-center px-3 pt-5 pb-4 text-center">
                    {/* Ikon Metode */}
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-md shadow-blue-500/30 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-7 w-7" strokeWidth={1.5} />
                      </div>
                      {/* Nomor Urut Metode */}
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Nama Metode */}
                    <h3 className="mt-3 text-sm font-bold text-gray-800 leading-tight">
                      {method.name}
                    </h3>

                    {/* Deskripsi Singkat */}
                    {method.description ? (
                      <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-gray-500 line-clamp-2">
                        {method.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* --- BANNER INFORMASI BAWAH --- */}
        <div className="mt-10 flex items-center gap-4 rounded-xl bg-blue-100/50 p-4 border border-blue-200/50">
          <Lightbulb className="h-8 w-8 shrink-0 text-blue-500" strokeWidth={2} />
          <p className="text-xs font-medium text-gray-600 leading-relaxed">
            Klik kartu metode untuk membuka halaman scanning marker dan mulai pengalaman AR.
          </p>
        </div>
      </div>

      {/* --- FOOTER BAWAH --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 pt-3 pb-5 flex flex-col items-center justify-center z-20">
        <p className="text-[10px] text-white/90 font-medium tracking-wide">
          © 2026 SDLC AR — Media Pembelajaran Interaktif
        </p>
        {/* Indikator Home Screen iPhone */}
        <div className="w-32 h-1 bg-white/50 rounded-full mt-3" />
      </div>

    </div>
  );
}