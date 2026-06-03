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
const DEFAULT_COLOR_FIRST = '#000000';
const DEFAULT_COLOR_SECOND = '#000000';

// Build customization for a pattern by mapping its parts to the global color slots.
// Part index 0 → colorFirst, index 1 → colorSecond, rest → colorFirst.
const buildCustomization = (pattern: DesignPatternState, colorFirst: string, colorSecond: string, opacity: number): PatternCustomization => ({
  colors: Object.fromEntries(pattern.parts.map((part, index) => [part.key, index === 1 ? colorSecond : colorFirst])),
  opacity,
});

interface StepDesignStore {
  patterns: DesignPatternState[];
  activePatternKey: string | null;
  colorFirst: string;
  colorSecond: string;
  activeOpacity: number;
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
  colorFirst: DEFAULT_COLOR_FIRST,
  colorSecond: DEFAULT_COLOR_SECOND,
  activeOpacity: DEFAULT_OPACITY,
  customizations: {},
  defaultPattern: null,
  defaultPatternCustomization: null,

  setPatterns: (patterns) => {
    const { colorFirst, colorSecond, activeOpacity } = get();
    const customizations: Record<string, PatternCustomization> = {};
    for (const pattern of patterns) {
      customizations[pattern.key] = buildCustomization(pattern, colorFirst, colorSecond, activeOpacity);
    }
    set({ patterns, customizations });
  },

  setDefaultPattern: (pattern) => {
    const { colorFirst, colorSecond, activeOpacity } = get();
    const customization = pattern ? buildCustomization(pattern, colorFirst, colorSecond, activeOpacity) : null;
    set({ defaultPattern: pattern, defaultPatternCustomization: customization });
  },

  setActivePattern: (key) => {
    if (key === null) {
      set({ activePatternKey: null });
      return;
    }

    const { patterns, customizations, colorFirst, colorSecond, activeOpacity } = get();
    const pattern = patterns.find((p) => p.key === key);
    if (!pattern) return;

    const nextCustomizations = { ...customizations };
    if (!nextCustomizations[key]) {
      nextCustomizations[key] = buildCustomization(pattern, colorFirst, colorSecond, activeOpacity);
    }

    set({ activePatternKey: key, customizations: nextCustomizations });
  },

  setPartColor: (partKey, color) => {
    const { activePatternKey, customizations, patterns, colorFirst, colorSecond } = get();
    if (!activePatternKey) return;

    const pattern = patterns.find((p) => p.key === activePatternKey);
    if (!pattern) return;

    const current = customizations[activePatternKey] ?? buildCustomization(pattern, colorFirst, colorSecond, get().activeOpacity);
    const updatedColors = { ...current.colors, [partKey]: color };

    // Sync global color slots from part index
    const partIndex = pattern.parts.findIndex((p) => p.key === partKey);
    const nextColorFirst = partIndex === 0 ? color : colorFirst;
    const nextColorSecond = partIndex === 1 ? color : colorSecond;

    // Rebuild all other patterns that haven't been customized away from defaults
    const nextCustomizations: Record<string, PatternCustomization> = { ...customizations };
    for (const p of patterns) {
      if (p.key === activePatternKey) continue;
      const existing = nextCustomizations[p.key];
      if (!existing) continue;
      nextCustomizations[p.key] = buildCustomization(p, nextColorFirst, nextColorSecond, existing.opacity);
    }

    nextCustomizations[activePatternKey] = { ...current, colors: updatedColors };

    set({
      colorFirst: nextColorFirst,
      colorSecond: nextColorSecond,
      customizations: nextCustomizations,
    });
  },

  setPatternOpacity: (opacity) => {
    const { activePatternKey, customizations, patterns, colorFirst, colorSecond } = get();
    if (!activePatternKey) return;

    const nextCustomizations: Record<string, PatternCustomization> = {};
    for (const p of patterns) {
      const existing = customizations[p.key];
      nextCustomizations[p.key] = existing ? { ...existing, opacity } : buildCustomization(p, colorFirst, colorSecond, opacity);
    }

    set({ activeOpacity: opacity, customizations: nextCustomizations });
  },
}));

export { useStepDesign };
export type { DesignPatternPartState, DesignPatternState, PatternCustomization };
