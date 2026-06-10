import type { Camera, Raycaster, Scene } from 'three';

import type { UvBounds, UvPoint } from '../entities/garment';

import type { PrintGizmoElement } from './gizmo';

interface GizmoButtonHoverTarget {
  slotIndex: number;
  cornerIndex: number;
}

interface GizmoButtonHit {
  slotIndex: number;
  cornerIndex: number;
}

interface PrintablePartMeshes {
  partId: string;
  meshNames: string[];
  printRotation: number;
  uvBounds: UvBounds;
}

interface PrintUvHit {
  uv: UvPoint;
  partId: string;
}

interface PrintDragMoveState {
  offset: UvPoint;
  activePartId: string;
}

interface GizmoPointerTarget {
  element: PrintGizmoElement;
  buttonHit: GizmoButtonHit | null;
  onFrame: boolean;
  uv: UvPoint;
}

interface ResolveGizmoPointerTargetContext {
  raycaster: Raycaster;
  camera: Camera;
  scene: Scene;
  domElement: HTMLElement;
  atlasSize: { width: number; height: number };
}

interface ResolveGizmoPointerTargetOptions {
  selectedInstanceId?: string | null;
  requireVisibleButtons?: boolean;
}

export type {
  GizmoButtonHit,
  GizmoButtonHoverTarget,
  GizmoPointerTarget,
  PrintablePartMeshes,
  PrintDragMoveState,
  PrintUvHit,
  ResolveGizmoPointerTargetContext,
  ResolveGizmoPointerTargetOptions,
};
