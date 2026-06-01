'use client';

import { memo } from 'react';

import { Flex, Grid, Text } from '@atoms';

import { useConfigurationControl } from '@store';
import { priceFormat } from '@utils';
import { useShallow } from 'zustand/react/shallow';

const ConfiguratorProduct = memo(() => {
  const { price, name, numberProduct, count_to_bonus, minimum_count, bonus_discount } = useConfigurationControl(
    useShallow((state) => ({
      price: state.price,
      name: state.name,
      numberProduct: state.numberProduct,
      count_to_bonus: state.count_to_bonus,
      bonus_discount: state.bonus_discount,
      minimum_count: state.minimum_count,
    })),
  );

  return (
    <Flex className="flex-col">
      <Grid className="grid-cols-[1fr_auto] gap-3">
        <Text variant="product_name" asChild>
          <h3>{name}</h3>
        </Text>
        <Flex className="flex-col items-start px-3 py-2 rounded-[4px] bg-primary hover:bg-primary/90 transition-colors">
          <Text className="font-semibold">Prodotto {numberProduct}</Text>
          <Text className="text-[14px] text-gray">Minimo {minimum_count} pz</Text>
        </Flex>
      </Grid>
      <Grid variant="configurator_price">
        <Text variant="product_price">{priceFormat(price)}</Text>
        <Text className="text-[#6B7280] font-medium">{`>${count_to_bonus} pezzi +${bonus_discount}% di sconto`}</Text>
      </Grid>
    </Flex>
  );
});

ConfiguratorProduct.displayName = 'ConfiguratorProduct';

export { ConfiguratorProduct };
