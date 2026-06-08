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
    const cx = world.x - sx * (halfWorld.x + NAME_GIZMO_BTN_OUTSET_ATLAS);
    const cy = world.y - sy * (halfWorld.y + NAME_GIZMO_BTN_OUTSET_ATLAS);
    return Math.hypot(cx, cy) <= NAME_GIZMO_BTN_HALF_ATLAS;
  });

  if (!corner) return null;

  return { slotIndex: element.slotIndex, cornerIndex: corner.cornerIndex };
};

const hitTestGizmoFrame = (world: { x: number; y: number }, element: PrintGizmoElement): boolean => {
  const halfWorld = { x: element.half.x * element.scale, y: element.half.y * element.scale };
  return Math.abs(world.x) <= halfWorld.x && Math.abs(world.y) <= halfWorld.y;
};

const GIZMO_HANDLE_CURSORS: Record<(typeof GIZMO_CORNERS)[number]['kind'], string> = {
  duplicate: 'copy',
  delete: 'pointer',
  rotate: 's-resize',
  scale: 'nwse-resize',
};

const getGizmoHoverCursor = (world: { x: number; y: number }, element: PrintGizmoElement): string | null => {
  const buttonHit = hitTestGizmoButton(world, element);
  if (buttonHit) {
    const corner = GIZMO_CORNERS.find((item) => item.cornerIndex === buttonHit.cornerIndex);
    return corner ? GIZMO_HANDLE_CURSORS[corner.kind] : null;
  }

  return hitTestGizmoFrame(world, element) ? 'move' : null;
};

export { GIZMO_CORNERS, getGizmoHoverCursor, hitTestGizmoButton, hitTestGizmoFrame };
export type { GizmoButtonHit };
