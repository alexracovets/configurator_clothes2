'use client';

import type { GarmentConfig, StyleId } from '@types';
import { getProduct } from '@data';

import { create } from 'zustand';

interface ConfiguratorProductState {
  styleId: StyleId;
  productIndex: number;
  product: GarmentConfig;
  setProductIndex: (index: number) => void;
  setProduct: (styleId: StyleId, productIndex: number) => void;
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
