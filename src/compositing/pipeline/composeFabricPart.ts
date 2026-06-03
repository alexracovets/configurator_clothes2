import { runFabricLayers } from '../layerPipeline';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';
import { createFabricLayerContext } from '../utils/canvas';
import { toStoreInput } from '../utils/toStoreInput';

const EMPTY_PRINT_INPUT: PrintCompositingInput = {
  activePattern: null,
  activePatternCustomization: null,
  defaultPattern: null,
  defaultPatternCustomization: null,
  logoParts: [],
};

const composeFabricPart = (fabric: FabricCompositingInput, partId: string, partTextureSize?: number) => {
  const context = createFabricLayerContext(toStoreInput(fabric, EMPTY_PRINT_INPUT), partId, partTextureSize);
  if (!context) {
    return document.createElement('canvas');
  }

  runFabricLayers(context);
  return context.canvas;
};

export { composeFabricPart };
