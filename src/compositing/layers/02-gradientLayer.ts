import { resolvePartGradientRotation, shouldMirrorPartGradientU } from '@constants';

import type { LayerContext } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return `rgba(0, 0, 0, ${clamp(alpha, 0, 1)})`;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
};

/** Linear gradient along part UV 0–1 (center ± 0.5·dir), same basis as shirtGradientMask in the reference shader. */
const createPartUvGradientLine = (width: number, height: number, rotationDeg: number) => {
  const angleRad = (rotationDeg * Math.PI) / 180;
  const dirX = Math.cos(angleRad);
  const dirY = Math.sin(angleRad);

  return {
    x0: (0.5 - dirX * 0.5) * width,
    y0: (0.5 - dirY * 0.5) * height,
    x1: (0.5 + dirX * 0.5) * width,
    y1: (0.5 + dirY * 0.5) * height,
  };
};

const applyGradientLayer = ({ ctx, width, height, input, partId }: LayerContext) => {
  if (!partId) return;

  const shadingPart = input.shadingParts.find((item) => item.id === partId);
  if (!shadingPart?.enabled) return;

  const rotation = resolvePartGradientRotation(partId, shadingPart.rotation);
  const line = createPartUvGradientLine(width, height, rotation);
  const mirrorU = shouldMirrorPartGradientU(partId);
  const x0 = mirrorU ? width - line.x0 : line.x0;
  const y0 = line.y0;
  const x1 = mirrorU ? width - line.x1 : line.x1;
  const y1 = line.y1;

  const mid = clamp(shadingPart.position, 0, 100) / 100;
  const spread = (clamp(shadingPart.softness, 0, 100) / 100) * 0.5;
  const stop0 = Math.max(0, mid - spread);
  const stop1 = Math.min(1, Math.max(mid + spread, stop0 + 0.001));
  const opacity = clamp(shadingPart.opacity, 0, 100) / 100;

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(stop0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(stop1, hexToRgba(shadingPart.colorPicked, 1));
  gradient.addColorStop(1, hexToRgba(shadingPart.colorPicked, 1));

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
};

export { applyGradientLayer, createPartUvGradientLine };
