'use client';

import { memo, useEffect } from 'react';

import { useThree } from '@react-three/fiber';

import { useGarmentMaterialRegistry } from '@providers';
import { useGarmentColor } from '@store';

interface PartColorLayerProps {
  partId: string;
}

const PartColorLayer = memo(({ partId }: PartColorLayerProps) => {
  const color = useGarmentColor((state) => state.byPart[partId]);
  const { getMaterials } = useGarmentMaterialRegistry();
  const { invalidate } = useThree();

  useEffect(() => {
    if (!color) return;
    for (const material of getMaterials(partId)) {
      material.color.set(color);
      material.needsUpdate = true;
    }
    invalidate();
  }, [color, getMaterials, invalidate, partId]);

  return null;
});

PartColorLayer.displayName = 'PartColorLayer';

export { PartColorLayer };
