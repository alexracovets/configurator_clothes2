'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { clearGizmoButtonHover, resolveGizmoPointerTarget } from '@gizmo';
import type { PrintGizmoElement } from '@gizmo';
import { useConfigurationControl, useGarmentName } from '@store';

const NAME_STEP = 4;

interface UseGizmoSelectionOptions {
  elements: PrintGizmoElement[];
  atlasSize: { width: number; height: number };
}

const useGizmoSelection = ({ elements, atlasSize }: UseGizmoSelectionOptions) => {
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const selectedInstanceId = useGarmentName((state) => state.selectedInstanceId);
  const setSelectedInstance = useGarmentName((state) => state.setSelectedInstance);
  const clearSelectedInstance = useGarmentName((state) => state.clearSelectedInstance);

  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const controls = useThree((state) => state.controls) as {
    addEventListener: (type: string, listener: () => void) => void;
    removeEventListener: (type: string, listener: () => void) => void;
  } | null;
  const invalidate = useThree((state) => state.invalidate);

  const ctx = useRef({
    elements,
    atlasSize,
    activeStep,
    selectedInstanceId,
    raycaster,
    camera,
    gl,
    scene,
    setSelectedInstance,
    clearSelectedInstance,
    invalidate,
  });

  useEffect(() => {
    ctx.current = {
      elements,
      atlasSize,
      activeStep,
      selectedInstanceId,
      raycaster,
      camera,
      gl,
      scene,
      setSelectedInstance,
      clearSelectedInstance,
      invalidate,
    };
  });

  useEffect(() => {
    if (activeStep !== NAME_STEP) {
      clearSelectedInstance();
    }
  }, [activeStep, clearSelectedInstance]);

  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (ctx.current.activeStep !== NAME_STEP) return;

      const target = resolveGizmoPointerTarget(event.clientX, event.clientY, ctx.current.elements, {
        raycaster: ctx.current.raycaster,
        camera: ctx.current.camera,
        scene: ctx.current.scene,
        domElement: ctx.current.gl.domElement,
        atlasSize: ctx.current.atlasSize,
      });

      if (target?.onFrame) {
        ctx.current.setSelectedInstance(target.element.id);
        ctx.current.invalidate();
        return;
      }

      if (target?.buttonHit && target.element.id === ctx.current.selectedInstanceId) {
        return;
      }

      ctx.current.clearSelectedInstance();
      clearGizmoButtonHover();
      ctx.current.invalidate();
    };

    const onControlsStart = () => {
      if (ctx.current.activeStep !== NAME_STEP) return;
      ctx.current.clearSelectedInstance();
      clearGizmoButtonHover();
      ctx.current.invalidate();
    };

    dom.addEventListener('pointerdown', onPointerDown, { capture: true });
    controls?.addEventListener('start', onControlsStart);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown, { capture: true });
      controls?.removeEventListener('start', onControlsStart);
    };
  }, [controls, gl]);
};

export { useGizmoSelection };
