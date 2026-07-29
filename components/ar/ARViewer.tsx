"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Scan, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useARStore, type Step, type Method } from "@/stores/ar-store";
import { StepPopup } from "./StepPopup";

/* eslint-disable @typescript-eslint/no-explicit-any */

const AFRAME_CDN =
  "https://aframe.io/releases/1.6.0/aframe.min.js";
const MINDAR_AFRAME_CDN =
  "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    document.head.appendChild(s);
  });
}

export function ARViewer({
  method,
  steps,
}: {
  method: Method;
  steps: Step[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<any>(null);
  const stepsRef = useRef(steps);
  const [loading, setLoading] = useState(true);

  const {
    isTracking,
    isModelLoaded,
    selectedStep,
    setSelectedStep,
    cameraError,
    setTracking,
    setModelLoaded,
    setCameraError,
  } = useARStore();

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    // Set body styles BEFORE A-Frame creates canvas
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";

    if (!containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;
    let visibilityInterval: ReturnType<typeof setInterval> | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;

    (async () => {
      try {
        await loadScript(AFRAME_CDN);
        if (cancelled) return;

        await loadScript(MINDAR_AFRAME_CDN);
        if (cancelled) return;

        container.innerHTML = `
          <a-scene
            mindar-image="imageTargetSrc: /markers/targets.mind; uiLoading:no; uiError:no; autoStart:true;"
            color-space="sRGB"
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
          >
            <a-assets>
              <a-asset-item id="ar-model" src="${method.modelPath}"></a-asset-item>
            </a-assets>

            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

            <a-entity mindar-image-target="targetIndex: ${method.mindTargetIndex}">
              <a-entity
                id="ar-model-entity"
                gltf-model="#ar-model"
                scale="0.5 0.5 0.5"
                position="0 0 0"
                class="clickable"
              ></a-entity>
            </a-entity>
          </a-scene>
        `;

        const scene = container.querySelector("a-scene") as any;
        if (!scene) throw new Error("Scene tidak ditemukan");

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("Timeout scene loaded")), 15000);
          scene.addEventListener("loaded", () => {
            clearTimeout(timer);
            resolve();
          }, { once: true });
        });
        if (cancelled) return;

        setLoading(false);

        scene.addEventListener("arError", () => {
          if (!cancelled)
            setCameraError(
              "Gagal mengakses kamera. Aktifkan izin kamera di pengaturan."
            );
        });

        const model = scene.querySelector("#ar-model-entity") as any;
        modelRef.current = model;

        if (model) {
          model.addEventListener("model-loaded", () => {
            if (!cancelled) {
              setModelLoaded(true);
            }
          });
          model.addEventListener("model-error", () => {
            if (!cancelled) setCameraError("Gagal memuat model 3D");
          });

          visibilityInterval = setInterval(() => {
            if (cancelled) return;
            const vis = model.getAttribute("visible");
            setTracking(vis === "true");
          }, 300);
        }

        // --- touch: tap = select mesh, drag = rotate ---
        const canvas = scene.canvas || scene.renderer?.domElement;
        if (canvas) {
          canvas.style.touchAction = "none";

          canvas.addEventListener("touchstart", (e: TouchEvent) => {
            if (e.touches.length !== 1) return;
            isDragging = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }, { passive: true });

          canvas.addEventListener("touchmove", (e: TouchEvent) => {
            if (e.touches.length !== 1 || !modelRef.current) return;
            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;
            if (Math.sqrt(dx * dx + dy * dy) > 10) {
              isDragging = true;
              const el = modelRef.current;
              el.object3D.rotation.y += dx * 0.008;
              el.object3D.rotation.x = Math.max(
                -Math.PI / 2,
                Math.min(Math.PI / 2, el.object3D.rotation.x + dy * 0.008)
              );
              touchStartX = e.touches[0].clientX;
              touchStartY = e.touches[0].clientY;
            }
          }, { passive: true });

          canvas.addEventListener("touchend", (e: TouchEvent) => {
            if (isDragging || !modelRef.current) return;
            try {
              const touch = e.changedTouches[0];
              if (!touch) return;

              const rect = canvas.getBoundingClientRect();
              const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
              const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

              const THREE = (window as any).AFRAME?.THREE;
              if (!THREE) return;

              let threeCamera: any = null;
              try {
                const camEl = scene.querySelector("a-camera");
                if (camEl?.components?.camera?.camera) {
                  threeCamera = camEl.components.camera.camera;
                } else {
                  threeCamera = scene.camera;
                }
              } catch {}

              if (!threeCamera) return;

              const raycaster = new THREE.Raycaster();
              const mouse = new THREE.Vector2(x, y);
              raycaster.setFromCamera(mouse, threeCamera);

              const meshes: any[] = [];
              const meshNames: string[] = [];
              modelRef.current.object3D.traverse((child: any) => {
                if (child.isMesh) {
                  meshes.push(child);
                  if (child.name) meshNames.push(child.name);
                }
              });
              console.log("[AR] Meshes:", meshNames);

              if (meshes.length === 0) return;

              const intersects = raycaster.intersectObjects(meshes, false);
              console.log("[AR] Intersections:", intersects.length);
              if (intersects.length > 0) {
                let meshName = intersects[0].object.name;
                if (!meshName) {
                  let parent = intersects[0].object.parent;
                  while (parent && !meshName) {
                    meshName = parent.name;
                    parent = parent.parent;
                  }
                }
                console.log("[AR] Tapped mesh:", meshName);
                if (meshName) {
                  const step = stepsRef.current.find(
                    (s) => s.meshName === meshName
                  );
                  console.log("[AR] Step found:", step?.title);
                  if (step) setSelectedStep(step);
                }
              }
            } catch (err) {
              console.error("[AR] Tap error:", err);
            }
          }, { passive: true });
        }
      } catch (err: any) {
        if (!cancelled) {
          setCameraError(err.message || "Gagal memulai AR");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (visibilityInterval) clearInterval(visibilityInterval);
      try {
        const s = container.querySelector("a-scene") as any;
        if (s) {
          try { s.systems?.["mindar-image-system"]?.stop(); } catch {}
          s.remove();
        }
      } catch {}
      container.innerHTML = "";
      modelRef.current = null;
      setTracking(false);
      setModelLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method.modelPath, method.mindTargetIndex]);

  return (
    <>
      <div ref={containerRef} />
      <style>{`
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .a-orientation-modal,
        a-scene .a-scene-warning,
        .a-vr-button {
          display: none !important;
        }
      `}</style>

      {/* overlay top */}
      <div className="fixed left-0 right-0 top-0 z-[100] flex items-center gap-3 p-4 safe-top">
        <Link href="/home/mulai-belajar">
          <Button
            variant="secondary"
            size="icon-sm"
            className="bg-white/90 text-foreground backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm">
          {method.name}
        </div>
      </div>

      {/* overlay bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] pb-safe pointer-events-none">
        {cameraError && (
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-red-500/90 px-4 py-3 text-sm text-white backdrop-blur-sm pointer-events-auto">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {loading && !cameraError && (
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-sm pointer-events-auto">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            <span>Memuat AR...</span>
          </div>
        )}

        {!loading && !cameraError && !isTracking && (
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-sm pointer-events-auto">
            <Scan className="h-5 w-5 shrink-0 animate-pulse" />
            <span>Arahkan kamera ke marker AR</span>
          </div>
        )}

        {isTracking && !isModelLoaded && (
          <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-sm pointer-events-auto">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            <span>Memuat model 3D...</span>
          </div>
        )}

        {isTracking && isModelLoaded && !selectedStep && (
          <div className="mx-4 mb-4 rounded-2xl bg-black/60 px-4 py-3 text-center text-sm text-white/80 backdrop-blur-sm pointer-events-auto">
            Ketuk bagian model untuk melihat penjelasan
          </div>
        )}
      </div>

      {selectedStep && (
        <StepPopup
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </>
  );
}
