import crewneckData from './crewneck/crewneck.json';

import type { GarmentConfig, StyleConfig, StyleId } from './types';

const STYLES: Record<StyleId, StyleConfig> = {
  crewneck: crewneckData as StyleConfig,
};

const getStyle = (id: StyleId): StyleConfig => STYLES[id];

const getProduct = (styleId: StyleId, productIndex: number): GarmentConfig | undefined => STYLES[styleId]?.products[productIndex - 1];

interface CatalogProductRef {
  styleId: StyleId;
  productIndex: number;
  product: GarmentConfig;
}

const listCatalogProducts = (): CatalogProductRef[] =>
  (Object.keys(STYLES) as StyleId[]).flatMap((styleId) =>
    STYLES[styleId].products.map((product, index) => ({
      styleId,
      productIndex: index + 1,
      product,
    })),
  );

const resolveProductPreviewSrc = (product: GarmentConfig) =>
  product.previewImage ? `${product.path}${product.previewImage}` : `${product.path}designs/thumbs/crewneck_design_1.webp`;

export { getProduct, getStyle, listCatalogProducts, resolveProductPreviewSrc, STYLES };
export type { CatalogProductRef };
export type {
  GarmentConfig,
  GarmentPartConfig,
  LogoPositionConfig,
  NamePositionConfig,
  PartGradientConfig,
  PrintAtlasConfig,
  StyleConfig,
  StyleId,
  TextDefaultsConfig,
  UvBounds,
  UvPoint,
} from './types';
