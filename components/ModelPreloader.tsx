"use client";

import { useEffect } from "react";

interface ModelPreloaderProps {
  modelPaths: string[];
}

export default function ModelPreloader({ modelPaths }: ModelPreloaderProps) {
  useEffect(() => {
    for (const path of modelPaths) {
      if (!path) continue;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      console.log("[Preloader] Prefetching:", path);
    }

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
