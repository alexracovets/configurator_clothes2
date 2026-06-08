'use client';

import { useEffect } from 'react';

import { useConfiguratorProduct, useGarmentColor, useGarmentDesign, useGarmentName, useGarmentNumber } from '@store';

const GarmentProductInit = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const initForProduct = useGarmentColor((state) => state.initForProduct);
  const initDesignForProduct = useGarmentDesign((state) => state.initForProduct);
  const initNameForProduct = useGarmentName((state) => state.initForProduct);
  const initNumberForProduct = useGarmentNumber((state) => state.initForProduct);

  useEffect(() => {
    initForProduct(product);
    initDesignForProduct(product);
    initNameForProduct(product);
    initNumberForProduct(product);
  }, [initDesignForProduct, initForProduct, initNameForProduct, initNumberForProduct, product]);

  return null;
};

export { GarmentProductInit };
