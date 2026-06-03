import type { Object3D } from 'three';

import { composePrintAtlas } from '../pipeline/composePrintAtlas';
import type { PbrMaps } from '../types/pbrMaps';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';
import { buildPrintAtlasCacheKey } from '../utils/cacheKeys';
import { getGarmentRuntime } from '../runtime/garmentRuntime';
import { resolveMeshPartId, resolveUv0Bounds } from '../meshPartMapping';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';
import { toStoreInput } from '../utils/toStoreInput';

import { assignPartTexturesToMesh } from './assignPartAlbedo';

const buildMergedAlbedoKey = (fabricKey: string, printKey: string, meshName: string) => {
  const bounds = resolveUv0Bounds(meshName);
  return `m:${fabricKey}|p:${printKey}|${bounds.minX},${bounds.minY},${bounds.maxX},${bounds.maxY}`;
};

/** Pipeline 4–7: rebuild print atlas only; re-merge albedo using cached fabric canvases. */
const syncPrintPipeline = async (root: Object3D, fabric: FabricCompositingInput, print: PrintCompositingInput, pbrMaps: PbrMaps) => {
  const runtime = getGarmentRuntime(root);
  const printKey = buildPrintAtlasCacheKey(print);

  if (runtime.printKey !== printKey) {
    runtime.printCanvas = await composePrintAtlas(toStoreInput(fabric, print));
    runtime.printKey = printKey;
  }

  if (!runtime.printCanvas) return;

  forEachFabricMesh(root, (mesh) => {
    const partId = resolveMeshPartId(mesh.name, fabric.colorParts);
    if (!partId) return;

    const fabricCache = runtime.fabricByPartId.get(partId);
    if (!fabricCache) return;

    const mergedKey = buildMergedAlbedoKey(fabricCache.key, printKey, mesh.name);

    let skip = false;
    forEachStandardMaterial(mesh, (material) => {
      if (material.userData.mergedAlbedoKey === mergedKey && material.userData.fabricTexture) {
        skip = true;
      }
    });
    if (skip) return;

    assignPartTexturesToMesh(mesh, fabricCache.canvas, runtime, pbrMaps, mergedKey, partId);
  });
};

export { syncPrintPipeline };
