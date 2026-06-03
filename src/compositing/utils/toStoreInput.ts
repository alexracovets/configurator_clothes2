import type { CompositingStoreInput } from '../types';

import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';

const toStoreInput = (fabric: FabricCompositingInput, print: PrintCompositingInput): CompositingStoreInput => ({
  colorParts: fabric.colorParts,
  shadingParts: fabric.shadingParts,
  nameParts: fabric.nameParts,
  activePattern: print.activePattern,
  activePatternCustomization: print.activePatternCustomization,
  defaultPattern: print.defaultPattern,
  defaultPatternCustomization: print.defaultPatternCustomization,
  logoParts: print.logoParts,
});

export { toStoreInput };
