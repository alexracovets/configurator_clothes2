'use client';

import type { garmentConfigType, styleIdType } from '@types';
import { getProduct } from '@data';

import { create } from 'zustand';

interface ConfiguratorProductState {
  styleId: styleIdType;
  productIndex: number;
  product: garmentConfigType;
  setProductIndex: (index: number) => void;
  setProduct: (styleId: styleIdType, productIndex: number) => void;
}

const DEFAULT_STYLE_ID: styleIdType = 'crewneck';
const DEFAULT_PRODUCT_INDEX = 1;

const resolveProduct = (styleId: styleIdType, productIndex: number): garmentConfigType => {
  const product = getProduct(styleId, productIndex);
  if (!product) throw new Error(`Product not found: ${styleId} #${productIndex}`);
  return product;
};

const useConfiguratorProduct = create<ConfiguratorProductState>((set) => ({
  styleId: DEFAULT_STYLE_ID,
  productIndex: DEFAULT_PRODUCT_INDEX,
  product: resolveProduct(DEFAULT_STYLE_ID, DEFAULT_PRODUCT_INDEX),
  setProductIndex: (productIndex) => {
    set((state) => ({
      productIndex,
      product: resolveProduct(state.styleId, productIndex),
    }));
  },
  setProduct: (styleId, productIndex) => {
    set({
      styleId,
      productIndex,
      product: resolveProduct(styleId, productIndex),
    });
  },
}));

export { useConfiguratorProduct };
