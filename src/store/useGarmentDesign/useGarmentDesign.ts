'use client';

import { create } from 'zustand';
import { PALETTE_COLORS } from '@constants';

const DEFAULT_COLOR = PALETTE_COLORS[1];
const DEFAULT_OPACITY = 1;

interface DesignPatternItem {
  key: string;
  name: string;
  parts: string[];
}

interface UseStepDesignStore {
  patterns: DesignPatternItem[];
  activePattern: DesignPatternItem | null;
  colorFirst: string;
  colorSecond: string;
  activeOpacity: number;
  defaultPattern: DesignPatternItem | null;
  setPatterns: (patterns: DesignPatternItem[]) => void;
  setActivePattern: (pattern: DesignPatternItem) => void;
  setColorFirst: (color: string) => void;
  setColorSecond: (color: string) => void;
  setActiveOpacity: (opacity: number) => void;
  setDefaultPattern: (pattern: DesignPatternItem) => void;
}

const useGarmentDesign = create<UseStepDesignStore>((set) => ({
  patterns: [],
  activePattern: null,
  colorFirst: DEFAULT_COLOR,
  colorSecond: DEFAULT_COLOR,
  activeOpacity: DEFAULT_OPACITY,
  defaultPattern: null,
  setPatterns: (patterns: DesignPatternItem[]) => set({ patterns }),
  setActivePattern: (pattern: DesignPatternItem) => set({ activePattern: pattern }),
  setColorFirst: (color: string) => set({ colorFirst: color }),
  setColorSecond: (color: string) => set({ colorSecond: color }),
  setActiveOpacity: (opacity: number) => set({ activeOpacity: opacity }),
  setDefaultPattern: (pattern: DesignPatternItem) => set({ defaultPattern: pattern }),
}));

export { useGarmentDesign };
