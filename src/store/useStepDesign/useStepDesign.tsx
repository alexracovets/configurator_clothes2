'use client';

import { create } from 'zustand';

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

const DEFAULT_OPACITY = 1;
const DEFAULT_PART_COLOR = '#000000';

const buildDefaultCustomization = (pattern: DesignPatternState): PatternCustomization => ({
  colors: Object.fromEntries(pattern.parts.map((part) => [part.key, DEFAULT_PART_COLOR])),
  opacity: DEFAULT_OPACITY,
});

interface StepDesignStore {
  patterns: DesignPatternState[];
  activePatternKey: string | null;
  customizations: Record<string, PatternCustomization>;
  defaultPattern: DesignPatternState | null;
  defaultPatternCustomization: PatternCustomization | null;
  setPatterns: (patterns: DesignPatternState[]) => void;
  setDefaultPattern: (pattern: DesignPatternState | null) => void;
  setActivePattern: (key: string | null) => void;
  setPartColor: (partKey: string, color: string) => void;
  setPatternOpacity: (opacity: number) => void;
}

const useStepDesign = create<StepDesignStore>((set, get) => ({
  patterns: [],
  activePatternKey: null,
  customizations: {},
  defaultPattern: null,
  defaultPatternCustomization: null,

  setPatterns: (patterns) => {
    const customizations: Record<string, PatternCustomization> = {};
    for (const pattern of patterns) {
      customizations[pattern.key] = buildDefaultCustomization(pattern);
    }
    set({ patterns, customizations });
  },

  setDefaultPattern: (pattern) => {
    const customization = pattern ? buildDefaultCustomization(pattern) : null;
    set({ defaultPattern: pattern, defaultPatternCustomization: customization });
  },

  setActivePattern: (key) => {
    if (key === null) {
      set({ activePatternKey: null });
      return;
    }

    const { patterns, customizations } = get();
    const pattern = patterns.find((p) => p.key === key);
    if (!pattern) return;

    const nextCustomizations = { ...customizations };
    if (!nextCustomizations[key]) {
      nextCustomizations[key] = buildDefaultCustomization(pattern);
    }

    set({ activePatternKey: key, customizations: nextCustomizations });
  },

  setPartColor: (partKey, color) => {
    const { activePatternKey, customizations, patterns } = get();
    if (!activePatternKey) return;

    const pattern = patterns.find((p) => p.key === activePatternKey);
    if (!pattern) return;

    const current = customizations[activePatternKey] ?? buildDefaultCustomization(pattern);
    set({
      customizations: {
        ...customizations,
        [activePatternKey]: {
          ...current,
          colors: { ...current.colors, [partKey]: color },
        },
      },
    });
  },

  setPatternOpacity: (opacity) => {
    const { activePatternKey, customizations, patterns } = get();
    if (!activePatternKey) return;

    const pattern = patterns.find((p) => p.key === activePatternKey);
    if (!pattern) return;

    const current = customizations[activePatternKey] ?? buildDefaultCustomization(pattern);
    set({
      customizations: {
        ...customizations,
        [activePatternKey]: { ...current, opacity },
      },
    });
  },
}));

export { useStepDesign };
export type { DesignPatternPartState, DesignPatternState, PatternCustomization };
