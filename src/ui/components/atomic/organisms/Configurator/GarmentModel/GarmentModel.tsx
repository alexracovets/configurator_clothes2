'use client';

import { useEffect } from 'react';

import { useGLTF } from '@react-three/drei';

import { resolvePbrTexturePaths } from '@hooks';
import { GarmentMaterialRegistryProvider } from '@providers';
import { resolveModelUrl } from '@utils';
import { useConfiguratorProduct } from '@store';

import { GarmentProductInit } from '../GarmentProductInit';
import { GarmentMeshes } from '../GarmentMeshes';
import { PbrMapsLoader } from '../PbrMapsLoader';

const GarmentModel = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const modelUrl = resolveModelUrl(product);
  const pbrPaths = resolvePbrTexturePaths(product);

  useEffect(() => {
    useGLTF.preload(modelUrl);
  }, [modelUrl]);

  const scene = (
    <>
      <GarmentProductInit />
      <GarmentMeshes />
    </>
  );

  return (
    <GarmentMaterialRegistryProvider>
      <PbrMapsLoader paths={pbrPaths}>{scene}</PbrMapsLoader>
    </GarmentMaterialRegistryProvider>
  );
};

export { GarmentModel };
