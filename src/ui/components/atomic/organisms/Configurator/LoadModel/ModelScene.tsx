'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGarmentLayers } from '@compositing';
import type { Group } from 'three';
import { Mesh, MeshStandardMaterial } from 'three';

import { SLIDE_DISTANCE, TRANSITION_DURATION } from './constants';
import type { ModelPhase } from './constants';
import { prepareModelRoot } from './useModelMaterials';

type ModelSceneProps = {
  url: string;
  phase: ModelPhase;
  onComplete?: () => void;
};

const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

const setGroupOpacity = (root: Group, opacity: number) => {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.userData.preserveAlpha) return;

      material.transparent = opacity < 1;
      material.opacity = opacity;
      material.depthWrite = opacity >= 0.99;
      material.needsUpdate = true;
    });
  });
};

const ModelScene = ({ url, phase, onComplete }: ModelSceneProps) => {
  const groupRef = useRef<Group>(null);
  const progressRef = useRef(phase === 'idle' ? 1 : 0);
  const completedRef = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const { scene } = useGLTF(url);

  const modelRoot = useMemo(() => prepareModelRoot(scene), [scene]);

  useGarmentLayers(modelRoot);

  useEffect(() => {
    progressRef.current = phase === 'idle' ? 1 : 0;
    completedRef.current = false;

    if (!groupRef.current) return;

    groupRef.current.position.set(0, 0, 0);

    if (phase === 'enter') {
      groupRef.current.position.x = SLIDE_DISTANCE;
      setGroupOpacity(groupRef.current, 0.35);
      return;
    }

    if (phase === 'exit') {
      setGroupOpacity(groupRef.current, 1);
      return;
    }

    setGroupOpacity(groupRef.current, 1);
  }, [phase, url]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || phase === 'idle') return;

    progressRef.current = Math.min(1, progressRef.current + delta / TRANSITION_DURATION);
    const eased = easeOutCubic(progressRef.current);

    if (phase === 'enter') {
      group.position.x = SLIDE_DISTANCE * (1 - eased);
      setGroupOpacity(group, 0.35 + eased * 0.65);
    }

    if (phase === 'exit') {
      group.position.x = -SLIDE_DISTANCE * eased;
      setGroupOpacity(group, 1 - eased);
    }

    invalidate();

    if (progressRef.current >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={modelRoot} />
    </group>
  );
};

export { ModelScene };
