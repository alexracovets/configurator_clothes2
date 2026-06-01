'use client';

import { create } from 'zustand';

interface StepLogoUv {
  x: number;
  y: number;
}

interface StepLogoPartState {
  id: string;
  positionKey: string;
  label: string;
  uv: StepLogoUv;
  rotation: number;
  opacity: number;
  baseScale: number;
  scale: number;
  src: string;
  fileName: string;
  visible: boolean;
  isDefault: boolean;
}

interface StepLogoPositionState {
  key: string;
  label: string;
  uv: StepLogoUv;
  rotation: number;
  scale: number;
  default: boolean;
  interactive: boolean;
  defaultSrc: string;
}

const CUSTOM_USER_LOGO_UV: StepLogoUv = { x: 0.5, y: 0.5 };

interface StepLogoState {
  parts: StepLogoPartState[];
  positions: StepLogoPositionState[];
  setParts: (parts: StepLogoPartState[]) => void;
  setPositions: (positions: StepLogoPositionState[]) => void;
  assignLogoToPosition: (position: StepLogoPositionState, payload: { src: string; fileName: string }) => void;
  addUserLogo: (payload: { src: string; fileName: string }) => boolean;
  replaceUserLogo: (id: string, payload: { src: string; fileName: string }) => void;
  canAddUserLogo: () => boolean;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<StepLogoPartState>) => void;
}

const useStepLogo = create<StepLogoState>((set, get) => ({
  parts: [],
  positions: [],
  setParts: (parts) => set({ parts }),
  setPositions: (positions) => set({ positions }),
  assignLogoToPosition: (position, { src, fileName }) =>
    set((state) => {
      if (!position.interactive) return state;

      const existing = state.parts.find((part) => part.positionKey === position.key);

      if (existing) {
        return {
          parts: state.parts.map((part) =>
            part.id === existing.id
              ? {
                  ...part,
                  src,
                  fileName,
                  visible: true,
                  isDefault: false,
                }
              : part,
          ),
        };
      }

      return {
        parts: [
          ...state.parts,
          {
            id: `${position.key}_${Date.now()}`,
            positionKey: position.key,
            label: position.label,
            uv: position.uv,
            rotation: position.rotation,
            opacity: 1,
            baseScale: position.scale,
            scale: 1,
            src,
            fileName,
            visible: true,
            isDefault: false,
          },
        ],
      };
    }),
  addUserLogo: ({ src, fileName }) => {
    const state = get();
    const interactive = state.positions.filter((position) => position.interactive);
    const usedKeys = new Set(state.parts.filter((part) => !part.isDefault).map((part) => part.positionKey));
    const freeSlot = interactive.find((position) => !usedKeys.has(position.key));

    if (freeSlot) {
      get().assignLogoToPosition(freeSlot, { src, fileName });
      return true;
    }

    if (interactive.length > 0) return false;

    const id = `custom_${Date.now()}`;
    set({
      parts: [
        ...state.parts,
        {
          id,
          positionKey: id,
          label: fileName,
          uv: CUSTOM_USER_LOGO_UV,
          rotation: 0,
          opacity: 1,
          baseScale: 1,
          scale: 1,
          src,
          fileName,
          visible: true,
          isDefault: false,
        },
      ],
    });
    return true;
  },
  replaceUserLogo: (id, { src, fileName }) =>
    set((state) => ({
      parts: state.parts.map((part) => (part.id === id && !part.isDefault ? { ...part, src, fileName, visible: true } : part)),
    })),
  canAddUserLogo: () => {
    const { positions, parts } = get();
    const interactive = positions.filter((position) => position.interactive);

    if (interactive.length === 0) return true;

    const usedKeys = new Set(parts.filter((part) => !part.isDefault).map((part) => part.positionKey));
    return interactive.some((position) => !usedKeys.has(position.key));
  },
  removePart: (id) =>
    set((state) => {
      const target = state.parts.find((part) => part.id === id);
      if (!target || target.isDefault) return state;

      const remaining = state.parts.filter((part) => part.id !== id);
      const position = state.positions.find((part) => part.key === target.positionKey);

      if (!position?.default || remaining.some((part) => part.positionKey === position.key)) {
        return { parts: remaining };
      }

      return {
        parts: [
          ...remaining,
          {
            id: `default-${position.key}`,
            positionKey: position.key,
            label: position.label,
            uv: position.uv,
            rotation: position.rotation,
            opacity: 1,
            baseScale: position.scale,
            scale: 1,
            src: position.defaultSrc,
            fileName: position.defaultSrc.split('/').pop() ?? 'logo.svg',
            visible: true,
            isDefault: true,
          },
        ],
      };
    }),
  updatePart: (id, patch) => set((state) => ({ parts: state.parts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
}));

export { useStepLogo };
export type { StepLogoPartState, StepLogoPositionState, StepLogoUv };
