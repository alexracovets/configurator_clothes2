import { Color, MeshStandardMaterial, type Texture, Vector2, Vector4 } from 'three';

import type { PbrMaps } from '../pbrMaps';

import { garmentGradientMapFragment } from '../garmentGradient/garmentGradientShaders';
import type { GarmentPrintState } from '../garmentPrint/applyGarmentPrint';
import { getEmptyPrintTexture } from '../garmentPrint/emptyPrintTexture';
import { NAME_SLOT_COUNT } from '../garmentPrint/nameSlotConstants';
import { hydrateGarmentNameUniforms } from '../garmentPrint/applyGarmentNames';
import { garmentPrintMapFragment } from '../garmentPrint/garmentPrintShaders';

import { applyPbrMaps } from './applyPbrMaps';
import { NAME_GIZMO_BTN_ACTIVE_COLOR, NAME_GIZMO_BTN_FILL_COLOR, NAME_GIZMO_ICON_COLOR } from '../garmentPrint/nameStampConstants';
import {
  garmentFragmentUvPars,
  garmentGizmoLightsFragment,
  garmentNormalFragment,
  garmentRoughnessFragment,
  garmentVertexUv,
  garmentVertexUvPars,
} from './garmentShaders';

const SLEEVE_POLYGON_OFFSET = { factor: -1, units: -1 } as const;

const isSleeveMesh = (meshName: string) => {
  const name = meshName.toLowerCase();
  return name.includes('sleeve_left') || name.includes('sleeve_right');
};

const configureGarmentShader = (material: MeshStandardMaterial) => {
  if (material.userData.garmentShaderConfigured) return;

  material.userData.garmentShaderConfigured = true;

  const bakeNormal = material.userData.pbrBakeNormal as Texture;
  const printState = material.userData.garmentPrintState as GarmentPrintState | undefined;
  const gradient = material.userData.garmentGradient as
    | { color2: string; rotation: number; position: number; softness: number; opacity: number; enabled: boolean }
    | undefined;
  const emptyPrint = getEmptyPrintTexture();
  material.userData.uPartUvBounds = material.userData.uPartUvBounds ?? new Vector4(0, 0, 1, 1);

  material.onBeforeCompile = (shader) => {
    shader.defines = { ...shader.defines, USE_UV1: '', USE_GRADIENT: '', USE_PRINT: '' };
    shader.uniforms.uBakeNormal = { value: bakeNormal };
    shader.uniforms.uPartUvBounds = { value: material.userData.uPartUvBounds };
    material.userData.uPartUvBoundsUniform = shader.uniforms.uPartUvBounds;
    shader.uniforms.uGradientEnabled = { value: gradient?.enabled ? 1 : 0 };
    shader.uniforms.uGradientColor2 = { value: new Color(gradient?.color2 ?? '#000000') };
    shader.uniforms.uGradientRotation = { value: ((gradient?.rotation ?? 0) * Math.PI) / 180 };
    shader.uniforms.uGradientPosition = { value: gradient?.position ?? 0.5 };
    shader.uniforms.uGradientSoftness = { value: gradient?.softness ?? 0.5 };
    shader.uniforms.uGradientOpacity = { value: gradient?.opacity ?? 1 };
    material.userData.uGradientEnabledUniform = shader.uniforms.uGradientEnabled;
    material.userData.uGradientColor2Uniform = shader.uniforms.uGradientColor2;
    material.userData.uGradientRotationUniform = shader.uniforms.uGradientRotation;
    material.userData.uGradientPositionUniform = shader.uniforms.uGradientPosition;
    material.userData.uGradientSoftnessUniform = shader.uniforms.uGradientSoftness;
    material.userData.uGradientOpacityUniform = shader.uniforms.uGradientOpacity;
    shader.uniforms.uDefaultLogos = { value: printState?.defaultLogos ?? emptyPrint };
    shader.uniforms.uPrintAtlasSize = { value: new Vector2(2048, 1074) };
    shader.uniforms.uNameFillMask = { value: emptyPrint };
    shader.uniforms.uNameStrokeMask = { value: emptyPrint };
    shader.uniforms.uNameStampSize = { value: new Vector2(1, 1) };
    shader.uniforms.uNameAnchorUv = { value: Array.from({ length: NAME_SLOT_COUNT }, () => new Vector2()) };
    shader.uniforms.uNameRotation = { value: Array.from({ length: NAME_SLOT_COUNT }, () => 0) };
    shader.uniforms.uNameScale = { value: Array.from({ length: NAME_SLOT_COUNT }, () => 1) };
    shader.uniforms.uNameSlotActive = { value: Array.from({ length: NAME_SLOT_COUNT }, () => 0) };
    shader.uniforms.uNamePartBounds = { value: Array.from({ length: NAME_SLOT_COUNT }, () => new Vector4(0, 0, 1, 1)) };
    shader.uniforms.uNameTextColors = { value: Array.from({ length: NAME_SLOT_COUNT }, () => new Color('#000000')) };
    shader.uniforms.uNameStrokeColors = { value: Array.from({ length: NAME_SLOT_COUNT }, () => new Color('#ffffff')) };
    shader.uniforms.uNameGizmoEnabled = { value: 0 };
    shader.uniforms.uNameGizmoButtonsReveal = { value: Array.from({ length: NAME_SLOT_COUNT }, () => 0) };
    shader.uniforms.uNameGizmoHalf = { value: Array.from({ length: NAME_SLOT_COUNT }, () => new Vector2(0, 0)) };
    shader.uniforms.uNameGizmoIcons = { value: emptyPrint };
    shader.uniforms.uNameGizmoHoverSlot = { value: -1 };
    shader.uniforms.uNameGizmoHoverCorner = { value: -1 };
    shader.uniforms.uNameGizmoHoverScale = { value: 1 };
    shader.uniforms.uNameGizmoBtnFill = { value: new Color(NAME_GIZMO_BTN_FILL_COLOR) };
    shader.uniforms.uNameGizmoBtnFillActive = { value: new Color(NAME_GIZMO_BTN_ACTIVE_COLOR) };
    shader.uniforms.uNameGizmoIconColor = { value: new Color(NAME_GIZMO_ICON_COLOR) };
    shader.uniforms.uPatternMask0 = { value: printState?.patternMasks[0] ?? emptyPrint };
    shader.uniforms.uPatternMask1 = { value: printState?.patternMasks[1] ?? emptyPrint };
    shader.uniforms.uPatternColor0 = { value: new Color(printState?.patternColors[0] ?? '#000000') };
    shader.uniforms.uPatternColor1 = { value: new Color(printState?.patternColors[1] ?? '#000000') };
    shader.uniforms.uPatternOpacity = { value: printState?.patternOpacity ?? 1 };

    material.userData.uDefaultLogosUniform = shader.uniforms.uDefaultLogos;
    material.userData.uPrintAtlasSizeUniform = shader.uniforms.uPrintAtlasSize;
    material.userData.uNameFillMaskUniform = shader.uniforms.uNameFillMask;
    material.userData.uNameStrokeMaskUniform = shader.uniforms.uNameStrokeMask;
    material.userData.uNameStampSizeUniform = shader.uniforms.uNameStampSize;
    material.userData.uNameAnchorUvUniform = shader.uniforms.uNameAnchorUv;
    material.userData.uNameRotationUniform = shader.uniforms.uNameRotation;
    material.userData.uNameScaleUniform = shader.uniforms.uNameScale;
    material.userData.uNameSlotActiveUniform = shader.uniforms.uNameSlotActive;
    material.userData.uNamePartBoundsUniform = shader.uniforms.uNamePartBounds;
    material.userData.uNameTextColorsUniform = shader.uniforms.uNameTextColors;
    material.userData.uNameStrokeColorsUniform = shader.uniforms.uNameStrokeColors;
    material.userData.uNameGizmoEnabledUniform = shader.uniforms.uNameGizmoEnabled;
    material.userData.uNameGizmoButtonsRevealUniform = shader.uniforms.uNameGizmoButtonsReveal;
    material.userData.uNameGizmoHalfUniform = shader.uniforms.uNameGizmoHalf;
    material.userData.uNameGizmoIconsUniform = shader.uniforms.uNameGizmoIcons;
    material.userData.uNameGizmoHoverSlotUniform = shader.uniforms.uNameGizmoHoverSlot;
    material.userData.uNameGizmoHoverCornerUniform = shader.uniforms.uNameGizmoHoverCorner;
    material.userData.uNameGizmoHoverScaleUniform = shader.uniforms.uNameGizmoHoverScale;
    material.userData.uPatternMask0Uniform = shader.uniforms.uPatternMask0;
    material.userData.uPatternMask1Uniform = shader.uniforms.uPatternMask1;
    material.userData.uPatternColor0Uniform = shader.uniforms.uPatternColor0;
    material.userData.uPatternColor1Uniform = shader.uniforms.uPatternColor1;
    material.userData.uPatternOpacityUniform = shader.uniforms.uPatternOpacity;

    hydrateGarmentNameUniforms(material, {
      uNameFillMask: shader.uniforms.uNameFillMask,
      uNameStrokeMask: shader.uniforms.uNameStrokeMask,
      uNameStampSize: shader.uniforms.uNameStampSize,
      uNameAnchorUv: shader.uniforms.uNameAnchorUv,
      uNameRotation: shader.uniforms.uNameRotation,
      uNameScale: shader.uniforms.uNameScale,
      uNameSlotActive: shader.uniforms.uNameSlotActive,
      uNamePartBounds: shader.uniforms.uNamePartBounds,
      uNameTextColors: shader.uniforms.uNameTextColors,
      uNameStrokeColors: shader.uniforms.uNameStrokeColors,
      uNameGizmoEnabled: shader.uniforms.uNameGizmoEnabled,
      uNameGizmoHalf: shader.uniforms.uNameGizmoHalf,
      uNameGizmoIcons: shader.uniforms.uNameGizmoIcons,
    });

    shader.vertexShader = shader.vertexShader.replace('#include <uv_pars_vertex>', garmentVertexUvPars).replace('#include <uv_vertex>', garmentVertexUv);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <uv_pars_fragment>', garmentFragmentUvPars)
      .replace('#include <map_fragment>', `#include <map_fragment>\n${garmentGradientMapFragment}\n${garmentPrintMapFragment}`)
      .replace('#include <normal_fragment_maps>', garmentNormalFragment)
      .replace('#include <roughnessmap_fragment>', garmentRoughnessFragment)
      .replace('#include <tonemapping_fragment>', `#include <tonemapping_fragment>\n${garmentGizmoLightsFragment}`);
  };

  material.customProgramCacheKey = () => 'garment-pbr-print-v43-gizmo-buttons-reveal';
};

const createGarmentMaterial = (pbrMaps: PbrMaps | null, source: MeshStandardMaterial, meshName = ''): MeshStandardMaterial => {
  const material = source.clone();

  if (isSleeveMesh(meshName)) {
    material.polygonOffset = true;
    material.polygonOffsetFactor = SLEEVE_POLYGON_OFFSET.factor;
    material.polygonOffsetUnits = SLEEVE_POLYGON_OFFSET.units;
  }

  if (!pbrMaps) {
    material.needsUpdate = true;
    return material;
  }

  applyPbrMaps(material, pbrMaps);
  configureGarmentShader(material);
  material.needsUpdate = true;

  return material;
};

export { createGarmentMaterial };
