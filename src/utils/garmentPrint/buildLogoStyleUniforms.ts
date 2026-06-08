import type { GarmentPartConfig } from '@data';
import type { LogoInstance } from '@store';

import { resolveLogoDisplayScale } from '../composeLogoAtlas/composeLogoPrintAtlas';
import { FULL_UV_BOUNDS, resolvePartPrintRotation, resolvePartUvBounds } from '../resolveProductRenderConfig/resolveProductRenderConfig';
import { LOGO_SLOT_COUNT } from './logoStampConstants';

type LogoSlotFloat4 = [number, number, number, number];
type LogoSlotVec2 = [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
type LogoSlotBounds4 = [
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
];

interface LogoStyleUniforms {
  stampCellSize: { width: number; height: number };
  anchorUv: LogoSlotVec2;
  rotation: LogoSlotFloat4;
  partRotation: LogoSlotFloat4;
  scale: LogoSlotFloat4;
  slotActive: LogoSlotFloat4;
  partBounds: LogoSlotBounds4;
}

const DEFAULT_PART_BOUNDS = FULL_UV_BOUNDS;

const buildLogoStyleUniforms = (
  instances: LogoInstance[],
  parts: GarmentPartConfig[],
  meshPartId: string,
  stampCellSize: { width: number; height: number },
  atlasWidth: number,
  atlasHeight: number,
): LogoStyleUniforms => {
  const partsById = Object.fromEntries(parts.map((part) => [part.id, part]));
  const anchorUv: LogoSlotVec2 = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  const rotation: LogoSlotFloat4 = [0, 0, 0, 0];
  const partRotation: LogoSlotFloat4 = [0, 0, 0, 0];
  const scale: LogoSlotFloat4 = [1, 1, 1, 1];
  const slotActive: LogoSlotFloat4 = [0, 0, 0, 0];
  const partBounds: LogoSlotBounds4 = [{ ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }];

  instances.slice(0, LOGO_SLOT_COUNT).forEach((instance, index) => {
    if (instance.partId !== meshPartId) return;

    const part = partsById[instance.partId];
    const bounds = part ? resolvePartUvBounds(part) : DEFAULT_PART_BOUNDS;
    const naturalWidth = instance.naturalWidth || 1;
    const naturalHeight = instance.naturalHeight || 1;

    slotActive[index] = 1;
    anchorUv[index] = instance.uv;
    rotation[index] = (instance.rotation * Math.PI) / 180;
    partRotation[index] = part ? (resolvePartPrintRotation(part) * Math.PI) / 180 : 0;
    scale[index] = resolveLogoDisplayScale(instance, naturalWidth, naturalHeight, atlasWidth, atlasHeight);
    partBounds[index] = bounds;
  });

  return {
    stampCellSize: {
      width: Math.max(stampCellSize.width, 1),
      height: Math.max(stampCellSize.height, 1),
    },
    anchorUv,
    rotation,
    partRotation,
    scale,
    slotActive,
    partBounds,
  };
};

export { buildLogoStyleUniforms };
export type { LogoStyleUniforms };
