'use client';

import { create } from 'zustand';

import { PALETTE_COLORS } from '@constants';
import { GarmentConfig } from '@data';

import { buildDefaultGradients } from './mapPartGradientDefaults';
import { DISABLED_PART_GRADIENT, type PartGradient } from './partGradientTypes';

const DEFAULT_COLOR = PALETTE_COLORS[0];

interface GarmentColorSnapshot {
  byPart: Record<string, string>;
  gradientsByPart: Record<string, PartGradient>;
}

interface GarmentColorState {
  byPart: Record<string, string>;
  gradientsByPart: Record<string, PartGradient>;
  initForProduct: (product: GarmentConfig) => void;
  restoreSnapshot: (snapshot: GarmentColorSnapshot) => void;
  setPartColor: (partId: string, color: string) => void;
  getPartColor: (partId: string) => string;
  setPartGradientEnabled: (partId: string, enabled: boolean) => void;
  setPartGradientColor2: (partId: string, color: string) => void;
  setPartGradientRotation: (partId: string, rotation: number) => void;
  setPartGradientPosition: (partId: string, position: number) => void;
  setPartGradientSoftness: (partId: string, softness: number) => void;
  setPartGradientOpacity: (partId: string, opacity: number) => void;
  getPartGradient: (partId: string) => PartGradient;
}

const buildDefaultColors = (product: GarmentConfig): Record<string, string> => Object.fromEntries(product.parts.map((part) => [part.id, DEFAULT_COLOR]));

const getOrCreateGradient = (gradientsByPart: Record<string, PartGradient>, partId: string): PartGradient => {
  return gradientsByPart[partId] ?? DISABLED_PART_GRADIENT;
};

const useGarmentColor = create<GarmentColorState>((set, get) => ({
  byPart: {},
  gradientsByPart: {},

  initForProduct: (product) => {
    set({ byPart: buildDefaultColors(product), gradientsByPart: buildDefaultGradients(product) });
  },

  restoreSnapshot: (snapshot) => {
    set({
      byPart: snapshot.byPart,
      gradientsByPart: snapshot.gradientsByPart,
    });
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

  setPartGradientEnabled: (partId, enabled) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, enabled },
        },
      };
    });
  },

  setPartGradientColor2: (partId, color) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, color2: color },
        },
      };
    });
  },

  setPartGradientRotation: (partId, rotation) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, rotation },
        },
      };
    });
  },

  setPartGradientPosition: (partId, position) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, position },
        },
      };
    });
  },

  setPartGradientSoftness: (partId, softness) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, softness },
        },
      };
    });
  },

  setPartGradientOpacity: (partId, opacity) => {
    set((state) => {
      const current = getOrCreateGradient(state.gradientsByPart, partId);

      return {
        gradientsByPart: {
          ...state.gradientsByPart,
          [partId]: { ...current, opacity },
        },
      };
    });
  },

  getPartGradient: (partId) => getOrCreateGradient(get().gradientsByPart, partId),
}));

export { useGarmentColor, DEFAULT_COLOR };
export type { PartGradient };
