import { Color, type MeshStandardMaterial, type Texture, Vector2, Vector4 } from 'three';

import type { NameStyleUniforms } from './buildNameStyleUniforms';

interface GarmentNameMaskState {
  fillMask: Texture;
  strokeMask: Texture;
}

interface GizmoFrameState {
  enabled: number;
  half: Array<{ x: number; y: number }>;
}

let pendingNameMasks: GarmentNameMaskState | null = null;
let pendingNameStyle: NameStyleUniforms | null = null;
let pendingGizmoFrame: GizmoFrameState | null = null;
let pendingGizmoIcons: Texture | null = null;

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

const applyGizmoFrameToUniforms = (material: MeshStandardMaterial, state: GizmoFrameState) => {
  const enabledUniform = material.userData.uNameGizmoEnabledUniform as { value: number } | undefined;
  if (enabledUniform) enabledUniform.value = state.enabled;

  const halfUniform = material.userData.uNameGizmoHalfUniform as { value: Vector2[] } | undefined;
  if (halfUniform) {
    state.half.forEach((half, index) => {
      halfUniform.value[index]?.set(half.x, half.y);
    });
  }
};

const applyGarmentGizmoFrame = (material: MeshStandardMaterial, state: GizmoFrameState) => {
  pendingGizmoFrame = state;
  material.userData.garmentGizmoFrameState = state;
  applyGizmoFrameToUniforms(material, state);
};

const applyGarmentGizmoIcons = (material: MeshStandardMaterial, texture: Texture) => {
  pendingGizmoIcons = texture;
  material.userData.garmentGizmoIcons = texture;
  const iconsUniform = material.userData.uNameGizmoIconsUniform as { value: Texture } | undefined;
  if (iconsUniform) iconsUniform.value = texture;
};

const applyGarmentGizmoButtonsReveal = (material: MeshStandardMaterial, reveal: number[]) => {
  const revealUniform = material.userData.uNameGizmoButtonsRevealUniform as { value: number[] } | undefined;
  if (!revealUniform) return;

  reveal.forEach((value, index) => {
    revealUniform.value[index] = value;
  });
};

const applyGarmentGizmoHover = (material: MeshStandardMaterial, hover: { slot: number; corner: number; scale: number }) => {
  const slotUniform = material.userData.uNameGizmoHoverSlotUniform as { value: number } | undefined;
  const cornerUniform = material.userData.uNameGizmoHoverCornerUniform as { value: number } | undefined;
  const scaleUniform = material.userData.uNameGizmoHoverScaleUniform as { value: number } | undefined;

  if (slotUniform) slotUniform.value = hover.slot;
  if (cornerUniform) cornerUniform.value = hover.corner;
  if (scaleUniform) scaleUniform.value = hover.scale;
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
    uNameGizmoEnabled: { value: number };
    uNameGizmoHalf: { value: Vector2[] };
    uNameGizmoIcons: { value: Texture };
  },
) => {
  const maskState = (material.userData.garmentNameMaskState as GarmentNameMaskState | undefined) ?? pendingNameMasks;
  const styleState = (material.userData.garmentNameStyleState as NameStyleUniforms | undefined) ?? pendingNameStyle;
  const gizmoState = (material.userData.garmentGizmoFrameState as GizmoFrameState | undefined) ?? pendingGizmoFrame;

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

  material.userData.uNameGizmoEnabledUniform = uniforms.uNameGizmoEnabled;
  material.userData.uNameGizmoHalfUniform = uniforms.uNameGizmoHalf;
  material.userData.uNameGizmoIconsUniform = uniforms.uNameGizmoIcons;
  if (gizmoState) {
    applyGizmoFrameToUniforms(material, gizmoState);
    material.userData.garmentGizmoFrameState = gizmoState;
  }
  const iconsState = (material.userData.garmentGizmoIcons as Texture | undefined) ?? pendingGizmoIcons;
  if (iconsState) {
    uniforms.uNameGizmoIcons.value = iconsState;
    material.userData.garmentGizmoIcons = iconsState;
  }
};

export {
  applyGarmentGizmoButtonsReveal,
  applyGarmentGizmoFrame,
  applyGarmentGizmoHover,
  applyGarmentGizmoIcons,
  applyGarmentNameMasks,
  applyGarmentNameStyle,
  applyGarmentPrintAtlasSize,
  hydrateGarmentNameUniforms,
};
export type { GarmentNameMaskState, GizmoFrameState };
