'use client';

import { create } from 'zustand';

import type { GarmentConfig } from '@data';

import { mapProductNumberPositions } from './mapProductNumbers';
import type { NumberInstance, NumberPosition, NumberPreview } from './mapProductNumbers';

interface GarmentNumberState {
  productPath: string | null;
  positionsKey: string | null;
  positions: NumberPosition[];
  instances: NumberInstance[];
  preview: NumberPreview | null;
  initForProduct: (product: GarmentConfig) => void;
  addInstance: (instance: NumberInstance) => void;
  removeInstance: (id: string) => void;
  updateInstance: (id: string, patch: Partial<NumberInstance>) => void;
  setPreview: (instanceId: string, patch: NumberPreview['patch']) => void;
  clearPreview: () => void;
  getInstancesForRender: () => NumberInstance[];
}

const resolveNumberInstancesForRender = (instances: NumberInstance[], preview: NumberPreview | null): NumberInstance[] => {
  if (!preview) return instances;

  return instances.map((instance) => (instance.id === preview.instanceId ? { ...instance, ...preview.patch } : instance));
};

const buildPositionsKey = (product: GarmentConfig) => JSON.stringify(product.numberPositions ?? []);

const useGarmentNumber = create<GarmentNumberState>((set, get) => ({
  productPath: null,
  positionsKey: null,
  positions: [],
  instances: [],
  preview: null,
  initForProduct: (product) => {
    const positionsKey = buildPositionsKey(product);
    const positions = mapProductNumberPositions(product);
    const state = get();

    const syncInstancesFromPositions = (instances: NumberInstance[]) =>
      instances.map((instance) => {
        const position = positions.find((item) => item.key === instance.positionKey);
        if (!position) return instance;

        return { ...instance, partId: position.partId, uv: position.uv };
      });

    if (state.productPath === product.path && state.positionsKey === positionsKey) {
      set({ positions, instances: syncInstancesFromPositions(state.instances) });
      return;
    }

    set({
      productPath: product.path,
      positionsKey,
      positions,
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
  getInstancesForRender: () => resolveNumberInstancesForRender(get().instances, get().preview),
}));

export { resolveNumberInstancesForRender, useGarmentNumber };
export type { NumberInstance, NumberPosition, NumberPreview };
