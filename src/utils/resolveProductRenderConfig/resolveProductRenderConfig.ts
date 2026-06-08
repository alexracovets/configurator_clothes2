import type { GarmentConfig, GarmentPartConfig, PrintAtlasConfig, UvBounds } from '@data';

const DEFAULT_PART_TEXTURE_SIZE = 2048;
const DEFAULT_PRINT_ATLAS: PrintAtlasConfig = {
  width: 2048,
  height: Math.round((4900 / 9331) * 2048),
};
const FULL_UV_BOUNDS: UvBounds = { minX: 0, maxX: 1, minY: 0, maxY: 1 };

const resolvePrintAtlasSize = (product: GarmentConfig): PrintAtlasConfig => product.printAtlas ?? DEFAULT_PRINT_ATLAS;

const resolvePartTextureSize = (product: GarmentConfig): number => product.partTextureSize ?? DEFAULT_PART_TEXTURE_SIZE;

const resolvePartUvBounds = (part: GarmentPartConfig): UvBounds => part.uvBounds ?? FULL_UV_BOUNDS;

const resolvePartPrintRotation = (part: GarmentPartConfig): number => part.printRotation ?? part.gradient?.rotation ?? 0;

export { FULL_UV_BOUNDS, resolvePartPrintRotation, resolvePartTextureSize, resolvePartUvBounds, resolvePrintAtlasSize };
