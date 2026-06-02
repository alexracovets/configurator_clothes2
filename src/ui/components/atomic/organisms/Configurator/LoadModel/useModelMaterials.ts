'use client';

import type { Object3D } from 'three';
import { Mesh, MeshStandardMaterial } from 'three';

import { fixInsideMeshMaterial, splitFabricMeshMaterials } from '@compositing';

const fixDecalMaterials = (root: Object3D) => {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.name !== 'label' || !material.map) return;

      material.color.set('#ffffff');
      material.transparent = true;
      material.depthWrite = false;
      material.userData.preserveAlpha = true;
      material.needsUpdate = true;
    });
  });
};

const prepareModelRoot = (scene: Object3D) => {
  const root = scene.clone(true);
  splitFabricMeshMaterials(root);
  fixInsideMeshMaterial(root);
  fixDecalMaterials(root);
  return root;
};

export { fixDecalMaterials, prepareModelRoot };
