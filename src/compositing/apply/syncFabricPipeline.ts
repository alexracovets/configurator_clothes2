import { PART_TEXTURE_SIZE } from '@constants';
import type { Object3D } from 'three';

import { composeFabricPart } from '../pipeline/composeFabricPart';
import { composePrintAtlas } from '../pipeline/composePrintAtlas';
import type { PbrMaps } from '../types/pbrMaps';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';
import { buildFabricCacheKey, buildPrintAtlasCacheKey } from '../utils/cacheKeys';
import { getGarmentRuntime } from '../runtime/garmentRuntime';
import { resolveMeshPartId, resolveUv0Bounds } from '../meshPartMapping';
import { forEachFabricMesh } from '../utils/mesh';
import { toStoreInput } from '../utils/toStoreInput';

import { assignPartTexturesToMesh } from './assignPartAlbedo';

const buildMergedAlbedoKey = (fabricKey: string, printKey: string, meshName: string) => {
  const bounds = resolveUv0Bounds(meshName);
  return `m:${fabricKey}|p:${printKey}|${bounds.minX},${bounds.minY},${bounds.maxX},${bounds.maxY}`;
};

const ensurePrintAtlas = async (root: Object3D, fabric: FabricCompositingInput, print: PrintCompositingInput) => {
  const runtime = getGarmentRuntime(root);
  const printKey = buildPrintAtlasCacheKey(print);

  if (runtime.printKey !== printKey || !runtime.printCanvas) {
    runtime.printCanvas = await composePrintAtlas(toStoreInput(fabric, print));
    runtime.printKey = printKey;
  }

  return { runtime, printKey };
};

const syncFabricPipeline = async (root: Object3D, fabric: FabricCompositingInput, print: PrintCompositingInput, pbrMaps: PbrMaps, partIds: string[]) => {
  if (partIds.length === 0) return;

  const { runtime, printKey } = await ensurePrintAtlas(root, fabric, print);
  if (!runtime.printCanvas) return;

  const targetIds = new Set(partIds);

  for (const partId of partIds) {
    const fabricKey = buildFabricCacheKey(fabric, partId, PART_TEXTURE_SIZE);
    const cached = runtime.fabricByPartId.get(partId);
    if (cached?.key === fabricKey) continue;

    runtime.fabricByPartId.set(partId, {
      key: fabricKey,
      canvas: composeFabricPart(fabric, partId, PART_TEXTURE_SIZE),
    });
  }

  forEachFabricMesh(root, (mesh) => {
    const partId = resolveMeshPartId(mesh.name, fabric.colorParts);
    if (!partId || !targetIds.has(partId)) return;

    const fabricCache = runtime.fabricByPartId.get(partId);
    if (!fabricCache) return;

    const mergedKey = buildMergedAlbedoKey(fabricCache.key, printKey, mesh.name);
    assignPartTexturesToMesh(mesh, fabricCache.canvas, runtime, pbrMaps, mergedKey, partId);
  });
};

export { syncFabricPipeline };
