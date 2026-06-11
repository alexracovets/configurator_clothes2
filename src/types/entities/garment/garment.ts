interface uvPointType {
  x: number;
  y: number;
}

interface uvBoundsType {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface printAtlasConfigType {
  width: number;
  height: number;
}

interface partGradientConfigType {
  reversed: boolean;
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

interface garmentPartConfigType {
  id: string;
  name: string;
  label: string;
  meshNames: string[];
  renderOrder?: number;
  uvBounds?: uvBoundsType;
  printRotation?: number;
  gradient?: partGradientConfigType;
}

interface patternPartConfigType {
  path_name: string;
  id: number;
}

interface patternConfigType {
  name: string;
  parts: patternPartConfigType[];
}

interface textPositionConfigType {
  label: string;
  uv: uvPointType;
  rotation: number;
  fontSize: number;
  interactive?: boolean;
  show_frame?: boolean;
  show_gizmo?: boolean;
}

interface textDefaultsConfigType {
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

interface namePositionConfigType extends textPositionConfigType {
  partId: string;
}

interface numberPositionConfigType extends textPositionConfigType {
  zone: string;
}

interface logoPositionConfigType {
  label: string;
  uv: uvPointType;
  src?: string;
  rotation: number;
  scale: number;
  partId?: string;
  default?: boolean;
  interactive?: boolean;
  show_frame?: boolean;
  show_gizmo?: boolean;
}

interface garmentPbrTexturesConfigType {
  bakeNormal: string;
  bakeAoRoughness: string;
  fabricNormal: string;
  fabricRoughness: string;
}

interface garmentStaticMeshConfigType {
  meshNames: string[];
  renderOrder?: number;
}

interface garmentConfigType {
  name: string;
  type: string;
  previewImage?: string;
  price: number;
  bonus_count: number;
  bonus_discount: number;
  minimum_count?: number;
  path: string;
  modelFile?: string;
  pbrTextures?: garmentPbrTexturesConfigType;
  parts: garmentPartConfigType[];
  staticMeshes?: garmentStaticMeshConfigType[];
  preserveGltfMeshes?: string[];
  printAtlas?: printAtlasConfigType;
  partTextureSize?: number;
  patterns: patternConfigType[];
  default_pattern?: patternConfigType[];
  nameDefaults?: textDefaultsConfigType;
  namePositions?: namePositionConfigType[];
  numberDefaults?: textDefaultsConfigType;
  numberPositions?: numberPositionConfigType[];
  logoPositions?: logoPositionConfigType[];
}

interface styleConfigType {
  id: string;
  products: garmentConfigType[];
}

type styleIdType = 'crewneck';

export type {
  garmentConfigType,
  garmentPbrTexturesConfigType,
  garmentPartConfigType,
  logoPositionConfigType,
  partGradientConfigType,
  patternConfigType,
  printAtlasConfigType,
  styleConfigType,
  styleIdType,
  textDefaultsConfigType,
  textPositionConfigType,
  uvBoundsType,
  uvPointType,
};
