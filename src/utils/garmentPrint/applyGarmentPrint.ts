import type { UvBounds } from '@data';
import type { MeshStandardMaterial, Texture } from 'three';

const applyGarmentPrint = (material: MeshStandardMaterial, printTexture: Texture, uvBounds: UvBounds) => {
  material.userData.printTexture = printTexture;

  const atlasUniform = material.userData.uPrintAtlasUniform as { value: Texture } | undefined;
  if (atlasUniform) {
    atlasUniform.value = printTexture;
  }

  const boundsUniform = material.userData.uPartUvBoundsUniform as { value: { set: (x: number, y: number, z: number, w: number) => void } } | undefined;
  if (boundsUniform) {
    boundsUniform.value.set(uvBounds.minX, uvBounds.minY, uvBounds.maxX, uvBounds.maxY);
    return;
  }

  material.userData.uPartUvBounds?.set(uvBounds.minX, uvBounds.minY, uvBounds.maxX, uvBounds.maxY);
  material.needsUpdate = true;
};

export { applyGarmentPrint };
