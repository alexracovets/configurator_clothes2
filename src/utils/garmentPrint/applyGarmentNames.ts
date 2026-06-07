import { Color, type MeshStandardMaterial, type Texture, Vector2, Vector4 } from 'three';

import type { NameStyleUniforms } from './buildNameStyleUniforms';

interface GarmentNameMaskState {
  fillMask: Texture;
  strokeMask: Texture;
}

let pendingNameMasks: GarmentNameMaskState | null = null;
let pendingNameStyle: NameStyleUniforms | null = null;

const applyNameMasksToUniforms = (material: MeshStandardMaterial, state: GarmentNameMaskState) => {
  const fillUniform = material.userData.uNameFillMaskUniform as { value: Texture } | undefined;
  if (fillUniform) fillUniform.value = state.fillMask;

  const strokeUniform = material.userData.uNameStrokeMaskUniform as { value: Texture } | undefined;
  if (strokeUniform) strokeUniform.value = state.strokeMask;
};

const applyNameStyleToUniforms = (material: MeshStandardMaterial, style: NameStyleUniforms) => {
  const stampSizeUniform = material.userData.uNameStampSizeUniform as { value: Vector2 } | undefined;
  if (stampSizeUniform) stampSizeUniform.value.set(style.stampSize.width, style.stampSize.height);

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

  const slotActiveUniform = material.userData.uNameSlotActiveUniform as { value: number[] } | undefined;
  if (slotActiveUniform) {
    style.slotActive.forEach((value, index) => {
      slotActiveUniform.value[index] = value;
    });
  }

  const partBoundsUniform = material.userData.uNamePartBoundsUniform as { value: Vector4[] } | undefined;
  if (partBoundsUniform) {
    style.partBounds.forEach((bounds, index) => {
      partBoundsUniform.value[index].set(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
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
    uNameStrokeMask: { value: Texture };
    uNameStampSize: { value: Vector2 };
    uNameAnchorUv: { value: Vector2[] };
    uNameRotation: { value: number[] };
    uNameScale: { value: number[] };
    uNameSlotActive: { value: number[] };
    uNamePartBounds: { value: Vector4[] };
    uNameTextColors: { value: Color[] };
    uNameStrokeColors: { value: Color[] };
  },
) => {
  const maskState = (material.userData.garmentNameMaskState as GarmentNameMaskState | undefined) ?? pendingNameMasks;
  const styleState = (material.userData.garmentNameStyleState as NameStyleUniforms | undefined) ?? pendingNameStyle;

  if (maskState) {
    uniforms.uNameFillMask.value = maskState.fillMask;
    uniforms.uNameStrokeMask.value = maskState.strokeMask;
    material.userData.garmentNameMaskState = maskState;
    material.userData.uNameFillMaskUniform = uniforms.uNameFillMask;
    material.userData.uNameStrokeMaskUniform = uniforms.uNameStrokeMask;
  }

  if (styleState) {
    applyNameStyleToUniforms(material, styleState);
    material.userData.garmentNameStyleState = styleState;
    material.userData.uNameStampSizeUniform = uniforms.uNameStampSize;
    material.userData.uNameAnchorUvUniform = uniforms.uNameAnchorUv;
    material.userData.uNameRotationUniform = uniforms.uNameRotation;
    material.userData.uNameScaleUniform = uniforms.uNameScale;
    material.userData.uNameSlotActiveUniform = uniforms.uNameSlotActive;
    material.userData.uNamePartBoundsUniform = uniforms.uNamePartBounds;
    material.userData.uNameTextColorsUniform = uniforms.uNameTextColors;
    material.userData.uNameStrokeColorsUniform = uniforms.uNameStrokeColors;
  }
};

export { applyGarmentNameMasks, applyGarmentNameStyle, applyGarmentPrintAtlasSize, hydrateGarmentNameUniforms };
export type { GarmentNameMaskState };
