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
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black text-white">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <p className="mt-3 text-sm">Memuat AR...</p>
        </div>
      }
    >
      <ARViewer method={method} steps={steps} />
    </Suspense>
  );
}
