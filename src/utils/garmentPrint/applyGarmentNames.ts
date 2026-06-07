import { Color, type MeshStandardMaterial, type Texture, Vector2 } from 'three';

import type { NameStyleUniforms } from './buildNameStyleUniforms';

interface GarmentNameMaskState {
  fillMask: Texture;
}

let pendingNameMasks: GarmentNameMaskState | null = null;
let pendingNameStyle: NameStyleUniforms | null = null;

const applyNameMasksToUniforms = (material: MeshStandardMaterial, state: GarmentNameMaskState) => {
  const fillUniform = material.userData.uNameFillMaskUniform as { value: Texture } | undefined;
  if (fillUniform) fillUniform.value = state.fillMask;
};

const applyNameStyleToUniforms = (material: MeshStandardMaterial, style: NameStyleUniforms) => {
  const stampUniform = material.userData.uNameStampUvUniform as { value: Vector2 } | undefined;
  if (stampUniform) stampUniform.value.set(style.stampUv.x, style.stampUv.y);

  const anchorUniform = material.userData.uNameAnchorUvUniform as { value: Vector2[] } | undefined;
  if (anchorUniform) {
    style.anchorUv.forEach((anchor, index) => {
      anchorUniform.value[index].set(anchor.x, anchor.y);
    });
  }

  const rotationUniform = material.userData.uNameRotationUniform as { value: number[] } | undefined;
  if (rotationUniform) {
    style.rotation.forEach((value, index) => {
      rotationUniform.value[index] = value;
    });
  }

  const scaleUniform = material.userData.uNameScaleUniform as { value: number[] } | undefined;
  if (scaleUniform) {
    style.scale.forEach((value, index) => {
      scaleUniform.value[index] = value;
    });
  }

  const strokeWidthUniform = material.userData.uNameStrokeWidthUniform as { value: number[] } | undefined;
  if (strokeWidthUniform) {
    style.strokeWidth.forEach((value, index) => {
      strokeWidthUniform.value[index] = value;
    });
  }

  const textUniforms = material.userData.uNameTextColorsUniform as { value: Color[] } | undefined;
  if (textUniforms) {
    style.textColors.forEach((color, index) => {
      textUniforms.value[index].set(color);
    });
  }

  const strokeUniforms = material.userData.uNameStrokeColorsUniform as { value: Color[] } | undefined;
  if (strokeUniforms) {
    style.strokeColors.forEach((color, index) => {
      strokeUniforms.value[index].set(color);
    });
  }
};

const applyGarmentNameMasks = (material: MeshStandardMaterial, state: GarmentNameMaskState) => {
  pendingNameMasks = state;
  material.userData.garmentNameMaskState = state;
  applyNameMasksToUniforms(material, state);
};

const applyGarmentNameStyle = (material: MeshStandardMaterial, style: NameStyleUniforms) => {
  pendingNameStyle = style;
  material.userData.garmentNameStyleState = style;
  applyNameStyleToUniforms(material, style);
};

const applyGarmentPrintAtlasSize = (material: MeshStandardMaterial, width: number, height: number) => {
  const atlasUniform = material.userData.uPrintAtlasSizeUniform as { value: Vector2 } | undefined;
  if (atlasUniform) atlasUniform.value.set(width, height);
};

const hydrateGarmentNameUniforms = (
  material: MeshStandardMaterial,
  uniforms: {
    uNameFillMask: { value: Texture };
    uNameStampUv: { value: Vector2 };
    uNameAnchorUv: { value: Vector2[] };
    uNameRotation: { value: number[] };
    uNameScale: { value: number[] };
    uNameStrokeWidth: { value: number[] };
    uNameTextColors: { value: Color[] };
    uNameStrokeColors: { value: Color[] };
  },
) => {
  const maskState = (material.userData.garmentNameMaskState as GarmentNameMaskState | undefined) ?? pendingNameMasks;
  const styleState = (material.userData.garmentNameStyleState as NameStyleUniforms | undefined) ?? pendingNameStyle;

  if (maskState) {
    uniforms.uNameFillMask.value = maskState.fillMask;
    material.userData.garmentNameMaskState = maskState;
    material.userData.uNameFillMaskUniform = uniforms.uNameFillMask;
  }

  if (styleState) {
    applyNameStyleToUniforms(material, styleState);
    material.userData.garmentNameStyleState = styleState;
    material.userData.uNameStampUvUniform = uniforms.uNameStampUv;
    material.userData.uNameAnchorUvUniform = uniforms.uNameAnchorUv;
    material.userData.uNameRotationUniform = uniforms.uNameRotation;
    material.userData.uNameScaleUniform = uniforms.uNameScale;
    material.userData.uNameStrokeWidthUniform = uniforms.uNameStrokeWidth;
    material.userData.uNameTextColorsUniform = uniforms.uNameTextColors;
    material.userData.uNameStrokeColorsUniform = uniforms.uNameStrokeColors;
  }
};

export { applyGarmentNameMasks, applyGarmentNameStyle, applyGarmentPrintAtlasSize, hydrateGarmentNameUniforms };
export type { GarmentNameMaskState };
