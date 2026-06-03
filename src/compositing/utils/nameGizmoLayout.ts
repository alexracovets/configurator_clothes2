// Thin adapter — converts StepNamePartState to generic GizmoItem and re-exports.
export {
  buildGizmoLayout as buildNameGizmoLayout,
  hitTestGizmoLayout as hitTestNameGizmoLayout,
  drawGizmoFrame,
  drawGizmoHandle,
  GIZMO_HANDLES,
} from './gizmoLayout';
export type { GizmoHandle, GizmoZone, GizmoLayout as NameLayerLayout } from './gizmoLayout';

import type { StepNamePartState } from '@store';
import type { GizmoItem } from './gizmoLayout';

export const namePartToGizmoItem = (part: StepNamePartState): GizmoItem => ({
  id: part.id,
  uvX: part.uv.x,
  uvY: part.uv.y,
  rotation: part.rotation,
  text: part.text || 'PLAYER NAME',
  font: part.font,
  fontSize: part.fontSize,
  strokeWidth: part.strokeWidth,
  mirrorX: part.positionKey.toLowerCase().includes('back'),
});
