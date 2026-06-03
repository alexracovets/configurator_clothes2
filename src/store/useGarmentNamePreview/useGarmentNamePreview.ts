'use client';

import { create } from 'zustand';

interface NamePreviewPatch {
  text?: string;
  font?: string;
  fontSize?: number;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  uv?: { x: number; y: number };
  rotation?: number;
}

interface GarmentNamePreviewState {
  preview: { partId: string; patch: NamePreviewPatch } | null;
  setNamePreview: (partId: string, patch: NamePreviewPatch) => void;
  clearNamePreview: () => void;
}

const useGarmentNamePreview = create<GarmentNamePreviewState>((set) => ({
  preview: null,
  setNamePreview: (partId, patch) => set({ preview: { partId, patch } }),
  clearNamePreview: () => set({ preview: null }),
}));

export { useGarmentNamePreview };
export type { NamePreviewPatch };
