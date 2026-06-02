import type { Material, Object3D } from 'three';
import { Mesh, MeshStandardMaterial } from 'three';

import { isFabricMeshName } from '../meshPartMapping';

const getMeshMaterials = (mesh: Mesh): Material[] => (Array.isArray(mesh.material) ? mesh.material : [mesh.material]);

const forEachFabricMesh = (root: Object3D, callback: (mesh: Mesh) => void) => {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    if (!isFabricMeshName(child.name)) return;
    callback(child);
  });
};

const forEachStandardMaterial = (mesh: Mesh, callback: (material: MeshStandardMaterial) => void) => {
  getMeshMaterials(mesh).forEach((material) => {
    if (material instanceof MeshStandardMaterial) {
      callback(material);
    }
  });
};

export { forEachFabricMesh, forEachStandardMaterial, getMeshMaterials };
