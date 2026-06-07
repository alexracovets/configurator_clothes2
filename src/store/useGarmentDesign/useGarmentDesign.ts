'use client';

import { create } from 'zustand';

import { PALETTE_COLORS } from '@constants';
import type { GarmentConfig } from '@data';

const DEFAULT_COLOR = PALETTE_COLORS[1];
const DEFAULT_OPACITY = 1;

interface DesignPatternPart {
  key: string;
  src: string;
}

interface DesignPatternItem {
  key: string;
  name: string;
  parts: DesignPatternPart[];
}

interface UseGarmentDesignStore {
  productPath: string | null;
  patterns: DesignPatternItem[];
  activePattern: DesignPatternItem | null;
  patternColors: Record<string, string>;
  activeOpacity: number;
  defaultPattern: DesignPatternItem | null;
  initForProduct: (product: GarmentConfig) => void;
  setPatterns: (patterns: DesignPatternItem[]) => void;
  setActivePattern: (pattern: DesignPatternItem | null) => void;
  setPartColor: (partKey: string, color: string) => void;
  getPartColor: (partKey: string) => string;
  setActiveOpacity: (opacity: number) => void;
  setDefaultPattern: (pattern: DesignPatternItem | null) => void;
}

const mapProductDesigns = (product: GarmentConfig): DesignPatternItem[] =>
  product.patterns.map((pattern, patternIndex) => ({
    key: `pattern-${patternIndex}`,
    name: pattern.name,
    parts: pattern.parts.map((part, partIndex) => ({
      key: `pattern-${patternIndex}-part-${partIndex}`,
      src: `${product.path}designs/${part.path_name}`,
    })),
  }));

const mapDefaultPattern = (product: GarmentConfig): DesignPatternItem | null => {
  const pattern = product.default_pattern?.[0];
  if (!pattern) return null;

  return {
    key: 'default-pattern',
    name: pattern.name,
    parts: pattern.parts.map((part, partIndex) => ({
      key: `default-pattern-part-${partIndex}`,
      src: `${product.path}designs/${part.path_name}`,
    })),
  };
};

const buildPatternColors = (pattern: DesignPatternItem): Record<string, string> => Object.fromEntries(pattern.parts.map((part) => [part.key, DEFAULT_COLOR]));

const useGarmentDesign = create<UseGarmentDesignStore>((set, get) => ({
  productPath: null,
  patterns: [],
  activePattern: null,
  patternColors: {},
  activeOpacity: DEFAULT_OPACITY,
  defaultPattern: null,

  initForProduct: (product) => {
    set({
      productPath: product.path,
      patterns: mapProductDesigns(product),
      defaultPattern: mapDefaultPattern(product),
      activePattern: null,
      patternColors: {},
      activeOpacity: DEFAULT_OPACITY,
    });
  },

  setPatterns: (patterns) => set({ patterns }),

  setActivePattern: (pattern) => {
    if (!pattern) {
      set({ activePattern: null, patternColors: {}, activeOpacity: DEFAULT_OPACITY });
      return;
    }

    set({ activePattern: pattern, patternColors: buildPatternColors(pattern), activeOpacity: DEFAULT_OPACITY });
  },

  setPartColor: (partKey, color) => {
    set((state) => ({
      patternColors: {
        ...state.patternColors,
        [partKey]: color,
      },
    }));
  },

  getPartColor: (partKey) => get().patternColors[partKey] ?? DEFAULT_COLOR,

  setActiveOpacity: (opacity) => set({ activeOpacity: opacity }),

  setDefaultPattern: (pattern) => set({ defaultPattern: pattern }),
}));

export { useGarmentDesign };
export type { DesignPatternItem, DesignPatternPart };
