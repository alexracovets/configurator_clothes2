import { FONTS_CONFIGURATION } from '@constants';

import { NAME_REFERENCE_FONT_SIZE, NAME_STAMP_UV } from '../garmentPrint/nameStampConstants';

interface DrawNameMaskGeometryInput {
  text: string;
  font: string;
}

const FONT_FAMILY_BY_NAME = Object.fromEntries(FONTS_CONFIGURATION.map((font) => [font.name, font.fontFamily]));

const resolveFontFamily = (fontName: string) => FONT_FAMILY_BY_NAME[fontName] ?? fontName;

// Лише форма гліфів; колір, розмір і обводка — GPU uniforms.
const drawNameMaskGeometry = (ctx: CanvasRenderingContext2D, instance: DrawNameMaskGeometryInput, atlasWidth: number, atlasHeight: number) => {
  if (!instance.text.trim()) return;

  const x = NAME_STAMP_UV.x * atlasWidth;
  const y = NAME_STAMP_UV.y * atlasHeight;
  const fontFamily = resolveFontFamily(instance.font);

  ctx.save();
  ctx.translate(x, y);
  ctx.font = `${NAME_REFERENCE_FONT_SIZE}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(instance.text, 0, 0);
  ctx.restore();
};

export { drawNameMaskGeometry };
export type { DrawNameMaskGeometryInput };
