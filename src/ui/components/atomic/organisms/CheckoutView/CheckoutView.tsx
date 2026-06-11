'use client';

import Link from 'next/link';

import { Flex, Grid, SvgIcon } from '@atoms';

import { CheckoutProductCard, CheckoutSummaryPanel } from '@molecules';
import { useCheckout } from '@store';

const CheckoutView = () => {
  const products = useCheckout((state) => state.products);

  return (
    <Grid className="grid-cols-[auto_400px]">
      <Flex className="flex-col items-start justify-start gap-6 pt-9 w-full">
        {products.map((product) => (
          <CheckoutProductCard key={product.cartItemId} product={product} />
        ))}
        <Link
          href="/configurator"
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[8px] border border-gray-20 bg-white px-4 text-[14px] font-semibold transition-colors hover:bg-gray-100"
        >
          <SvgIcon name="plus" />
          Aggiungi altri prodotti
        </Link>
      </Flex>

      <CheckoutSummaryPanel />
    </Grid>
  );
};

export { CheckoutView };
