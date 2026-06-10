import type { PartGradient } from '@types';

const DEFAULT_GRADIENT_COLOR2 = '#000000';

const DEFAULT_PART_GRADIENT: PartGradient = {
  enabled: true,
  reversed: false,
  color2: DEFAULT_GRADIENT_COLOR2,
  rotation: 0,
  position: 0.5,
  softness: 0.5,
  opacity: 1,
};

const DISABLED_PART_GRADIENT: PartGradient = {
  enabled: false,
  reversed: false,
  color2: DEFAULT_GRADIENT_COLOR2,
  rotation: 0,
  position: 0.5,
  softness: 0.5,
  opacity: 1,
};

export { DEFAULT_GRADIENT_COLOR2, DEFAULT_PART_GRADIENT, DISABLED_PART_GRADIENT };
export type { PartGradient } from '@types';
