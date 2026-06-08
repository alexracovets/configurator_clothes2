import type { GarmentConfig } from '@data';
import type { LogoInstance } from '@store';

import { resolveLogoDisplayScale, resolveLogoGizmoHalf, resolveLogoReferenceDrawSize } from '../utils/composeLogoAtlas/composeLogoPrintAtlas';
import { LOGO_SCALE_MAX, LOGO_SCALE_MIN, LOGO_SLOT_COUNT } from '../utils/garmentPrint/logoStampConstants';
import { resolvePartPrintRotation, resolvePrintAtlasSize } from '../utils/resolveProductRenderConfig/resolveProductRenderConfig';

import type { PrintGizmoElement } from './types';

interface BuildLogoGizmoElementsInput {
  product: GarmentConfig;
  instances: LogoInstance[];
}

const buildLogoGizmoElements = ({ product, instances }: BuildLogoGizmoElementsInput): PrintGizmoElement[] => {
  const partsById = Object.fromEntries(product.parts.map((part) => [part.id, part]));
  const atlasSize = resolvePrintAtlasSize(product);

  return instances.flatMap((instance) => {
    if (!instance.showGizmo || !instance.src.trim()) return [];

    const slotIndex = instances.slice(0, LOGO_SLOT_COUNT).findIndex((item) => item.id === instance.id);
    if (slotIndex < 0) return [];

    const part = partsById[instance.partId];
    if (!part) return [];

    const naturalWidth = instance.naturalWidth || 1;
    const naturalHeight = instance.naturalHeight || 1;
    const { width, height } = resolveLogoReferenceDrawSize(instance, naturalWidth, naturalHeight);

    const half = resolveLogoGizmoHalf(width, height, instance.uploadRotation ?? 0);

    return [
      {
        kind: 'logo' as const,
        id: instance.id,
        partId: instance.partId,
        slotIndex,
        meshNames: part.meshNames,
        uv: instance.uv,
        rotation: instance.rotation,
        partRotation: resolvePartPrintRotation(part),
        scale: resolveLogoDisplayScale(instance, naturalWidth, naturalHeight, atlasSize.width, atlasSize.height),
        half,
        scaleMin: LOGO_SCALE_MIN,
        scaleMax: LOGO_SCALE_MAX,
      },
    ];
  });
};

export { buildLogoGizmoElements };
