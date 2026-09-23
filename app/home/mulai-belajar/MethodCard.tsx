"use client";

import { useState } from "react";
import {
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
} from "lucide-react";

const iconMap = {
  waterfall: List,
  agile: RefreshCw,
  scrum: Settings,
  "big-bang": Zap,
  prototype: MonitorSmartphone,
  spiral: RotateCw,
  iterative: RotateCcw,
  incremental: TrendingUp,
  lean: Network,
  devops: Infinity,
};

interface MethodCardProps {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  modelPath: string;
  index: number;
  iconName: string;
}

export function MethodCard({
  slug,
  name,
  description,
  modelPath,
  index,
  iconName,
}: MethodCardProps) {
  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const Icon = (iconMap[iconName as keyof typeof iconMap] || RefreshCw);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("[MethodCard] Click:", slug, "| Model:", modelPath);
    setIsPreloading(true);
    setProgress(0);
    setStatus("Mengunduh model...");

    try {
      console.log("[MethodCard] Starting fetch:", modelPath);
      const response = await fetch(modelPath);
      if (!response.ok) throw new Error("HTTP " + response.status);

      const contentLength = +(response.headers.get("Content-Length") || 0);
      const reader = response.body!.getReader();
      let received = 0;
      const chunks: Uint8Array[] = [];

      console.log("[MethodCard] Download started. Size:", (contentLength / 1048576).toFixed(1), "MB");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (contentLength > 0) {
          const pct = Math.round((received / contentLength) * 100);
          setProgress(pct);
          setStatus(
            `Mengunduh... ${pct}% (${(received / 1048576).toFixed(1)} / ${(
              contentLength / 1048576
            ).toFixed(1)} MB)`
          );
        } else {
          setStatus(`Mengunduh... ${(received / 1048576).toFixed(1)} MB`);
        }
      }

      console.log("[MethodCard] Download complete. Caching to SW...");

      // Cache model ke SW
      const blob = new Blob(chunks as BlobPart[], { type: "model/gltf-binary" });
      if ("caches" in window) {
        const cache = await caches.open("ar-models-v1");
        const blobUrl = URL.createObjectURL(blob);
        const blobRes = await fetch(blobUrl);
        await cache.put(modelPath, blobRes.clone());
        URL.revokeObjectURL(blobUrl);
        console.log("[MethodCard] Model cached successfully:", modelPath);
      } else {
        console.warn("[MethodCard] Cache API not available");
      }

      setProgress(100);
      setStatus("Siap! Membuka AR...");
      console.log("[MethodCard] Navigating to AR page...");

      // Navigate after short delay
      setTimeout(() => {
        console.log("[MethodCard] Final navigation to:", `/learn/ar.html?method=${slug}`);
        window.location.href = `/learn/ar.html?method=${slug}`;
      }, 800);
    } catch (error) {
      console.error("[MethodCard] Error:", error);
      setStatus("Download gagal. Coba lagi.");
      setIsPreloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPreloading}
        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {name}
          </h3>
          {description ? (
            <p className="mt-1 text-[10px] font-medium leading-relaxed text-gray-500 line-clamp-2">
              {description}
            </p>
          ) : null}
        </div>
      </button>

      {/* Preload Modal */}
      {isPreloading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Mempersiapkan {name}
            </h2>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status Text */}
            <p className="text-sm text-gray-600 font-mono text-center">
              {status}
            </p>

            {/* Progress Percentage */}
            <p className="text-center text-xs text-gray-500 mt-2">
              {progress}%
            </p>
          </div>
        </div>
      )}
    </>
  );
}
