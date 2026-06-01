'use client';

import { create } from 'zustand';

interface StepNameUv {
  x: number;
  y: number;
}

interface StepNamePartState {
  id: string;
  positionKey: string;
  label: string;
  uv: StepNameUv;
  rotation: number;
  text: string;
  font: string;
  fontSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  isDefault: boolean;
}

interface StepNamePositionState {
  key: string;
  label: string;
  uv: StepNameUv;
  rotation: number;
  fontSize: number;
  interactive: boolean;
}

interface StepNameState {
  parts: StepNamePartState[];
  positions: StepNamePositionState[];
  addPart: (part: StepNamePartState) => void;
  setParts: (parts: StepNamePartState[]) => void;
  setPositions: (positions: StepNamePositionState[]) => void;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<StepNamePartState>) => void;
}

const useStepName = create<StepNameState>((set) => ({
  parts: [],
  positions: [],
  addPart: (part) => set((state) => ({ parts: [...state.parts, part] })),
  setParts: (parts) => set({ parts }),
  setPositions: (positions) =>
    set((state) => ({
      positions,
      parts: state.parts.filter((part) => positions.some((position) => position.key === part.positionKey)),
    })),
  removePart: (id) =>
    set((state) => {
      const target = state.parts.find((part) => part.id === id);
      if (!target || target.isDefault) return state;

      return { parts: state.parts.filter((part) => part.id !== id) };
    }),
  updatePart: (id, patch) => set((state) => ({ parts: state.parts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
}));

export { useStepName };
export type { StepNamePartState, StepNamePositionState, StepNameUv };
