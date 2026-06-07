'use client';

import { create } from 'zustand';

import { GarmentConfig, getProduct, type StyleId } from '@data';

interface ConfiguratorProductState {
  styleId: StyleId;
  productIndex: number;
  product: GarmentConfig;
  setProductIndex: (index: number) => void;
}

const DEFAULT_STYLE_ID: StyleId = 'crewneck';
const DEFAULT_PRODUCT_INDEX = 1;

const resolveProduct = (styleId: StyleId, productIndex: number): GarmentConfig => {
  const product = getProduct(styleId, productIndex);
  if (!product) throw new Error(`Product not found: ${styleId} #${productIndex}`);
  return product;
};

const useConfiguratorProduct = create<ConfiguratorProductState>((set) => ({
  styleId: DEFAULT_STYLE_ID,
  productIndex: DEFAULT_PRODUCT_INDEX,
  product: resolveProduct(DEFAULT_STYLE_ID, DEFAULT_PRODUCT_INDEX),
  setProductIndex: (productIndex) => {
    set({
      productIndex,
      product: resolveProduct(DEFAULT_STYLE_ID, productIndex),
    });
  },
}));

export { useConfiguratorProduct };
