const garmentNameMapFragment = /* glsl */ `
  vec2 namePartUv = ( vPrintUv - uPartUvBounds.xy ) / ( uPartUvBounds.zw - uPartUvBounds.xy );
  float nameInsidePart = step( 0.0, namePartUv.x ) * step( namePartUv.x, 1.0 ) * step( 0.0, namePartUv.y ) * step( namePartUv.y, 1.0 );

  vec2 nameStampUv0 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[0], uNameRotation[0], uNameScale[0] );
  vec2 nameStampUv1 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[1], uNameRotation[1], uNameScale[1] );
  vec2 nameStampUv2 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[2], uNameRotation[2], uNameScale[2] );
  vec2 nameStampUv3 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[3], uNameRotation[3], uNameScale[3] );

  vec4 nameFillMasks = vec4(
    garmentNameFillChannel( uNameFillMask, nameStampUv0, 0.0 ),
    garmentNameFillChannel( uNameFillMask, nameStampUv1, 1.0 ),
    garmentNameFillChannel( uNameFillMask, nameStampUv2, 2.0 ),
    garmentNameFillChannel( uNameFillMask, nameStampUv3, 3.0 )
  );
  vec4 nameStrokeMasks = vec4(
    garmentNameStrokeChannel( uNameFillMask, nameStampUv0, 0.0, uNameStrokeWidth[0] ),
    garmentNameStrokeChannel( uNameFillMask, nameStampUv1, 1.0, uNameStrokeWidth[1] ),
    garmentNameStrokeChannel( uNameFillMask, nameStampUv2, 2.0, uNameStrokeWidth[2] ),
    garmentNameStrokeChannel( uNameFillMask, nameStampUv3, 3.0, uNameStrokeWidth[3] )
  );
  vec4 nameColor = vec4( 0.0 );

  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[0], nameStrokeMasks.r * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[0], nameFillMasks.r * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[1], nameStrokeMasks.g * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[1], nameFillMasks.g * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[2], nameStrokeMasks.b * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[2], nameFillMasks.b * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[3], nameStrokeMasks.a * nameInsidePart );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[3], nameFillMasks.a * nameInsidePart );

  printColor.rgb = nameColor.rgb * nameColor.a + printColor.rgb * ( 1.0 - nameColor.a );
  printColor.a = nameColor.a + printColor.a * ( 1.0 - nameColor.a );
`;

export { garmentNameMapFragment };
