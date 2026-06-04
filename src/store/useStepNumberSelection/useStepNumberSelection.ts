'use client';

import { create } from 'zustand';

interface StepNumberSelectionStore {
  selectedPartId: string | null;
  selectPart: (id: string | null) => void;
}

const useStepNumberSelection = create<StepNumberSelectionStore>((set) => ({
  selectedPartId: null,
  selectPart: (id) => set({ selectedPartId: id }),
}));

export { useStepNumberSelection };
export type { StepNumberSelectionStore };
