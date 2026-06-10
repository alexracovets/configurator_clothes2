import type { GarmentTextRenderInstance } from '@types';

import { resolveRotatedGizmoHalf } from '../composeLogoAtlas/composeLogoPrintAtlas';
import { PRINT_UPLOAD_ROTATION_DEG } from './nameStampConstants';

const resolveTextPlacementRotationDeg = (instance: GarmentTextRenderInstance) =>
  instance.placementRotation !== undefined ? instance.placementRotation : instance.rotation;

const resolveTextContentRotationDeg = (instance: GarmentTextRenderInstance) => resolveTextPlacementRotationDeg(instance) + PRINT_UPLOAD_ROTATION_DEG;

const resolveTextGizmoHalf = (half: { x: number; y: number }, instance: GarmentTextRenderInstance) =>
  resolveRotatedGizmoHalf(half, resolveTextContentRotationDeg(instance));

export { resolveTextContentRotationDeg, resolveTextGizmoHalf };
