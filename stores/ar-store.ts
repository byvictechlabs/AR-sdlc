import { create } from "zustand";

export interface Step {
  id: string;
  meshName: string;
  title: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  stepOrder: number;
}

export interface Method {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelPath: string;
  markerPath: string;
  status: string;
  sortOrder: number;
  mindTargetIndex: number | null;
}

interface ARState {
  isTracking: boolean;
  isModelLoaded: boolean;
  activeTargetIndex: number | null;
  selectedStep: Step | null;
  isSpeaking: boolean;
  cameraError: string | null;

  setTracking: (v: boolean) => void;
  setModelLoaded: (v: boolean) => void;
  setActiveTarget: (v: number | null) => void;
  setSelectedStep: (v: Step | null) => void;
  setSpeaking: (v: boolean) => void;
  setCameraError: (v: string | null) => void;
}

export const useARStore = create<ARState>((set) => ({
  isTracking: false,
  isModelLoaded: false,
  activeTargetIndex: null,
  selectedStep: null,
  isSpeaking: false,
  cameraError: null,

  setTracking: (v) => set({ isTracking: v }),
  setModelLoaded: (v) => set({ isModelLoaded: v }),
  setActiveTarget: (v) => set({ activeTargetIndex: v }),
  setSelectedStep: (v) => set({ selectedStep: v }),
  setSpeaking: (v) => set({ isSpeaking: v }),
  setCameraError: (v) => set({ cameraError: v }),
}));
