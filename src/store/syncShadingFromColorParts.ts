import type { StepColorPart } from './useStepColor/stepColorTypes';
import { useStepShading } from './useStepShading/useStepShading';

const syncShadingFromColorParts = (parts: StepColorPart[]) => {
  useStepShading.getState().syncFromColorParts(parts);
};

export { syncShadingFromColorParts };
