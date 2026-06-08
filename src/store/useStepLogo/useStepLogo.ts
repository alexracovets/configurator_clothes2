'use client';

import { useCallback, useMemo } from 'react';

import { useGarmentLogo } from '../useGarmentLogo';
import type { LogoInstance, LogoPosition } from '../useGarmentLogo';

interface StepLogoUv {
  x: number;
  y: number;
}

interface StepLogoPartState {
  id: string;
  positionKey: string;
  label: string;
  uv: StepLogoUv;
  rotation: number;
  opacity: number;
  baseScale: number;
  scale: number;
  src: string;
  fileName: string;
  visible: boolean;
  isDefault: boolean;
}

interface StepLogoPositionState {
  key: string;
  label: string;
  uv: StepLogoUv;
  rotation: number;
  scale: number;
  default: boolean;
  interactive: boolean;
  defaultSrc: string;
}

interface StepLogoStoreView {
  parts: StepLogoPartState[];
  positions: StepLogoPositionState[];
  canAddUserLogo: () => boolean;
  removePart: (id: string) => void;
  updatePart: (id: string, patch: Partial<StepLogoPartState>) => void;
}

const mapInstanceToPart = (instance: LogoInstance): StepLogoPartState => ({
  id: instance.id,
  positionKey: instance.positionKey,
  label: instance.label,
  uv: instance.uv,
  rotation: instance.rotation,
  opacity: instance.opacity,
  baseScale: instance.scale,
  scale: instance.scale,
  src: instance.src,
  fileName: instance.fileName,
  visible: true,
  isDefault: instance.isDefault,
});

const mapPositionToStep = (position: LogoPosition): StepLogoPositionState => ({
  key: position.key,
  label: position.label,
  uv: position.uv,
  rotation: position.rotation,
  scale: position.scale,
  default: position.isDefault,
  interactive: position.interactive,
  defaultSrc: position.src ?? '',
});

const useStepLogo = <T>(selector: (state: StepLogoStoreView) => T): T => {
  const instances = useGarmentLogo((state) => state.instances);
  const positions = useGarmentLogo((state) => state.positions);
  const canAddUserLogo = useGarmentLogo((state) => state.canAddUserLogo);
  const removeInstance = useGarmentLogo((state) => state.removeInstance);
  const updateInstance = useGarmentLogo((state) => state.updateInstance);

  const parts = useMemo(() => instances.map(mapInstanceToPart), [instances]);
  const stepPositions = useMemo(() => positions.map(mapPositionToStep), [positions]);

  const removePart = useCallback((id: string) => removeInstance(id), [removeInstance]);

  const updatePart = useCallback(
    (id: string, patch: Partial<StepLogoPartState>) => {
      const logoPatch = { ...patch };
      delete logoPatch.baseScale;
      delete logoPatch.visible;
      updateInstance(id, logoPatch);
    },
    [updateInstance],
  );

  return selector({
    parts,
    positions: stepPositions,
    canAddUserLogo,
    removePart,
    updatePart,
  });
};

export { useStepLogo };
export type { StepLogoPartState, StepLogoPositionState, StepLogoUv };
