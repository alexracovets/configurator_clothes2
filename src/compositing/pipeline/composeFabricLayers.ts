import { runFabricLayers } from '../layerPipeline';
import { createFabricLayerContext } from '../utils/canvas';
import type { CompositingInput } from '../types';

const composeFabricLayers = (input: CompositingInput, partId: string | null) => {
  const context = createFabricLayerContext(input, partId);
  if (!context) {
    return document.createElement('canvas');
  }

  runFabricLayers(context);
  return context.canvas;
};

export { composeFabricLayers };
