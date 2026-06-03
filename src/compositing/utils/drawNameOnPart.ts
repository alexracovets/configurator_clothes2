import type { StepNamePartState } from '@store';

import { drawNameGlyph, measureNameGlyph, NAME_FONT_SCALE } from './nameTextMetrics';

/**
 * Draw name text onto a per-part canvas using part-local UV coordinates (0–1).
 * UV origin is bottom-left (same as UV unwrap), Y is flipped for canvas (top-left origin).
 */
const drawNameOnPart = (ctx: CanvasRenderingContext2D, part: StepNamePartState, canvasSize: number): void => {
  const text = part.text || 'PLAYER NAME';
  const layout = measureNameGlyph(text, part.font, part.fontSize, part.strokeWidth);
  if (!layout) return;

  const offscreen = document.createElement('canvas');
  offscreen.width = layout.glyphW;
  offscreen.height = layout.glyphH;
  const octx = offscreen.getContext('2d')!;
  drawNameGlyph(octx, text, layout, part.font, part.textColor, part.strokeColor, part.strokeWidth);

  const cx = part.uv.x * canvasSize;
  const cy = (1 - part.uv.y) * canvasSize;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((part.rotation * Math.PI) / 180);
  ctx.drawImage(offscreen, -layout.displayHalfW, -layout.displayHalfH, layout.glyphW / NAME_FONT_SCALE, layout.glyphH / NAME_FONT_SCALE);
  ctx.restore();
};

export { drawNameOnPart };
