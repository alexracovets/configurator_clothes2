import type { garmentConfigType, numberInstanceType, numberLimitsType, numberPositionType, textDefaultsConfigType, uvPointType } from '@types';

import { resolvePartUvBounds } from '@utils';

const NUMBER_MAX_LENGTH = 2;

const resolveZonePartId = (product: garmentConfigType, zone: string): string => {
  const normalized = zone.toLowerCase();
  const part = product.parts.find((item) => item.id.toLowerCase().includes(normalized));

  if (!part) {
    throw new Error(`Product "${product.path}" has no part for zone "${zone}".`);
  }

  return part.id;
};

// numberPositions UV is 0..1 inside the zone part; shader expects print-atlas coordinates.
const resolveZoneLocalUvToAtlas = (product: garmentConfigType, zone: string, localUv: uvPointType): uvPointType => {
  const partId = resolveZonePartId(product, zone);
  const part = product.parts.find((item) => item.id === partId);

  if (!part) {
    throw new Error(`Product "${product.path}" has no part for zone "${zone}".`);
  }

  const bounds = resolvePartUvBounds(part);

  return {
    x: bounds.minX + localUv.x * (bounds.maxX - bounds.minX),
    y: bounds.minY + localUv.y * (bounds.maxY - bounds.minY),
  };
};

const resolveNumberDefaults = (product: garmentConfigType): textDefaultsConfigType => {
  if (!product.numberDefaults) {
    throw new Error(`Product "${product.path}" defines numberPositions but is missing numberDefaults.`);
  }

  return product.numberDefaults;
};

const resolveNumberLimits = (product: garmentConfigType): numberLimitsType => {
  const defaults = resolveNumberDefaults(product);

  return {
    maxLength: NUMBER_MAX_LENGTH,
    fontSizeMin: defaults.fontSizeMin ?? 50,
    fontSizeMax: defaults.fontSizeMax ?? 500,
    strokeWidthMax: defaults.strokeWidthMax ?? 20,
  };
};

const mapProductNumberPositions = (product: garmentConfigType): numberPositionType[] =>
  (product.numberPositions ?? []).map((position, index) => ({
    key: `number-pos-${index}`,
    label: position.label,
    partId: resolveZonePartId(product, position.zone),
    uv: resolveZoneLocalUvToAtlas(product, position.zone, position.uv),
    rotation: position.rotation,
    fontSize: position.fontSize,
    showFrame: position.show_frame ?? true,
    showGizmo: position.show_gizmo ?? position.interactive === true,
    interactive: position.interactive ?? true,
  }));

const sanitizeNumberText = (value: string) => value.replace(/\D/g, '').slice(0, NUMBER_MAX_LENGTH);

const createNumberInstance = (product: garmentConfigType, position: numberPositionType, id: string): numberInstanceType => {
  const defaults = resolveNumberDefaults(product);

  return {
    id,
    positionKey: position.key,
    label: position.label,
    partId: position.partId,
    uv: position.uv,
    rotation: 0,
    placementRotation: position.rotation,
    text: sanitizeNumberText(defaults.text),
    font: defaults.font,
    fontSize: position.fontSize,
    textColor: defaults.textColor,
    strokeColor: defaults.strokeColor,
    strokeWidth: defaults.strokeWidth,
    showFrame: position.showFrame,
    showGizmo: position.showGizmo,
  };
};

export {
  createNumberInstance,
  mapProductNumberPositions,
  resolveNumberDefaults,
  resolveNumberLimits,
  resolveZoneLocalUvToAtlas,
  sanitizeNumberText,
  NUMBER_MAX_LENGTH,
};
