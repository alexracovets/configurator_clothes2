'use client';

import { useEffect } from 'react';

import { useThree } from '@react-three/fiber';

import { useGarmentLogoPreview, useStepLogo, useStepLogoSelection } from '@store';
import { isOrbitControlsEnabled, orbitControlsRef } from '@utils';
import { getGizmoHits } from '../../../../../compositing/utils/gizmoHitTest';
import { logoGizmoHitTest } from '../../../../../compositing/utils/logoGizmoLayout';
import { ensureNaturalSize } from '../../../../../compositing/utils/logoNaturalSize';

type DragMode = 'body' | 'rotate' | 'resize';
type LastPreview = { uv?: { x: number; y: number }; rotation?: number; scale?: number };

const clamp01 = (v: number) => Math.max(0.01, Math.min(0.99, v));
const SCALE_MIN = 0.25;
const SCALE_MAX = 3;
const SCALE_SPEED = 0.005;
const ROTATE_SPEED = 0.5;

const userLogos = () => useStepLogo.getState().parts.filter((p) => p.visible && !p.isDefault);

const LogoGizmoHandler = () => {
  const { gl, camera, scene } = useThree();

  // Clear selection + preview when the handler unmounts (step change).
  useEffect(
    () => () => {
      useStepLogoSelection.getState().selectPart(null);
      useGarmentLogoPreview.getState().clearLogoPreview();
    },
    [],
  );

  // Pre-warm natural-size cache so hit-testing works before the first atlas render.
  useEffect(() => {
    for (const part of userLogos()) void ensureNaturalSize(part.src);
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    let dragMode: DragMode | null = null;
    let dragId: string | null = null;
    let pendingDragMode: DragMode | null = null;
    let dragStartLogoUV: { x: number; y: number } | null = null;
    let dragStartHitUV: { x: number; y: number } | null = null;
    let dragMeshName: string | null = null;
    let dragStartClientX = 0;
    let dragStartClientY = 0;
    let dragStartRotation = 0;
    let dragStartScale = 1;
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
        new PointerEvent('pointerup', { bubbles: true, pointerId: e.pointerId, clientX: e.clientX, clientY: e.clientY, pointerType: e.pointerType }),
      );
    }

    function beginDrag(mode: DragMode, id: string, hitUV: { x: number; y: number }, meshName: string) {
      dragMode = mode;
      dragId = id;
      pendingDragMode = null;
      lastPreview = null;

      const part = useStepLogo.getState().parts.find((p) => p.id === id);
      if (!part) return;

      if (mode === 'body') {
        dragStartHitUV = { x: hitUV.x, y: hitUV.y };
        dragStartLogoUV = { x: part.uv.x, y: part.uv.y };
        dragMeshName = meshName;
        canvas.style.cursor = 'grabbing';
      } else if (mode === 'rotate') {
        dragStartRotation = part.rotation;
        canvas.style.cursor = 'ns-resize';
      } else {
        dragStartScale = part.scale;
        canvas.style.cursor = 'ew-resize';
      }
    }

    function resetDragState() {
      useGarmentLogoPreview.getState().clearLogoPreview();
      lastPreview = null;
      dragMode = null;
      dragId = null;
      pendingDragMode = null;
      dragStartLogoUV = null;
      dragStartHitUV = null;
      dragMeshName = null;
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
        if (!dragStartHitUV || !dragStartLogoUV) return;
        const hits = getGizmoHits(e, gl, camera, scene);
        const hit = hits.find((h) => h.meshName === dragMeshName) ?? hits[0] ?? null;
        if (!hit) return;
        // Logo uv is raw atlas UV0 — same space as the raycast hit, so the delta maps 1:1.
        const uv = { x: clamp01(dragStartLogoUV.x + (hit.uv.x - dragStartHitUV.x)), y: clamp01(dragStartLogoUV.y + (hit.uv.y - dragStartHitUV.y)) };
        lastPreview = { uv };
        useGarmentLogoPreview.getState().setLogoPreview(dragId, { uv });
        return;
      }

      if (dragMode === 'rotate') {
        const rotation = dragStartRotation + (e.clientY - dragStartClientY) * ROTATE_SPEED;
        lastPreview = { rotation };
        useGarmentLogoPreview.getState().setLogoPreview(dragId, { rotation });
        return;
      }

      if (dragMode === 'resize') {
        const scale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, dragStartScale + (e.clientX - dragStartClientX) * SCALE_SPEED));
        lastPreview = { scale };
        useGarmentLogoPreview.getState().setLogoPreview(dragId, { scale });
      }
    }

    function hitAtEvent(e: PointerEvent) {
      const hits = getGizmoHits(e, gl, camera, scene);
      const selectedId = useStepLogoSelection.getState().selectedPartId;
      for (const hit of hits) {
        for (const logo of userLogos()) {
          const gz = logoGizmoHitTest(hit.uv.x, hit.uv.y, logo, logo.id === selectedId);
          if (gz) return { gz, id: logo.id, hit };
        }
      }
      return null;
    }

    function onPointerDown(e: PointerEvent) {
      wasDrag = false;
      pendingDragMode = null;

      const found = hitAtEvent(e);
      const selection = useStepLogoSelection.getState();

      if (!found) {
        selection.selectPart(null);
        return;
      }

      const { gz, id, hit } = found;

      if (gz === 'delete') {
        useStepLogo.getState().removePart(id);
        selection.selectPart(null);
        e.stopPropagation();
        return;
      }

      if (gz === 'body' && id !== selection.selectedPartId) {
        selection.selectPart(id);
        e.stopPropagation();
        return;
      }

      dragId = id;
      dragStartClientX = e.clientX;
      dragStartClientY = e.clientY;

      if (gz === 'body' && id === selection.selectedPartId) {
        pendingDragMode = 'body';
        dragStartHitUV = { x: hit.uv.x, y: hit.uv.y };
        dragMeshName = hit.meshName;
        e.stopPropagation();
        return;
      }

      if (gz === 'rotate' || gz === 'resize') {
        beginDrag(gz, id, hit.uv, hit.meshName);
        e.stopPropagation();
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (pendingDragMode && !dragMode && dragId) {
        const dist = Math.hypot(e.clientX - dragStartClientX, e.clientY - dragStartClientY);
        if (dist >= 0) {
          const found = hitAtEvent(e);
          if (found && found.id === dragId) {
            cancelOrbitGesture(e);
            beginDrag(pendingDragMode, dragId, found.hit.uv, found.hit.meshName);
            e.stopPropagation();
          } else {
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
        const patch: LastPreview = {};
        if (lastPreview.uv !== undefined) patch.uv = lastPreview.uv;
        if (lastPreview.rotation !== undefined) patch.rotation = lastPreview.rotation;
        if (lastPreview.scale !== undefined) patch.scale = lastPreview.scale;
        useStepLogo.getState().updatePart(dragId, patch);
      }

      if (!wasDrag && pendingDragMode) {
        pendingDragMode = null;
        dragId = null;
        dragStartLogoUV = null;
        dragStartHitUV = null;
        return;
      }

      resetDragState();
    }

    function onKeyDown(e: KeyboardEvent) {
      const selection = useStepLogoSelection.getState();
      if (e.key === 'Escape') {
        selection.selectPart(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selection.selectedPartId) {
        useStepLogo.getState().removePart(selection.selectedPartId);
        selection.selectPart(null);
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

export { LogoGizmoHandler };
