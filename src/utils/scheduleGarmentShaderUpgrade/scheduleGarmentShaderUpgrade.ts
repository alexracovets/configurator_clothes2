import type { garmentConfigType } from '@types';
import type { MeshStandardMaterial } from 'three';

import { upgradeGarmentMaterialShader } from '../createGarmentMaterial/createGarmentMaterial';

type ScheduleGarmentShaderUpgradeOptions = {
  parts: garmentConfigType['parts'];
  getMaterials: (registryKey: string) => readonly MeshStandardMaterial[];
  invalidate: () => void;
  onComplete: () => void;
};

const scheduleGarmentShaderUpgrade = ({ parts, getMaterials, invalidate, onComplete }: ScheduleGarmentShaderUpgradeOptions) => {
  const materialQueue = parts.flatMap((part) => [...getMaterials(part.id)]);

  if (materialQueue.length === 0) {
    onComplete();
    return () => {};
  }

  let index = 0;
  let cancelled = false;
  let idleCallbackId = 0;

  const step = () => {
    if (cancelled) return;

    if (index >= materialQueue.length) {
      invalidate();
      onComplete();
      return;
    }

    upgradeGarmentMaterialShader(materialQueue[index]!);
    index += 1;
    invalidate();

    if (index >= materialQueue.length) {
      onComplete();
      return;
    }

    idleCallbackId = requestIdleCallback(step, { timeout: 200 });
  };

  idleCallbackId = requestIdleCallback(step, { timeout: 200 });

  return () => {
    cancelled = true;
    cancelIdleCallback(idleCallbackId);
  };
};

export { scheduleGarmentShaderUpgrade };
