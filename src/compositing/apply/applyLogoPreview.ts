import type { Object3D } from 'three';

import type { LogoPreviewPatch } from '@store';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';
import { createPrintAtlasCanvas } from '../canvas/createLayerCanvas';
import { runPrintLayers } from '../layerPipeline';
import { getCanvas2dContext } from '../utils/canvas';
import { toStoreInput } from '../utils/toStoreInput';
import { getGarmentRuntime } from '../runtime/garmentRuntime';

/** Rebuild the print atlas with the dragged logo patched — does NOT update the cache. */
const applyLogoPreview = async (
  root: Object3D,
  fabric: FabricCompositingInput,
  print: PrintCompositingInput,
  partId: string,
  patch: LogoPreviewPatch,
): Promise<void> => {
  const previewPrint: PrintCompositingInput = {
    ...print,
    logoParts: print.logoParts.map((part) => (part.id === partId ? { ...part, ...patch } : part)),
  };

  const canvas = createPrintAtlasCanvas();
  const ctx = getCanvas2dContext(canvas);
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await runPrintLayers({ canvas, ctx, input: toStoreInput(fabric, previewPrint) });

  const runtime = getGarmentRuntime(root);
  if (!runtime.printAtlasTexture) return;

  runtime.printAtlasTexture.image = canvas;
  runtime.printAtlasTexture.needsUpdate = true;
};

/** Restore the committed print canvas after clearing the preview. */
const clearLogoPreview = (root: Object3D): void => {
  const runtime = getGarmentRuntime(root);
  if (!runtime.printAtlasTexture || !runtime.printCanvas) return;

  runtime.printAtlasTexture.image = runtime.printCanvas;
  runtime.printAtlasTexture.needsUpdate = true;
};

export { applyLogoPreview, clearLogoPreview };
