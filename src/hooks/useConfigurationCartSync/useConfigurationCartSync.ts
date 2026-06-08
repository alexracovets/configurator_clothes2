'use client';

import { useEffect, useRef } from 'react';

import { getProduct } from '@data';
import { applyGarmentConfiguration, captureGarmentConfiguration, useConfigurationCart, useConfigurationControl, useConfiguratorProduct } from '@store';

const useConfigurationCartSync = () => {
  const activeItemId = useConfigurationCart((state) => state.activeItemId);
  const saveConfiguration = useConfigurationCart((state) => state.saveConfiguration);
  const setProduct = useConfiguratorProduct((state) => state.setProduct);
  const setNumberProduct = useConfigurationControl((state) => state.setNumberProduct);
  const previousActiveItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    const { items, getConfiguration } = useConfigurationCart.getState();
    const activeIndex = items.findIndex((item) => item.id === activeItemId);
    const activeItem = items[activeIndex];
    if (!activeItem) return;

    const previousActiveItemId = previousActiveItemIdRef.current;
    if (previousActiveItemId && previousActiveItemId !== activeItemId && items.some((item) => item.id === previousActiveItemId)) {
      saveConfiguration(previousActiveItemId, captureGarmentConfiguration());
    }

    const product = getProduct(activeItem.styleId, activeItem.productIndex);
    if (!product) return;

    setProduct(activeItem.styleId, activeItem.productIndex);
    setNumberProduct(activeIndex + 1);
    applyGarmentConfiguration(product, getConfiguration(activeItemId));

    previousActiveItemIdRef.current = activeItemId;
  }, [activeItemId, saveConfiguration, setNumberProduct, setProduct]);
};

export { useConfigurationCartSync };
