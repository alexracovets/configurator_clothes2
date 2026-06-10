import type { PatternConfig } from '../entities/garment';

type DesignPatternPart = {
  key: string;
  src: string;
  previewSrc: string;
};

type DesignPatternItem = Pick<PatternConfig, 'name'> & {
  key: string;
  parts: DesignPatternPart[];
};

export type { DesignPatternItem, DesignPatternPart };
