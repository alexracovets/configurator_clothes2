import type { NameInstance } from '@store';

import { measureNameGizmoHalf } from '../drawNameOnAtlas/measureNameStampBounds';

import type { GizmoFrameState } from './applyGarmentNames';
import { NAME_SLOT_COUNT } from './nameSlotConstants';

const measureCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const measureCtx = measureCanvas?.getContext('2d') ?? null;

// Builds the per-slot selection-frame half sizes for one garment part. Slot indexing matches
// buildNameStyleUniforms so each frame lines up with the name rendered in that slot.
const buildGizmoFrameUniforms = (instances: NameInstance[], meshPartId: string, enabled: boolean): GizmoFrameState => {
  const half = Array.from({ length: NAME_SLOT_COUNT }, () => ({ x: 0, y: 0 }));

  if (measureCtx) {
    instances.slice(0, NAME_SLOT_COUNT).forEach((instance, index) => {
      if (instance.partId !== meshPartId || !instance.text.trim()) return;

      const measured = measureNameGizmoHalf(instance.text, instance.font, measureCtx);
      if (measured) half[index] = measured;
    });
  }

  return { enabled: enabled ? 1 : 0, half };
};

export { buildGizmoFrameUniforms };
