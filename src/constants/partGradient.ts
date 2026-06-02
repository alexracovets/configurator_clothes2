import type { Uv0PartKey } from './uv0Bounds';

interface PartGradientDefaults {
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

const resolvePartKeyFromPartId = (partId: string): Uv0PartKey | null => {
  const normalized = partId.toLowerCase();
  if (normalized.includes('sleeve_left')) return 'sleeve_left';
  if (normalized.includes('sleeve_right')) return 'sleeve_right';
  if (normalized.includes('front')) return 'front';
  if (normalized.includes('back')) return 'back';
  return null;
};

const SLEEVE_LEFT_GRADIENT_DEFAULTS: PartGradientDefaults = {
  rotation: 214,
  position: 35,
  softness: 50,
  opacity: 100,
};

const SLEEVE_RIGHT_GRADIENT_DEFAULTS: PartGradientDefaults = {
  ...SLEEVE_LEFT_GRADIENT_DEFAULTS,
};

const BODY_GRADIENT_DEFAULTS: PartGradientDefaults = {
  rotation: 0,
  position: 50,
  softness: 35,
  opacity: 100,
};

const PART_GRADIENT_ROTATION_OFFSET: Record<Exclude<Uv0PartKey, 'full'>, number> = {
  back: 0,
  front: 180,
  sleeve_left: 45,
  sleeve_right: 45,
};

const shouldMirrorPartGradientU = (partId: string) => resolvePartKeyFromPartId(partId) === 'sleeve_right';

const PART_GRADIENT_DEFAULTS: Partial<Record<Uv0PartKey, PartGradientDefaults>> = {
  back: BODY_GRADIENT_DEFAULTS,
  front: BODY_GRADIENT_DEFAULTS,
  sleeve_left: SLEEVE_LEFT_GRADIENT_DEFAULTS,
  sleeve_right: SLEEVE_RIGHT_GRADIENT_DEFAULTS,
};

const resolvePartGradientRotation = (partId: string, rotation: number) => {
  const key = resolvePartKeyFromPartId(partId);
  if (!key) return rotation;
  if (key === 'full') return rotation;
  return rotation + PART_GRADIENT_ROTATION_OFFSET[key];
};

const resolvePartGradientDefaults = (partId: string): PartGradientDefaults => {
  const key = resolvePartKeyFromPartId(partId);
  if (!key) return BODY_GRADIENT_DEFAULTS;
  return PART_GRADIENT_DEFAULTS[key] ?? BODY_GRADIENT_DEFAULTS;
};

export {
  BODY_GRADIENT_DEFAULTS,
  PART_GRADIENT_DEFAULTS,
  PART_GRADIENT_ROTATION_OFFSET,
  resolvePartGradientDefaults,
  resolvePartGradientRotation,
  resolvePartKeyFromPartId,
  shouldMirrorPartGradientU,
  SLEEVE_LEFT_GRADIENT_DEFAULTS,
  SLEEVE_RIGHT_GRADIENT_DEFAULTS,
};
export type { PartGradientDefaults };
