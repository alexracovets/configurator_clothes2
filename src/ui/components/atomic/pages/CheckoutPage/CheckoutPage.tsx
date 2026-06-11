'use client';

import { useEffect } from 'react';

import { Container } from '@atoms';
import { CheckoutView } from '@organisms';
import { useCheckout } from '@store';

const CheckoutPage = () => {
  const initializeFromCart = useCheckout((state) => state.initializeFromCart);
  const initialized = useCheckout((state) => state.initialized);

  useEffect(() => {
    if (!initialized) {
      initializeFromCart();
    }
  }, [initializeFromCart, initialized]);

  return (
    <Container>
      <CheckoutView />
    </Container>
  );
};

export { CheckoutPage };
