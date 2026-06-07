const garmentPrintMapFragment = /* glsl */ `
#ifdef USE_PRINT
  vec4 printTexel = texture2D( uPrintAtlas, vPrintUv );
  diffuseColor.rgb = printTexel.rgb * printTexel.a + diffuseColor.rgb * ( 1.0 - printTexel.a );
#endif
`;

export { garmentPrintMapFragment };
