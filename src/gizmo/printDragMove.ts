import type { UvPoint } from '@data';
import { clampUvToPartBounds } from '../utils/resolveProductRenderConfig/resolveProductRenderConfig';

import type { PrintablePartMeshes, PrintUvHit } from './resolveGizmoPointerTarget';

interface PrintDragMoveState {
  offset: UvPoint;
  activePartId: string;
}

interface PrintDragMoveResult {
  uv: UvPoint;
  partId: string;
  state: PrintDragMoveState;
}

const resolvePrintablePart = (printableParts: PrintablePartMeshes[], partId: string) => printableParts.find((part) => part.partId === partId) ?? null;

const resolvePrintDragMove = (hit: PrintUvHit, state: PrintDragMoveState, printableParts: PrintablePartMeshes[]): PrintDragMoveResult | null => {
  const targetPart = resolvePrintablePart(printableParts, hit.partId);
  if (!targetPart) return null;

  let offset = state.offset;
  let activePartId = state.activePartId;

  if (hit.partId !== activePartId) {
    offset = { x: 0, y: 0 };
    activePartId = hit.partId;
  }

  const uv = clampUvToPartBounds({ x: hit.uv.x + offset.x, y: hit.uv.y + offset.y }, targetPart.uvBounds);

  return {
    uv,
    partId: hit.partId,
    state: { offset, activePartId },
  };
};

export { resolvePrintDragMove };
export type { PrintDragMoveState };
