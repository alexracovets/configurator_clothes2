'use client';

import { create } from 'zustand';

import type { StyleId } from '@data';

import type { CartItemConfiguration } from './cartItemConfiguration';
import { type CartItem, createCartItem, createDefaultCartItem } from './mapCartItems';

interface ConfigurationCartState {
  items: CartItem[];
  activeItemId: string;
  configurations: Record<string, CartItemConfiguration>;
  addItem: (styleId: StyleId, productIndex: number) => void;
  selectItem: (id: string) => void;
  removeItem: (id: string) => void;
  getActiveItemIndex: () => number;
  saveConfiguration: (itemId: string, configuration: CartItemConfiguration) => void;
  getConfiguration: (itemId: string) => CartItemConfiguration | undefined;
}

const initialItem = createDefaultCartItem();

const useConfigurationCart = create<ConfigurationCartState>((set, get) => ({
  items: [initialItem],
  activeItemId: initialItem.id,
  configurations: {},

  addItem: (styleId, productIndex) => {
    const item = createCartItem(styleId, productIndex);

    set((state) => ({
      items: [...state.items, item],
      activeItemId: item.id,
    }));
  },

  selectItem: (id) => {
    const exists = get().items.some((item) => item.id === id);
    if (!exists) return;

    set({ activeItemId: id });
  },

  removeItem: (id) => {
    const { items, activeItemId, configurations } = get();
    if (items.length <= 1) return;

    const nextItems = items.filter((item) => item.id !== id);
    const nextActiveId = activeItemId === id ? nextItems[0].id : activeItemId;
    const nextConfigurations = Object.fromEntries(Object.entries(configurations).filter(([itemId]) => itemId !== id));

    set({
      items: nextItems,
      activeItemId: nextActiveId,
      configurations: nextConfigurations,
    });
  },

  getActiveItemIndex: () => {
    const { items, activeItemId } = get();
    return items.findIndex((item) => item.id === activeItemId);
  },

  saveConfiguration: (itemId, configuration) => {
    set((state) => ({
      configurations: {
        ...state.configurations,
        [itemId]: configuration,
      },
    }));
  },

  getConfiguration: (itemId) => get().configurations[itemId],
}));

export { useConfigurationCart };
