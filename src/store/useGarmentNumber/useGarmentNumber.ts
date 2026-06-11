'use client';

import type { garmentConfigType, garmentNumberSnapshotType, numberInstanceType, numberPositionType, numberPreviewType } from '@types';

import { create } from 'zustand';

import { mapProductNumberPositions } from './mapProductNumbers';

interface GarmentNumberState {
  productPath: string | null;
  positionsKey: string | null;
  positions: numberPositionType[];
  instances: numberInstanceType[];
  preview: numberPreviewType | null;
  initForProduct: (product: garmentConfigType) => void;
  restoreSnapshot: (product: garmentConfigType, snapshot: garmentNumberSnapshotType) => void;
  addInstance: (instance: numberInstanceType) => void;
  removeInstance: (id: string) => void;
  updateInstance: (id: string, patch: Partial<numberInstanceType>) => void;
  setPreview: (instanceId: string, patch: numberPreviewType['patch']) => void;
  clearPreview: () => void;
  getInstancesForRender: () => numberInstanceType[];
}

const resolveNumberInstancesForRender = (instances: numberInstanceType[], preview: numberPreviewType | null): numberInstanceType[] => {
  if (!preview) return instances;

  return instances.map((instance) => (instance.id === preview.instanceId ? { ...instance, ...preview.patch } : instance));
};

const buildPositionsKey = (product: garmentConfigType) => JSON.stringify(product.numberPositions ?? []);

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

    const syncInstancesFromPositions = (instances: numberInstanceType[]) =>
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
  restoreSnapshot: (product, snapshot) => {
    const positionsKey = buildPositionsKey(product);
    const positions = mapProductNumberPositions(product);

    set({
      productPath: product.path,
      positionsKey,
      positions,
      instances: snapshot.instances,
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
