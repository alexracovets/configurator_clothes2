'use client';

import { create } from 'zustand';

import type { GarmentConfig } from '@data';

import { mapProductNamePositions } from './mapProductNames';
import type { NameInstance, NamePosition, NamePreview } from './mapProductNames';

interface GarmentNameState {
  productPath: string | null;
  positionsKey: string | null;
  positions: NamePosition[];
  instances: NameInstance[];
  preview: NamePreview | null;
  initForProduct: (product: GarmentConfig) => void;
  addInstance: (instance: NameInstance) => void;
  removeInstance: (id: string) => void;
  updateInstance: (id: string, patch: Partial<NameInstance>) => void;
  setPreview: (instanceId: string, patch: NamePreview['patch']) => void;
  clearPreview: () => void;
  getInstancesForRender: () => NameInstance[];
}

const resolveInstancesForRender = (instances: NameInstance[], preview: NamePreview | null): NameInstance[] => {
  if (!preview) return instances;

  return instances.map((instance) => (instance.id === preview.instanceId ? { ...instance, ...preview.patch } : instance));
};

const buildPositionsKey = (product: GarmentConfig) => JSON.stringify(product.namePositions ?? []);

const useGarmentName = create<GarmentNameState>((set, get) => ({
  productPath: null,
  positionsKey: null,
  positions: [],
  instances: [],
  preview: null,
  initForProduct: (product) => {
    const positionsKey = buildPositionsKey(product);
    const state = get();

    if (state.productPath === product.path && state.positionsKey === positionsKey) {
      return;
    }

    set({
      productPath: product.path,
      positionsKey,
      positions: mapProductNamePositions(product),
      instances: [],
      preview: null,
    });
  },
  addInstance: (instance) => {
    set((state) => ({ instances: [...state.instances, instance] }));
  },
  removeInstance: (id) => {
    set((state) => ({
      instances: state.instances.filter((instance) => instance.id !== id),
      preview: state.preview?.instanceId === id ? null : state.preview,
    }));
  },
  updateInstance: (id, patch) => {
    set((state) => ({
      instances: state.instances.map((instance) => (instance.id === id ? { ...instance, ...patch } : instance)),
    }));
  },
  setPreview: (instanceId, patch) => {
    set((state) => {
      const currentPatch = state.preview?.instanceId === instanceId ? state.preview.patch : {};

      return { preview: { instanceId, patch: { ...currentPatch, ...patch } } };
    });
  },
  clearPreview: () => {
    set({ preview: null });
  },
  getInstancesForRender: () => resolveInstancesForRender(get().instances, get().preview),
}));

export { resolveInstancesForRender, useGarmentName };
export type { NameInstance, NamePosition, NamePreview };
