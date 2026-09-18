"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import type { Step, Method } from "@/stores/ar-store";

const ARViewer = lazy(() =>
  import("@/components/ar/ARViewer").then((m) => ({ default: m.ARViewer }))
);

function checkArSupport(): boolean {
  return !!navigator.mediaDevices?.getUserMedia;
}

export function ScanPage({
  method,
  steps,
}: {
  method: Method;
  steps: Step[];
}) {
  const [arAvailable, setArAvailable] = useState(false);

  useEffect(() => {
    if (method.mindTargetIndex !== null && checkArSupport()) {
      setArAvailable(true);
    }
  }, [method.mindTargetIndex]);

  if (!arAvailable || method.mindTargetIndex === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-6">
        <p className="text-sm text-muted-foreground">
          AR tidak tersedia di perangkat ini
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white">
      
      {/* --- HEADER --- */}
      <header className="relative z-50 flex h-14 w-full shrink-0 items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 shadow-sm">
        {/* Efek Bokeh Transparan */}
        <div className="absolute top-1 left-1/3 h-10 w-10 rounded-full bg-white/20 blur-md pointer-events-none" />
        <div className="absolute -bottom-2 right-1/3 h-12 w-12 rounded-full bg-white/10 blur-lg pointer-events-none" />
        
        <h1 className="text-base font-bold tracking-wide text-white">
          Scan Marker
        </h1>
      </header>

      {/* --- MAIN CONTENT & AR VIEWER --- */}
      <div className="relative flex-1 w-full bg-white">
        
        {/* AR Viewer dengan Suspense */}
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-white">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="mt-3 text-sm text-blue-500 font-medium">Memuat Kamera...</p>
              </div>
            </div>
          }
        >
          {/* Komponen AR Anda akan merender feed kamera di sini */}
          <ARViewer method={method} steps={steps} />
        </Suspense>

        {/* --- SCANNER OVERLAY UI --- */}
        {/* pointer-events-none agar tidak memblokir interaksi sentuhan ke kanvas AR di bawahnya */}
        <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
          
          {/* Kotak Reticle (Scanner) */}
          <div className="relative h-64 w-64 -mt-16">
            {/* Sudut Kiri Atas */}
            <div className="absolute top-0 left-0 h-16 w-16 rounded-tl-[24px] border-t-[4px] border-l-[4px] border-blue-500"></div>
            {/* Sudut Kanan Atas */}
            <div className="absolute top-0 right-0 h-16 w-16 rounded-tr-[24px] border-t-[4px] border-r-[4px] border-blue-500"></div>
            {/* Sudut Kiri Bawah */}
            <div className="absolute bottom-0 left-0 h-16 w-16 rounded-bl-[24px] border-b-[4px] border-l-[4px] border-blue-500"></div>
            {/* Sudut Kanan Bawah */}
            <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-[24px] border-b-[4px] border-r-[4px] border-blue-500"></div>

            {/* Garis Scan Tengah */}
            <div className="absolute top-1/2 left-8 right-8 h-[2px] -translate-y-1/2 bg-gray-700/80 shadow-sm"></div>
          </div>

          {/* Tombol Action/Capture di Bawah */}
          {/* pointer-events-auto dikembalikan ke tombol agar bisa diklik jika nanti dibutuhkan */}
          <div className="absolute bottom-12 pointer-events-auto">
            <button 
              type="button"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg active:scale-95 transition-transform"
              aria-label="Scan Action"
            >
              {/* Lingkaran dalam (opsional, jika ingin efek dua lapis) */}
              <div className="h-14 w-14 rounded-full border-2 border-white/20"></div>
            </button>
          </div>

        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="relative z-50 flex shrink-0 flex-col items-center justify-center bg-blue-600 pb-5 pt-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <p className="text-[10px] font-medium tracking-wide text-white/90">
          © 2026 SDLC AR — Media Pembelajaran Interaktif
        </p>
        {/* Indikator Home Screen iPhone */}
        <div className="mt-3 h-1 w-32 rounded-full bg-white/50" />
      </footer>

    </div>
  );
}