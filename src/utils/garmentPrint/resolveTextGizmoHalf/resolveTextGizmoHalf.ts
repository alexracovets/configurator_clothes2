import type { garmentTextRenderInstanceType } from '@types';

import { resolveRotatedGizmoHalf } from '../../composeLogoAtlas/composeLogoPrintAtlas';
import { PRINT_UPLOAD_ROTATION_DEG } from '@constants';

const resolveTextPlacementRotationDeg = (instance: garmentTextRenderInstanceType) =>
  instance.placementRotation !== undefined ? instance.placementRotation : instance.rotation;

const resolveTextContentRotationDeg = (instance: garmentTextRenderInstanceType) => resolveTextPlacementRotationDeg(instance) + PRINT_UPLOAD_ROTATION_DEG;

const resolveTextGizmoHalf = (half: { x: number; y: number }, instance: garmentTextRenderInstanceType) =>
  resolveRotatedGizmoHalf(half, resolveTextContentRotationDeg(instance));

export { resolveTextContentRotationDeg, resolveTextGizmoHalf };
