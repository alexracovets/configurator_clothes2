import type { GarmentConfig, TextDefaultsConfig } from '@data';

interface NamePosition {
  key: string;
  label: string;
  partId: string;
  uv: { x: number; y: number };
  rotation: number;
  fontSize: number;
  interactive: boolean;
}

interface NameInstance {
  id: string;
  positionKey: string;
  label: string;
  partId: string;
  uv: { x: number; y: number };
  rotation: number;
  text: string;
  font: string;
  fontSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
}

interface NamePreview {
  instanceId: string;
  patch: Partial<Pick<NameInstance, 'text' | 'textColor' | 'strokeColor' | 'fontSize' | 'strokeWidth'>>;
}

interface NameLimits {
  maxLength: number;
  fontSizeMin: number;
  fontSizeMax: number;
  strokeWidthMax: number;
}

const resolveNameDefaults = (product: GarmentConfig): TextDefaultsConfig => {
  if (!product.nameDefaults) {
    throw new Error(`Product "${product.path}" defines namePositions but is missing nameDefaults.`);
  }

  return product.nameDefaults;
};

const resolveNameLimits = (product: GarmentConfig): NameLimits => {
  const defaults = resolveNameDefaults(product);

  return {
    maxLength: defaults.maxLength ?? 20,
    fontSizeMin: defaults.fontSizeMin ?? 50,
    fontSizeMax: defaults.fontSizeMax ?? 400,
    strokeWidthMax: defaults.strokeWidthMax ?? 20,
  };
};

const mapProductNamePositions = (product: GarmentConfig): NamePosition[] =>
  (product.namePositions ?? []).map((position, index) => ({
    key: `name-pos-${index}`,
    label: position.label,
    partId: position.partId,
    uv: position.uv,
    rotation: position.rotation,
    fontSize: position.fontSize,
    interactive: position.interactive,
  }));

const createNameInstance = (product: GarmentConfig, position: NamePosition, id: string): NameInstance => {
  const defaults = resolveNameDefaults(product);

  return {
    id,
    positionKey: position.key,
    label: position.label,
    partId: position.partId,
    uv: position.uv,
    rotation: position.rotation,
    text: defaults.text,
    font: defaults.font,
    fontSize: position.fontSize,
    textColor: defaults.textColor,
    strokeColor: defaults.strokeColor,
    strokeWidth: defaults.strokeWidth,
  };
};

export { createNameInstance, mapProductNamePositions, resolveNameDefaults, resolveNameLimits };
export type { NameInstance, NameLimits, NamePosition, NamePreview };
