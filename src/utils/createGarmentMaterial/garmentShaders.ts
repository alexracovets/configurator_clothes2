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
#ifdef USE_GRADIENT
uniform vec4 uPartUvBounds;
uniform float uGradientEnabled;
uniform vec3 uGradientColor2;
uniform float uGradientRotation;
uniform float uGradientPosition;
uniform float uGradientSoftness;
uniform float uGradientOpacity;

float garmentGradientMask( vec2 uv ) {
  vec2 dir = vec2( cos( uGradientRotation ), sin( uGradientRotation ) );
  vec2 gradStart = vec2( 0.5 ) - dir * 0.5;
  vec2 gradEnd = vec2( 0.5 ) + dir * 0.5;
  vec2 gradVec = gradEnd - gradStart;
  float t = dot( uv - gradStart, gradVec ) / dot( gradVec, gradVec );
  t = clamp( t, 0.0, 1.0 );

  float mid = uGradientPosition;
  float spread = uGradientSoftness * 0.5;
  float stop0 = max( 0.0, mid - spread );
  float stop1 = min( 1.0, max( mid + spread, stop0 + 0.001 ) );

  return smoothstep( stop0, stop1, t ) * uGradientOpacity;
}
#endif
#ifdef USE_PRINT
uniform sampler2D uDefaultLogos;
uniform vec2 uPrintAtlasSize;
uniform sampler2D uNameFillMask;
uniform vec2 uNameStampSize;
uniform vec2 uNameAnchorUv[4];
uniform float uNameRotation[4];
uniform float uNameScale[4];
uniform sampler2D uNameStrokeMask;
uniform float uNameSlotActive[4];
uniform vec4 uNamePartBounds[4];
uniform vec3 uNameTextColors[4];
uniform vec3 uNameStrokeColors[4];
uniform sampler2D uPatternMask0;
uniform sampler2D uPatternMask1;
uniform vec3 uPatternColor0;
uniform vec3 uPatternColor1;
uniform float uPatternOpacity;

vec4 garmentCompositeNameLayer( vec4 base, vec3 rgb, float alpha ) {
  vec4 layer = vec4( rgb, alpha );
  base.rgb = layer.rgb * layer.a + base.rgb * ( 1.0 - layer.a );
  base.a = layer.a + base.a * ( 1.0 - layer.a );
  return base;
}

vec2 garmentNameToStampUv( vec2 worldUv, vec2 anchor, float rotation, float scale ) {
  vec2 deltaPx = ( worldUv - anchor ) * uPrintAtlasSize;
  float c = cos( -rotation );
  float s = sin( -rotation );
  vec2 localPx = vec2( c * deltaPx.x - s * deltaPx.y, s * deltaPx.x + c * deltaPx.y ) / max( scale, 0.001 );
  return vec2( 0.5 ) + localPx / uNameStampSize;
}

float garmentNameFillChannel( sampler2D tex, vec2 uv, float channel ) {
  vec4 masks = texture2D( tex, uv );
  if ( channel < 0.5 ) return masks.r;
  if ( channel < 1.5 ) return masks.g;
  if ( channel < 2.5 ) return masks.b;
  return masks.a;
}

float garmentNameInsideStamp( vec2 stampUv ) {
  return step( 0.0, stampUv.x ) * step( stampUv.x, 1.0 ) * step( 0.0, stampUv.y ) * step( stampUv.y, 1.0 );
}

float garmentNameSampleFillChannel( sampler2D tex, vec2 stampUv, float channel ) {
  return garmentNameFillChannel( tex, stampUv, channel ) * garmentNameInsideStamp( stampUv );
}

float garmentNameInsidePart( vec2 worldUv, vec4 bounds ) {
  vec2 partUv = ( worldUv - bounds.xy ) / ( bounds.zw - bounds.xy );
  return step( 0.0, partUv.x ) * step( partUv.x, 1.0 ) * step( 0.0, partUv.y ) * step( partUv.y, 1.0 );
}

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
