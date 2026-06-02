import type { PrintLayerContext } from '../types';

import { loadImage } from '../canvas/loadImage';

const applyDefaultPatternLayer = async ({ ctx, input }: PrintLayerContext) => {
  const { defaultPattern: pattern } = input;
  if (!pattern) return;

  ctx.save();
  ctx.globalAlpha = 1;

  for (const part of pattern.parts) {
    const image = await loadImage(part.src);
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.restore();
};

export { applyDefaultPatternLayer };
