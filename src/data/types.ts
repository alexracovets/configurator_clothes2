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

interface PartGradientConfig {
  reversed: boolean;
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

interface GarmentPartConfig {
  id: string;
  name: string;
  label: string;
  meshNames: string[];
  renderOrder?: number;
  uvBounds?: UvBounds;
  gradient?: PartGradientConfig;
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
  interactive?: boolean;
  show_frame?: boolean;
  show_gizmo?: boolean;
}

interface TextDefaultsConfig {
  text: string;
  font: string;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  maxLength?: number;
  fontSizeMin?: number;
  fontSizeMax?: number;
  strokeWidthMax?: number;
}

interface NamePositionConfig extends TextPositionConfig {
  partId: string;
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
  nameDefaults?: TextDefaultsConfig;
  namePositions?: NamePositionConfig[];
  numberDefaults?: TextDefaultsConfig;
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
  NamePositionConfig,
  NumberPositionConfig,
  PartGradientConfig,
  PatternConfig,
  PatternPartConfig,
  PrintAtlasConfig,
  StyleConfig,
  StyleId,
  TextDefaultsConfig,
  TextPositionConfig,
  UvBounds,
  UvPoint,
};
