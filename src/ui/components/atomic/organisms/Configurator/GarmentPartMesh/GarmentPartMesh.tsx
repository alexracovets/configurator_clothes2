'use client';

import { memo, useEffect, useLayoutEffect, useMemo } from 'react';
import type { Mesh, MeshStandardMaterial, Object3D } from 'three';

import { useGarmentMaterialRegistry, usePbrMaps } from '@providers';

interface GarmentPartMeshProps {
  registryKey: string;
  meshName: string;
  node: Object3D;
  renderOrder?: number;
}

const GarmentPartMesh = memo(({ registryKey, meshName, node, renderOrder = 0 }: GarmentPartMeshProps) => {
  const pbrMaps = usePbrMaps();
  const { register, unregister } = useGarmentMaterialRegistry();

  const source = node as Mesh;
  const sourceMaterial = Array.isArray(source.material) ? source.material[0] : source.material;

  const material = useMemo(() => createGarmentMaterial(pbrMaps, sourceMaterial as MeshStandardMaterial), [pbrMaps, sourceMaterial]);

  useLayoutEffect(() => {
    register(registryKey, material);
    return () => unregister(registryKey, material);
  }, [material, registryKey, register, unregister]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return <mesh name={meshName} geometry={source.geometry} material={material} renderOrder={renderOrder} />;
});

GarmentPartMesh.displayName = 'GarmentPartMesh';

export { GarmentPartMesh };
