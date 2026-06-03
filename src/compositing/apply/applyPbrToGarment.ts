import type { Object3D } from 'three';

import type { PbrMaps } from '../types/pbrMaps';
import { applyPbrMapsLayer } from '../layers/03-pbrMapsLayer';
import { configureGarmentMaterial } from '../utils/configureGarmentMaterial';
import { resolveMeshPartId, resolveUv0Bounds, resolveUv0PartKey } from '../meshPartMapping';
import { fixInsideMeshMaterial } from '../utils/fixInsideMeshMaterial';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';

/** Pipeline 3: PBR + garment shader — once per material, not tied to color/print. */
const applyPbrToGarment = (root: Object3D, maps: PbrMaps, colorParts: { id: string }[]) => {
  forEachFabricMesh(root, (mesh) => {
    const partId = resolveMeshPartId(mesh.name, colorParts);

    forEachStandardMaterial(mesh, (material) => {
      if (material.userData.pbrMapsApplied) return;

      applyPbrMapsLayer(material, maps);
      material.userData.pbrMapsApplied = true;
      configureGarmentMaterial(material, resolveUv0Bounds(mesh.name), maps, resolveUv0PartKey(mesh.name), partId);
    });
  });

  if (!root.userData.garmentInsideFixed) {
    fixInsideMeshMaterial(root, maps.fabricNormal);
    root.userData.garmentInsideFixed = true;
  }
};

export { applyPbrToGarment };
