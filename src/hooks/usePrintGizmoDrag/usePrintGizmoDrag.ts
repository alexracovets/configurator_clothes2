'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { GIZMO_CORNERS, raycastPrintUv, resolveGizmoPointerTarget, resolvePrintDragMove, setGizmoButtonDragActive, toPrintLocalPx } from '@gizmo';
import type { gizmoButtonHitType, printablePartMeshesType, printDragMoveStateType, printGizmoElementType } from '@types';
import { useGarmentLogo, useGarmentName } from '@store';

type DragMode = 'move' | 'rotate' | 'scale';

const resolvePrintRotation = (printableParts: printablePartMeshesType[], partId: string, fallback: number) =>
  printableParts.find((part) => part.partId === partId)?.printRotation ?? fallback;

interface UsePrintGizmoDragOptions {
  element: printGizmoElementType;
  elements: printGizmoElementType[];
  printableParts: printablePartMeshesType[];
  atlasSize: { width: number; height: number };
  gizmoStep: number | null;
  selectedInstanceId: string | null;
}

const usePrintGizmoDrag = ({ element, elements, printableParts, atlasSize, gizmoStep, selectedInstanceId }: UsePrintGizmoDragOptions) => {
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useThree((state) => state.controls) as { enabled: boolean } | null;

  const ctx = useRef({
    element,
    elements,
    printableParts,
    atlasSize,
    gizmoStep,
    selectedInstanceId,
    raycaster,
    camera,
    gl,
    scene,
    invalidate,
    controls,
  });

  useEffect(() => {
    ctx.current = {
      element,
      elements,
      printableParts,
      atlasSize,
      gizmoStep,
      selectedInstanceId,
      raycaster,
      camera,
      gl,
      scene,
      invalidate,
      controls,
    };
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

    const startDrag = (mode: DragMode, clientX: number, clientY: number, buttonHit: gizmoButtonHitType | null) => {
      const el = ctx.current.element;

      if (el.kind === 'name') {
        const instance = useGarmentName.getState().instances.find((item) => item.id === el.id);
        if (!instance) return;

        const startRotation = instance.rotation;
        const startFontSize = instance.fontSize;
        const centerUv = { ...instance.uv };
        const grab = raycastPrintUv(clientX, clientY, ctx.current.printableParts, raycastContext());
        let dragMoveState: printDragMoveStateType = {
          offset: grab ? { x: instance.uv.x - grab.uv.x, y: instance.uv.y - grab.uv.y } : { x: 0, y: 0 },
          activePartId: grab?.partId ?? instance.partId,
        };
        const grabPartRotation = grab ? resolvePrintRotation(ctx.current.printableParts, grab.partId, el.partRotation) : el.partRotation;
        const startLocal = grab ? toPrintLocalPx(grab.uv, centerUv, ctx.current.atlasSize, grabPartRotation, startRotation) : { x: 1, y: 0 };
        const startDistance = Math.hypot(startLocal.x, startLocal.y) || 0.05;
        const startAngle = Math.atan2(startLocal.y, startLocal.x);

        setControls(false);
        if (buttonHit && (mode === 'rotate' || mode === 'scale')) {
          setGizmoButtonDragActive(buttonHit);
        }

        const onMove = (moveEvent: PointerEvent) => {
          const hit = raycastPrintUv(moveEvent.clientX, moveEvent.clientY, ctx.current.printableParts, raycastContext());
          if (!hit) return;

          if (mode === 'move') {
            const move = resolvePrintDragMove(hit, dragMoveState, ctx.current.printableParts);
            if (!move) return;

            dragMoveState = move.state;
            useGarmentName.getState().updateInstance(el.id, {
              uv: move.uv,
              partId: move.partId,
            });
          } else if (mode === 'rotate') {
            const partRotation = resolvePrintRotation(ctx.current.printableParts, hit.partId, el.partRotation);
            const local = toPrintLocalPx(hit.uv, centerUv, ctx.current.atlasSize, partRotation, startRotation);
            const angle = Math.atan2(local.y, local.x);
            const deltaDeg = ((angle - startAngle) * 180) / Math.PI;
            useGarmentName.getState().updateInstance(el.id, { rotation: startRotation + deltaDeg });
          } else {
            const partRotation = resolvePrintRotation(ctx.current.printableParts, hit.partId, el.partRotation);
            const local = toPrintLocalPx(hit.uv, centerUv, ctx.current.atlasSize, partRotation, startRotation);
            const distance = Math.hypot(local.x, local.y);
            const ratio = distance / Math.max(startDistance, 0.0001);
            const next = Math.min(el.fontSizeMax ?? Infinity, Math.max(el.fontSizeMin ?? 0, Math.round(startFontSize * ratio)));
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
        return;
      }

      const instance = useGarmentLogo.getState().instances.find((item) => item.id === el.id);
      if (!instance) return;

      const startRotation = instance.rotation;
      const startScale = instance.scale;
      const centerUv = { ...instance.uv };
      const grab = raycastPrintUv(clientX, clientY, ctx.current.printableParts, raycastContext());
      let dragMoveState: printDragMoveStateType = {
        offset: grab ? { x: instance.uv.x - grab.uv.x, y: instance.uv.y - grab.uv.y } : { x: 0, y: 0 },
        activePartId: grab?.partId ?? instance.partId,
      };
      const grabPartRotation = grab ? resolvePrintRotation(ctx.current.printableParts, grab.partId, el.partRotation) : el.partRotation;
      const startLocal = grab ? toPrintLocalPx(grab.uv, centerUv, ctx.current.atlasSize, grabPartRotation, 0) : { x: 1, y: 0 };
      const startDistance = Math.hypot(startLocal.x, startLocal.y) || 0.05;
      const startAngle = Math.atan2(startLocal.y, startLocal.x);

      setControls(false);
      if (buttonHit && (mode === 'rotate' || mode === 'scale')) {
        setGizmoButtonDragActive(buttonHit);
      }

      const onMove = (moveEvent: PointerEvent) => {
        const hit = raycastPrintUv(moveEvent.clientX, moveEvent.clientY, ctx.current.printableParts, raycastContext());
        if (!hit) return;

        if (mode === 'move') {
          const move = resolvePrintDragMove(hit, dragMoveState, ctx.current.printableParts);
          if (!move) return;

          dragMoveState = move.state;
          useGarmentLogo.getState().updateInstance(el.id, {
            uv: move.uv,
            partId: move.partId,
          });
        } else if (mode === 'rotate') {
          const partRotation = resolvePrintRotation(ctx.current.printableParts, hit.partId, el.partRotation);
          const local = toPrintLocalPx(hit.uv, centerUv, ctx.current.atlasSize, partRotation, 0);
          const angle = Math.atan2(local.y, local.x);
          const deltaDeg = ((angle - startAngle) * 180) / Math.PI;
          useGarmentLogo.getState().updateInstance(el.id, { rotation: startRotation + deltaDeg });
        } else {
          const partRotation = resolvePrintRotation(ctx.current.printableParts, hit.partId, el.partRotation);
          const local = toPrintLocalPx(hit.uv, centerUv, ctx.current.atlasSize, partRotation, 0);
          const distance = Math.hypot(local.x, local.y);
          const ratio = distance / Math.max(startDistance, 0.0001);
          const next = Math.min(el.scaleMax ?? Infinity, Math.max(el.scaleMin ?? 0, startScale * ratio));
          useGarmentLogo.getState().updateInstance(el.id, { scale: next });
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
      if (ctx.current.gizmoStep === null) return;

      const target = resolveGizmoPointerTarget(event.clientX, event.clientY, ctx.current.elements, raycastContext(), {
        selectedInstanceId: ctx.current.selectedInstanceId,
        requireVisibleButtons: true,
      });

      if (!target || target.element.id !== ctx.current.element.id) return;

      const corner = target.buttonHit ? GIZMO_CORNERS.find((item) => item.cornerIndex === target.buttonHit!.cornerIndex) : undefined;
      if (corner && ctx.current.selectedInstanceId !== target.element.id) return;
      if (!corner && !target.onFrame) return;

      if (target.element.kind === 'name') {
        useGarmentName.getState().bringInstanceToFront(target.element.id);
        useGarmentName.getState().setSelectedInstance(target.element.id);
      } else {
        useGarmentLogo.getState().bringInstanceToFront(target.element.id);
        useGarmentLogo.getState().setSelectedInstance(target.element.id);
      }
      ctx.current.invalidate();

      event.stopImmediatePropagation();
      event.preventDefault();

      if (corner?.kind === 'duplicate') {
        if (target.element.kind === 'name') {
          useGarmentName.getState().duplicateInstance(target.element.id);
        } else {
          useGarmentLogo.getState().duplicateInstance(target.element.id);
        }
        ctx.current.invalidate();
        return;
      }
      if (corner?.kind === 'delete') {
        if (target.element.kind === 'name') {
          useGarmentName.getState().removeInstance(target.element.id);
        } else {
          useGarmentLogo.getState().removeInstance(target.element.id);
        }
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
