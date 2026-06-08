import type { GarmentConfig } from '@data';
import type { NameInstance } from '@store';

import { measureNameGizmoHalf } from '../utils/drawNameOnAtlas/measureNameStampBounds';
import { NAME_REFERENCE_FONT_SIZE } from '../utils/garmentPrint/nameStampConstants';
import { NAME_SLOT_COUNT } from '../utils/garmentPrint/nameSlotConstants';

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

    const rad = (instance.rotation * Math.PI) / 180;
    const cosA = Math.abs(Math.cos(rad));
    const sinA = Math.abs(Math.sin(rad));
    const half = { x: rawHalf.x * cosA + rawHalf.y * sinA, y: rawHalf.x * sinA + rawHalf.y * cosA };

    return [
      {
        id: instance.id,
        partId: instance.partId,
        slotIndex,
        meshNames: part.meshNames,
        uv: instance.uv,
        rotation: instance.rotation,
        scale: instance.fontSize / NAME_REFERENCE_FONT_SIZE,
        half,
        fontSize: instance.fontSize,
        fontSizeMin,
        fontSizeMax,
      },
    ];
  });
};

export { buildNameGizmoElements };
