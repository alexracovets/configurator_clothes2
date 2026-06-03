'use client';

import { create } from 'zustand';

interface StepNameSelectionStore {
  selectedPartId: string | null;
  selectPart: (id: string | null) => void;
}

const useStepNameSelection = create<StepNameSelectionStore>((set) => ({
  selectedPartId: null,
  selectPart: (id) => set({ selectedPartId: id }),
}));

export { useStepNameSelection };
export type { StepNameSelectionStore };
