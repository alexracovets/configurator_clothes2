import { MeshStandardMaterial, type Texture } from 'three';

import type { PbrMaps } from '../pbrMaps';

import { applyPbrMaps } from './applyPbrMaps';
import { garmentFragmentUvPars, garmentNormalFragment, garmentRoughnessFragment, garmentVertexUv, garmentVertexUvPars } from './garmentShaders';

const SLEEVE_POLYGON_OFFSET = { factor: -1, units: -1 } as const;

const isSleeveMesh = (meshName: string) => {
  const name = meshName.toLowerCase();
  return name.includes('sleeve_left') || name.includes('sleeve_right');
};

const configureGarmentShader = (material: MeshStandardMaterial) => {
  if (material.userData.garmentShaderConfigured) return;

  material.userData.garmentShaderConfigured = true;

  const bakeNormal = material.userData.pbrBakeNormal as Texture;

  material.onBeforeCompile = (shader) => {
    shader.defines = { ...shader.defines, USE_UV1: '' };
    shader.uniforms.uBakeNormal = { value: bakeNormal };

    shader.vertexShader = shader.vertexShader.replace('#include <uv_pars_vertex>', garmentVertexUvPars).replace('#include <uv_vertex>', garmentVertexUv);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <uv_pars_fragment>', garmentFragmentUvPars)
      .replace('#include <normal_fragment_maps>', garmentNormalFragment)
      .replace('#include <roughnessmap_fragment>', garmentRoughnessFragment);
  };

  material.customProgramCacheKey = () => 'garment-pbr-v1';
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
