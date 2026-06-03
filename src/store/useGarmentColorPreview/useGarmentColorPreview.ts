'use client';

import { create } from 'zustand';

interface ColorPreviewState {
  preview: { partId: string; color: string } | null;
  setColorPreview: (partId: string, color: string) => void;
  clearColorPreview: () => void;
}

const useGarmentColorPreview = create<ColorPreviewState>((set) => ({
  preview: null,
  setColorPreview: (partId, color) => set({ preview: { partId, color } }),
  clearColorPreview: () => set({ preview: null }),
}));

export { useGarmentColorPreview };
