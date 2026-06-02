import type { PrintLayerContext } from '../types';

import { drawLogoOnAtlas } from '../utils/drawLogoOnAtlas';

const applyLogoLayer = async ({ ctx, canvas, input }: PrintLayerContext) => {
  const userLogos = input.logoParts.filter((part) => part.visible && !part.isDefault);
  if (userLogos.length === 0) return;

  for (const part of userLogos) {
    await drawLogoOnAtlas(ctx, part, canvas.width, canvas.height);
  }
};

export { applyLogoLayer };
