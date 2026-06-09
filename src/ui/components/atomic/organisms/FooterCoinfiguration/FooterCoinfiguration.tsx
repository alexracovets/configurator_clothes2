'use client';

import { Button, Container, Flex, SvgIcon } from '@atoms';
import { useConfigurationCart } from '@store';
import { useCallback } from 'react';

const FooterCoinfiguration = () => {
  const duplicateActiveItem = useConfigurationCart((state) => state.duplicateActiveItem);

  const handleDuplicate = useCallback(() => {
    duplicateActiveItem();
  }, [duplicateActiveItem]);

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
        <Button size="sm">
          <SvgIcon name="info" />
          Info
        </Button>
        <Button variant="primary" size="sm">
          <SvgIcon name="cart" />
          Completa Config.
        </Button>
      </Flex>
    </Container>
  );
};

export { FooterCoinfiguration };
