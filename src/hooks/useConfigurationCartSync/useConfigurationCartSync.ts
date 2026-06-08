'use client';

import { useLayoutEffect, useRef } from 'react';

import { activateCartItem, useConfigurationCart } from '@store';

const useConfigurationCartSync = () => {
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;
    const { activeItemId } = useConfigurationCart.getState();
    activateCartItem(() => useConfigurationCart.getState(), activeItemId);
  }, []);
};

export { useConfigurationCartSync };
