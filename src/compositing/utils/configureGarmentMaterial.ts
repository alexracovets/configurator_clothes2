import {
  garmentPartMapFragment,
  shirtFragmentUniforms,
  shirtNormalFragment,
  shirtRoughnessFragment,
  shirtVertexUvParsVertex,
  shirtVertexUvVertex,
} from '@shaders';
import type { Uv0PartKey, UvBounds } from '@constants';
import type { PbrMaps } from '../types/pbrMaps';
import type { MeshStandardMaterial, Texture } from 'three';
import { Vector4 } from 'three';

import { ensureShadingUniforms } from '../apply/applyGarmentShading';

const PART_MAP_UNIFORMS = /* glsl */ `
uniform vec4 uPartUvBounds;
#ifdef USE_PRINT
uniform sampler2D uPrintAtlas;
#endif
`;

const PART_POLYGON_OFFSET: Partial<Record<Uv0PartKey, { factor: number; units: number }>> = {
  sleeve_left: { factor: -1, units: -1 },
  sleeve_right: { factor: -1, units: -1 },
};

const configureGarmentMaterial = (material: MeshStandardMaterial, bounds: UvBounds, maps: PbrMaps, partKey: Uv0PartKey | null, partId: string | null) => {
  const bakeNormal = (material.userData.pbrBakeNormal as Texture | undefined) ?? maps.bakeNormal;

  if (!material.userData.garmentShaderConfigured) {
    material.userData.garmentShaderConfigured = true;
    material.userData.uPartUvBounds = new Vector4(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    ensureShadingUniforms(material);

    const offset = partKey ? PART_POLYGON_OFFSET[partKey] : undefined;
    if (offset) {
      material.polygonOffset = true;
      material.polygonOffsetFactor = offset.factor;
      material.polygonOffsetUnits = offset.units;
    }

    material.onBeforeCompile = (shader) => {
      shader.defines = { ...shader.defines, USE_UV1: '' };

      if (material.userData.shadingEnabled === true) {
        shader.defines.USE_GRADIENT = '';
        if (material.userData.shadingMirrorU === true) {
          shader.defines.USE_GRADIENT_MIRROR_U = '';
        }
      }

      if (material.userData.hasPrintAtlas === true && material.userData.printTexture) {
        shader.defines.USE_PRINT = '';
        shader.uniforms.uPrintAtlas = { value: material.userData.printTexture };
      }

      shader.uniforms.uBakeNormal = { value: bakeNormal };
      shader.uniforms.uPartUvBounds = { value: material.userData.uPartUvBounds };

      const shadingUniforms = ensureShadingUniforms(material);
      if (material.userData.shadingEnabled === true) {
        shader.uniforms.uGradientColor2 = shadingUniforms.uGradientColor2;
        shader.uniforms.uGradientRotation = shadingUniforms.uGradientRotation;
        shader.uniforms.uGradientPosition = shadingUniforms.uGradientPosition;
        shader.uniforms.uGradientSoftness = shadingUniforms.uGradientSoftness;
        shader.uniforms.uGradientOpacity = shadingUniforms.uGradientOpacity;
      }

      shader.vertexShader = shader.vertexShader
        .replace('#include <uv_pars_vertex>', shirtVertexUvParsVertex)
        .replace('#include <uv_vertex>', shirtVertexUvVertex);

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <uv_pars_fragment>', `${shirtFragmentUniforms}\n${PART_MAP_UNIFORMS}`)
        .replace('#include <map_fragment>', garmentPartMapFragment)
        .replace('#include <normal_fragment_maps>', shirtNormalFragment)
        .replace('#include <roughnessmap_fragment>', shirtRoughnessFragment);
    };

    material.customProgramCacheKey = () =>
      `garment-part-${partKey ?? 'x'}-${partId ?? 'x'}-g${material.userData.shadingEnabled === true ? 1 : 0}-m${material.userData.shadingMirrorU === true ? 1 : 0}-p${material.userData.hasPrintAtlas === true ? 1 : 0}-${bounds.minX}-${bounds.minY}-${bounds.maxX}-${bounds.maxY}`;
  } else {
    const uniform = material.userData.uPartUvBounds as Vector4;
    uniform.set(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  }

  material.needsUpdate = true;
};

export { configureGarmentMaterial };
