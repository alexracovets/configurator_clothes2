import type { StyleId } from '@data';

interface CartItem {
  id: string;
  styleId: StyleId;
  productIndex: number;
}

const DEFAULT_STYLE_ID: StyleId = 'crewneck';
const DEFAULT_PRODUCT_INDEX = 1;

const createCartItem = (styleId: StyleId, productIndex: number): CartItem => ({
  id: `cart-${styleId}-${productIndex}-${crypto.randomUUID()}`,
  styleId,
  productIndex,
});

const createDefaultCartItem = () => createCartItem(DEFAULT_STYLE_ID, DEFAULT_PRODUCT_INDEX);

export { createCartItem, createDefaultCartItem, DEFAULT_PRODUCT_INDEX, DEFAULT_STYLE_ID };
export type { CartItem };
