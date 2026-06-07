const garmentNameMapFragment = /* glsl */ `
  vec2 nameStampUv0 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[0], uNameRotation[0], uNameScale[0] );
  vec2 nameStampUv1 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[1], uNameRotation[1], uNameScale[1] );
  vec2 nameStampUv2 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[2], uNameRotation[2], uNameScale[2] );
  vec2 nameStampUv3 = garmentNameToStampUv( vPrintUv, uNameAnchorUv[3], uNameRotation[3], uNameScale[3] );

  vec4 nameFillMasks = vec4(
    garmentNameSampleFillChannel( uNameFillMask, nameStampUv0, 0.0 ),
    garmentNameSampleFillChannel( uNameFillMask, nameStampUv1, 1.0 ),
    garmentNameSampleFillChannel( uNameFillMask, nameStampUv2, 2.0 ),
    garmentNameSampleFillChannel( uNameFillMask, nameStampUv3, 3.0 )
  );
  vec4 nameStrokeMasks = vec4(
    garmentNameFillChannel( uNameStrokeMask, nameStampUv0, 0.0 ),
    garmentNameFillChannel( uNameStrokeMask, nameStampUv1, 1.0 ),
    garmentNameFillChannel( uNameStrokeMask, nameStampUv2, 2.0 ),
    garmentNameFillChannel( uNameStrokeMask, nameStampUv3, 3.0 )
  );
  float nameInside0 = garmentNameInsidePart( vPrintUv, uNamePartBounds[0] ) * uNameSlotActive[0];
  float nameInside1 = garmentNameInsidePart( vPrintUv, uNamePartBounds[1] ) * uNameSlotActive[1];
  float nameInside2 = garmentNameInsidePart( vPrintUv, uNamePartBounds[2] ) * uNameSlotActive[2];
  float nameInside3 = garmentNameInsidePart( vPrintUv, uNamePartBounds[3] ) * uNameSlotActive[3];
  vec4 nameColor = vec4( 0.0 );

  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[0], nameStrokeMasks.r * nameInside0 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[0], nameFillMasks.r * nameInside0 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[1], nameStrokeMasks.g * nameInside1 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[1], nameFillMasks.g * nameInside1 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[2], nameStrokeMasks.b * nameInside2 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[2], nameFillMasks.b * nameInside2 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameStrokeColors[3], nameStrokeMasks.a * nameInside3 );
  nameColor = garmentCompositeNameLayer( nameColor, uNameTextColors[3], nameFillMasks.a * nameInside3 );

  printColor.rgb = nameColor.rgb * nameColor.a + printColor.rgb * ( 1.0 - nameColor.a );
  printColor.a = nameColor.a + printColor.a * ( 1.0 - nameColor.a );
`;

export { garmentNameMapFragment };
