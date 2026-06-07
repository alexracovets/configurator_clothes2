'use client';

import { memo } from 'react';

import type { Object3D } from 'three';

interface PreserveGltfMeshProps {
  meshName: string;
  node: Object3D;
}

const PreserveGltfMesh = memo(({ meshName, node }: PreserveGltfMeshProps) => {
  return <primitive name={meshName} object={node} />;
});

PreserveGltfMesh.displayName = 'PreserveGltfMesh';

export { PreserveGltfMesh };
