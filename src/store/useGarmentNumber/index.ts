export {
  createNumberInstance,
  mapProductNumberPositions,
  resolveNumberDefaults,
  resolveNumberLimits,
  sanitizeNumberText,
  NUMBER_MAX_LENGTH,
} from './mapProductNumbers';
export type { NumberInstance, NumberLimits, NumberPosition, NumberPreview } from './mapProductNumbers';
export { resolveNumberInstancesForRender, useGarmentNumber } from './useGarmentNumber';
