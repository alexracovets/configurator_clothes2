'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import type { PrintGizmoElement } from '@gizmo';
import {
  clearGizmoButtonHover,
  getGizmoButtonReveal,
  getGizmoHoverCursor,
  isGizmoButtonDragActive,
  resolveGizmoPointerTarget,
  setGizmoButtonHover,
  toWorldPx,
} from '@gizmo';
import { useGarmentName } from '@store';

interface UseGizmoButtonHoverOptions {
  elements: PrintGizmoElement[];
  atlasSize: { width: number; height: number };
}

const useGizmoButtonHover = ({ elements, atlasSize }: UseGizmoButtonHoverOptions) => {
  const selectedInstanceId = useGarmentName((state) => state.selectedInstanceId);
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);

  const ctx = useRef({
    elements,
    atlasSize,
    selectedInstanceId,
    raycaster,
    camera,
    gl,
    scene,
    invalidate,
  });

  useEffect(() => {
    ctx.current = {
      elements,
      atlasSize,
      selectedInstanceId,
      raycaster,
      camera,
      gl,
      scene,
      invalidate,
    };
  });

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerMove = (event: PointerEvent) => {
      if (isGizmoButtonDragActive()) return;

      const c = ctx.current;
      const target = resolveGizmoPointerTarget(
        event.clientX,
        event.clientY,
        c.elements,
        {
          raycaster: c.raycaster,
          camera: c.camera,
          scene: c.scene,
          domElement: c.gl.domElement,
          atlasSize: c.atlasSize,
        },
        {
          selectedInstanceId: c.selectedInstanceId,
          requireVisibleButtons: true,
        },
      );

      if (!target) {
        dom.style.cursor = '';
        clearGizmoButtonHover();
        return;
      }

      const world = toWorldPx(target.uv, target.element, c.atlasSize);
      const buttonsVisible = c.selectedInstanceId === target.element.id && getGizmoButtonReveal(target.element.slotIndex) > 0.5;

      dom.style.cursor = getGizmoHoverCursor(world, target.element, buttonsVisible) ?? '';
      setGizmoButtonHover(target.buttonHit);
    };

    const onPointerLeave = () => {
      if (isGizmoButtonDragActive()) return;
      dom.style.cursor = '';
      clearGizmoButtonHover();
    };

    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerleave', onPointerLeave);

    return () => {
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerleave', onPointerLeave);
      dom.style.cursor = '';
      clearGizmoButtonHover();
    };
  }, [gl]);
};

export { useGizmoButtonHover };
