'use client';

import { useGLTF } from '@react-three/drei';

import { resolveModelUrl } from '@utils';
import { useConfiguratorProduct } from '@store';

import { GarmentPartMesh } from '../GarmentPartMesh';
import { GarmentNameTextureLayer } from '../GarmentNameTextureLayer';
import { GarmentTextureLayer } from '../GarmentTextureLayer';
import { PreserveGltfMesh } from '../PreserveGltfMesh';
import { STATIC_REGISTRY_KEY, StaticColorLayer } from '../StaticColorLayer';

const GarmentMeshes = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const modelUrl = resolveModelUrl(product);
  const { nodes } = useGLTF(modelUrl);

  return (
    <group key={product.path}>
      {product.parts.flatMap((part) =>
        part.meshNames.map((meshName) => (
          <GarmentPartMesh key={`${part.id}-${meshName}`} registryKey={part.id} meshName={meshName} node={nodes[meshName]} renderOrder={part.renderOrder} />
        )),
      )}
      {product.staticMeshes?.flatMap((group) =>
        group.meshNames.map((meshName) => (
          <GarmentPartMesh
            key={`static-${meshName}`}
            registryKey={STATIC_REGISTRY_KEY}
            meshName={meshName}
            node={nodes[meshName]}
            renderOrder={group.renderOrder}
          />
        )),
      )}
      {product.preserveGltfMeshes?.map((meshName) => (
        <PreserveGltfMesh key={`preserve-${meshName}`} meshName={meshName} node={nodes[meshName]} />
      ))}
      <GarmentTextureLayer />
      <GarmentNameTextureLayer />
      <StaticColorLayer />
    </group>
  );
};

export { GarmentMeshes };
