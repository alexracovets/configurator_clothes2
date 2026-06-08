import type { GarmentPartConfig } from '@data';
import type { Camera, Object3D, Raycaster, Scene } from 'three';
import { Vector2 } from 'three';

import { resolvePartPrintRotation, resolvePartUvBounds } from '../utils/resolveProductRenderConfig/resolveProductRenderConfig';

import { getGizmoButtonReveal } from './gizmoButtonReveal';
import { hitTestGizmoButton, hitTestGizmoFrame } from './hitTestGizmoButton';
import type { GizmoButtonHit } from './hitTestGizmoButton';
import { toPrintLocalPx } from './printLocalSpace';
import type { PrintGizmoElement } from './types';

interface PrintablePartMeshes {
  partId: string;
  meshNames: string[];
  printRotation: number;
  uvBounds: { minX: number; maxX: number; minY: number; maxY: number };
}

interface PrintUvHit {
  uv: { x: number; y: number };
  partId: string;
}

interface GizmoPointerTarget {
  element: PrintGizmoElement;
  buttonHit: GizmoButtonHit | null;
  onFrame: boolean;
  uv: { x: number; y: number };
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

const toLocalPx = (uv: { x: number; y: number }, element: PrintGizmoElement, atlasSize: { width: number; height: number }) =>
  toPrintLocalPx(uv, element.uv, atlasSize, element.partRotation, element.rotation);

const buildPrintablePartMeshes = (parts: GarmentPartConfig[]): PrintablePartMeshes[] =>
  parts.map((part) => ({
    partId: part.id,
    meshNames: part.meshNames,
    printRotation: resolvePartPrintRotation(part),
    uvBounds: resolvePartUvBounds(part),
  }));

const resolvePartIdFromMeshName = (meshName: string, printableParts: PrintablePartMeshes[]) => {
  const match = printableParts.find((part) => part.meshNames.includes(meshName));
  return match?.partId ?? null;
};

const raycastPrintUv = (clientX: number, clientY: number, printableParts: PrintablePartMeshes[], ctx: ResolveGizmoPointerTargetContext): PrintUvHit | null => {
  const rect = ctx.domElement.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  ctx.raycaster.setFromCamera(new Vector2(x, y), ctx.camera);
  const hits = ctx.raycaster.intersectObject(ctx.scene as Object3D, true).filter((item) => item.uv);
  const allowedMeshes = new Set(printableParts.flatMap((part) => part.meshNames));

  for (const hit of hits) {
    if (!allowedMeshes.has(hit.object.name)) continue;

    const partId = resolvePartIdFromMeshName(hit.object.name, printableParts);
    if (!partId) continue;

    return { uv: { x: hit.uv!.x, y: hit.uv!.y }, partId };
  }

  return null;
};

const raycastGizmoUv = (clientX: number, clientY: number, elements: PrintGizmoElement[], ctx: ResolveGizmoPointerTargetContext) => {
  const rect = ctx.domElement.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  ctx.raycaster.setFromCamera(new Vector2(x, y), ctx.camera);
  const hits = ctx.raycaster.intersectObject(ctx.scene as Object3D, true).filter((item) => item.uv);

  for (const hit of hits) {
    if (!elements.some((element) => element.meshNames.includes(hit.object.name))) continue;
    return { x: hit.uv!.x, y: hit.uv!.y };
  }

  return null;
};

const resolveGizmoButtonHit = (
  world: { x: number; y: number },
  element: PrintGizmoElement,
  options: ResolveGizmoPointerTargetOptions,
): GizmoButtonHit | null => {
  const buttonHit = hitTestGizmoButton(world, element);
  if (!buttonHit) return null;
  if (!options.requireVisibleButtons) return buttonHit;

  const buttonsVisible = options.selectedInstanceId === element.id && getGizmoButtonReveal(element.slotIndex) > 0.5;

  return buttonsVisible ? buttonHit : null;
};

const resolveGizmoPointerTarget = (
  clientX: number,
  clientY: number,
  elements: PrintGizmoElement[],
  ctx: ResolveGizmoPointerTargetContext,
  options: ResolveGizmoPointerTargetOptions = {},
): GizmoPointerTarget | null => {
  const uv = raycastGizmoUv(clientX, clientY, elements, ctx);
  if (!uv) return null;

  const sorted = [...elements].sort((left, right) => right.slotIndex - left.slotIndex);

  for (const element of sorted) {
    const world = toLocalPx(uv, element, ctx.atlasSize);
    const onFrame = hitTestGizmoFrame(world, element);
    const buttonHit = resolveGizmoButtonHit(world, element, options);

    if (onFrame || buttonHit) {
      return { element, buttonHit, onFrame, uv };
    }
  }

  return null;
};

export { buildPrintablePartMeshes, raycastGizmoUv, raycastPrintUv, resolveGizmoPointerTarget, toLocalPx };
export type { GizmoPointerTarget, PrintablePartMeshes, PrintUvHit, ResolveGizmoPointerTargetContext, ResolveGizmoPointerTargetOptions };
