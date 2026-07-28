"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Scan, Play, Pause, X, BookOpen, ChevronUp } from "lucide-react";

interface Step {
  id: string;
  meshName: string;
  title: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  stepOrder: number;
}

interface Method {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelPath: string;
  markerPath: string;
}

export function ScanPage({
  method,
  steps,
}: {
  method: Method;
  steps: Step[];
}) {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

  // Close on escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedStep(null);
    }
    if (selectedStep) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedStep]);

  return (
    <>
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Method Info */}
        <div className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Box className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                {method.name}
              </h2>
              {method.description && (
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {method.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AR Scanner Placeholder */}
        <div className="rounded-xl border-2 border-dashed border-blue-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Scan className="h-7 w-7 text-blue-500" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Scan Marker
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Arahkan kamera ke marker untuk memunculkan model 3D {method.name}.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Segera hadir
          </div>
        </div>

        {/* Steps List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Tahapan
          </h3>
          <div className="space-y-2">
            {sortedSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className="w-full rounded-xl border border-border/60 bg-white p-4 text-left shadow-sm active:bg-blue-50/50 active:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {step.stepOrder}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground rotate-90" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedStep(null)}
          />

          {/* Sheet */}
          <div
            ref={sheetRef}
            className="absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl safe-bottom animate-in slide-in-from-bottom duration-300"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-1 bg-white">
              <div className="h-1 w-8 rounded-full bg-slate-300" />
            </div>

            <div className="px-5 pb-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    {selectedStep.stepOrder}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {selectedStep.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {method.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-muted-foreground active:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Description */}
              {selectedStep.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {selectedStep.description}
                </p>
              )}

              {/* Content */}
              {selectedStep.content && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Materi Pembelajaran
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {selectedStep.content}
                  </p>
                </div>
              )}

              {/* Audio Player */}
              {selectedStep.audioUrl ? (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm shadow-blue-500/25 active:bg-blue-600 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      Audio Pembelajaran
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {isPlaying ? "Memutar..." : "Tap untuk memutar"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700 text-center">
                  Audio belum tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
