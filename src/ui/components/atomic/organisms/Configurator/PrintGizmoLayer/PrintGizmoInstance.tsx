'use client';

import { memo, useMemo } from 'react';

import type { PrintGizmoElement } from '@gizmo';
import { usePrintGizmoDrag } from '@hooks';
import { useConfiguratorProduct } from '@store';
import { resolvePrintAtlasSize } from '@utils';

interface PrintGizmoInstanceProps {
  element: PrintGizmoElement;
}

// The frame and buttons are painted in the garment shader (glued to the fabric). This component
// renders nothing — it wires pointer interaction by raycasting the garment and hit-testing the same
// corner/box geometry the shader draws.
const PrintGizmoInstance = memo(({ element }: PrintGizmoInstanceProps) => {
  const product = useConfiguratorProduct((state) => state.product);
  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);

  usePrintGizmoDrag({ element, atlasSize });

  return null;
});

PrintGizmoInstance.displayName = 'PrintGizmoInstance';

export { PrintGizmoInstance };
