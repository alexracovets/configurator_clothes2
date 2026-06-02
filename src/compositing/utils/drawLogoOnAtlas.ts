import { PRINT_ATLAS_HEIGHT, PRINT_ATLAS_WIDTH } from '../constants';

import { loadImage } from '../canvas/loadImage';
import type { StepLogoPartState } from '@store';

import { uvToCanvas } from './uvCanvas';

const LOGO_MARK_REF_WIDTH = 283;
const LOGO_MARK_BASE_WIDTH = Math.round((LOGO_MARK_REF_WIDTH / 9331) * PRINT_ATLAS_WIDTH);

const LOGO_VERTICAL_REF_HEIGHT = 482;
const LOGO_VERTICAL_BASE_HEIGHT = Math.round((LOGO_VERTICAL_REF_HEIGHT / 4900) * PRINT_ATLAS_HEIGHT);

const isBackLogoPart = (part: StepLogoPartState) => part.positionKey.toLowerCase().includes('back') || part.label.toLowerCase().includes('back');

const resolveLogoDrawSize = (part: StepLogoPartState, image: HTMLImageElement) => {
  const scale = part.baseScale * part.scale;
  const aspect = image.naturalWidth / image.naturalHeight || 1;

  if (isBackLogoPart(part)) {
    const drawHeight = LOGO_VERTICAL_BASE_HEIGHT * scale;
    return { drawWidth: drawHeight * aspect, drawHeight };
  }

  const drawWidth = LOGO_MARK_BASE_WIDTH * scale;
  return { drawWidth, drawHeight: drawWidth / aspect };
};

const drawLogoOnAtlas = async (ctx: CanvasRenderingContext2D, part: StepLogoPartState, canvasWidth: number, canvasHeight: number) => {
  if (!part.visible) return;

  const image = await loadImage(part.src);
  const { drawWidth, drawHeight } = resolveLogoDrawSize(part, image);
  const { x, y } = uvToCanvas(part.uv, canvasWidth, canvasHeight);

  ctx.save();
  ctx.globalAlpha = part.opacity;
  ctx.translate(x, y);
  ctx.rotate((part.rotation * Math.PI) / 180);
  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
};

export { drawLogoOnAtlas };
