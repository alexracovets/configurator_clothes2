import type { garmentConfigType, logoInstanceType, nameInstanceType } from '@types';

interface buildLogoGizmoElementsInputType {
  product: garmentConfigType;
  instances: logoInstanceType[];
}

interface buildNameGizmoElementsInputType {
  product: garmentConfigType;
  instances: nameInstanceType[];
  fontSizeMin: number;
  fontSizeMax: number;
}

export type { buildLogoGizmoElementsInputType, buildNameGizmoElementsInputType };
