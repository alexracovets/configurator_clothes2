import type { GarmentPartConfig } from '@data';
import type { GarmentTextRenderInstance } from '@store';

import type { StampPixelSize } from '../drawNameOnAtlas/measureNameStampBounds';
import { FULL_UV_BOUNDS, resolvePartPrintRotation, resolvePartUvBounds } from '../resolveProductRenderConfig/resolveProductRenderConfig';
import { NAME_REFERENCE_FONT_SIZE } from './nameStampConstants';
import { NAME_SLOT_COUNT } from './nameSlotConstants';

type NameSlotFloat4 = [number, number, number, number];
type NameSlotColor4 = [string, string, string, string];
type NameSlotVec2 = [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
type NameSlotBounds4 = [
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
  { minX: number; minY: number; maxX: number; maxY: number },
];

interface NameStyleUniforms {
  stampSize: StampPixelSize;
  anchorUv: NameSlotVec2;
  rotation: NameSlotFloat4;
  partRotation: NameSlotFloat4;
  scale: NameSlotFloat4;
  slotActive: NameSlotFloat4;
  partBounds: NameSlotBounds4;
  textColors: NameSlotColor4;
  strokeColors: NameSlotColor4;
}

const DEFAULT_NAME_COLOR = '#000000';
const DEFAULT_NAME_STROKE = '#ffffff';
const DEFAULT_STAMP_SIZE: StampPixelSize = { width: 1, height: 1 };
const DEFAULT_PART_BOUNDS = FULL_UV_BOUNDS;

const buildNameStyleUniforms = (
  instances: GarmentTextRenderInstance[],
  parts: GarmentPartConfig[],
  stampSize: StampPixelSize,
  meshPartId: string,
): NameStyleUniforms => {
  const partsById = Object.fromEntries(parts.map((part) => [part.id, part]));
  const anchorUv: NameSlotVec2 = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  const rotation: NameSlotFloat4 = [0, 0, 0, 0];
  const partRotation: NameSlotFloat4 = [0, 0, 0, 0];
  const scale: NameSlotFloat4 = [1, 1, 1, 1];
  const slotActive: NameSlotFloat4 = [0, 0, 0, 0];
  const partBounds: NameSlotBounds4 = [{ ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }, { ...DEFAULT_PART_BOUNDS }];
  const textColors: NameSlotColor4 = [DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR];
  const strokeColors: NameSlotColor4 = [DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE];

  instances.slice(0, NAME_SLOT_COUNT).forEach((instance, index) => {
    if (instance.partId !== meshPartId) return;

    const part = partsById[instance.partId];
    const bounds = part ? resolvePartUvBounds(part) : DEFAULT_PART_BOUNDS;

    slotActive[index] = 1;
    anchorUv[index] = instance.uv;
    rotation[index] = (instance.rotation * Math.PI) / 180;
    partRotation[index] = part ? (resolvePartPrintRotation(part) * Math.PI) / 180 : 0;
    scale[index] = instance.fontSize / NAME_REFERENCE_FONT_SIZE;
    partBounds[index] = bounds;
    textColors[index] = instance.textColor;
    strokeColors[index] = instance.strokeColor;
  });

  return {
    stampSize: stampSize.width > 0 && stampSize.height > 0 ? stampSize : DEFAULT_STAMP_SIZE,
    anchorUv,
    rotation,
    partRotation,
    scale,
    slotActive,
    partBounds,
    textColors,
    strokeColors,
  };
};

export { buildNameStyleUniforms };
export type { NameSlotBounds4, NameSlotColor4, NameSlotFloat4, NameSlotVec2, NameStyleUniforms };
