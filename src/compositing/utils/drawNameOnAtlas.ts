import type { StepNamePartState } from '@store';
import { UV0_BOUNDS } from '@constants';

import { uvToCanvas } from './uvCanvas';

const FONT_SCALE = 2.0;

// Measure context for text metrics — created once, server-safe.
let _measureCtx: CanvasRenderingContext2D | null | undefined;
const measureCtx = (): CanvasRenderingContext2D | null => {
  if (_measureCtx === undefined) {
    _measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  return _measureCtx;
};

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
  const mc = measureCtx();
  if (!mc) return;

  const text = part.text || 'PLAYER NAME';
  const fontFamily = part.font;
  const fontSize = Math.round(part.fontSize * FONT_SCALE);
  const strokeWidth = part.strokeWidth * FONT_SCALE;

  mc.font = `bold ${fontSize}px "${fontFamily}"`;
  const metrics = mc.measureText(text);
  const textW = metrics.width;
  const textH = fontSize * 1.1;
  const pad = strokeWidth + 4;

  const glyphW = Math.max(2, Math.ceil(textW + pad * 2));
  const glyphH = Math.max(2, Math.ceil(textH + pad * 2));

  const offscreen = document.createElement('canvas');
  offscreen.width = glyphW;
  offscreen.height = glyphH;
  const octx = offscreen.getContext('2d')!;

  octx.font = `bold ${fontSize}px "${fontFamily}"`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';

  if (strokeWidth > 0) {
    octx.strokeStyle = part.strokeColor;
    octx.lineWidth = strokeWidth * 2;
    octx.lineJoin = 'round';
    octx.strokeText(text, glyphW / 2, glyphH / 2);
  }
  octx.fillStyle = part.textColor;
  octx.fillText(text, glyphW / 2, glyphH / 2);

  // Convert part-local UV to atlas UV, then to canvas pixel coords.
  const atlasUv = resolveAtlasUv(part.uv, part.positionKey);
  const { x, y } = uvToCanvas(atlasUv, atlasWidth, atlasHeight);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((part.rotation * Math.PI) / 180);
  ctx.drawImage(offscreen, -glyphW / (2 * FONT_SCALE), -glyphH / (2 * FONT_SCALE), glyphW / FONT_SCALE, glyphH / FONT_SCALE);
  ctx.restore();
};

export { drawNameOnAtlas };
