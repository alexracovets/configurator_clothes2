import type { PartGradientConfig } from '../entities/garment';

type PartGradient = {
  enabled: boolean;
  color2: string;
} & PartGradientConfig;

export type { PartGradient };
