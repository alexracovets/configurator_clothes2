'use client';

import type { Object3D } from 'three';
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three';

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

const centerModelRoot = (root: Object3D) => {
  root.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(root);
  if (bounds.isEmpty()) return;

  const center = bounds.getCenter(new Vector3());
  root.position.sub(center);
};

const prepareModelRoot = (scene: Object3D) => {
  const root = scene.clone(true);
  splitFabricMeshMaterials(root);
  fixInsideMeshMaterial(root);
  fixDecalMaterials(root);
  centerModelRoot(root);
  return root;
};

export { fixDecalMaterials, prepareModelRoot };
