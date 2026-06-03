import type { Object3D } from 'three';

import type { DesignColorPreview, PatternCustomization } from '@store';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';
import { createPrintAtlasCanvas } from '../canvas/createLayerCanvas';
import { runPrintLayers } from '../layerPipeline';
import { getCanvas2dContext } from '../utils/canvas';
import { toStoreInput } from '../utils/toStoreInput';
import { getGarmentRuntime } from '../runtime/garmentRuntime';

interface DesignPreviewPatch {
  colorPreview?: DesignColorPreview;
  opacityPreview?: number;
}

/** Rebuild print atlas with preview overrides — does NOT update the cache. */
const applyDesignPreview = async (root: Object3D, fabric: FabricCompositingInput, print: PrintCompositingInput, patch: DesignPreviewPatch): Promise<void> => {
  const { activePattern, activePatternCustomization } = print;
  if (!activePattern || !activePatternCustomization) return;

  const { colorPreview, opacityPreview } = patch;

  if (colorPreview && activePattern.key !== colorPreview.patternKey) return;

  const previewCustomization: PatternCustomization = {
    colors: colorPreview ? { ...activePatternCustomization.colors, [colorPreview.partKey]: colorPreview.color } : activePatternCustomization.colors,
    opacity: opacityPreview ?? activePatternCustomization.opacity,
  };

  const previewPrint: PrintCompositingInput = { ...print, activePatternCustomization: previewCustomization };

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
const clearDesignColorPreview = (root: Object3D): void => {
  const runtime = getGarmentRuntime(root);
  if (!runtime.printAtlasTexture || !runtime.printCanvas) return;

  runtime.printAtlasTexture.image = runtime.printCanvas;
  runtime.printAtlasTexture.needsUpdate = true;
};

export { applyDesignPreview, clearDesignColorPreview };
export type { DesignPreviewPatch };
