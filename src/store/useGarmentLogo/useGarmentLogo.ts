'use client';

import { create } from 'zustand';

import type { GarmentConfig } from '@data';
import { loadCachedImage, LOGO_SLOT_COUNT, LOGO_UPLOAD_ROTATION_DEG } from '@utils';

import { createDefaultLogoInstances, createDynamicUserLogoPosition, createLogoInstance, mapProductLogoPositions } from './mapProductLogos';
import type { LogoInstance, LogoPosition, LogoPreview } from './mapProductLogos';

interface GarmentLogoState {
  productPath: string | null;
  positionsKey: string | null;
  positions: LogoPosition[];
  instances: LogoInstance[];
  preview: LogoPreview | null;
  selectedInstanceId: string | null;
  initForProduct: (product: GarmentConfig) => void;
  addUserInstance: (position: LogoPosition, src: string, fileName: string) => Promise<void>;
  addFreeUserInstance: (product: GarmentConfig, src: string, fileName: string) => Promise<void>;
  replaceInstanceImage: (id: string, src: string, fileName: string) => Promise<void>;
  removeInstance: (id: string) => void;
  duplicateInstance: (id: string) => void;
  setSelectedInstance: (id: string) => void;
  clearSelectedInstance: () => void;
  bringInstanceToFront: (id: string) => void;
  updateInstance: (id: string, patch: Partial<LogoInstance>) => void;
  setPreview: (instanceId: string, patch: LogoPreview['patch']) => void;
  clearPreview: () => void;
  canAddUserLogo: () => boolean;
  getInstancesForRender: () => LogoInstance[];
}

const resolveLogoInstancesForRender = (instances: LogoInstance[], preview: LogoPreview | null): LogoInstance[] => {
  if (!preview) return instances;

  return instances.map((instance) => (instance.id === preview.instanceId ? { ...instance, ...preview.patch } : instance));
};

const buildPositionsKey = (product: GarmentConfig) => JSON.stringify(product.logoPositions ?? []);

const resolveLogoNaturalSize = async (src: string) => {
  const image = await loadCachedImage(src);
  return { width: image.naturalWidth, height: image.naturalHeight };
};

const syncInstancesFromPositions = (instances: LogoInstance[], positions: LogoPosition[]) =>
  instances.map((instance) => {
    const position = positions.find((item) => item.key === instance.positionKey);
    if (!position) return instance;

    return {
      ...instance,
      partId: position.partId,
      uv: position.uv,
      showFrame: position.showFrame,
      showGizmo: position.showGizmo,
    };
  });

const useGarmentLogo = create<GarmentLogoState>((set, get) => ({
  productPath: null,
  positionsKey: null,
  positions: [],
  instances: [],
  preview: null,
  selectedInstanceId: null,
  initForProduct: (product) => {
    const positionsKey = buildPositionsKey(product);
    const positions = mapProductLogoPositions(product);
    const state = get();

    if (state.productPath === product.path && state.positionsKey === positionsKey) {
      set({ positions, instances: syncInstancesFromPositions(state.instances, positions) });
      return;
    }

    set({
      productPath: product.path,
      positionsKey,
      positions,
      instances: createDefaultLogoInstances(positions),
      preview: null,
      selectedInstanceId: null,
    });
  },
  addUserInstance: async (position, src, fileName) => {
    const natural = await resolveLogoNaturalSize(src);
    const instance = createLogoInstance(position, `${position.key}_user_${Date.now()}`, {
      src,
      fileName,
      isDefault: false,
      naturalWidth: natural.width,
      naturalHeight: natural.height,
      uploadRotation: LOGO_UPLOAD_ROTATION_DEG,
    });

    set((state) => ({ instances: [...state.instances, instance] }));
  },
  addFreeUserInstance: async (product, src, fileName) => {
    const { instances } = get();
    const userCount = instances.filter((instance) => !instance.isDefault).length;

    if (userCount >= LOGO_SLOT_COUNT) return;

    const position = createDynamicUserLogoPosition(product, userCount);
    const natural = await resolveLogoNaturalSize(src);
    const instance = createLogoInstance(position, `${position.key}_${Date.now()}`, {
      src,
      fileName,
      isDefault: false,
      naturalWidth: natural.width,
      naturalHeight: natural.height,
      uploadRotation: LOGO_UPLOAD_ROTATION_DEG,
    });

    set((state) => ({ instances: [...state.instances, instance] }));
  },
  replaceInstanceImage: async (id, src, fileName) => {
    const natural = await resolveLogoNaturalSize(src);
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id
          ? {
              ...instance,
              src,
              fileName,
              naturalWidth: natural.width,
              naturalHeight: natural.height,
            }
          : instance,
      ),
      preview: state.preview?.instanceId === id ? null : state.preview,
    }));
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

      const userCount = state.instances.filter((instance) => !instance.isDefault).length;
      if (userCount >= LOGO_SLOT_COUNT) return state;

      const copy: LogoInstance = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
        uv: { x: source.uv.x, y: Math.min(0.98, source.uv.y + 0.04) },
        isDefault: false,
        showFrame: true,
        showGizmo: true,
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
  canAddUserLogo: () => {
    const { positions, instances } = get();
    const userInstances = instances.filter((instance) => !instance.isDefault);

    if (positions.length === 0) {
      return userInstances.length < LOGO_SLOT_COUNT;
    }

    const usedKeys = new Set(userInstances.map((instance) => instance.positionKey));

    return positions.some((position) => position.interactive && !usedKeys.has(position.key));
  },
  getInstancesForRender: () => resolveLogoInstancesForRender(get().instances, get().preview),
}));

export { resolveLogoInstancesForRender, useGarmentLogo };
export type { LogoInstance, LogoPosition, LogoPreview };
