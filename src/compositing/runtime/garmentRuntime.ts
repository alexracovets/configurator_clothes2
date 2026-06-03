import type { CanvasTexture, Object3D } from 'three';

interface FabricPartCache {
  key: string;
  canvas: HTMLCanvasElement;
}

interface GarmentRuntime {
  fabricByPartId: Map<string, FabricPartCache>;
  printCanvas: HTMLCanvasElement | null;
  printKey: string | null;
  printAtlasTexture: CanvasTexture | null;
}

const RUNTIME_KEY = 'garmentCompositor';

const getGarmentRuntime = (root: Object3D): GarmentRuntime => {
  if (!root.userData[RUNTIME_KEY]) {
    root.userData[RUNTIME_KEY] = {
      fabricByPartId: new Map(),
      printCanvas: null,
      printKey: null,
      printAtlasTexture: null,
    };
  }

  return root.userData[RUNTIME_KEY] as GarmentRuntime;
};

export { getGarmentRuntime };
export type { FabricPartCache, GarmentRuntime };
