import type { LayerContext } from '../types';
import { drawNameOnPart } from '../utils/drawNameOnPart';
import { buildNumberGizmoLayout, drawGizmoFrame, drawGizmoHandle, GIZMO_HANDLES, numberPartToGizmoItem } from '../utils/numberGizmoLayout';
import { useStepNumberSelection } from '@store';

const resolveMeshZone = (partId: string): string | null => {
  const key = partId.toLowerCase();
  if (key.includes('back')) return 'back';
  if (key.includes('front')) return 'front';
  if (key.includes('sleeve_left')) return 'sleeve_left';
  if (key.includes('sleeve_right')) return 'sleeve_right';
  return null;
};

const applyNumberLayer = ({ ctx, width, input, partId }: LayerContext): void => {
  if (!input.numberParts || input.numberParts.length === 0) return;
  if (!partId) return;

  const partZone = resolveMeshZone(partId);
  if (!partZone) return;

  const selectedPartId = useStepNumberSelection.getState().selectedPartId;

  for (const part of input.numberParts) {
    if (part.zone !== partZone) continue;
    drawNameOnPart(ctx, part, width);

    if (part.id === selectedPartId) {
      const item = numberPartToGizmoItem(part);
      const layout = buildNumberGizmoLayout(item, width);
      drawGizmoFrame(ctx, layout.textBox, width, part.rotation);
      for (const handle of GIZMO_HANDLES) {
        drawGizmoHandle(ctx, layout.handles[handle], handle, width);
      }
    }
  }
};

export { applyNumberLayer };
