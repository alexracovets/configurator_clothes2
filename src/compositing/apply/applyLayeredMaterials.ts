import type { Object3D } from 'three';

import type { CompositingInput } from '../types';
import { forEachFabricMesh } from '../utils/mesh';

import { applyPbrToGarment } from './applyPbrToGarment';
import { syncFabricPipeline } from './syncFabricPipeline';
import { syncPrintPipeline } from './syncPrintPipeline';

const splitFabricMeshMaterials = (root: Object3D) => {
  forEachFabricMesh(root, (mesh) => {
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((material) => material.clone());
      return;
    }

    mesh.material = mesh.material.clone();
  });
};

/** Full sync — prefer separate pipelines from `useGarmentLayers`. */
const applyLayeredMaterials = async (root: Object3D, input: CompositingInput) => {
  if (!input.pbrMaps) return;

  const fabric = {
    colorParts: input.colorParts,
    shadingParts: input.shadingParts,
  };
  const print = {
    activePattern: input.activePattern,
    activePatternCustomization: input.activePatternCustomization,
    defaultPattern: input.defaultPattern,
    defaultPatternCustomization: input.defaultPatternCustomization,
    logoParts: input.logoParts,
  };

  applyPbrToGarment(root, input.pbrMaps);
  await syncPrintPipeline(root, fabric, print, input.pbrMaps);
  await syncFabricPipeline(
    root,
    fabric,
    print,
    input.pbrMaps,
    fabric.colorParts.map((part) => part.id),
  );
};

export { applyLayeredMaterials, splitFabricMeshMaterials };
