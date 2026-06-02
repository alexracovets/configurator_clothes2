import type { PrintLayerContext } from '../types';

import { loadImage } from '../canvas/loadImage';

const applyPatternLayer = async ({ ctx, input }: PrintLayerContext) => {
  const { activePattern: pattern, activePatternCustomization: customization } = input;
  if (!pattern || !customization) return;

  ctx.save();
  ctx.globalAlpha = customization.opacity;

  for (const part of pattern.parts) {
    const image = await loadImage(part.src);
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.restore();
};

export { applyPatternLayer };
