'use client';

import type { checkoutLineRowPatchType, checkoutProductType } from '@types';

import { create } from 'zustand';

import { captureGarmentConfiguration, useConfigurationCart } from '../useConfigurationCart';

import { buildCheckoutRows, createCheckoutRow } from './buildCheckoutRows';
import { getCheckoutDiscountPercent, getProductRowQuantity, getProductsSubtotal, getProductUnitPrice } from './checkoutPricing';

interface CheckoutState {
  products: checkoutProductType[];
  initialized: boolean;
  initializeFromCart: () => void;
  addRow: (cartItemId: string) => void;
  removeRow: (cartItemId: string, rowId: string) => void;
  updateRow: (cartItemId: string, rowId: string, patch: checkoutLineRowPatchType) => void;
  getProductQuantity: (cartItemId: string) => number;
  getGrandTotalQuantity: () => number;
  getProductSubtotal: (cartItemId: string) => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getDiscountPercent: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
}

const useCheckout = create<CheckoutState>((set, get) => ({
  products: [],
  initialized: false,

  initializeFromCart: () => {
    const cartState = useConfigurationCart.getState();
    const activeConfiguration = captureGarmentConfiguration();
    const configurations = {
      ...cartState.configurations,
      [cartState.activeItemId]: activeConfiguration,
    };

    const products: checkoutProductType[] = cartState.items.map((item) => ({
      cartItemId: item.id,
      styleId: item.styleId,
      productIndex: item.productIndex,
      rows: buildCheckoutRows(configurations[item.id]),
    }));

    set({ products, initialized: true });
  },

  addRow: (cartItemId) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.cartItemId === cartItemId
          ? {
              ...product,
              rows: [...product.rows, createCheckoutRow('L')],
            }
          : product,
      ),
    }));
  },

  removeRow: (cartItemId, rowId) => {
    set((state) => ({
      products: state.products.map((product) => {
        if (product.cartItemId !== cartItemId || product.rows.length <= 1) return product;
        return {
          ...product,
          rows: product.rows.filter((row) => row.id !== rowId),
        };
      }),
    }));
  },

  updateRow: (cartItemId, rowId, patch) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.cartItemId === cartItemId
          ? {
              ...product,
              rows: product.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
            }
          : product,
      ),
    }));
  },

  getProductQuantity: (cartItemId) => {
    const product = get().products.find((item) => item.cartItemId === cartItemId);
    if (!product) return 0;
    return getProductRowQuantity(product);
  },

  getGrandTotalQuantity: () => get().products.reduce((sum, product) => sum + getProductRowQuantity(product), 0),

  getProductSubtotal: (cartItemId) => {
    const product = get().products.find((item) => item.cartItemId === cartItemId);
    if (!product) return 0;
    return getProductUnitPrice(product) * getProductRowQuantity(product);
  },

  getSubtotal: () => getProductsSubtotal(get().products),

  getShippingCost: () => 0,

  getDiscountPercent: () => getCheckoutDiscountPercent(get().getGrandTotalQuantity()),

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const discountPercent = get().getDiscountPercent();
    return subtotal * (discountPercent / 100);
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const shipping = get().getShippingCost();
    return Math.max(subtotal - discount + shipping, 0);
  },
}));

export { useCheckout };
