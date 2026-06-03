const garmentPartMapFragment = /* glsl */ `
#ifdef USE_MAP
  vec2 partUv = ( vRawUv0 - uPartUvBounds.xy ) / ( uPartUvBounds.zw - uPartUvBounds.xy );
  vec4 texelColor = texture2D( map, partUv );
  diffuseColor *= texelColor;

  // Layer 2 — SFUMATURA on fabric only (before print)
  #ifdef USE_GRADIENT
    vec2 gradUv = partUv;
    #ifdef USE_GRADIENT_MIRROR_U
      gradUv.x = 1.0 - gradUv.x;
    #endif
    float gradMask = shirtGradientMask( gradUv );
    diffuseColor.rgb = mix( diffuseColor.rgb, uGradientColor2, gradMask );
  #endif

  // Layers 4–7 — print atlas over fabric+gradient (source-over)
  #ifdef USE_PRINT
    vec2 atlasUv = uPartUvBounds.xy + partUv * ( uPartUvBounds.zw - uPartUvBounds.xy );
    vec4 printColor = texture2D( uPrintAtlas, atlasUv );
    diffuseColor.rgb = printColor.rgb * printColor.a + diffuseColor.rgb * ( 1.0 - printColor.a );
  #endif
#endif
`;

export { garmentPartMapFragment };
