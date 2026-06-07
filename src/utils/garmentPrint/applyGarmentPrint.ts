import { Color, type MeshStandardMaterial, type Texture } from 'three';

import { getEmptyPrintTexture } from './emptyPrintTexture';

const PATTERN_LAYER_COUNT = 2;

type PatternColorPair = [string, string];
type PatternMaskPair = [Texture, Texture];

interface GarmentPrintState {
  defaultLogos: Texture;
  patternMasks: PatternMaskPair;
  patternColors: PatternColorPair;
  patternOpacity: number;
}

const emptyMaskPair = (): PatternMaskPair => {
  const empty = getEmptyPrintTexture();
  return [empty, empty];
};

const applyGarmentPrint = (material: MeshStandardMaterial, state: GarmentPrintState) => {
  material.userData.garmentPrintState = state;

  const logosUniform = material.userData.uDefaultLogosUniform as { value: Texture } | undefined;
  if (logosUniform) logosUniform.value = state.defaultLogos;

  const mask0Uniform = material.userData.uPatternMask0Uniform as { value: Texture } | undefined;
  if (mask0Uniform) mask0Uniform.value = state.patternMasks[0];

  const mask1Uniform = material.userData.uPatternMask1Uniform as { value: Texture } | undefined;
  if (mask1Uniform) mask1Uniform.value = state.patternMasks[1];

  applyGarmentPatternTints(material, state.patternColors, state.patternOpacity);
};

const applyGarmentPatternTints = (material: MeshStandardMaterial, patternColors: PatternColorPair, patternOpacity: number) => {
  const state = material.userData.garmentPrintState as GarmentPrintState | undefined;
  if (state) {
    material.userData.garmentPrintState = { ...state, patternColors, patternOpacity };
  }

  const color0Uniform = material.userData.uPatternColor0Uniform as { value: Color } | undefined;
  if (color0Uniform) color0Uniform.value.set(patternColors[0]);

  const color1Uniform = material.userData.uPatternColor1Uniform as { value: Color } | undefined;
  if (color1Uniform) color1Uniform.value.set(patternColors[1]);

  const opacityUniform = material.userData.uPatternOpacityUniform as { value: number } | undefined;
  if (opacityUniform) opacityUniform.value = patternOpacity;
};

export { applyGarmentPatternTints, applyGarmentPrint, emptyMaskPair, PATTERN_LAYER_COUNT };
export type { GarmentPrintState, PatternColorPair, PatternMaskPair };
