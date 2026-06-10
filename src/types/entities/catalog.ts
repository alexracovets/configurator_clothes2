import type { GarmentConfig, StyleId } from './garment';

interface CatalogProductRef {
  styleId: StyleId;
  productIndex: number;
  product: GarmentConfig;
}

export type { CatalogProductRef };
