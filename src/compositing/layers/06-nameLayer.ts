import type { LayerContext } from '../types';
import { drawNameOnPart } from '../utils/drawNameOnPart';

const resolvePartZone = (positionKey: string): string => {
  const key = positionKey.toLowerCase();
  if (key.includes('back')) return 'back';
  if (key.includes('front')) return 'front';
  if (key.includes('sleeve_left') || key.includes('left')) return 'sleeve_left';
  if (key.includes('sleeve_right') || key.includes('right')) return 'sleeve_right';
  return 'back';
};

const applyNameLayer = ({ ctx, width, input, partId }: LayerContext): void => {
  if (!input.nameParts || input.nameParts.length === 0) return;
  if (!partId) return;

  const partZone = partId.toLowerCase().includes('back')
    ? 'back'
    : partId.toLowerCase().includes('front')
      ? 'front'
      : partId.toLowerCase().includes('sleeve_left')
        ? 'sleeve_left'
        : partId.toLowerCase().includes('sleeve_right')
          ? 'sleeve_right'
          : null;

  if (!partZone) return;

  for (const part of input.nameParts) {
    if (resolvePartZone(part.positionKey) !== partZone) continue;
    drawNameOnPart(ctx, part, width);
  }
};

export { applyNameLayer };
