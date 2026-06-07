const garmentVertexUvPars = /* glsl */ `
#include <uv_pars_vertex>
varying vec2 vRawUv1;
varying vec2 vPrintUv;
`;

const garmentVertexUv = /* glsl */ `
#include <uv_vertex>
vPrintUv = uv;
#ifdef USE_UV1
  vRawUv1 = uv1;
#else
  vRawUv1 = uv;
#endif
`;

const garmentFragmentUvPars = /* glsl */ `
#include <uv_pars_fragment>
varying vec2 vRawUv1;
varying vec2 vPrintUv;
uniform sampler2D uBakeNormal;
#ifdef USE_PRINT
uniform sampler2D uDefaultLogos;
uniform sampler2D uPatternMask0;
uniform sampler2D uPatternMask1;
uniform vec3 uPatternColor0;
uniform vec3 uPatternColor1;
uniform float uPatternOpacity;
#endif
`;

const garmentNormalFragment = /* glsl */ `
#ifdef USE_NORMALMAP_TANGENTSPACE
  vec3 bakeN = texture2D( uBakeNormal, vRawUv1 ).xyz;
  normal = normalize( tbn * bakeN );

  #ifdef FLIP_SIDED
    normal = -normal;
  #endif
  #ifdef DOUBLE_SIDED
    normal = normal * faceDirection;
  #endif
#endif
`;

const garmentRoughnessFragment = /* glsl */ `
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  float fabricR = texture2D( roughnessMap, vRoughnessMapUv ).r;
  fabricR = pow( fabricR, 0.55 );
  roughnessFactor *= mix( 0.14, 0.82, fabricR );
#endif
#ifdef USE_AOMAP
  float bakeRough = texture2D( aoMap, vRawUv1 ).g;
  roughnessFactor *= mix( 0.62, 1.0, bakeRough );
#endif
`;

export { garmentFragmentUvPars, garmentNormalFragment, garmentRoughnessFragment, garmentVertexUv, garmentVertexUvPars };
