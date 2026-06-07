import { FONTS_CONFIGURATION } from '@constants';

import { NAME_REFERENCE_FONT_SIZE } from '../garmentPrint/nameStampConstants';

interface DrawNameMaskGeometryInput {
  text: string;
  font: string;
}

const FONT_FAMILY_BY_NAME = Object.fromEntries(FONTS_CONFIGURATION.map((font) => [font.name, font.fontFamily]));

const resolveFontFamily = (fontName: string) => FONT_FAMILY_BY_NAME[fontName] ?? fontName;

const drawNameMaskGeometry = (ctx: CanvasRenderingContext2D, instance: DrawNameMaskGeometryInput, canvasWidth: number, canvasHeight: number) => {
  if (!instance.text.trim()) return;

  const fontFamily = resolveFontFamily(instance.font);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.font = `${NAME_REFERENCE_FONT_SIZE}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(instance.text, 0, 0);
  ctx.restore();
};

export { drawNameMaskGeometry };
export type { DrawNameMaskGeometryInput };
