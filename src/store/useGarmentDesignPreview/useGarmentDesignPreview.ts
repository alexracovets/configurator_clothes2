'use client';

import { create } from 'zustand';

interface DesignColorPreview {
  patternKey: string;
  partKey: string;
  color: string;
}

interface GarmentDesignPreviewState {
  preview: DesignColorPreview | null;
  opacityPreview: number | null;
  setDesignPreview: (patternKey: string, partKey: string, color: string) => void;
  clearDesignPreview: () => void;
  setOpacityPreview: (opacity: number) => void;
  clearOpacityPreview: () => void;
}

const useGarmentDesignPreview = create<GarmentDesignPreviewState>((set) => ({
  preview: null,
  opacityPreview: null,
  setDesignPreview: (patternKey, partKey, color) => set({ preview: { patternKey, partKey, color } }),
  clearDesignPreview: () => set({ preview: null }),
  setOpacityPreview: (opacity) => set({ opacityPreview: opacity }),
  clearOpacityPreview: () => set({ opacityPreview: null }),
}));

export { useGarmentDesignPreview };
export type { DesignColorPreview };
