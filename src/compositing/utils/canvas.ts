import { createPartLayerCanvas } from '../canvas/createLayerCanvas';
import type { CompositingStoreInput, LayerContext } from '../types';

const getCanvas2dContext = (canvas: HTMLCanvasElement) => canvas.getContext('2d');

const createFabricLayerContext = (input: CompositingStoreInput, partId: string | null): LayerContext | null => {
  const canvas = createPartLayerCanvas();
  const ctx = getCanvas2dContext(canvas);
  if (!ctx) return null;

  return {
    canvas,
    ctx,
    width: canvas.width,
    height: canvas.height,
    input,
    partId,
  };
};

export { createFabricLayerContext, getCanvas2dContext };
