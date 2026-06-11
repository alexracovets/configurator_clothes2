import type { cartItemType, styleIdType } from '@types';

const DEFAULT_STYLE_ID: styleIdType = 'crewneck';
const DEFAULT_PRODUCT_INDEX = 1;

const createCartItem = (styleId: styleIdType, productIndex: number): cartItemType => ({
  id: `cart-${styleId}-${productIndex}-${crypto.randomUUID()}`,
  styleId,
  productIndex,
});

const createDefaultCartItem = () => createCartItem(DEFAULT_STYLE_ID, DEFAULT_PRODUCT_INDEX);

export { createCartItem, createDefaultCartItem, DEFAULT_PRODUCT_INDEX, DEFAULT_STYLE_ID };
