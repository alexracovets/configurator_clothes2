import type { GarmentConfig } from '@data';
import type { NameInstance } from '@store';

import { measureNameGizmoHalf } from '../utils/drawNameOnAtlas/measureNameStampBounds';
import { NAME_REFERENCE_FONT_SIZE } from '../utils/garmentPrint/nameStampConstants';

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
    if (!instance.text.trim()) return [];

    const part = partsById[instance.partId];
    if (!part) return [];

    const half = measureCtx ? measureNameGizmoHalf(instance.text, instance.font, measureCtx) : null;
    if (!half) return [];

    return [
      {
        id: instance.id,
        partId: instance.partId,
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
