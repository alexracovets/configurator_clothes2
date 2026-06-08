'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { GIZMO_CORNERS, type GizmoButtonHit, type PrintGizmoElement, raycastGizmoUv, resolveGizmoPointerTarget, setGizmoButtonDragActive } from '@gizmo';
import { useGarmentName } from '@store';

type DragMode = 'move' | 'rotate' | 'scale';

interface UsePrintGizmoDragOptions {
  element: PrintGizmoElement;
  elements: PrintGizmoElement[];
  atlasSize: { width: number; height: number };
}

const usePrintGizmoDrag = ({ element, elements, atlasSize }: UsePrintGizmoDragOptions) => {
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useThree((state) => state.controls) as { enabled: boolean } | null;

  const ctx = useRef({ element, elements, atlasSize, raycaster, camera, gl, scene, invalidate, controls });
  useEffect(() => {
    ctx.current = { element, elements, atlasSize, raycaster, camera, gl, scene, invalidate, controls };
  });

  useEffect(() => {
    const dom = gl.domElement;

    const raycastContext = () => ({
      raycaster: ctx.current.raycaster,
      camera: ctx.current.camera,
      scene: ctx.current.scene,
      domElement: ctx.current.gl.domElement,
      atlasSize: ctx.current.atlasSize,
    });

    const setControls = (enabled: boolean) => {
      if (ctx.current.controls) ctx.current.controls.enabled = enabled;
    };

    const startDrag = (mode: DragMode, clientX: number, clientY: number, buttonHit: GizmoButtonHit | null) => {
      const el = ctx.current.element;
      const instance = useGarmentName.getState().instances.find((item) => item.id === el.id);
      if (!instance) return;

      const startRotation = instance.rotation;
      const startFontSize = instance.fontSize;
      const centerUv = { ...instance.uv };
      const grab = raycastGizmoUv(clientX, clientY, ctx.current.elements, raycastContext());
      const moveOffset = grab ? { x: instance.uv.x - grab.x, y: instance.uv.y - grab.y } : { x: 0, y: 0 };
      const startDistance = grab ? Math.hypot(grab.x - centerUv.x, grab.y - centerUv.y) || 0.05 : 0.05;
      const startAngle = grab ? Math.atan2(grab.y - centerUv.y, grab.x - centerUv.x) : 0;

      setControls(false);
      if (buttonHit && (mode === 'rotate' || mode === 'scale')) {
        setGizmoButtonDragActive(buttonHit);
      }

      const onMove = (moveEvent: PointerEvent) => {
        const uv = raycastGizmoUv(moveEvent.clientX, moveEvent.clientY, ctx.current.elements, raycastContext());
        if (!uv) return;

        if (mode === 'move') {
          useGarmentName.getState().updateInstance(el.id, { uv: { x: uv.x + moveOffset.x, y: uv.y + moveOffset.y } });
        } else if (mode === 'rotate') {
          const angle = Math.atan2(uv.y - centerUv.y, uv.x - centerUv.x);
          const deltaDeg = ((angle - startAngle) * 180) / Math.PI;
          useGarmentName.getState().updateInstance(el.id, { rotation: startRotation + deltaDeg });
        } else {
          const distance = Math.hypot(uv.x - centerUv.x, uv.y - centerUv.y);
          const ratio = distance / Math.max(startDistance, 0.0001);
          const next = Math.min(el.fontSizeMax, Math.max(el.fontSizeMin, Math.round(startFontSize * ratio)));
          useGarmentName.getState().updateInstance(el.id, { fontSize: next });
        }
        ctx.current.invalidate();
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        setGizmoButtonDragActive(null);
        setControls(true);
        ctx.current.invalidate();
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const selectedInstanceId = useGarmentName.getState().selectedInstanceId;
      const target = resolveGizmoPointerTarget(event.clientX, event.clientY, ctx.current.elements, raycastContext(), {
        selectedInstanceId,
        requireVisibleButtons: true,
      });

      if (!target || target.element.id !== ctx.current.element.id) return;

      const corner = target.buttonHit ? GIZMO_CORNERS.find((item) => item.cornerIndex === target.buttonHit!.cornerIndex) : undefined;
      if (corner && selectedInstanceId !== target.element.id) return;
      if (!corner && !target.onFrame) return;

      useGarmentName.getState().bringInstanceToFront(target.element.id);
      useGarmentName.getState().setSelectedInstance(target.element.id);
      ctx.current.invalidate();

      event.stopImmediatePropagation();
      event.preventDefault();

      if (corner?.kind === 'duplicate') {
        useGarmentName.getState().duplicateInstance(target.element.id);
        ctx.current.invalidate();
        return;
      }
      if (corner?.kind === 'delete') {
        useGarmentName.getState().removeInstance(target.element.id);
        ctx.current.invalidate();
        return;
      }
      startDrag(corner ? corner.kind : 'move', event.clientX, event.clientY, target.buttonHit);
    };

    dom.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => dom.removeEventListener('pointerdown', onPointerDown, { capture: true });
  }, [gl]);
};

export { usePrintGizmoDrag };
