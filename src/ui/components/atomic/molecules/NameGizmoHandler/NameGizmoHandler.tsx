'use client';

import { useEffect } from 'react';

import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useGarmentNamePreview, useStepName, useStepNameSelection } from '@store';
import { isOrbitControlsEnabled, orbitControlsRef } from '@utils';
import { getGizmoHits, gizmoHitTest, normaliseUVForZone } from '../../../../../compositing/utils/gizmoHitTest';
import type { GizmoPartZone } from '../../../../../compositing/utils/gizmoHitTest';
import { namePartToGizmoItem } from '../../../../../compositing/utils/nameGizmoLayout';

type DragMode = 'body' | 'rotate' | 'resize';
type LastPreview = { uv?: { x: number; y: number }; rotation?: number; fontSize?: number };

const clamp01 = (v: number) => Math.max(0.01, Math.min(0.99, v));
const DRAG_THRESHOLD_PX = 0;

const NameGizmoHandler = () => {
  const { gl, camera, scene } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    let dragMode: DragMode | null = null;
    let dragId: string | null = null;
    let pendingDragMode: DragMode | null = null;
    let dragStartPartUV: { x: number; y: number } | null = null;
    let dragStartHitNUV: { x: number; y: number } | null = null;
    let dragMeshName: string | null = null;
    let dragZone: GizmoPartZone | null = null;
    let dragStartClientX = 0;
    let dragStartClientY = 0;
    let dragStartRotation = 0;
    let dragStartFontSize = 0;
    let wasDrag = false;
    let suppressPointerUp = false;
    let lastPreview: LastPreview | null = null;

    function cancelOrbitGesture(e: PointerEvent) {
      const controls = orbitControlsRef.current;
      if (controls) {
        controls.enabled = false;
        controls.enabled = isOrbitControlsEnabled();
      }
      suppressPointerUp = true;
      canvas.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          pointerId: e.pointerId,
          clientX: e.clientX,
          clientY: e.clientY,
          pointerType: e.pointerType,
        }),
      );
    }

    function beginDrag(mode: DragMode, id: string, rawUV: THREE.Vector2, meshName: string, zone: GizmoPartZone) {
      dragMode = mode;
      dragId = id;
      pendingDragMode = null;
      lastPreview = null;

      const part = useStepName.getState().parts.find((p) => p.id === id);
      if (!part) return;

      if (mode === 'body') {
        const { nx, ny } = normaliseUVForZone(rawUV.x, rawUV.y, zone);
        dragStartHitNUV = { x: nx, y: ny };
        dragStartPartUV = { x: part.uv.x, y: part.uv.y };
        dragMeshName = meshName;
        dragZone = zone;
        canvas.style.cursor = 'grabbing';
      } else if (mode === 'rotate') {
        dragStartRotation = part.rotation;
        canvas.style.cursor = 'ns-resize';
      } else {
        dragStartFontSize = part.fontSize;
        canvas.style.cursor = 'ew-resize';
      }
    }

    function resetDragState() {
      useGarmentNamePreview.getState().clearNamePreview();
      lastPreview = null;
      dragMode = null;
      dragId = null;
      pendingDragMode = null;
      dragStartPartUV = null;
      dragStartHitNUV = null;
      dragMeshName = null;
      dragZone = null;
      canvas.style.cursor = '';
      wasDrag = false;
    }

    let rafId: number | null = null;
    let latestMoveEvent: PointerEvent | null = null;

    function applyMove() {
      rafId = null;
      const e = latestMoveEvent;
      latestMoveEvent = null;
      if (!e || !dragMode || !dragId) return;

      if (dragMode === 'body') {
        if (!dragStartHitNUV || !dragStartPartUV || !dragZone) return;

        const hits = getGizmoHits(e, gl, camera, scene);
        const hit = hits.find((h) => h.meshName === dragMeshName) ?? hits.find((h) => h.zone === dragZone) ?? null;
        if (!hit) return;

        const { nx, ny } = normaliseUVForZone(hit.uv.x, hit.uv.y, dragZone);
        const dNx = nx - dragStartHitNUV.x;
        const dNy = ny - dragStartHitNUV.y;
        // Back mesh UV axes run opposite to part-local space when viewed from the camera.
        const flip = dragZone === 'back' ? -1 : 1;
        const newX = clamp01(dragStartPartUV.x + dNx);
        const newY = clamp01(dragStartPartUV.y + flip * dNy);
        const uv = { x: newX, y: newY };
        lastPreview = { uv };
        useGarmentNamePreview.getState().setNamePreview(dragId, { uv });
        return;
      }

      if (dragMode === 'rotate') {
        const rotation = dragStartRotation + (e.clientY - dragStartClientY) * 0.5;
        lastPreview = { rotation };
        useGarmentNamePreview.getState().setNamePreview(dragId, { rotation });
        return;
      }

      if (dragMode === 'resize') {
        const fontSize = Math.max(10, Math.min(400, dragStartFontSize + (e.clientX - dragStartClientX) * 0.5));
        lastPreview = { fontSize };
        useGarmentNamePreview.getState().setNamePreview(dragId, { fontSize });
      }
    }

    function onPointerDown(e: PointerEvent) {
      wasDrag = false;
      pendingDragMode = null;

      const nameState = useStepName.getState();
      const selectionState = useStepNameSelection.getState();
      const hits = getGizmoHits(e, gl, camera, scene);

      if (hits.length === 0) {
        selectionState.selectPart(null);
        return;
      }

      for (const { uv, meshName, zone } of hits) {
        const items = nameState.parts.map(namePartToGizmoItem);
        const result = gizmoHitTest(uv.x, uv.y, zone, items, selectionState.selectedPartId);
        if (!result) continue;

        const gz = result.gizmoZone;
        const id = result.id;

        if (gz === 'delete') {
          nameState.removePart(id);
          selectionState.selectPart(null);
          e.stopPropagation();
          return;
        }

        if (gz === 'copy') {
          const part = nameState.parts.find((p) => p.id === id);
          if (part) {
            const newPart = {
              ...part,
              id: `${part.id}_copy_${Date.now()}`,
              uv: { x: Math.min(0.95, part.uv.x + 0.05), y: Math.min(0.95, part.uv.y + 0.05) },
              isDefault: false,
            };
            nameState.addPart(newPart);
            selectionState.selectPart(newPart.id);
          }
          e.stopPropagation();
          return;
        }

        if (gz === 'body' && id !== selectionState.selectedPartId) {
          selectionState.selectPart(id);
          e.stopPropagation();
          return;
        }

        dragId = id;
        dragStartClientX = e.clientX;
        dragStartClientY = e.clientY;

        if (gz === 'body' && id === selectionState.selectedPartId) {
          pendingDragMode = 'body';
          e.stopPropagation();
          return;
        }

        if (gz === 'rotate' || gz === 'resize') {
          beginDrag(gz, id, uv, meshName, zone);
          e.stopPropagation();
          return;
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (pendingDragMode && !dragMode && dragId) {
        const dist = Math.hypot(e.clientX - dragStartClientX, e.clientY - dragStartClientY);
        if (dist >= DRAG_THRESHOLD_PX) {
          const hits = getGizmoHits(e, gl, camera, scene);
          let found = false;
          for (const { uv, meshName, zone } of hits) {
            const nameState = useStepName.getState();
            const selectionState = useStepNameSelection.getState();
            const items = nameState.parts.map(namePartToGizmoItem);
            const result = gizmoHitTest(uv.x, uv.y, zone, items, selectionState.selectedPartId);
            if (result && result.id === dragId) {
              cancelOrbitGesture(e);
              beginDrag(pendingDragMode, dragId, uv, meshName, zone);
              e.stopPropagation();
              found = true;
              break;
            }
          }
          if (!found) {
            pendingDragMode = null;
            dragId = null;
          }
        }
      }

      if (!dragMode || !dragId) return;
      wasDrag = true;
      latestMoveEvent = e;
      if (rafId === null) rafId = requestAnimationFrame(applyMove);
    }

    function onPointerUp() {
      if (suppressPointerUp) {
        suppressPointerUp = false;
        return;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        applyMove();
      }

      if (wasDrag && dragId && lastPreview) {
        const patch: { uv?: { x: number; y: number }; rotation?: number; fontSize?: number } = {};
        if (lastPreview.uv !== undefined) patch.uv = lastPreview.uv;
        if (lastPreview.rotation !== undefined) patch.rotation = lastPreview.rotation;
        if (lastPreview.fontSize !== undefined) patch.fontSize = lastPreview.fontSize;
        useStepName.getState().updatePart(dragId, patch);
      }

      if (!wasDrag && pendingDragMode) {
        pendingDragMode = null;
        dragId = null;
        dragStartPartUV = null;
        dragStartHitNUV = null;
        return;
      }

      resetDragState();
    }

    function onKeyDown(e: KeyboardEvent) {
      const selectionState = useStepNameSelection.getState();
      if (e.key === 'Escape') {
        selectionState.selectPart(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectionState.selectedPartId) {
        useStepName.getState().removePart(selectionState.selectedPartId);
        selectionState.selectPart(null);
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resetDragState();
      canvas.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [gl, camera, scene]);

  return null;
};

export { NameGizmoHandler };
