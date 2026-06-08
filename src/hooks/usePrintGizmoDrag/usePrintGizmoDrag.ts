'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

import type { PrintGizmoElement } from '@gizmo';
import { useGarmentName } from '@store';

type DragMode = 'move' | 'rotate' | 'scale';

interface UsePrintGizmoDragOptions {
  element: PrintGizmoElement;
  atlasSize: { width: number; height: number };
}

// Must match the shader constants in garmentShaders.ts (GIZMO_BTN_HALF / GIZMO_BTN_OUTSET).
const BUTTON_HALF_PX = 120;
const BUTTON_OUTSET_PX = 34;

// Corner sign → tool. Matches the icon cells painted by the shader.
const CORNERS = [
  { kind: 'duplicate', sx: -1, sy: 1 },
  { kind: 'delete', sx: -1, sy: -1 },
  { kind: 'rotate', sx: 1, sy: 1 },
  { kind: 'scale', sx: 1, sy: -1 },
] as const;

const usePrintGizmoDrag = ({ element, atlasSize }: UsePrintGizmoDragOptions) => {
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useThree((state) => state.controls) as { enabled: boolean } | null;

  // Keep the latest values without re-registering the listener on every drag frame.
  const ctx = useRef({ element, atlasSize, raycaster, camera, gl, scene, invalidate, controls });
  useEffect(() => {
    ctx.current = { element, atlasSize, raycaster, camera, gl, scene, invalidate, controls };
  });

  useEffect(() => {
    const dom = gl.domElement;

    const raycastUv = (clientX: number, clientY: number) => {
      const c = ctx.current;
      const rect = c.gl.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      c.raycaster.setFromCamera(new Vector2(x, y), c.camera);
      // Raycast the actual rendered garment meshes (matched by name) — they carry the live transforms.
      const hit = c.raycaster.intersectObject(c.scene, true).find((i) => i.uv && c.element.meshNames.includes(i.object.name));
      return hit?.uv ? { x: hit.uv.x, y: hit.uv.y } : null;
    };

    // Convert a print-UV hit to the name's local px without rotation (matches the AABB frame in the shader).
    const uvToLocalPx = (uv: { x: number; y: number }) => {
      const el = ctx.current.element;
      const dx = (uv.x - el.uv.x) * ctx.current.atlasSize.width;
      const dy = (uv.y - el.uv.y) * ctx.current.atlasSize.height;
      return { x: dx / el.scale, y: dy / el.scale };
    };

    const setControls = (enabled: boolean) => {
      if (ctx.current.controls) ctx.current.controls.enabled = enabled;
    };

    const startDrag = (mode: DragMode, clientX: number, clientY: number) => {
      const el = ctx.current.element;
      const instance = useGarmentName.getState().instances.find((item) => item.id === el.id);
      if (!instance) return;

      const startRotation = instance.rotation;
      const startFontSize = instance.fontSize;
      const centerUv = { ...instance.uv };
      const grab = raycastUv(clientX, clientY);
      const moveOffset = grab ? { x: instance.uv.x - grab.x, y: instance.uv.y - grab.y } : { x: 0, y: 0 };
      const startDistance = grab ? Math.hypot(grab.x - centerUv.x, grab.y - centerUv.y) || 0.05 : 0.05;
      const startAngle = grab ? Math.atan2(grab.y - centerUv.y, grab.x - centerUv.x) : 0;

      setControls(false);

      const onMove = (moveEvent: PointerEvent) => {
        const uv = raycastUv(moveEvent.clientX, moveEvent.clientY);
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
        setControls(true);
        ctx.current.invalidate();
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const uv = raycastUv(event.clientX, event.clientY);
      if (!uv) return;

      const local = uvToLocalPx(uv);
      const el = ctx.current.element;
      const extX = el.half.x + BUTTON_OUTSET_PX;
      const extY = el.half.y + BUTTON_OUTSET_PX;

      const corner = CORNERS.find(({ sx, sy }) => Math.hypot(local.x - sx * extX, local.y - sy * extY) <= BUTTON_HALF_PX);
      const onBody = Math.abs(local.x) <= el.half.x && Math.abs(local.y) <= el.half.y;
      if (!corner && !onBody) return;

      // This pointer belongs to the gizmo — keep OrbitControls and other handlers out of it.
      event.stopImmediatePropagation();
      event.preventDefault();

      if (corner?.kind === 'duplicate') {
        useGarmentName.getState().duplicateInstance(el.id);
        ctx.current.invalidate();
        return;
      }
      if (corner?.kind === 'delete') {
        useGarmentName.getState().removeInstance(el.id);
        ctx.current.invalidate();
        return;
      }
      startDrag(corner ? corner.kind : 'move', event.clientX, event.clientY);
    };

    dom.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => dom.removeEventListener('pointerdown', onPointerDown, { capture: true });
  }, [gl]);
};

export { usePrintGizmoDrag };
