import type { LogoInstance } from '@store';

import { resolveLogoReferenceDrawSize } from '../composeLogoAtlas/composeLogoPrintAtlas';
import type { GizmoFrameState } from './applyGarmentLogos';
import { LOGO_SLOT_COUNT } from './logoStampConstants';

const buildLogoGizmoFrameUniforms = (instances: LogoInstance[], meshPartId: string, enabled: boolean): GizmoFrameState => {
  const half = Array.from({ length: LOGO_SLOT_COUNT }, () => ({ x: 0, y: 0 }));
  const frameActive = Array.from({ length: LOGO_SLOT_COUNT }, () => 0);
  const gizmoActive = Array.from({ length: LOGO_SLOT_COUNT }, () => 0);

  instances.slice(0, LOGO_SLOT_COUNT).forEach((instance, index) => {
    if (instance.partId !== meshPartId) return;

    frameActive[index] = instance.showFrame ? 1 : 0;
    gizmoActive[index] = instance.showGizmo ? 1 : 0;

    const naturalWidth = instance.naturalWidth || 1;
    const naturalHeight = instance.naturalHeight || 1;
    const { width, height } = resolveLogoReferenceDrawSize(instance, naturalWidth, naturalHeight);

    const rad = (instance.rotation * Math.PI) / 180;
    const cosA = Math.abs(Math.cos(rad));
    const sinA = Math.abs(Math.sin(rad));
    half[index] = {
      x: (width * cosA + height * sinA) / 2,
      y: (width * sinA + height * cosA) / 2,
    };
  });

  return { enabled: enabled ? 1 : 0, half, frameActive, gizmoActive };
};

export { buildLogoGizmoFrameUniforms };
