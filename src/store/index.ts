export { useConfigurationControl } from './useConfigurationControl';
export { activateCartItem, applyGarmentConfiguration, captureGarmentConfiguration, useConfigurationCart } from './useConfigurationCart';
export type { CartItem, CartItemConfiguration } from './useConfigurationCart';
export { useConfiguratorProduct } from './useConfiguratorProduct';
export { useConfiguratorSceneLoad } from './useConfiguratorSceneLoad';
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
export { resolveLogoInstancesForRender, useGarmentLogo } from './useGarmentLogo';
export type { LogoInstance, LogoPosition, LogoPreview } from './useGarmentLogo';
export { useStepLogo } from './useStepLogo';
export type { StepLogoPartState, StepLogoPositionState, StepLogoUv } from './useStepLogo';
export { useInfoDialog } from './useInfoDialog';
