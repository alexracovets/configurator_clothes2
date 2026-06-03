// Thin adapter — wraps generic gizmoHitTest for StepNamePartState.
export { getGizmoHits as getNameHits, normaliseUVForZone, zoneFromMeshName } from './gizmoHitTest';
export type { GizmoPartZone as NameZone } from './gizmoHitTest';
export type { GizmoZone } from './gizmoLayout';

import type { StepNamePartState } from '@store';
import { gizmoHitTest } from './gizmoHitTest';
import { namePartToGizmoItem } from './nameGizmoLayout';
import type { GizmoPartZone } from './gizmoHitTest';
import type { GizmoZone } from './gizmoLayout';

export const nameHitTest = (
  uvX: number,
  uvY: number,
  zone: GizmoPartZone,
  parts: StepNamePartState[],
  selectedPartId: string | null,
  _canvasSize: number,
): { id: string; gizmoZone: GizmoZone } | null => gizmoHitTest(uvX, uvY, zone, parts.map(namePartToGizmoItem), selectedPartId);
