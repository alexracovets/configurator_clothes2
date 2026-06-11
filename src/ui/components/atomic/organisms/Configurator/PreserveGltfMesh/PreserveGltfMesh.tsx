'use client';

import { memo, useEffect, useMemo } from 'react';

import type { Mesh, Object3D } from 'three';

import type { preserveGltfMeshPropsType } from '@types';

const disposeMeshResources = (object: Object3D) => {
  object.traverse((child) => {
    if (!('isMesh' in child) || !child.isMesh) return;

    const mesh = child as Mesh;
    mesh.geometry?.dispose();

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      material?.dispose();
    }
  });
};

const PreserveGltfMesh = memo(({ meshName, node, renderOrder = 0 }: preserveGltfMeshPropsType) => {
  const instance = useMemo(() => node.clone(true), [node]);

  useEffect(() => {
    return () => disposeMeshResources(instance);
  }, [instance]);

  return <primitive name={meshName} object={instance} renderOrder={renderOrder} />;
});

PreserveGltfMesh.displayName = 'PreserveGltfMesh';

export { PreserveGltfMesh };
