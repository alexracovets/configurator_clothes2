import type { UvBounds } from '@constants';

/** Crops the global print atlas (UV0 space) onto a square part texture (0–1). */
const drawPrintOnPart = (ctx: CanvasRenderingContext2D, size: number, printCanvas: HTMLCanvasElement, bounds: UvBounds) => {
  const pw = printCanvas.width;
  const ph = printCanvas.height;
  const sx = bounds.minX * pw;
  const sy = bounds.minY * ph;
  const sw = (bounds.maxX - bounds.minX) * pw;
  const sh = (bounds.maxY - bounds.minY) * ph;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(printCanvas, sx, sy, sw, sh, 0, 0, size, size);
  ctx.restore();
};

export { drawPrintOnPart };
