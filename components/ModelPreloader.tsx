"use client";

import { useEffect } from "react";

interface ModelPreloaderProps {
  modelPaths: string[];
}

export default function ModelPreloader({ modelPaths }: ModelPreloaderProps) {
  useEffect(() => {
    // Prefetch model GLB DIMATIKAN (sebelumnya ~48MB langsung diunduh semua
    // saat halaman dibuka → bandwidth ketelen, halaman terasa lambat).
    // Unduhan model sekarang on-demand saat pengguna klik kartu metode
    // (lihat MethodCard.tsx → preloadModel + Cache API ar-models-v1).
    console.log(
      "[Preloader] Prefetch model dilewati (on-demand di klik kartu):",
      modelPaths.length,
      "model"
    );

    // Marker targets.mind tetap diprefetch — ukurannya kecil (~0,9MB)
    // dan dibutuhkan begitu halaman AR dibuka.
    const markerLink = document.createElement("link");
    markerLink.rel = "prefetch";
    markerLink.href = "/markers/targets.mind";
    markerLink.as = "fetch";
    markerLink.crossOrigin = "anonymous";
    document.head.appendChild(markerLink);
    console.log("[Preloader] Prefetching: /markers/targets.mind");
  }, [modelPaths]);

  return null;
}
