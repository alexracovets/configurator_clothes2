import { CanvasTexture, ClampToEdgeWrapping, type Mesh, SRGBColorSpace } from 'three';

import type { PbrMaps } from '../types/pbrMaps';
import { applyPbrMapsLayer } from '../layers/03-pbrMapsLayer';
import { configureGarmentMaterial } from '../utils/configureGarmentMaterial';
import { resolveUv0Bounds, resolveUv0PartKey } from '../meshPartMapping';
import { forEachStandardMaterial } from '../utils/mesh';

import type { GarmentRuntime } from '../runtime/garmentRuntime';

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

const syncPrintAtlasTexture = (runtime: GarmentRuntime, printCanvas: HTMLCanvasElement | null) => {
  if (!printCanvas) {
    if (runtime.printAtlasTexture) {
      disposeTexture(runtime.printAtlasTexture);
      runtime.printAtlasTexture = null;
    }
    return null;
  }

  if (!runtime.printAtlasTexture) {
    runtime.printAtlasTexture = createPartAlbedoTexture(printCanvas);
    return runtime.printAtlasTexture;
  }

  runtime.printAtlasTexture.image = printCanvas;
  runtime.printAtlasTexture.needsUpdate = true;
  return runtime.printAtlasTexture;
};

/** Layers 1–2 fabric + layers 4–7 print (composited in shader: gradient before print). */
const assignPartTexturesToMesh = (
  mesh: Mesh,
  fabricCanvas: HTMLCanvasElement,
  runtime: GarmentRuntime,
  pbrMaps: PbrMaps,
  cacheKey: string,
  partId: string | null,
) => {
  const fabricTexture = createPartAlbedoTexture(fabricCanvas);
  const printAtlasTexture = syncPrintAtlasTexture(runtime, runtime.printCanvas);
  const bounds = resolveUv0Bounds(mesh.name);

  forEachStandardMaterial(mesh, (material) => {
    const previousFabric = material.userData.fabricTexture as CanvasTexture | undefined;
    if (previousFabric && previousFabric !== fabricTexture) {
      disposeTexture(previousFabric);
    }

    const hadPrint = material.userData.hasPrintAtlas === true;
    const hasPrint = printAtlasTexture !== null;

    if (!material.userData.pbrMapsApplied) {
      applyPbrMapsLayer(material, pbrMaps);
      material.userData.pbrMapsApplied = true;
      configureGarmentMaterial(material, bounds, pbrMaps, resolveUv0PartKey(mesh.name), partId);
    } else if (hadPrint !== hasPrint) {
      material.userData.garmentShaderConfigured = false;
      configureGarmentMaterial(material, bounds, pbrMaps, resolveUv0PartKey(mesh.name), partId);
    } else {
      const uniform = material.userData.uPartUvBounds as { set: (x: number, y: number, z: number, w: number) => void };
      uniform.set(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    }

    material.map = fabricTexture;
    material.userData.fabricTexture = fabricTexture;
    material.userData.printTexture = printAtlasTexture;
    material.userData.hasPrintAtlas = hasPrint;
    material.userData.compositedTexture = fabricTexture;
    material.userData.mergedAlbedoKey = cacheKey;
    material.userData.colorPreviewActive = false;
    material.color.set('#ffffff');
    material.needsUpdate = true;
  });
};

export { assignPartTexturesToMesh, createPartAlbedoTexture, syncPrintAtlasTexture };
