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
  const frameActive = Array.from({ length: NAME_SLOT_COUNT }, () => 0);
  const gizmoActive = Array.from({ length: NAME_SLOT_COUNT }, () => 0);

  if (measureCtx) {
    instances.slice(0, NAME_SLOT_COUNT).forEach((instance, index) => {
      if (instance.partId !== meshPartId || !instance.text.trim()) return;

      frameActive[index] = instance.showFrame ? 1 : 0;
      gizmoActive[index] = instance.showGizmo ? 1 : 0;

      const measured = measureNameGizmoHalf(instance.text, instance.font, measureCtx);
      if (measured) {
        const rad = (instance.rotation * Math.PI) / 180;
        const cosA = Math.abs(Math.cos(rad));
        const sinA = Math.abs(Math.sin(rad));
        half[index] = {
          x: measured.x * cosA + measured.y * sinA,
          y: measured.x * sinA + measured.y * cosA,
        };
      }
    });
  }

  return { enabled: enabled ? 1 : 0, half, frameActive, gizmoActive };
};

export { buildGizmoFrameUniforms };
