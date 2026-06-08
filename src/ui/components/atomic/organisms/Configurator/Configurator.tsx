'use client';

import { Suspense } from 'react';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { CanvasControl } from './CanvasControl';
import { Model } from './Model';

const Configurator = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      frameloop="demand"
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        stencil: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      dpr={[1, 1.5]}
    >
      <CanvasControl />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
};

export { Configurator };
