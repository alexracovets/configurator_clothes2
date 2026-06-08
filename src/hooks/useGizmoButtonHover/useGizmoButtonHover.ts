'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

import type { PrintGizmoElement } from '@gizmo';
import { clearGizmoButtonHover, hitTestGizmoButton, isGizmoButtonDragActive, setGizmoButtonHover } from '@gizmo';

interface UseGizmoButtonHoverOptions {
  elements: PrintGizmoElement[];
  atlasSize: { width: number; height: number };
}

const useGizmoButtonHover = ({ elements, atlasSize }: UseGizmoButtonHoverOptions) => {
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  const ctx = useRef({ elements, atlasSize, raycaster, camera, gl, scene });
  useEffect(() => {
    ctx.current = { elements, atlasSize, raycaster, camera, gl, scene };
  });

  useEffect(() => {
    const dom = gl.domElement;

    const raycastUv = (clientX: number, clientY: number) => {
      const c = ctx.current;
      const rect = c.gl.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      c.raycaster.setFromCamera(new Vector2(x, y), c.camera);
      const hits = c.raycaster.intersectObject(c.scene, true).filter((item) => item.uv);

      for (const element of c.elements) {
        const hit = hits.find((item) => element.meshNames.includes(item.object.name));
        if (hit?.uv) return { uv: { x: hit.uv.x, y: hit.uv.y }, element };
      }

      return null;
    };

    const uvToWorldPx = (uv: { x: number; y: number }, element: PrintGizmoElement) => ({
      x: (uv.x - element.uv.x) * ctx.current.atlasSize.width,
      y: (uv.y - element.uv.y) * ctx.current.atlasSize.height,
    });

    const onPointerMove = (event: PointerEvent) => {
      if (isGizmoButtonDragActive()) return;

      const result = raycastUv(event.clientX, event.clientY);
      if (!result) {
        dom.style.cursor = '';
        clearGizmoButtonHover();
        return;
      }

      const buttonHit = hitTestGizmoButton(uvToWorldPx(result.uv, result.element), result.element);
      dom.style.cursor = buttonHit ? 'pointer' : '';
      setGizmoButtonHover(buttonHit);
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
