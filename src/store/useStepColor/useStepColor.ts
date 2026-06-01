'use client';

import { create } from 'zustand';

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

const useStepColor = create<StepColorStore>((set) => ({
  parts: [],
  setParts: (parts) => set({ parts }),
  setPartColor: (partId, color) =>
    set((state) => ({
      parts: state.parts.map((part) => (part.id === partId ? { ...part, color } : part)),
    })),
}));

export { useStepColor };
export type { StepColorPart };
