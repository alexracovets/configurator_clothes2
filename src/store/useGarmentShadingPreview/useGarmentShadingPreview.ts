'use client';

import { create } from 'zustand';

import type { ShadingPreviewPatch } from './shadingPreviewTypes';

interface ShadingPreviewState {
  preview: { partId: string; patch: ShadingPreviewPatch } | null;
  setShadingPreview: (partId: string, patch: ShadingPreviewPatch) => void;
  clearShadingPreview: () => void;
}

const useGarmentShadingPreview = create<ShadingPreviewState>((set) => ({
  preview: null,
  setShadingPreview: (partId, patch) =>
    set((state) => ({
      preview: state.preview?.partId === partId ? { partId, patch: { ...state.preview.patch, ...patch } } : { partId, patch },
    })),
  clearShadingPreview: () => set({ preview: null }),
}));

export { useGarmentShadingPreview };
