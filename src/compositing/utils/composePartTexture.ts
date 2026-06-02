import type { UvBounds } from '@constants';

import { runFabricLayers } from '../layerPipeline';
import type { CompositingInput } from '../types';
import { createFabricLayerContext } from './canvas';
import { drawPrintOnPart } from './drawPrintOnPart';

const composePartTexture = (input: CompositingInput, partId: string | null, printCanvas: HTMLCanvasElement, bounds: UvBounds) => {
  const context = createFabricLayerContext(input, partId);
  if (!context) {
    return document.createElement('canvas');
  }

  runFabricLayers(context);

  drawPrintOnPart(context.ctx, context.width, printCanvas, bounds);

  return context.canvas;
};

export { composePartTexture };
