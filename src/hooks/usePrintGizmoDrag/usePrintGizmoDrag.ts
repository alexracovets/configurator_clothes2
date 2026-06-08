'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

import type { PrintGizmoElement } from '@gizmo';
import { useGarmentName } from '@store';
import { NAME_GIZMO_BTN_HALF_ATLAS, NAME_GIZMO_BTN_OUTSET_ATLAS } from '@utils';

type DragMode = 'move' | 'rotate' | 'scale';

interface UsePrintGizmoDragOptions {
  element: PrintGizmoElement;
  atlasSize: { width: number; height: number };
}

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

    // Print-atlas px from anchor (matches garmentNameToWorldPx in the shader).
    const uvToWorldPx = (uv: { x: number; y: number }) => {
      const el = ctx.current.element;
      return {
        x: (uv.x - el.uv.x) * ctx.current.atlasSize.width,
        y: (uv.y - el.uv.y) * ctx.current.atlasSize.height,
      };
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

      const world = uvToWorldPx(uv);
      const el = ctx.current.element;
      const halfWorld = { x: el.half.x * el.scale, y: el.half.y * el.scale };

      // Hit-test is centred at the button position (frame corner + fixed outset in atlas px).
      // ±NAME_GIZMO_BTN_HALF_ATLAS square matches the visual icon cell drawn by the shader.
      const corner = CORNERS.find(({ sx, sy }) => {
        const cx = Math.abs(world.x - sx * (halfWorld.x + NAME_GIZMO_BTN_OUTSET_ATLAS));
        const cy = Math.abs(world.y - sy * (halfWorld.y + NAME_GIZMO_BTN_OUTSET_ATLAS));
        return cx <= NAME_GIZMO_BTN_HALF_ATLAS && cy <= NAME_GIZMO_BTN_HALF_ATLAS;
      });
      const onBody = Math.abs(world.x) <= halfWorld.x && Math.abs(world.y) <= halfWorld.y;
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
