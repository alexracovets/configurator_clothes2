import type { TextDefaultsConfig, TextPositionConfig, UvPoint } from '../entities/garment';

type MappedGizmoFlags = {
  showFrame: boolean;
  showGizmo: boolean;
  interactive: boolean;
};

type TextPrintPosition = {
  key: string;
  partId: string;
  uv: UvPoint;
} & Pick<TextPositionConfig, 'label' | 'rotation' | 'fontSize'> &
  MappedGizmoFlags;

type TextPrintInstance = {
  id: string;
  positionKey: string;
  text: string;
  font: string;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  /** Position default orientation; affects text only, not gizmo. */
  placementRotation?: number;
} & Pick<TextPrintPosition, 'label' | 'partId' | 'uv' | 'rotation' | 'fontSize' | 'showFrame' | 'showGizmo'>;

type TextPrintPreview<T extends TextPrintInstance = TextPrintInstance> = {
  instanceId: string;
  patch: Partial<Pick<T, 'text' | 'textColor' | 'strokeColor' | 'fontSize' | 'strokeWidth'>>;
};

type TextPrintLimits = Required<Pick<TextDefaultsConfig, 'maxLength' | 'fontSizeMin' | 'fontSizeMax' | 'strokeWidthMax'>>;

type NamePosition = TextPrintPosition;
type NameInstance = TextPrintInstance;
type NamePreview = TextPrintPreview<NameInstance>;
type NameLimits = TextPrintLimits;

type NumberPosition = TextPrintPosition;
type NumberInstance = TextPrintInstance;
type NumberPreview = TextPrintPreview<NumberInstance>;
type NumberLimits = TextPrintLimits;

type GarmentTextRenderInstance = NameInstance | NumberInstance;

export type {
  GarmentTextRenderInstance,
  MappedGizmoFlags,
  NameInstance,
  NameLimits,
  NamePosition,
  NamePreview,
  NumberInstance,
  NumberLimits,
  NumberPosition,
  NumberPreview,
  TextPrintInstance,
  TextPrintLimits,
  TextPrintPosition,
  TextPrintPreview,
};
