'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Button, Container, Flex, SvgIcon } from '@atoms';

import { captureGarmentConfiguration, useCheckout, useConfigurationCart, useInfoDialog } from '@store';

const FooterConfiguration = () => {
  const router = useRouter();
  const duplicateActiveItem = useConfigurationCart((state) => state.duplicateActiveItem);
  const activeItemId = useConfigurationCart((state) => state.activeItemId);
  const saveConfiguration = useConfigurationCart((state) => state.saveConfiguration);
  const initializeFromCart = useCheckout((state) => state.initializeFromCart);
  const setIsOpen = useInfoDialog((state) => state.setIsOpen);

  const handleDuplicate = useCallback(() => {
    duplicateActiveItem();
  }, [duplicateActiveItem]);

  const handleInfo = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleComplete = useCallback(() => {
    saveConfiguration(activeItemId, captureGarmentConfiguration());
    initializeFromCart();
    router.push('/checkout');
  }, [activeItemId, initializeFromCart, router, saveConfiguration]);

  return (
    <Container>
      <Flex className="gap-2 items-center justify-center w-full pb-12 pt-2">
        <Button size="sm">
          <SvgIcon name="share" />
          Condividi
        </Button>
        <Button size="sm">
          <SvgIcon name="plus" />
          Prodotto
        </Button>
        <Button size="sm" onClick={handleDuplicate}>
          <SvgIcon name="duplicate" />
          Duplica
        </Button>
        <Button size="sm" onClick={handleInfo}>
          <SvgIcon name="info" />
          Info
        </Button>
        <Button variant="primary" size="sm" onClick={handleComplete}>
          <SvgIcon name="cart" />
          Completa Config.
        </Button>
      </Flex>
    </Container>
  );
};

export { FooterConfiguration };
