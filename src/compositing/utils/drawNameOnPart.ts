import type { StepNamePartState } from '@store';

const FONT_SCALE = 2.0;

let _measureCtx: CanvasRenderingContext2D | null | undefined;
const getMeasureCtx = (): CanvasRenderingContext2D | null => {
  if (_measureCtx === undefined) {
    _measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  return _measureCtx;
};

/**
 * Draw name text onto a per-part canvas using part-local UV coordinates (0–1).
 * UV origin is bottom-left (same as UV unwrap), Y is flipped for canvas (top-left origin).
 */
const drawNameOnPart = (ctx: CanvasRenderingContext2D, part: StepNamePartState, canvasSize: number): void => {
  const mc = getMeasureCtx();
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

  // UV origin is bottom-left; canvas origin is top-left → flip Y.
  const cx = part.uv.x * canvasSize;
  const cy = (1 - part.uv.y) * canvasSize;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((part.rotation * Math.PI) / 180);
  ctx.drawImage(offscreen, -glyphW / (2 * FONT_SCALE), -glyphH / (2 * FONT_SCALE), glyphW / FONT_SCALE, glyphH / FONT_SCALE);
  ctx.restore();
};

export { drawNameOnPart };
