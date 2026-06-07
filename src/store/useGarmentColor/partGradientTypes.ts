interface PartGradient {
  enabled: boolean;
  color2: string;
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

const DEFAULT_PART_GRADIENT: PartGradient = {
  enabled: true,
  color2: '#000000',
  rotation: 0,
  position: 0.5,
  softness: 0.5,
  opacity: 1,
};

const DISABLED_PART_GRADIENT: PartGradient = {
  enabled: false,
  color2: '#000000',
  rotation: 0,
  position: 0.5,
  softness: 0.5,
  opacity: 1,
};

export { DEFAULT_PART_GRADIENT, DISABLED_PART_GRADIENT };
export type { PartGradient };
