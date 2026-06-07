'use client';

import { useEffect } from 'react';

import { useConfiguratorProduct, useGarmentColor, useGarmentDesign, useGarmentName } from '@store';

const GarmentProductInit = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const initForProduct = useGarmentColor((state) => state.initForProduct);
  const initDesignForProduct = useGarmentDesign((state) => state.initForProduct);
  const initNameForProduct = useGarmentName((state) => state.initForProduct);

  useEffect(() => {
    initForProduct(product);
    initDesignForProduct(product);
    initNameForProduct(product);
  }, [initDesignForProduct, initForProduct, initNameForProduct, product]);

  return null;
};

export { GarmentProductInit };
