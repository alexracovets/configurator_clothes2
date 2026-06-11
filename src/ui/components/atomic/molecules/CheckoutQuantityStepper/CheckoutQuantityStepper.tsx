'use client';

import { Button, Flex, Text } from '@atoms';

import type { checkoutQuantityStepperPropsType } from '@types';

const CheckoutQuantityStepper = ({ quantity, onDecrease, onIncrease }: checkoutQuantityStepperPropsType) => {
  return (
    <Flex className="items-center justify-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-full border border-gray-20"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Diminuisci quantità"
      >
        −
      </Button>
      <Text className="min-w-4 text-center text-[14px] font-medium">{quantity}</Text>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-full border border-gray-20"
        onClick={onIncrease}
        aria-label="Aumenta quantità"
      >
        +
      </Button>
    </Flex>
  );
};

export { CheckoutQuantityStepper };
