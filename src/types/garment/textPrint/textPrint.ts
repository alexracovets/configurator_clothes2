import type { textDefaultsConfigType, textPositionConfigType, uvPointType } from '@types';

interface mappedGizmoFlagsType {
  showFrame: boolean;
  showGizmo: boolean;
  interactive: boolean;
}

type textPrintPositionType = {
  key: string;
  partId: string;
  uv: uvPointType;
} & Pick<textPositionConfigType, 'label' | 'rotation' | 'fontSize'> &
  mappedGizmoFlagsType;

type textPrintInstanceType = {
  id: string;
  positionKey: string;
  /** Position default orientation; affects text only, not gizmo. */
  placementRotation?: number;
} & Pick<textDefaultsConfigType, 'text' | 'font' | 'textColor' | 'strokeColor' | 'strokeWidth'> &
  Pick<textPrintPositionType, 'label' | 'partId' | 'uv' | 'rotation' | 'fontSize' | 'showFrame' | 'showGizmo'>;

type textPrintPreviewType<T extends textPrintInstanceType = textPrintInstanceType> = {
  instanceId: string;
  patch: Partial<Pick<T, 'text' | 'textColor' | 'strokeColor' | 'fontSize' | 'strokeWidth'>>;
};

type textPrintLimitsType = Required<Pick<textDefaultsConfigType, 'maxLength' | 'fontSizeMin' | 'fontSizeMax' | 'strokeWidthMax'>>;

type namePositionType = textPrintPositionType;
type nameInstanceType = textPrintInstanceType;
type namePreviewType = textPrintPreviewType<nameInstanceType>;
type nameLimitsType = textPrintLimitsType;

type numberPositionType = textPrintPositionType;
type numberInstanceType = textPrintInstanceType;
type numberPreviewType = textPrintPreviewType<numberInstanceType>;
type numberLimitsType = textPrintLimitsType;

type garmentTextRenderInstanceType = nameInstanceType | numberInstanceType;

export type {
  garmentTextRenderInstanceType,
  mappedGizmoFlagsType,
  nameInstanceType,
  nameLimitsType,
  namePositionType,
  namePreviewType,
  numberInstanceType,
  numberLimitsType,
  numberPositionType,
  numberPreviewType,
};
