import { createPrintAtlasCanvas } from '../canvas/createLayerCanvas';
import { runPrintLayers } from '../layerPipeline';
import type { CompositingStoreInput, PrintLayerContext } from '../types';
import { buildPrintAtlasCacheKey } from '../utils/cacheKeys';
import { getCanvas2dContext } from '../utils/canvas';

let printAtlasCache: { key: string; canvas: HTMLCanvasElement } | null = null;

const composePrintAtlas = async (input: CompositingStoreInput) => {
  const cacheKey = buildPrintAtlasCacheKey(input);
  if (printAtlasCache?.key === cacheKey) {
    return printAtlasCache.canvas;
  }

  const canvas = createPrintAtlasCanvas();
  const ctx = getCanvas2dContext(canvas);
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const printContext: PrintLayerContext = { canvas, ctx, input };
  await runPrintLayers(printContext);

  printAtlasCache = { key: cacheKey, canvas };
  return canvas;
};

const invalidatePrintAtlasCache = () => {
  printAtlasCache = null;
};

export { composePrintAtlas, invalidatePrintAtlasCache };
