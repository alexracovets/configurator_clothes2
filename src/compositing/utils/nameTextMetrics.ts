const NAME_FONT_SCALE = 2.0;

type NameGlyphLayout = {
  fontSize: number;
  glyphW: number;
  glyphH: number;
  drawX: number;
  drawY: number;
  displayHalfW: number;
  displayHalfH: number;
};

let _measureCtx: CanvasRenderingContext2D | null | undefined;
const getMeasureCtx = (): CanvasRenderingContext2D | null => {
  if (_measureCtx === undefined) {
    _measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  return _measureCtx;
};

/** Ink bounds from measureText — symmetric box when drawn at drawY with alphabetic baseline. */
const measureNameGlyph = (text: string, fontFamily: string, fontSizePt: number, strokeWidthPt: number): NameGlyphLayout | null => {
  const mc = getMeasureCtx();
  if (!mc) return null;

  const fontSize = Math.round(fontSizePt * NAME_FONT_SCALE);
  const strokeWidth = strokeWidthPt * NAME_FONT_SCALE;
  const pad = strokeWidth + 4;

  mc.font = `bold ${fontSize}px "${fontFamily}"`;
  mc.textBaseline = 'alphabetic';
  const metrics = mc.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
  const inkH = ascent + descent;

  const glyphW = Math.max(2, Math.ceil(metrics.width + pad * 2));
  const glyphH = Math.max(2, Math.ceil(inkH + pad * 2));

  return {
    fontSize,
    glyphW,
    glyphH,
    drawX: glyphW / 2,
    drawY: pad + ascent,
    displayHalfW: glyphW / (2 * NAME_FONT_SCALE),
    displayHalfH: glyphH / (2 * NAME_FONT_SCALE),
  };
};

const drawNameGlyph = (
  ctx: CanvasRenderingContext2D,
  text: string,
  layout: NameGlyphLayout,
  fontFamily: string,
  fill: string,
  strokeColor: string,
  strokeWidthPt: number,
): void => {
  const strokeWidth = strokeWidthPt * NAME_FONT_SCALE;
  ctx.font = `bold ${layout.fontSize}px "${fontFamily}"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  if (strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth * 2;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, layout.drawX, layout.drawY);
  }
  ctx.fillStyle = fill;
  ctx.fillText(text, layout.drawX, layout.drawY);
};

export { NAME_FONT_SCALE, measureNameGlyph, drawNameGlyph };
export type { NameGlyphLayout };
