import type { LayerContext } from '../types';

const applyBaseColorLayer = ({ ctx, width, height, input, partId }: LayerContext) => {
  const part = partId ? input.colorParts.find((item) => item.id === partId) : null;
  const color = part?.color ?? '#ffffff';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
};

export { applyBaseColorLayer };
