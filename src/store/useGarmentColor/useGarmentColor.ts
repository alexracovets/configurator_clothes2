'use client';

import { create } from 'zustand';

import { PALETTE_COLORS } from '@constants';
import { GarmentConfig } from '@data';

const DEFAULT_COLOR = PALETTE_COLORS[0];

interface GarmentColorState {
  byPart: Record<string, string>;
  initForProduct: (product: GarmentConfig) => void;
  setPartColor: (partId: string, color: string) => void;
  getPartColor: (partId: string) => string;
}

const buildDefaultColors = (product: GarmentConfig): Record<string, string> => Object.fromEntries(product.parts.map((part) => [part.id, DEFAULT_COLOR]));

const useGarmentColor = create<GarmentColorState>((set, get) => ({
  byPart: {},
  initForProduct: (product) => {
    set({ byPart: buildDefaultColors(product) });
  },
  setPartColor: (partId, color) => {
    set((state) => ({
      byPart: {
        ...state.byPart,
        [partId]: color,
      },
    }));
  },
  getPartColor: (partId) => get().byPart[partId] ?? DEFAULT_COLOR,
}));

export { useGarmentColor, DEFAULT_COLOR };
