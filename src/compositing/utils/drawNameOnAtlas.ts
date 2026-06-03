import type { StepNamePartState } from '@store';
import { UV0_BOUNDS } from '@constants';

import { uvToCanvas } from './uvCanvas';
import { drawNameGlyph, measureNameGlyph, NAME_FONT_SCALE } from './nameTextMetrics';

// Map part-local UV (0–1) to print atlas UV using the part's UV0 bounds.
// "back" position key maps to back bounds etc.
const resolveAtlasUv = (partLocalUv: { x: number; y: number }, positionKey: string): { x: number; y: number } => {
  const key = positionKey.toLowerCase().includes('back')
    ? 'back'
    : positionKey.toLowerCase().includes('front')
      ? 'front'
      : positionKey.toLowerCase().includes('sleeve_left')
        ? 'sleeve_left'
        : positionKey.toLowerCase().includes('sleeve_right')
          ? 'sleeve_right'
          : null;

  if (!key || !(key in UV0_BOUNDS)) return partLocalUv;

  const bounds = UV0_BOUNDS[key as keyof typeof UV0_BOUNDS];
  return {
    x: bounds.minX + partLocalUv.x * (bounds.maxX - bounds.minX),
    y: bounds.minY + partLocalUv.y * (bounds.maxY - bounds.minY),
  };
};

/** Render text to an offscreen canvas at 2× scale for sharpness, then composite onto atlas. */
const drawNameOnAtlas = (ctx: CanvasRenderingContext2D, part: StepNamePartState, atlasWidth: number, atlasHeight: number): void => {
  const text = part.text || 'PLAYER NAME';
  const layout = measureNameGlyph(text, part.font, part.fontSize, part.strokeWidth);
  if (!layout) return;

  const offscreen = document.createElement('canvas');
  offscreen.width = layout.glyphW;
  offscreen.height = layout.glyphH;
  const octx = offscreen.getContext('2d')!;
  drawNameGlyph(octx, text, layout, part.font, part.textColor, part.strokeColor, part.strokeWidth);

  const atlasUv = resolveAtlasUv(part.uv, part.positionKey);
  const { x, y } = uvToCanvas(atlasUv, atlasWidth, atlasHeight);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((part.rotation * Math.PI) / 180);
  ctx.drawImage(offscreen, -layout.displayHalfW, -layout.displayHalfH, layout.glyphW / NAME_FONT_SCALE, layout.glyphH / NAME_FONT_SCALE);
  ctx.restore();
};

export { drawNameOnAtlas };
