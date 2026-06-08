'use client';

import { create } from 'zustand';

import type { GarmentConfig } from '@data';

import { mapProductNamePositions } from './mapProductNames';
import type { NameInstance, NamePosition, NamePreview } from './mapProductNames';

interface GarmentNameSnapshot {
  instances: NameInstance[];
  selectedInstanceId: string | null;
}

interface GarmentNameState {
  productPath: string | null;
  positionsKey: string | null;
  positions: NamePosition[];
  instances: NameInstance[];
  preview: NamePreview | null;
  selectedInstanceId: string | null;
  initForProduct: (product: GarmentConfig) => void;
  restoreSnapshot: (product: GarmentConfig, snapshot: GarmentNameSnapshot) => void;
  addInstance: (instance: NameInstance) => void;
  removeInstance: (id: string) => void;
  duplicateInstance: (id: string) => void;
  updateInstance: (id: string, patch: Partial<NameInstance>) => void;
  setSelectedInstance: (id: string | null) => void;
  clearSelectedInstance: () => void;
  bringInstanceToFront: (id: string) => void;
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
  selectedInstanceId: null,
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
      selectedInstanceId: null,
    });
  },
  restoreSnapshot: (product, snapshot) => {
    const positionsKey = buildPositionsKey(product);

    set({
      productPath: product.path,
      positionsKey,
      positions: mapProductNamePositions(product),
      instances: snapshot.instances,
      preview: null,
      selectedInstanceId: snapshot.selectedInstanceId,
    });
  },
  addInstance: (instance) => {
    set((state) => ({ instances: [...state.instances, instance] }));
  },
  removeInstance: (id) => {
    set((state) => ({
      instances: state.instances.filter((instance) => instance.id !== id),
      preview: state.preview?.instanceId === id ? null : state.preview,
      selectedInstanceId: state.selectedInstanceId === id ? null : state.selectedInstanceId,
    }));
  },
  duplicateInstance: (id) => {
    set((state) => {
      const source = state.instances.find((instance) => instance.id === id);
      if (!source) return state;

      const copy: NameInstance = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
        uv: { x: source.uv.x, y: Math.min(0.98, source.uv.y + 0.04) },
      };

      return { instances: [...state.instances, copy], selectedInstanceId: copy.id };
    });
  },
  setSelectedInstance: (id) => {
    set({ selectedInstanceId: id });
  },
  clearSelectedInstance: () => {
    set({ selectedInstanceId: null });
  },
  bringInstanceToFront: (id) => {
    set((state) => {
      const index = state.instances.findIndex((instance) => instance.id === id);
      if (index < 0 || index === state.instances.length - 1) return state;

      const next = [...state.instances];
      const [instance] = next.splice(index, 1);
      next.push(instance);

      return { instances: next };
    });
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
