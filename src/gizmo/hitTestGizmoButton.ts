import { NAME_GIZMO_BTN_HALF_ATLAS, NAME_GIZMO_BTN_OUTSET_ATLAS } from '@utils';

import type { PrintGizmoElement } from './types';

const GIZMO_CORNERS = [
  { kind: 'duplicate', cornerIndex: 0, sx: -1, sy: 1 },
  { kind: 'delete', cornerIndex: 1, sx: -1, sy: -1 },
  { kind: 'rotate', cornerIndex: 2, sx: 1, sy: 1 },
  { kind: 'scale', cornerIndex: 3, sx: 1, sy: -1 },
] as const;

interface GizmoButtonHit {
  slotIndex: number;
  cornerIndex: number;
}

const hitTestGizmoButton = (world: { x: number; y: number }, element: PrintGizmoElement): GizmoButtonHit | null => {
  const halfWorld = { x: element.half.x * element.scale, y: element.half.y * element.scale };

  const corner = GIZMO_CORNERS.find(({ sx, sy }) => {
    const cx = Math.abs(world.x - sx * (halfWorld.x + NAME_GIZMO_BTN_OUTSET_ATLAS));
    const cy = Math.abs(world.y - sy * (halfWorld.y + NAME_GIZMO_BTN_OUTSET_ATLAS));
    return cx <= NAME_GIZMO_BTN_HALF_ATLAS && cy <= NAME_GIZMO_BTN_HALF_ATLAS;
  });

  if (!corner) return null;

  return { slotIndex: element.slotIndex, cornerIndex: corner.cornerIndex };
};

export { GIZMO_CORNERS, hitTestGizmoButton };
export type { GizmoButtonHit };
