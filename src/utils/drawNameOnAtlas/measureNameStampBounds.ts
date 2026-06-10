import { FONT_FAMILY_BY_NAME } from '@constants';

import { NAME_REFERENCE_FONT_SIZE, resolveMaxReferenceStrokeWidth } from '../garmentPrint/nameStampConstants';

interface StampPixelSize {
  width: number;
  height: number;
}

const STAMP_BOUNDS_PADDING = 20;

const resolveFontFamily = (fontName: string) => FONT_FAMILY_BY_NAME[fontName] ?? fontName;

const measureNameStampPixelSize = (text: string, font: string, measureCtx: CanvasRenderingContext2D): StampPixelSize | null => {
  if (!text.trim()) return null;

  const fontFamily = resolveFontFamily(font);
  measureCtx.font = `${NAME_REFERENCE_FONT_SIZE}px ${fontFamily}`;

  const metrics = measureCtx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent ?? NAME_REFERENCE_FONT_SIZE * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? NAME_REFERENCE_FONT_SIZE * 0.2;
  const strokePad = Math.ceil(resolveMaxReferenceStrokeWidth() / 2);
  const pad = STAMP_BOUNDS_PADDING + strokePad;

  return {
    width: Math.max(1, Math.ceil(metrics.width + pad * 2)),
    height: Math.max(1, Math.ceil(ascent + descent + pad * 2)),
  };
};

// Half-size (in reference-font px) of the selection frame for one name: the raw glyph box plus a small gap.
const GIZMO_FRAME_PADDING = 12;

const measureNameGizmoHalf = (text: string, font: string, measureCtx: CanvasRenderingContext2D): { x: number; y: number } | null => {
  if (!text.trim()) return null;

  const fontFamily = resolveFontFamily(font);
  measureCtx.font = `${NAME_REFERENCE_FONT_SIZE}px ${fontFamily}`;

  const metrics = measureCtx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent ?? NAME_REFERENCE_FONT_SIZE * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? NAME_REFERENCE_FONT_SIZE * 0.2;

  return {
    x: metrics.width / 2 + GIZMO_FRAME_PADDING,
    y: (ascent + descent) / 2 + GIZMO_FRAME_PADDING,
  };
};

const unionStampPixelSize = (sizes: StampPixelSize[]): StampPixelSize => {
  if (sizes.length === 0) {
    return { width: 1, height: 1 };
  }

  return {
    width: Math.max(...sizes.map((size) => size.width)),
    height: Math.max(...sizes.map((size) => size.height)),
  };
};

export { measureNameGizmoHalf, measureNameStampPixelSize, unionStampPixelSize };
export type { StampPixelSize };
