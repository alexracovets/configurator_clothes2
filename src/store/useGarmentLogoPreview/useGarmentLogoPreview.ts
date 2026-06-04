'use client';

import { create } from 'zustand';

interface LogoPreviewPatch {
  uv?: { x: number; y: number };
  rotation?: number;
  scale?: number;
}

interface GarmentLogoPreviewState {
  preview: { partId: string; patch: LogoPreviewPatch } | null;
  setLogoPreview: (partId: string, patch: LogoPreviewPatch) => void;
  clearLogoPreview: () => void;
}

const useGarmentLogoPreview = create<GarmentLogoPreviewState>((set) => ({
  preview: null,
  setLogoPreview: (partId, patch) => set({ preview: { partId, patch } }),
  clearLogoPreview: () => set({ preview: null }),
}));

export { useGarmentLogoPreview };
export type { LogoPreviewPatch };
