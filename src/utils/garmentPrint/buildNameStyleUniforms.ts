import type { NameInstance } from '@store';

import { NAME_REFERENCE_FONT_SIZE, NAME_STAMP_UV } from './nameStampConstants';
import { NAME_SLOT_COUNT } from './nameSlotConstants';

type NameSlotFloat4 = [number, number, number, number];
type NameSlotColor4 = [string, string, string, string];
type NameSlotVec2 = [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, { x: number; y: number }];

interface NameStyleUniforms {
  stampUv: { x: number; y: number };
  anchorUv: NameSlotVec2;
  rotation: NameSlotFloat4;
  scale: NameSlotFloat4;
  strokeWidth: NameSlotFloat4;
  textColors: NameSlotColor4;
  strokeColors: NameSlotColor4;
}

const DEFAULT_NAME_COLOR = '#000000';
const DEFAULT_NAME_STROKE = '#ffffff';

const buildNameStyleUniforms = (instances: NameInstance[]): NameStyleUniforms => {
  const anchorUv: NameSlotVec2 = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  const rotation: NameSlotFloat4 = [0, 0, 0, 0];
  const scale: NameSlotFloat4 = [1, 1, 1, 1];
  const strokeWidth: NameSlotFloat4 = [0, 0, 0, 0];
  const textColors: NameSlotColor4 = [DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR, DEFAULT_NAME_COLOR];
  const strokeColors: NameSlotColor4 = [DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE, DEFAULT_NAME_STROKE];

  instances.slice(0, NAME_SLOT_COUNT).forEach((instance, index) => {
    anchorUv[index] = instance.uv;
    rotation[index] = (instance.rotation * Math.PI) / 180;
    scale[index] = instance.fontSize / NAME_REFERENCE_FONT_SIZE;
    strokeWidth[index] = instance.strokeWidth;
    textColors[index] = instance.textColor;
    strokeColors[index] = instance.strokeColor;
  });

  return {
    stampUv: NAME_STAMP_UV,
    anchorUv,
    rotation,
    scale,
    strokeWidth,
    textColors,
    strokeColors,
  };
};

export { buildNameStyleUniforms };
export type { NameSlotColor4, NameSlotFloat4, NameSlotVec2, NameStyleUniforms };
