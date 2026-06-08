import type { GarmentPartConfig } from '@data';
import type { LogoInstance } from '@store';

import { FULL_UV_BOUNDS, resolvePartUvBounds } from '../resolveProductRenderConfig/resolveProductRenderConfig';
import { LOGO_SLOT_COUNT } from './logoStampConstants';

type LogoSlotFloat4 = [number, number, number, number];
type LogoSlotVec2 = [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
type LogoSlotBounds4 = [
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
];

interface LogoSlotUniforms {
  anchorUv: LogoSlotVec2;
  slotActive: LogoSlotFloat4;
  partBounds: LogoSlotBounds4;
}

const DEFAULT_PART_BOUNDS = FULL_UV_BOUNDS;

const buildLogoSlotUniforms = (instances: LogoInstance[], parts: GarmentPartConfig[], meshPartId: string): LogoSlotUniforms => {
  const partsById = Object.fromEntries(parts.map((part) => [part.id, part]));
  const anchorUv: LogoSlotVec2 = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  const slotActive: LogoSlotFloat4 = [0, 0, 0, 0];
  const partBounds: LogoSlotBounds4 = [{ ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }];

  instances.slice(0, LOGO_SLOT_COUNT).forEach((instance, index) => {
    if (instance.partId !== meshPartId) return;

    const bounds = partsById[instance.partId] ? resolvePartUvBounds(partsById[instance.partId]) : DEFAULT_PART_BOUNDS;

    slotActive[index] = 1;
    anchorUv[index] = instance.uv;
    partBounds[index] = bounds;
  });

  return { anchorUv, slotActive, partBounds };
};

export { buildLogoSlotUniforms };
export type { LogoSlotUniforms };
