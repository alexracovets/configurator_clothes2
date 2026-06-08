'use client';

import { useEffect } from 'react';

import { useConfiguratorProduct, useGarmentColor, useGarmentDesign, useGarmentLogo, useGarmentName, useGarmentNumber } from '@store';

const GarmentProductInit = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const initForProduct = useGarmentColor((state) => state.initForProduct);
  const initDesignForProduct = useGarmentDesign((state) => state.initForProduct);
  const initNameForProduct = useGarmentName((state) => state.initForProduct);
  const initNumberForProduct = useGarmentNumber((state) => state.initForProduct);
  const initLogoForProduct = useGarmentLogo((state) => state.initForProduct);

  useEffect(() => {
    initForProduct(product);
    initDesignForProduct(product);
    initNameForProduct(product);
    initNumberForProduct(product);
    initLogoForProduct(product);
  }, [initDesignForProduct, initForProduct, initLogoForProduct, initNameForProduct, initNumberForProduct, product]);

  return null;
};

export { GarmentProductInit };
