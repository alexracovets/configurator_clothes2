// Thin adapter — converts StepNumberPartState to generic GizmoItem and re-exports.
export {
  buildGizmoLayout as buildNumberGizmoLayout,
  hitTestGizmoLayout as hitTestNumberGizmoLayout,
  drawGizmoFrame,
  drawGizmoHandle,
  GIZMO_HANDLES,
} from './gizmoLayout';
export type { GizmoHandle, GizmoZone, GizmoLayout as NumberLayerLayout } from './gizmoLayout';

import type { StepNumberPartState } from '@store';
import type { GizmoItem } from './gizmoLayout';

export const numberPartToGizmoItem = (part: StepNumberPartState): GizmoItem => ({
  id: part.id,
  uvX: part.uv.x,
  uvY: part.uv.y,
  rotation: part.rotation,
  text: part.text || '9',
  font: part.font,
  fontSize: part.fontSize,
  strokeWidth: part.strokeWidth,
  mirrorX: part.zone === 'back' || part.positionKey.toLowerCase().includes('back'),
});
