import type { catalogProductRefType, garmentConfigType, styleConfigType, styleIdType } from '@types';

import crewneckData from './crewneck/crewneck.json';

import { discountsContent, faqContent, measureContent, reviewsContent, shippingContent } from './modalInfo';

const STYLES: Record<styleIdType, styleConfigType> = {
  crewneck: crewneckData as styleConfigType,
};

const getStyle = (id: styleIdType): styleConfigType => STYLES[id];

const getProduct = (styleId: styleIdType, productIndex: number): garmentConfigType | undefined => STYLES[styleId]?.products[productIndex - 1];

const listCatalogProducts = (): catalogProductRefType[] =>
  (Object.keys(STYLES) as styleIdType[]).flatMap((styleId) =>
    STYLES[styleId].products.map((product, index) => ({
      styleId,
      productIndex: index + 1,
      product,
    })),
  );

const resolveProductPreviewSrc = (product: garmentConfigType) =>
  product.previewImage ? `${product.path}${product.previewImage}` : `${product.path}designs/thumbs/crewneck_design_1.webp`;

export {
  discountsContent,
  faqContent,
  getProduct,
  getStyle,
  listCatalogProducts,
  measureContent,
  resolveProductPreviewSrc,
  reviewsContent,
  shippingContent,
  STYLES,
};
