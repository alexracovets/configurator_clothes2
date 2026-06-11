'use client';

import type { cartItemConfigurationType, cartItemType, styleIdType } from '@types';
import { getProduct } from '@data';

import { create } from 'zustand';

import { activateCartItem } from './activateCartItem';
import { captureGarmentConfiguration, cloneCartItemConfiguration, createDefaultCartItemConfiguration } from './cartItemConfiguration';
import { inheritCartItemConfiguration } from './inheritCartItemConfiguration';
import { createCartItem, createDefaultCartItem } from './mapCartItems';

interface ConfigurationCartState {
  items: cartItemType[];
  activeItemId: string;
  configurations: Record<string, cartItemConfigurationType>;
  addItem: (styleId: styleIdType, productIndex: number) => void;
  duplicateActiveItem: () => void;
  selectItem: (id: string) => void;
  removeItem: (id: string) => void;
  getActiveItemIndex: () => number;
  saveConfiguration: (itemId: string, configuration: cartItemConfigurationType) => void;
  getConfiguration: (itemId: string) => cartItemConfigurationType | undefined;
}

const initialItem = createDefaultCartItem();

const useConfigurationCart = create<ConfigurationCartState>((set, get) => ({
  items: [initialItem],
  activeItemId: initialItem.id,
  configurations: {},

  addItem: (styleId, productIndex) => {
    const { items, activeItemId, configurations } = get();
    const item = createCartItem(styleId, productIndex);
    const newProduct = getProduct(styleId, productIndex);
    if (!newProduct) return;

    const nextConfigurations: Record<string, cartItemConfigurationType> = {
      ...configurations,
      [activeItemId]: captureGarmentConfiguration(),
    };

    const firstItem = items[0];
    const firstProduct = getProduct(firstItem.styleId, firstItem.productIndex);
    const referenceConfiguration =
      nextConfigurations[firstItem.id] ?? (firstProduct ? createDefaultCartItemConfiguration(firstProduct) : createDefaultCartItemConfiguration(newProduct));

    const inheritedConfiguration = firstProduct
      ? inheritCartItemConfiguration(referenceConfiguration, firstProduct, newProduct)
      : createDefaultCartItemConfiguration(newProduct);

    set({
      items: [...items, item],
      activeItemId: item.id,
      configurations: {
        ...nextConfigurations,
        [item.id]: inheritedConfiguration,
      },
    });

    activateCartItem(get, item.id);
  },

  duplicateActiveItem: () => {
    const { items, activeItemId, configurations } = get();
    const activeItem = items.find((item) => item.id === activeItemId);
    if (!activeItem) return;

    const currentConfiguration = captureGarmentConfiguration();
    const nextConfigurations: Record<string, cartItemConfigurationType> = {
      ...configurations,
      [activeItemId]: currentConfiguration,
    };

    const duplicatedItem = createCartItem(activeItem.styleId, activeItem.productIndex);

    set({
      items: [...items, duplicatedItem],
      activeItemId: duplicatedItem.id,
      configurations: {
        ...nextConfigurations,
        [duplicatedItem.id]: cloneCartItemConfiguration(currentConfiguration),
      },
    });

    activateCartItem(get, duplicatedItem.id);
  },

  selectItem: (id) => {
    const { items, activeItemId } = get();
    if (!items.some((item) => item.id === id) || activeItemId === id) return;

    activateCartItem(get, id, { savePreviousId: activeItemId });
    set({ activeItemId: id });
  },

  removeItem: (id) => {
    const { items, activeItemId, configurations } = get();
    if (items.length <= 1) return;

    const nextItems = items.filter((item) => item.id !== id);
    const nextActiveId = activeItemId === id ? nextItems[0].id : activeItemId;
    const nextConfigurations = Object.fromEntries(Object.entries(configurations).filter(([itemId]) => itemId !== id));
    const wasActive = activeItemId === id;

    set({
      items: nextItems,
      activeItemId: nextActiveId,
      configurations: nextConfigurations,
    });

    if (wasActive) {
      activateCartItem(get, nextActiveId);
    }
  },

  getActiveItemIndex: () => {
    const { items, activeItemId } = get();
    return items.findIndex((item) => item.id === activeItemId);
  },

  saveConfiguration: (itemId, configuration) => {
    set((state) => ({
      configurations: {
        ...state.configurations,
        [itemId]: cloneCartItemConfiguration(configuration),
      },
    }));
  },

  getConfiguration: (itemId) => get().configurations[itemId],
}));

export { useConfigurationCart };
