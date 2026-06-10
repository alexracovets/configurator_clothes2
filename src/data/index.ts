import type { CatalogProductRef, GarmentConfig, StyleConfig, StyleId } from '@types';

import crewneckData from './crewneck/crewneck.json';

import { faqContent } from './modalInfo';

const STYLES: Record<StyleId, StyleConfig> = {
  crewneck: crewneckData as StyleConfig,
};

const getStyle = (id: StyleId): StyleConfig => STYLES[id];

const getProduct = (styleId: StyleId, productIndex: number): GarmentConfig | undefined => STYLES[styleId]?.products[productIndex - 1];

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

export { faqContent, getProduct, getStyle, listCatalogProducts, resolveProductPreviewSrc, STYLES };
