import type { ChangeEvent } from 'react';

interface colorControlPropsType {
  color: string;
  label?: string;
  onSelect?: (color: string) => void;
  onPreviewSelect?: (color: string) => void;
}

type colorTabType = 'colori' | 'contorno';

interface colorTabControlPropsType {
  textColor: string;
  strokeColor: string;
  onTextColor: (color: string) => void;
  onStrokeColor: (color: string) => void;
  onPreviewTextColor?: (color: string) => void;
  onPreviewStrokeColor?: (color: string) => void;
  label?: string;
}

interface fontSelectRowPropsType {
  font: string;
  onChange: (font: string) => void;
}

interface hiddenLogoFileInputPropsType {
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface logoEditPanelPropsType {
  partId: string;
  onClose: () => void;
  onReplaceImage: () => void;
  replacing?: boolean;
}

interface partColorSwitchPropsType {
  color: string;
  label: string;
}

interface rangeControlPropsType {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

interface shadingControlPropsType {
  partId: string;
}

interface toggleControlPropsType {
  label: string;
  active: boolean;
  onChange: (value: boolean) => void;
}

export type {
  colorControlPropsType,
  colorTabType,
  colorTabControlPropsType,
  fontSelectRowPropsType,
  hiddenLogoFileInputPropsType,
  logoEditPanelPropsType,
  partColorSwitchPropsType,
  rangeControlPropsType,
  shadingControlPropsType,
  toggleControlPropsType,
};
