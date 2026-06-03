import type { LayerContext } from '../types';
import { drawNameOnPart } from '../utils/drawNameOnPart';
import { buildGizmoLayout, drawGizmoFrame, drawGizmoHandle, GIZMO_HANDLES } from '../utils/gizmoLayout';
import { namePartToGizmoItem } from '../utils/nameGizmoLayout';
import { useStepNameSelection } from '@store';

const resolvePartZone = (positionKey: string): string => {
  const key = positionKey.toLowerCase();
  if (key.includes('back')) return 'back';
  if (key.includes('front')) return 'front';
  if (key.includes('sleeve_left') || key.includes('left')) return 'sleeve_left';
  if (key.includes('sleeve_right') || key.includes('right')) return 'sleeve_right';
  return 'back';
};

const applyNameLayer = ({ ctx, width, input, partId }: LayerContext): void => {
  if (!input.nameParts || input.nameParts.length === 0) return;
  if (!partId) return;

  const partZone = partId.toLowerCase().includes('back')
    ? 'back'
    : partId.toLowerCase().includes('front')
      ? 'front'
      : partId.toLowerCase().includes('sleeve_left')
        ? 'sleeve_left'
        : partId.toLowerCase().includes('sleeve_right')
          ? 'sleeve_right'
          : null;

  if (!partZone) return;

  const selectedPartId = useStepNameSelection.getState().selectedPartId;

  for (const part of input.nameParts) {
    if (resolvePartZone(part.positionKey) !== partZone) continue;
    drawNameOnPart(ctx, part, width);

    if (part.id === selectedPartId) {
      const item = namePartToGizmoItem(part);
      const layout = buildGizmoLayout(item, width);
      drawGizmoFrame(ctx, layout.textBox, width, part.rotation);
      for (const handle of GIZMO_HANDLES) {
        drawGizmoHandle(ctx, layout.handles[handle], handle, width);
      }
    }
  }
};

export { applyNameLayer };
