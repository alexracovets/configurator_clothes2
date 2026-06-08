import type { Camera, Object3D, Raycaster, Scene } from 'three';
import { Vector2 } from 'three';

import { getGizmoButtonReveal } from './gizmoButtonReveal';
import { hitTestGizmoButton, hitTestGizmoFrame } from './hitTestGizmoButton';
import type { GizmoButtonHit } from './hitTestGizmoButton';
import type { PrintGizmoElement } from './types';

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

const toWorldPx = (uv: { x: number; y: number }, element: PrintGizmoElement, atlasSize: { width: number; height: number }) => ({
  x: (uv.x - element.uv.x) * atlasSize.width,
  y: (uv.y - element.uv.y) * atlasSize.height,
});

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
    const world = toWorldPx(uv, element, ctx.atlasSize);
    const onFrame = hitTestGizmoFrame(world, element);
    const buttonHit = resolveGizmoButtonHit(world, element, options);

    if (onFrame || buttonHit) {
      return { element, buttonHit, onFrame, uv };
    }
  }

  return null;
};

export { raycastGizmoUv, resolveGizmoPointerTarget, toWorldPx };
export type { GizmoPointerTarget, ResolveGizmoPointerTargetContext, ResolveGizmoPointerTargetOptions };
