'use client';

import { memo, useMemo } from 'react';

import { buildNameGizmoElements } from '@gizmo';
import { useGizmoButtonHover, useGizmoSelection } from '@hooks';
import { resolveNameLimits, useConfigurationControl, useConfiguratorProduct, useGarmentName } from '@store';
import { resolvePrintAtlasSize } from '@utils';

import { PrintGizmoInstance } from './PrintGizmoInstance';

const NAME_STEP = 4;

const PrintGizmoLayer = memo(() => {
  const product = useConfiguratorProduct((state) => state.product);
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const instances = useGarmentName((state) => state.instances);

  const limits = useMemo(() => (product.nameDefaults ? resolveNameLimits(product) : null), [product]);

  const elements = useMemo(() => {
    if (activeStep !== NAME_STEP || !limits) return [];
    return buildNameGizmoElements({ product, instances, fontSizeMin: limits.fontSizeMin, fontSizeMax: limits.fontSizeMax });
  }, [activeStep, instances, limits, product]);

  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);
  useGizmoSelection({ elements, atlasSize });
  useGizmoButtonHover({ elements, atlasSize });

  if (elements.length === 0) return null;

  return (
    <group>
      {elements.map((element) => (
        <PrintGizmoInstance key={element.id} element={element} elements={elements} />
      ))}
    </group>
  );
});

PrintGizmoLayer.displayName = 'PrintGizmoLayer';

export { PrintGizmoLayer };
