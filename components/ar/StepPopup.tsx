"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Play, Pause, Square, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useARStore, type Step } from "@/stores/ar-store";
import { speak, pause, resume, stop, isSpeaking, isPaused } from "@/ar/utils/tts";

type TtsStatus = "idle" | "playing" | "paused";

export function StepPopup({
  step,
  onClose,
}: {
  step: Step;
  onClose: () => void;
}) {
  const { isSpeaking: storeSpeaking, setSpeaking } = useARStore();
  const [ttsStatus, setTtsStatus] = useState<TtsStatus>("idle");

  useEffect(() => {
    setTtsStatus("idle");
  }, [step]);

  useEffect(() => {
    const id = setInterval(() => {
      const sp = isSpeaking();
      const pa = isPaused();
      if (sp && pa) setTtsStatus("paused");
      else if (sp) setTtsStatus("playing");
      else setTtsStatus("idle");
      setSpeaking(sp);
    }, 200);
    return () => clearInterval(id);
  }, [setSpeaking]);

  useEffect(() => {
    return () => {
      stop();
      setSpeaking(false);
    };
  }, [setSpeaking]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        stop();
        setSpeaking(false);
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, setSpeaking]);

  const handlePlayPause = useCallback(() => {
    if (ttsStatus === "idle") {
      const text = [step.title, step.description, step.content]
        .filter(Boolean)
        .join(". ");
      speak(text, () => setTtsStatus("idle"));
      setTtsStatus("playing");
    } else if (ttsStatus === "playing") {
      pause();
      setTtsStatus("paused");
    } else {
      resume();
      setTtsStatus("playing");
    }
  }, [ttsStatus, step, setTtsStatus]);

  const handleStop = useCallback(() => {
    stop();
    setTtsStatus("idle");
    setSpeaking(false);
  }, [setSpeaking]);

  const handleClose = useCallback(() => {
    stop();
    setSpeaking(false);
    onClose();
  }, [onClose, setSpeaking]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-lg rounded-t-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[40vh] overflow-y-auto px-6 py-4">
            {step.content && (
              <p className="leading-relaxed text-foreground/80">
                {step.content}
              </p>
            )}
            {!step.content && (
              <p className="text-muted-foreground italic">
                Tidak ada konten detail untuk tahap ini.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border/50 px-6 py-4">
            <Button
              variant={ttsStatus === "playing" ? "secondary" : "default"}
              className="flex-1"
              onClick={handlePlayPause}
            >
              {ttsStatus === "idle" && (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Dengarkan
                </>
              )}
              {ttsStatus === "playing" && (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Jeda
                </>
              )}
              {ttsStatus === "paused" && (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Lanjutkan
                </>
              )}
            </Button>
            {ttsStatus !== "idle" && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleStop}
              >
                <Square className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
