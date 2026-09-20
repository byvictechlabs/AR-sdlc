"use client";

import { useEffect } from "react";

export default function ModelPreloader() {
  useEffect(() => {
    const METHODS_API = "/api/methods";

    async function preloadModels() {
      try {
        const res = await fetch(METHODS_API);
        if (!res.ok) return;
        const methods = await res.json();

        for (const m of methods) {
          if (m.modelPath) {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = m.modelPath;
            link.as = "fetch";
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
            console.log("[Preloader] Prefetching:", m.modelPath);
          }
        }

        const markerRes = await fetch("/markers/targets.mind", { method: "HEAD" });
        if (markerRes.ok) {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = "/markers/targets.mind";
          link.as = "fetch";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
          console.log("[Preloader] Prefetching: /markers/targets.mind");
        }
      } catch (e) {
        console.warn("[Preloader] Failed:", e);
      }
    }

    preloadModels();
  }, []);

  return null;
}
