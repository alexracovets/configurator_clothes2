'use client';

import { useEffect } from 'react';

import { useConfiguratorProduct, useGarmentColor } from '@store';

const GarmentProductInit = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const initForProduct = useGarmentColor((state) => state.initForProduct);

  useEffect(() => {
    initForProduct(product);
  }, [initForProduct, product]);

  return null;
};

export { GarmentProductInit };
