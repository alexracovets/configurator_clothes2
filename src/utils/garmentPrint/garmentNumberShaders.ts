const garmentNumberMapFragment = /* glsl */ `
  vec2 numberStampUv0 = garmentNumberToStampUv( vPrintUv, uNumberAnchorUv[0], uNumberRotation[0], uNumberPlacementRotation[0], uNumberUploadRotation[0], uNumberPartRotation[0], uNumberScale[0] );
  vec2 numberStampUv1 = garmentNumberToStampUv( vPrintUv, uNumberAnchorUv[1], uNumberRotation[1], uNumberPlacementRotation[1], uNumberUploadRotation[1], uNumberPartRotation[1], uNumberScale[1] );
  vec2 numberStampUv2 = garmentNumberToStampUv( vPrintUv, uNumberAnchorUv[2], uNumberRotation[2], uNumberPlacementRotation[2], uNumberUploadRotation[2], uNumberPartRotation[2], uNumberScale[2] );
  vec2 numberStampUv3 = garmentNumberToStampUv( vPrintUv, uNumberAnchorUv[3], uNumberRotation[3], uNumberPlacementRotation[3], uNumberUploadRotation[3], uNumberPartRotation[3], uNumberScale[3] );

  vec4 numberFillMasks = vec4(
    garmentNameSampleFillChannel( uNumberFillMask, numberStampUv0, 0.0 ),
    garmentNameSampleFillChannel( uNumberFillMask, numberStampUv1, 1.0 ),
    garmentNameSampleFillChannel( uNumberFillMask, numberStampUv2, 2.0 ),
    garmentNameSampleFillChannel( uNumberFillMask, numberStampUv3, 3.0 )
  );
  vec4 numberStrokeMasks = vec4(
    garmentNameFillChannel( uNumberStrokeMask, numberStampUv0, 0.0 ),
    garmentNameFillChannel( uNumberStrokeMask, numberStampUv1, 1.0 ),
    garmentNameFillChannel( uNumberStrokeMask, numberStampUv2, 2.0 ),
    garmentNameFillChannel( uNumberStrokeMask, numberStampUv3, 3.0 )
  );
  float numberInside0 = garmentNameInsidePart( vPrintUv, uNumberPartBounds[0] ) * uNumberSlotActive[0];
  float numberInside1 = garmentNameInsidePart( vPrintUv, uNumberPartBounds[1] ) * uNumberSlotActive[1];
  float numberInside2 = garmentNameInsidePart( vPrintUv, uNumberPartBounds[2] ) * uNumberSlotActive[2];
  float numberInside3 = garmentNameInsidePart( vPrintUv, uNumberPartBounds[3] ) * uNumberSlotActive[3];

  vec4 slotNumber0 = vec4( 0.0 );
  slotNumber0 = garmentCompositeNameLayer( slotNumber0, uNumberStrokeColors[0], numberStrokeMasks.r * numberInside0 );
  slotNumber0 = garmentCompositeNameLayer( slotNumber0, uNumberTextColors[0], numberFillMasks.r * numberInside0 );
  printColor = garmentCompositeUiLayer( printColor, slotNumber0 );
  printColor = garmentCompositeUiLayer( printColor, garmentGizmoFrameColor( vPrintUv, uNumberAnchorUv[0], uNumberScale[0], uNumberGizmoHalf[0], uNumberRotation[0], uNumberPartRotation[0], uNumberGizmoEnabled * uNumberGizmoFrameActive[0], numberInside0 ) );

  vec4 slotNumber1 = vec4( 0.0 );
  slotNumber1 = garmentCompositeNameLayer( slotNumber1, uNumberStrokeColors[1], numberStrokeMasks.g * numberInside1 );
  slotNumber1 = garmentCompositeNameLayer( slotNumber1, uNumberTextColors[1], numberFillMasks.g * numberInside1 );
  printColor = garmentCompositeUiLayer( printColor, slotNumber1 );
  printColor = garmentCompositeUiLayer( printColor, garmentGizmoFrameColor( vPrintUv, uNumberAnchorUv[1], uNumberScale[1], uNumberGizmoHalf[1], uNumberRotation[1], uNumberPartRotation[1], uNumberGizmoEnabled * uNumberGizmoFrameActive[1], numberInside1 ) );

  vec4 slotNumber2 = vec4( 0.0 );
  slotNumber2 = garmentCompositeNameLayer( slotNumber2, uNumberStrokeColors[2], numberStrokeMasks.b * numberInside2 );
  slotNumber2 = garmentCompositeNameLayer( slotNumber2, uNumberTextColors[2], numberFillMasks.b * numberInside2 );
  printColor = garmentCompositeUiLayer( printColor, slotNumber2 );
  printColor = garmentCompositeUiLayer( printColor, garmentGizmoFrameColor( vPrintUv, uNumberAnchorUv[2], uNumberScale[2], uNumberGizmoHalf[2], uNumberRotation[2], uNumberPartRotation[2], uNumberGizmoEnabled * uNumberGizmoFrameActive[2], numberInside2 ) );

  vec4 slotNumber3 = vec4( 0.0 );
  slotNumber3 = garmentCompositeNameLayer( slotNumber3, uNumberStrokeColors[3], numberStrokeMasks.a * numberInside3 );
  slotNumber3 = garmentCompositeNameLayer( slotNumber3, uNumberTextColors[3], numberFillMasks.a * numberInside3 );
  printColor = garmentCompositeUiLayer( printColor, slotNumber3 );
  printColor = garmentCompositeUiLayer( printColor, garmentGizmoFrameColor( vPrintUv, uNumberAnchorUv[3], uNumberScale[3], uNumberGizmoHalf[3], uNumberRotation[3], uNumberPartRotation[3], uNumberGizmoEnabled * uNumberGizmoFrameActive[3], numberInside3 ) );
`;

export { garmentNumberMapFragment };
