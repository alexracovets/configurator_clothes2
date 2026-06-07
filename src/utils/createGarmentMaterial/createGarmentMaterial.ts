import { MeshStandardMaterial, type Texture, Vector4 } from 'three';

import type { PbrMaps } from '../pbrMaps';

import { getEmptyPrintTexture } from '../garmentPrint/emptyPrintTexture';
import { garmentPrintMapFragment } from '../garmentPrint/garmentPrintShaders';

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
  const printTexture = (material.userData.printTexture as Texture | undefined) ?? getEmptyPrintTexture();
  material.userData.printTexture = printTexture;
  material.userData.uPartUvBounds = material.userData.uPartUvBounds ?? new Vector4(0, 0, 1, 1);

  material.onBeforeCompile = (shader) => {
    shader.defines = { ...shader.defines, USE_UV1: '', USE_PRINT: '' };
    shader.uniforms.uBakeNormal = { value: bakeNormal };
    shader.uniforms.uPrintAtlas = { value: printTexture };
    shader.uniforms.uPartUvBounds = { value: material.userData.uPartUvBounds };
    material.userData.uPrintAtlasUniform = shader.uniforms.uPrintAtlas;
    material.userData.uPartUvBoundsUniform = shader.uniforms.uPartUvBounds;

    shader.vertexShader = shader.vertexShader.replace('#include <uv_pars_vertex>', garmentVertexUvPars).replace('#include <uv_vertex>', garmentVertexUv);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <uv_pars_fragment>', garmentFragmentUvPars)
      .replace('#include <map_fragment>', `#include <map_fragment>\n${garmentPrintMapFragment}`)
      .replace('#include <normal_fragment_maps>', garmentNormalFragment)
      .replace('#include <roughnessmap_fragment>', garmentRoughnessFragment);
  };

  material.customProgramCacheKey = () => 'garment-pbr-print-v4';
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
