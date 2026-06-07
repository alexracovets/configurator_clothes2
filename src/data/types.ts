interface UvPoint {
  x: number;
  y: number;
}

interface UvBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface PrintAtlasConfig {
  width: number;
  height: number;
}

interface GarmentPartConfig {
  id: string;
  name: string;
  label: string;
  meshNames: string[];
  renderOrder?: number;
  uvBounds?: UvBounds;
}

interface PatternPartConfig {
  path_name: string;
  id: number;
}

interface PatternConfig {
  name: string;
  parts: PatternPartConfig[];
}

interface TextPositionConfig {
  label: string;
  uv: UvPoint;
  rotation: number;
  fontSize: number;
  interactive: boolean;
}

interface NumberPositionConfig extends TextPositionConfig {
  zone: string;
}

interface LogoPositionConfig {
  label: string;
  uv: UvPoint;
  src?: string;
  rotation: number;
  scale: number;
  default: boolean;
  interactive: boolean;
}

interface GarmentPbrTexturesConfig {
  bakeNormal: string;
  bakeAoRoughness: string;
  fabricNormal: string;
  fabricRoughness: string;
}

interface GarmentStaticMeshConfig {
  meshNames: string[];
  renderOrder?: number;
}

interface GarmentConfig {
  name: string;
  type: string;
  price: number;
  bonus_count: number;
  bonus_discount: number;
  minimum_count?: number;
  path: string;
  modelFile?: string;
  pbrTextures?: GarmentPbrTexturesConfig;
  parts: GarmentPartConfig[];
  staticMeshes?: GarmentStaticMeshConfig[];
  preserveGltfMeshes?: string[];
  printAtlas?: PrintAtlasConfig;
  partTextureSize?: number;
  patterns: PatternConfig[];
  default_pattern?: PatternConfig[];
  namePositions?: TextPositionConfig[];
  numberPositions?: NumberPositionConfig[];
  logoPositions?: LogoPositionConfig[];
}

interface StyleConfig {
  id: string;
  products: GarmentConfig[];
}

type StyleId = 'crewneck';

export type {
  GarmentConfig,
  GarmentPbrTexturesConfig,
  GarmentPartConfig,
  GarmentStaticMeshConfig,
  LogoPositionConfig,
  NumberPositionConfig,
  PatternConfig,
  PatternPartConfig,
  PrintAtlasConfig,
  StyleConfig,
  StyleId,
  TextPositionConfig,
  UvBounds,
  UvPoint,
};
