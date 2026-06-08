import type { Camera, Object3D, Raycaster, Scene } from 'three';
import { Vector2 } from 'three';

import { hitTestGizmoButton, hitTestGizmoFrame } from './hitTestGizmoButton';
import type { GizmoButtonHit } from './hitTestGizmoButton';
import type { PrintGizmoElement } from './types';

interface GizmoPointerTarget {
  element: PrintGizmoElement;
  buttonHit: GizmoButtonHit | null;
  onFrame: boolean;
}

interface ResolveGizmoPointerTargetContext {
  raycaster: Raycaster;
  camera: Camera;
  scene: Scene;
  domElement: HTMLElement;
  atlasSize: { width: number; height: number };
}

const resolveGizmoPointerTarget = (
  clientX: number,
  clientY: number,
  elements: PrintGizmoElement[],
  ctx: ResolveGizmoPointerTargetContext,
): GizmoPointerTarget | null => {
  const rect = ctx.domElement.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((clientY - rect.top) / rect.height) * 2 + 1;
  ctx.raycaster.setFromCamera(new Vector2(x, y), ctx.camera);
  const hits = ctx.raycaster.intersectObject(ctx.scene as Object3D, true).filter((item) => item.uv);

  for (const element of elements) {
    const hit = hits.find((item) => element.meshNames.includes(item.object.name));
    if (!hit?.uv) continue;

    const world = {
      x: (hit.uv.x - element.uv.x) * ctx.atlasSize.width,
      y: (hit.uv.y - element.uv.y) * ctx.atlasSize.height,
    };

    return {
      element,
      buttonHit: hitTestGizmoButton(world, element),
      onFrame: hitTestGizmoFrame(world, element),
    };
  }

  return null;
};

export { resolveGizmoPointerTarget };
export type { GizmoPointerTarget, ResolveGizmoPointerTargetContext };
