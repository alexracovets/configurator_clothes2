'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { AtomImage, Box, Button, Flex, Grid, SvgIcon, Text } from '@atoms';

import { getProduct, resolveProductPreviewSrc } from '@data';
import { useCheckout } from '@store';
import type { checkoutProductCardPropsType } from '@types';
import { priceFormat } from '@utils';

import { CheckoutConfigurationTable } from '../CheckoutConfigurationTable';

const CheckoutProductCard = ({ product }: checkoutProductCardPropsType) => {
  const getProductQuantity = useCheckout((state) => state.getProductQuantity);
  const getProductSubtotal = useCheckout((state) => state.getProductSubtotal);

  const garment = getProduct(product.styleId, product.productIndex);
  const previewSrc = garment ? resolveProductPreviewSrc(garment) : '';
  const quantity = getProductQuantity(product.cartItemId);
  const subtotal = getProductSubtotal(product.cartItemId);

  const productName = useMemo(() => garment?.name ?? 'Prodotto', [garment?.name]);

  if (!garment) return null;

  return (
    <article className="w-full p-5 border border-primary-10 rounded-[12px]">
      <Grid className="grid-cols-[auto_1fr_auto] items-start gap-5">
        <AtomImage src={previewSrc} alt={productName} className="w-[101px] h-[126.73249053955078px] object-cover" />
        <Flex className="flex-col items-start justify-start gap-3">
          <Text variant="product_name" className="mb-0">
            {productName}
          </Text>
          <Flex className="flex-wrap gap-2">
            <Button variant="primary" size="xs">
              Elenco giocatori
            </Button>
            <Link href="/configurator">
              <Button size="xs" className="font-normal">
                Modifica Bozza
              </Button>
            </Link>
          </Flex>
          <Flex className="gap-3">
            <Text variant="small_secondary">Quantità</Text>
            <Box className="px-4 py-1.5 rounded-[8px] border border-primary-10">
              <Text variant="small_secondary" className="text-default">
                3 pz
              </Text>
            </Box>
          </Flex>
        </Flex>
        <Flex className="flex-col items-end gap-3">
          <Flex className="gap-3">
            <Text variant="product_price">{priceFormat(subtotal)}</Text>
            <Text variant="small">prezzo totale</Text>
            <SvgIcon name="three_dots" className="size-7 text-gray" />
          </Flex>
          <Flex className="flex-col gap-2 max-w-[250px]">
            <Text variant="small">% Scontistica applicata direttamente alla somma finale nel carrello</Text>
            <Text variant="small">Spedizione entro 15-20 giorni lavorativi.</Text>
          </Flex>
        </Flex>
      </Grid>

      <div className="pt-6">
        <CheckoutConfigurationTable cartItemId={product.cartItemId} rows={product.rows} />
      </div>
    </article>
  );
};

export { CheckoutProductCard };
