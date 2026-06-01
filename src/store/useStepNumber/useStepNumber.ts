'use client';

import { create } from 'zustand';

interface StepNumberUv {
  x: number;
  y: number;
}

interface StepNumberPartState {
  id: string;
  positionKey: string;
  label: string;
  zone: string;
  uv: StepNumberUv;
  rotation: number;
  text: string;
  font: string;
  fontSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  isDefault: boolean;
}

interface StepNumberPositionState {
  key: string;
  label: string;
  zone: string;
  uv: StepNumberUv;
  rotation: number;
  fontSize: number;
  interactive: boolean;
}

interface StepNumberState {
  parts: StepNumberPartState[];
  positions: StepNumberPositionState[];
  addPart: (part: StepNumberPartState) => void;
  setParts: (parts: StepNumberPartState[]) => void;
  setPositions: (positions: StepNumberPositionState[]) => void;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<StepNumberPartState>) => void;
}

const useStepNumber = create<StepNumberState>((set) => ({
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

export { useStepNumber };
export type { StepNumberPartState, StepNumberPositionState, StepNumberUv };
