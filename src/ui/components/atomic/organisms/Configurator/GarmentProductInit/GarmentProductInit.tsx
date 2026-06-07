'use client';

import { useEffect } from 'react';

import { useConfiguratorProduct, useGarmentColor, useGarmentDesign } from '@store';

const GarmentProductInit = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const initForProduct = useGarmentColor((state) => state.initForProduct);
  const initDesignForProduct = useGarmentDesign((state) => state.initForProduct);

  useEffect(() => {
    initForProduct(product);
    initDesignForProduct(product);
  }, [initDesignForProduct, initForProduct, product]);

  return null;
};

export { GarmentProductInit };
