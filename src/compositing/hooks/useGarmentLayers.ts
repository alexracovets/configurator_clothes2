'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import { resolvePbrTexturePaths, useConfiguratorProduct, useGarmentPbrMaps } from '@hooks';
import type { Object3D } from 'three';

import { applyLayeredMaterials } from '../apply/applyLayeredMaterials';
import { fixInsideMeshMaterial } from '../utils/fixInsideMeshMaterial';
import { useCompositingInput } from '../resolveCompositingInput';

const useGarmentLayers = (root: Object3D | null) => {
  const input = useCompositingInput();
  const { product } = useConfiguratorProduct();
  const pbrPaths = useMemo(() => (product ? resolvePbrTexturePaths(product) : null), [product]);
  const pbrMaps = useGarmentPbrMaps(
    pbrPaths ?? {
      bakeNormal: '/models/crewneck/crewneck/bake_normal.jpg',
      bakeAoRoughness: '/models/crewneck/crewneck/bake_ao-bake_roughness.jpg',
      fabricNormal: '/models/crewneck/crewneck/cotton_jersey_nor_gl.jpg',
      fabricRoughness: '/models/crewneck/crewneck/cotton_jersey_rough.jpg',
    },
  );
  const invalidate = useThree((state) => state.invalidate);
  const requestIdRef = useRef(0);

  const compositingInput = useMemo(
    () => ({
      ...input,
      pbrMaps: pbrPaths ? pbrMaps : null,
    }),
    [input, pbrMaps, pbrPaths],
  );

  useEffect(() => {
    if (!root || input.colorParts.length === 0 || !compositingInput.pbrMaps) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void applyLayeredMaterials(root, compositingInput).then(() => {
      if (requestIdRef.current !== requestId) return;
      if (compositingInput.pbrMaps) {
        fixInsideMeshMaterial(root, compositingInput.pbrMaps.fabricNormal);
      }
      invalidate();
    });
  }, [compositingInput, invalidate, root, input.colorParts.length]);
};

export { useGarmentLayers };
