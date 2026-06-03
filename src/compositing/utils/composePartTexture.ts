import type { UvBounds } from '@constants';

import { composeFabricPart } from '../pipeline/composeFabricPart';
import { mergePartAlbedo } from '../pipeline/mergePartAlbedo';
import type { CompositingInput } from '../types';

const composePartTexture = (input: CompositingInput, partId: string | null, printCanvas: HTMLCanvasElement, bounds: UvBounds) => {
  if (!partId) {
    return document.createElement('canvas');
  }

  const fabric = {
    colorParts: input.colorParts,
    shadingParts: input.shadingParts,
    nameParts: input.nameParts,
  };

  const fabricCanvas = composeFabricPart(fabric, partId);
  return mergePartAlbedo(fabricCanvas, printCanvas, bounds);
};

export { composePartTexture };
