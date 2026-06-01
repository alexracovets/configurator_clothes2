import type { StepColorPart } from './useStepColor/useStepColor';
import { useStepShading } from './useStepShading/useStepShading';

const syncShadingFromColorParts = (parts: StepColorPart[]) => {
  useStepShading.getState().syncFromColorParts(parts);
};

export { syncShadingFromColorParts };
