import type { garmentConfigType, styleIdType } from '@types';

interface catalogProductRefType {
  styleId: styleIdType;
  productIndex: number;
  product: garmentConfigType;
}

export type { catalogProductRefType };
