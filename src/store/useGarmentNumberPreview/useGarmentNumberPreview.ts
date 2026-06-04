'use client';

import { create } from 'zustand';

interface NumberPreviewPatch {
  text?: string;
  font?: string;
  fontSize?: number;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  uv?: { x: number; y: number };
  rotation?: number;
}

interface GarmentNumberPreviewState {
  preview: { partId: string; patch: NumberPreviewPatch } | null;
  setNumberPreview: (partId: string, patch: NumberPreviewPatch) => void;
  clearNumberPreview: () => void;
}

const useGarmentNumberPreview = create<GarmentNumberPreviewState>((set) => ({
  preview: null,
  setNumberPreview: (partId, patch) => set({ preview: { partId, patch } }),
  clearNumberPreview: () => set({ preview: null }),
}));

export { useGarmentNumberPreview };
export type { NumberPreviewPatch };
