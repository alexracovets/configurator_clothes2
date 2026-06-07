'use client';

import { memo, useEffect } from 'react';

import { useThree } from '@react-three/fiber';

import { useGarmentMaterialRegistry } from '@providers';
import { DEFAULT_COLOR, useConfiguratorProduct } from '@store';

const STATIC_REGISTRY_KEY = 'static';

const StaticColorLayer = memo(() => {
  const defaultColor = useConfiguratorProduct((state) => state.product.defaultColor ?? DEFAULT_COLOR);
  const { getMaterials } = useGarmentMaterialRegistry();
  const { invalidate } = useThree();

  useEffect(() => {
    for (const material of getMaterials(STATIC_REGISTRY_KEY)) {
      material.color.set(defaultColor);
      material.needsUpdate = true;
    }
    invalidate();
  }, [defaultColor, getMaterials, invalidate]);

  return null;
});

StaticColorLayer.displayName = 'StaticColorLayer';

export { STATIC_REGISTRY_KEY, StaticColorLayer };
