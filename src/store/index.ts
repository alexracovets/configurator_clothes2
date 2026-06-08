export { useConfigurationControl } from './useConfigurationControl';
export { useConfiguratorProduct } from './useConfiguratorProduct';
export { DEFAULT_COLOR, DEFAULT_PART_GRADIENT, DISABLED_PART_GRADIENT, resolveGradientColors, useGarmentColor } from './useGarmentColor';
export type { PartGradient } from './useGarmentColor';
export { useGarmentDesign } from './useGarmentDesign';
export type { DesignPatternItem, DesignPatternPart } from './useGarmentDesign';
export {
  createNameInstance,
  mapProductNamePositions,
  resolveInstancesForRender,
  resolveNameDefaults,
  resolveNameLimits,
  useGarmentName,
} from './useGarmentName';
export type { NameInstance, NameLimits, NamePosition, NamePreview } from './useGarmentName';
export {
  createNumberInstance,
  resolveNumberDefaults,
  resolveNumberInstancesForRender,
  resolveNumberLimits,
  sanitizeNumberText,
  useGarmentNumber,
} from './useGarmentNumber';
export type { NumberInstance, NumberLimits, NumberPosition, NumberPreview } from './useGarmentNumber';
export type { GarmentTextRenderInstance } from './garmentTextRenderInstance';
