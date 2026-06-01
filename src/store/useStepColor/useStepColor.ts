'use client';

import { create } from 'zustand';

import { syncShadingFromColorParts } from '../syncShadingFromColorParts';

interface StepColorPart {
  id: string;
  name: string;
  label: string;
  color: string;
}

interface StepColorStore {
  parts: StepColorPart[];
  setParts: (parts: StepColorPart[]) => void;
  setPartColor: (partId: string, color: string) => void;
}

const useStepColor = create<StepColorStore>((set, get) => ({
  parts: [],
  setParts: (parts) => {
    set({ parts });
    syncShadingFromColorParts(parts);
  },
  setPartColor: (partId, color) => {
    const parts = get().parts.map((part) => (part.id === partId ? { ...part, color } : part));
    set({ parts });
    syncShadingFromColorParts(parts);
  },
}));

export { useStepColor };
export type { StepColorPart };
