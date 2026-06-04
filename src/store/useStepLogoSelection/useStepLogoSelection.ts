'use client';

import { create } from 'zustand';

interface StepLogoSelectionStore {
  selectedPartId: string | null;
  selectPart: (id: string | null) => void;
}

const useStepLogoSelection = create<StepLogoSelectionStore>((set) => ({
  selectedPartId: null,
  selectPart: (id) => set({ selectedPartId: id }),
}));

export { useStepLogoSelection };
export type { StepLogoSelectionStore };
