import { getProduct, type StyleId } from '@data';

import { useConfigurationControl } from '../useConfigurationControl';
import { useConfiguratorProduct } from '../useConfiguratorProduct';
import { applyGarmentConfiguration, captureGarmentConfiguration } from './cartItemConfiguration';
import type { CartItemConfiguration } from './cartItemConfiguration';

interface ActivateCartItemGetState {
  items: Array<{ id: string; styleId: StyleId; productIndex: number }>;
  saveConfiguration: (itemId: string, configuration: CartItemConfiguration) => void;
  getConfiguration: (itemId: string) => CartItemConfiguration | undefined;
}

const activateCartItem = (get: () => ActivateCartItemGetState, itemId: string, options?: { savePreviousId?: string | null }) => {
  const { items, saveConfiguration, getConfiguration } = get();
  const activeIndex = items.findIndex((item) => item.id === itemId);
  const activeItem = items[activeIndex];
  if (!activeItem) return;

  const savePreviousId = options?.savePreviousId;
  if (savePreviousId && savePreviousId !== itemId && items.some((item) => item.id === savePreviousId)) {
    saveConfiguration(savePreviousId, captureGarmentConfiguration());
  }

  const product = getProduct(activeItem.styleId, activeItem.productIndex);
  if (!product) return;

  useConfiguratorProduct.getState().setProduct(activeItem.styleId, activeItem.productIndex);
  useConfigurationControl.getState().setNumberProduct(activeIndex + 1);

  const configuration = getConfiguration(itemId);
  applyGarmentConfiguration(product, configuration);

  if (!configuration) {
    saveConfiguration(itemId, captureGarmentConfiguration());
  }
};

export { activateCartItem };
