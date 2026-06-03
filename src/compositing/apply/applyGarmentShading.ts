import { resolvePartGradientRotation, shouldMirrorPartGradientU } from '@constants';
import type { ShadingPreviewPatch } from '@store';
import { Color, type IUniform, type MeshStandardMaterial, type Object3D } from 'three';

import type { CompositingShadingPart } from '../types';
import { resolveMeshPartId } from '../meshPartMapping';
import { forEachFabricMesh, forEachStandardMaterial } from '../utils/mesh';

type ShadingUniforms = {
  uGradientColor2: IUniform<Color>;
  uGradientRotation: IUniform<number>;
  uGradientPosition: IUniform<number>;
  uGradientSoftness: IUniform<number>;
  uGradientOpacity: IUniform<number>;
};

const ensureShadingUniforms = (material: MeshStandardMaterial): ShadingUniforms => {
  const existing = material.userData.shadingUniforms as ShadingUniforms | undefined;
  if (existing) return existing;

  const shadingUniforms: ShadingUniforms = {
    uGradientColor2: { value: new Color('#ffffff') },
    uGradientRotation: { value: 0 },
    uGradientPosition: { value: 0.5 },
    uGradientSoftness: { value: 0.35 },
    uGradientOpacity: { value: 1 },
  };

  material.userData.shadingUniforms = shadingUniforms;
  return shadingUniforms;
};

const resolveShadingPart = (
  partId: string,
  shadingParts: CompositingShadingPart[],
  preview: { partId: string; patch: ShadingPreviewPatch } | null,
): CompositingShadingPart | undefined => {
  const base = shadingParts.find((part) => part.id === partId);
  if (!base) return undefined;
  if (preview?.partId !== partId) return base;
  return { ...base, ...preview.patch };
};

const syncMaterialShading = (material: MeshStandardMaterial, partId: string, shading: CompositingShadingPart) => {
  const uniforms = ensureShadingUniforms(material);
  const mirrorU = shouldMirrorPartGradientU(partId);
  const enabled = shading.enabled;
  const prevEnabled = material.userData.shadingEnabled === true;
  const prevMirror = material.userData.shadingMirrorU === true;

  material.userData.shadingEnabled = enabled;
  material.userData.shadingMirrorU = mirrorU;

  if (!enabled) {
    if (prevEnabled !== enabled) material.needsUpdate = true;
    return;
  }

  uniforms.uGradientColor2.value.set(shading.colorPicked);
  uniforms.uGradientRotation.value = (resolvePartGradientRotation(partId, shading.rotation) * Math.PI) / 180;
  uniforms.uGradientPosition.value = shading.position / 100;
  uniforms.uGradientSoftness.value = shading.softness / 100;
  uniforms.uGradientOpacity.value = shading.opacity / 100;

  if (prevEnabled !== enabled || prevMirror !== mirrorU) {
    material.needsUpdate = true;
  }
};

/** SFUMATURA on GPU (same idea as COLOR preview) — no canvas recomposite. */
const applyGarmentShading = (
  root: Object3D,
  colorParts: { id: string }[],
  shadingParts: CompositingShadingPart[],
  preview: { partId: string; patch: ShadingPreviewPatch } | null,
) => {
  forEachFabricMesh(root, (mesh) => {
    const partId = resolveMeshPartId(mesh.name, colorParts);
    if (!partId) return;

    const shading = resolveShadingPart(partId, shadingParts, preview);
    if (!shading) return;

    forEachStandardMaterial(mesh, (material) => {
      syncMaterialShading(material, partId, shading);
    });
  });
};

export { applyGarmentShading, ensureShadingUniforms };
