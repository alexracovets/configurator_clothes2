import type { UvBounds } from '@constants';

import { createPartLayerCanvas } from '../canvas/createLayerCanvas';
import { drawPrintOnPart } from '../utils/drawPrintOnPart';
import { getCanvas2dContext } from '../utils/canvas';

/** Pipeline merge: fabric part canvas (1–2) + cropped print atlas (4–7). */
const mergePartAlbedo = (fabricCanvas: HTMLCanvasElement, printCanvas: HTMLCanvasElement, bounds: UvBounds) => {
  const canvas = createPartLayerCanvas();
  const ctx = getCanvas2dContext(canvas);
  if (!ctx) return canvas;

  ctx.drawImage(fabricCanvas, 0, 0, canvas.width, canvas.height);
  drawPrintOnPart(ctx, canvas.width, printCanvas, bounds);

  return canvas;
};

export { mergePartAlbedo };
