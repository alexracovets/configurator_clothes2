'use client';

import { create } from 'zustand';

const DEFAULT_PART_COLOR = '#000000';

interface DesignPatternPartState {
  key: string;
  materialId: number;
  src: string;
}

interface DesignPatternState {
  key: string;
  name: string;
  parts: DesignPatternPartState[];
}

interface PatternCustomization {
  colors: Record<string, string>;
  opacity: number;
}

interface StepDesignStore {
  patterns: DesignPatternState[];
  defaultPattern: DesignPatternState | null;
  activePatternKey: string | null;
  customizations: Record<string, PatternCustomization>;
  defaultPatternCustomization: PatternCustomization | null;
  setPatterns: (patterns: DesignPatternState[]) => void;
  setDefaultPattern: (pattern: DesignPatternState | null) => void;
  setActivePattern: (patternKey: string | null) => void;
  setPartColor: (partKey: string, color: string) => void;
  setDefaultPartColor: (partKey: string, color: string) => void;
  setPatternOpacity: (opacity: number) => void;
  setDefaultPatternOpacity: (opacity: number) => void;
}

const createDefaultCustomization = (parts: DesignPatternPartState[]): PatternCustomization => ({
  colors: Object.fromEntries(parts.map((part) => [part.key, DEFAULT_PART_COLOR])),
  opacity: 1,
});

const useStepDesign = create<StepDesignStore>((set, get) => ({
  patterns: [],
  defaultPattern: null,
  activePatternKey: null,
  customizations: {},
  defaultPatternCustomization: null,
  setPatterns: (patterns) => set({ patterns, activePatternKey: null, customizations: {} }),
  setDefaultPattern: (pattern) =>
    set({
      defaultPattern: pattern,
      defaultPatternCustomization: pattern ? createDefaultCustomization(pattern.parts) : null,
    }),
  setActivePattern: (patternKey) => {
    if (patternKey === null) {
      set({ activePatternKey: null });
      return;
    }

    const pattern = get().patterns.find((item) => item.key === patternKey);
    if (!pattern) {
      set({ activePatternKey: patternKey });
      return;
    }

    set((state) => {
      const customizations = { ...state.customizations };
      if (!customizations[patternKey]) {
        customizations[patternKey] = createDefaultCustomization(pattern.parts);
      }

      return { activePatternKey: patternKey, customizations };
    });
  },
  setPartColor: (partKey, color) =>
    set((state) => {
      const patternKey = state.activePatternKey;
      if (!patternKey) return state;

      const current = state.customizations[patternKey];
      if (!current) return state;

      return {
        customizations: {
          ...state.customizations,
          [patternKey]: {
            ...current,
            colors: { ...current.colors, [partKey]: color },
          },
        },
      };
    }),
  setDefaultPartColor: (partKey, color) =>
    set((state) => {
      const current = state.defaultPatternCustomization;
      if (!current) return state;

      return {
        defaultPatternCustomization: {
          ...current,
          colors: { ...current.colors, [partKey]: color },
        },
      };
    }),
  setPatternOpacity: (opacity) =>
    set((state) => {
      const patternKey = state.activePatternKey;
      if (!patternKey) return state;

      const current = state.customizations[patternKey];
      if (!current) return state;

      return {
        customizations: {
          ...state.customizations,
          [patternKey]: {
            ...current,
            opacity,
          },
        },
      };
    }),
  setDefaultPatternOpacity: (opacity) =>
    set((state) => {
      const current = state.defaultPatternCustomization;
      if (!current) return state;

      return {
        defaultPatternCustomization: {
          ...current,
          opacity,
        },
      };
    }),
}));

export { useStepDesign };
export type { DesignPatternPartState, DesignPatternState, PatternCustomization };
