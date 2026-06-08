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
uniform float uNameGizmoEnabled;
uniform float uNameGizmoFrameActive[4];
uniform float uNameGizmoButtonsActive[4];
uniform float uNameGizmoButtonsReveal[4];
uniform vec2 uNameGizmoHalf[4];
uniform sampler2D uNameGizmoIcons;
uniform float uNameGizmoHoverSlot;
uniform float uNameGizmoHoverCorner;
uniform float uNameGizmoHoverScale;
uniform vec3 uNameGizmoBtnFill;
uniform vec3 uNameGizmoBtnFillActive;
uniform vec3 uNameGizmoIconColor;
uniform sampler2D uPatternMask0;
uniform sampler2D uPatternMask1;
uniform vec3 uPatternColor0;
uniform vec3 uPatternColor1;
uniform float uPatternOpacity;

vec4 garmentGizmoUiColor;

vec4 garmentCompositeUiLayer( vec4 base, vec4 layer ) {
  base.rgb = layer.rgb * layer.a + base.rgb * ( 1.0 - layer.a );
  base.a = layer.a + base.a * ( 1.0 - layer.a );
  return base;
}

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

float garmentGizmoBorderAa( vec2 atlasPx ) {
  return max( max( fwidth( atlasPx.x ), fwidth( atlasPx.y ) ), 0.0001 );
}

float garmentGizmoStrokeAlpha( float edgeDist, float lineHalfPx, float aa ) {
  return 1.0 - smoothstep( lineHalfPx - aa, lineHalfPx + aa, edgeDist );
}

// Distance to a rounded rectangle border, antialiased in stamp-pixel space.
float garmentGizmoRectBorder( vec2 localPx, vec2 halfPx, float lineHalfPx ) {
  vec2 q = abs( localPx ) - halfPx;
  float dist = min( max( q.x, q.y ), 0.0 ) + length( max( q, 0.0 ) );
  return garmentGizmoStrokeAlpha( abs( dist ), lineHalfPx, garmentGizmoBorderAa( localPx ) );
}

// 1D parameter along the rectangle perimeter (0..period), alternates colour segments.
float garmentGizmoDash( vec2 localPx, vec2 halfPx, float period ) {
  vec2 d = abs( localPx ) - halfPx;
  float t = ( d.x > d.y ) ? ( localPx.y + halfPx.y ) : ( localPx.x + halfPx.x );
  return step( period * 0.5, mod( t, period ) );
}

float garmentGizmoCircleDash( vec2 rel, float radius, float period ) {
  float arc = atan( rel.y, rel.x ) * radius;
  float t = mod( arc, period );
  if ( t < 0.0 ) t += period;
  return step( period * 0.5, t );
}

vec3 garmentGizmoDashColor( float dash ) {
  return mix( vec3( 1.0 ), uNameGizmoIconColor, dash );
}

// Print-atlas px from anchor (axis-aligned, no rotation). Gizmo UI uses this space so
// frame stroke, dash period and button size stay constant when uNameScale changes.
vec2 garmentNameToWorldPx( vec2 worldUv, vec2 anchor ) {
  return ( worldUv - anchor ) * uPrintAtlasSize;
}

// Fixed atlas-px chrome (NAME_GIZMO_* in nameStampConstants.ts). Independent of uNameScale.
const float GIZMO_BTN_HALF = 24.0;
const float GIZMO_BTN_OUTSET = 16.0;
const float GIZMO_FRAME_LINE_HALF = 0.9;
const float GIZMO_DASH_PERIOD = 9.2;
const float GIZMO_BTN_HOVER_SCALE_RANGE = 0.1;
const float GIZMO_BTN_REVEAL_SCALE_MIN = 0.75;

// Frame is an axis-aligned AABB around the scaled text. Only the extent uses scale; stroke/dash
// are drawn in fixed atlas px so the selection chrome does not grow with font size.
vec4 garmentGizmoFrameColor( vec2 worldUv, vec2 anchor, float scale, vec2 halfPx, float enabled, float insidePart ) {
  if ( enabled < 0.5 || insidePart < 0.5 ) return vec4( 0.0 );
  vec2 worldPx = garmentNameToWorldPx( worldUv, anchor );
  vec2 halfWorld = halfPx * scale;
  float border = garmentGizmoRectBorder( worldPx, halfWorld, GIZMO_FRAME_LINE_HALF );
  if ( border < 0.01 ) return vec4( 0.0 );
  float dash = garmentGizmoDash( worldPx, halfWorld, GIZMO_DASH_PERIOD );
  return vec4( garmentGizmoDashColor( dash ), border );
}

float garmentGizmoButtonHoverScale( float slotIndex, float cornerIndex ) {
  if ( abs( uNameGizmoHoverSlot - slotIndex ) > 0.5 ) return 1.0;
  if ( abs( uNameGizmoHoverCorner - cornerIndex ) > 0.5 ) return 1.0;
  return max( uNameGizmoHoverScale, 1.0 );
}

vec4 garmentGizmoButtonCell( sampler2D icons, vec2 worldPx, vec2 center, float cell, float hoverScale ) {
  vec2 rel = ( worldPx - center ) / max( hoverScale, 1.0 );
  float r = length( rel );
  float aa = garmentGizmoBorderAa( worldPx );
  float outerR = GIZMO_BTN_HALF + GIZMO_FRAME_LINE_HALF + aa;
  if ( r > outerR ) return vec4( 0.0 );

  float activeMix = clamp( ( hoverScale - 1.0 ) / GIZMO_BTN_HOVER_SCALE_RANGE, 0.0, 1.0 );
  vec3 fillColor = mix( uNameGizmoBtnFill, uNameGizmoBtnFillActive, activeMix );
  vec4 col = vec4( 0.0 );

  // Fill stops at the inner stroke edge so the full-width dash ring matches the text frame.
  if ( r < GIZMO_BTN_HALF - GIZMO_FRAME_LINE_HALF ) {
    col = vec4( fillColor, 1.0 );
    vec2 d = rel / ( 2.0 * GIZMO_BTN_HALF ) + 0.5;
    vec4 icon = texture2D( icons, vec2( ( cell + d.x ) * 0.25, 1.0 - d.y ) );
    vec3 iconRgb = mix( uNameGizmoIconColor, vec3( 1.0 ), activeMix );
    col.rgb = iconRgb * icon.a + col.rgb * ( 1.0 - icon.a );
    col.a = icon.a + col.a * ( 1.0 - icon.a );
  }

  float border = garmentGizmoStrokeAlpha( abs( r - GIZMO_BTN_HALF ), GIZMO_FRAME_LINE_HALF, aa );
  if ( border > 0.01 ) {
    float dash = garmentGizmoCircleDash( rel, GIZMO_BTN_HALF, GIZMO_DASH_PERIOD );
    vec3 borderCol = garmentGizmoDashColor( dash );
    col.rgb = borderCol * border + col.rgb * ( 1.0 - border );
    col.a = border + col.a * ( 1.0 - border );
  }

  return col;
}

// Buttons sit at AABB corners in atlas px; icon size is fixed and does not follow uNameScale.
vec4 garmentGizmoButtons( vec2 worldUv, vec2 anchor, float scale, vec2 halfPx, float enabled, float reveal, float insidePart, sampler2D icons, float slotIndex ) {
  if ( enabled < 0.5 || reveal < 0.01 || insidePart < 0.5 ) return vec4( 0.0 );
  vec2 worldPx = garmentNameToWorldPx( worldUv, anchor );
  vec2 ext = halfPx * scale + vec2( GIZMO_BTN_OUTSET );
  float revealScale = mix( GIZMO_BTN_REVEAL_SCALE_MIN, 1.0, reveal );

  vec4 c0 = garmentGizmoButtonCell( icons, worldPx, vec2( -ext.x,  ext.y ), 0.0, garmentGizmoButtonHoverScale( slotIndex, 0.0 ) * revealScale );
  vec4 c1 = garmentGizmoButtonCell( icons, worldPx, vec2( -ext.x, -ext.y ), 1.0, garmentGizmoButtonHoverScale( slotIndex, 1.0 ) * revealScale );
  vec4 c2 = garmentGizmoButtonCell( icons, worldPx, vec2(  ext.x,  ext.y ), 2.0, garmentGizmoButtonHoverScale( slotIndex, 2.0 ) * revealScale );
  vec4 c3 = garmentGizmoButtonCell( icons, worldPx, vec2(  ext.x, -ext.y ), 3.0, garmentGizmoButtonHoverScale( slotIndex, 3.0 ) * revealScale );

  vec4 col = vec4( 0.0 );
  col.rgb = c0.rgb * c0.a + col.rgb * ( 1.0 - c0.a ); col.a = c0.a + col.a * ( 1.0 - c0.a );
  col.rgb = c1.rgb * c1.a + col.rgb * ( 1.0 - c1.a ); col.a = c1.a + col.a * ( 1.0 - c1.a );
  col.rgb = c2.rgb * c2.a + col.rgb * ( 1.0 - c2.a ); col.a = c2.a + col.a * ( 1.0 - c2.a );
  col.rgb = c3.rgb * c3.a + col.rgb * ( 1.0 - c3.a ); col.a = c3.a + col.a * ( 1.0 - c3.a );
  col.a *= reveal;
  return col;
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

const garmentGizmoLightsFragment = /* glsl */ `
#ifdef USE_PRINT
  gl_FragColor.rgb = mix( gl_FragColor.rgb, garmentGizmoUiColor.rgb, garmentGizmoUiColor.a );
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

export { garmentFragmentUvPars, garmentGizmoLightsFragment, garmentNormalFragment, garmentRoughnessFragment, garmentVertexUv, garmentVertexUvPars };
