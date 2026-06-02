import type { Object3D } from 'three';
import { CanvasTexture, ClampToEdgeWrapping, MeshStandardMaterial, SRGBColorSpace } from 'three';

import { applyPbrMapsLayer } from '../layers/03-pbrMapsLayer';
import { composePrintAtlas } from '../pipeline/composePrintAtlas';
import { resolveMeshPartId, resolveUv0Bounds, resolveUv0PartKey } from '../meshPartMapping';
import type { CompositingInput } from '../types';
import { buildFabricCacheKey } from '../utils/cacheKeys';
import { configureGarmentMaterial } from '../utils/configureGarmentMaterial';
import { composePartTexture } from '../utils/composePartTexture';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';

const disposeTexture = (texture: CanvasTexture) => {
  texture.dispose();
};

const createPartAlbedoTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
};

const assignCompositedTexture = (material: MeshStandardMaterial, texture: CanvasTexture, meshName: string, pbrMaps: CompositingInput['pbrMaps']) => {
  const previous = material.userData.compositedTexture as CanvasTexture | undefined;
  if (previous && previous !== texture) {
    disposeTexture(previous);
  }

  if (pbrMaps) {
    applyPbrMapsLayer(material, pbrMaps);
  }

  if (pbrMaps) {
    configureGarmentMaterial(material, resolveUv0Bounds(meshName), pbrMaps, resolveUv0PartKey(meshName));
  }
  material.map = texture;
  material.userData.compositedTexture = texture;
  material.needsUpdate = true;
};

const splitFabricMeshMaterials = (root: Object3D) => {
  forEachFabricMesh(root, (mesh) => {
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((material) => material.clone());
      return;
    }

    mesh.material = mesh.material.clone();
  });
};

const applyLayeredMaterials = async (root: Object3D, input: CompositingInput) => {
  if (!input.pbrMaps) return;

  const printCanvas = await composePrintAtlas(input);
  const textureMap = new Map<string, CanvasTexture>();

  const resolveTexture = (meshName: string, partId: string | null) => {
    const bounds = resolveUv0Bounds(meshName);
    const cacheKey = `${buildFabricCacheKey(input, partId)}|${bounds.minX},${bounds.minY},${bounds.maxX},${bounds.maxY}`;
    const cached = textureMap.get(cacheKey);
    if (cached) return cached;

    const partCanvas = composePartTexture(input, partId, printCanvas, bounds);
    const texture = createPartAlbedoTexture(partCanvas);
    textureMap.set(cacheKey, texture);

    return texture;
  };

  forEachFabricMesh(root, (mesh) => {
    const partId = resolveMeshPartId(mesh.name, input.colorParts);
    const texture = resolveTexture(mesh.name, partId);

    forEachStandardMaterial(mesh, (material) => {
      assignCompositedTexture(material, texture, mesh.name, input.pbrMaps);
    });
  });
};

export { applyLayeredMaterials, splitFabricMeshMaterials };
