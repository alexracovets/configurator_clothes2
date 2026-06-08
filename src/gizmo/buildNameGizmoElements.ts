import type { GarmentConfig } from '@data';
import type { NameInstance } from '@store';

import { measureNameGizmoHalf } from '../utils/drawNameOnAtlas/measureNameStampBounds';
import { NAME_REFERENCE_FONT_SIZE } from '../utils/garmentPrint/nameStampConstants';
import { NAME_SLOT_COUNT } from '../utils/garmentPrint/nameSlotConstants';
import { resolvePartPrintRotation } from '../utils/resolveProductRenderConfig/resolveProductRenderConfig';

import type { PrintGizmoElement } from './types';

interface BuildNameGizmoElementsInput {
  product: GarmentConfig;
  instances: NameInstance[];
  fontSizeMin: number;
  fontSizeMax: number;
}

const measureCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const measureCtx = measureCanvas?.getContext('2d') ?? null;

const buildNameGizmoElements = ({ product, instances, fontSizeMin, fontSizeMax }: BuildNameGizmoElementsInput): PrintGizmoElement[] => {
  const partsById = Object.fromEntries(product.parts.map((part) => [part.id, part]));

  return instances.flatMap((instance) => {
    if (!instance.showGizmo || !instance.text.trim()) return [];

    const slotIndex = instances.slice(0, NAME_SLOT_COUNT).findIndex((item) => item.id === instance.id);
    if (slotIndex < 0) return [];

    const part = partsById[instance.partId];
    if (!part) return [];

    const rawHalf = measureCtx ? measureNameGizmoHalf(instance.text, instance.font, measureCtx) : null;
    if (!rawHalf) return [];

    return [
      {
        kind: 'name' as const,
        id: instance.id,
        partId: instance.partId,
        slotIndex,
        meshNames: part.meshNames,
        uv: instance.uv,
        rotation: instance.rotation,
        partRotation: resolvePartPrintRotation(part),
        half: rawHalf,
        scale: instance.fontSize / NAME_REFERENCE_FONT_SIZE,
        fontSize: instance.fontSize,
        fontSizeMin,
        fontSizeMax,
      },
    ];
  });
};

export { buildNameGizmoElements };
