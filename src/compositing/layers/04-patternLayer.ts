import type { PrintLayerContext } from '../types';

import { loadImage } from '../canvas/loadImage';

const tintCanvas = (source: HTMLImageElement, color: string, w: number, h: number): HTMLCanvasElement => {
  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext('2d')!;

  ctx.drawImage(source, 0, 0, w, h);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);

  return offscreen;
};

const applyPatternLayer = async ({ ctx, input }: PrintLayerContext) => {
  const { activePattern: pattern, activePatternCustomization: customization } = input;
  if (!pattern || !customization) return;

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.save();
  ctx.globalAlpha = customization.opacity;

  for (const part of pattern.parts) {
    const image = await loadImage(part.src);
    const color = customization.colors[part.key];

    if (color) {
      const tinted = tintCanvas(image, color, w, h);
      ctx.drawImage(tinted, 0, 0, w, h);
    } else {
      ctx.drawImage(image, 0, 0, w, h);
    }
  }

  ctx.restore();
};

export { applyPatternLayer };
