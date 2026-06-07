import { FONTS_CONFIGURATION } from '@constants';

import { NAME_REFERENCE_FONT_SIZE } from '../garmentPrint/nameStampConstants';

interface DrawNameStrokeMaskGeometryInput {
  text: string;
  font: string;
  strokeWidth: number;
  fontSize: number;
}

const FONT_FAMILY_BY_NAME = Object.fromEntries(FONTS_CONFIGURATION.map((font) => [font.name, font.fontFamily]));

const resolveFontFamily = (fontName: string) => FONT_FAMILY_BY_NAME[fontName] ?? fontName;

const resolveReferenceStrokeWidth = (strokeWidth: number, fontSize: number) => strokeWidth * (NAME_REFERENCE_FONT_SIZE / Math.max(fontSize, 1));

const drawNameStrokeMaskGeometry = (ctx: CanvasRenderingContext2D, instance: DrawNameStrokeMaskGeometryInput, canvasWidth: number, canvasHeight: number) => {
  if (!instance.text.trim() || instance.strokeWidth <= 0) return;

  const fontFamily = resolveFontFamily(instance.font);
  const lineWidth = resolveReferenceStrokeWidth(instance.strokeWidth, instance.fontSize);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.font = `${NAME_REFERENCE_FONT_SIZE}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.miterLimit = 2;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeText(instance.text, 0, 0);
  ctx.restore();
};

export { drawNameStrokeMaskGeometry, resolveReferenceStrokeWidth };
export type { DrawNameStrokeMaskGeometryInput };
