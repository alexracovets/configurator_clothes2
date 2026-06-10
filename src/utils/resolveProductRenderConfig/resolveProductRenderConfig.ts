import type { GarmentConfig, GarmentPartConfig, PrintAtlasConfig, UvBounds, UvPoint } from '@types';

import { DEFAULT_PART_TEXTURE_SIZE, PRINT_ATLAS_HEIGHT, PRINT_ATLAS_WIDTH } from '@constants';

const DEFAULT_PRINT_ATLAS: PrintAtlasConfig = {
  width: PRINT_ATLAS_WIDTH,
  height: PRINT_ATLAS_HEIGHT,
};
const FULL_UV_BOUNDS: UvBounds = { minX: 0, maxX: 1, minY: 0, maxY: 1 };

const resolvePrintAtlasSize = (product: GarmentConfig): PrintAtlasConfig => product.printAtlas ?? DEFAULT_PRINT_ATLAS;

const resolvePartTextureSize = (product: GarmentConfig): number => product.partTextureSize ?? DEFAULT_PART_TEXTURE_SIZE;

const resolvePartUvBounds = (part: GarmentPartConfig): UvBounds => part.uvBounds ?? FULL_UV_BOUNDS;

const resolvePartPrintRotation = (part: GarmentPartConfig): number => part.printRotation ?? part.gradient?.rotation ?? 0;

const isUvInsidePartBounds = (uv: UvPoint, bounds: UvBounds = FULL_UV_BOUNDS): boolean =>
  uv.x >= bounds.minX && uv.x <= bounds.maxX && uv.y >= bounds.minY && uv.y <= bounds.maxY;

const clampUvToPartBounds = (uv: UvPoint, bounds: UvBounds = FULL_UV_BOUNDS): UvPoint => ({
  x: Math.min(bounds.maxX, Math.max(bounds.minX, uv.x)),
  y: Math.min(bounds.maxY, Math.max(bounds.minY, uv.y)),
});

const repairPrintInstancePlacement = <T extends { partId: string; uv: UvPoint }>(instance: T, parts: GarmentPartConfig[]): T => {
  const assignedPart = parts.find((part) => part.id === instance.partId);
  const assignedBounds = assignedPart ? resolvePartUvBounds(assignedPart) : FULL_UV_BOUNDS;

  if (isUvInsidePartBounds(instance.uv, assignedBounds)) {
    return instance;
  }

  const containingPart = parts.find((part) => isUvInsidePartBounds(instance.uv, resolvePartUvBounds(part)));
  if (containingPart) {
    return { ...instance, partId: containingPart.id };
  }

  return { ...instance, uv: clampUvToPartBounds(instance.uv, assignedBounds) };
};

export {
  clampUvToPartBounds,
  FULL_UV_BOUNDS,
  isUvInsidePartBounds,
  repairPrintInstancePlacement,
  resolvePartPrintRotation,
  resolvePartTextureSize,
  resolvePartUvBounds,
  resolvePrintAtlasSize,
};
