'use client';

import type { productCatalogPopoverPropsType } from '@types';
import { resolveProductPreviewSrc } from '@data';

import { useState } from 'react';

import { AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Grid, Text } from '@atoms';

import { ProductCatalogOption } from '../ProductCatalogOption';
import { ProductSessionAddButton } from '../ProductSessionAddButton';

const ProductCatalogPopover = ({ products, onSelect }: productCatalogPopoverPropsType) => {
  const [open, setOpen] = useState(false);

  return (
    <AtomPopover open={open} onOpenChange={setOpen}>
      <AtomPopoverTrigger asChild>
        <ProductSessionAddButton />
      </AtomPopoverTrigger>
      <AtomPopoverContent side="right" align="start" className="w-[240px] p-3" gap="sm">
        <Text className="text-[14px] font-semibold text-default">Seleziona prodotto</Text>
        <Grid className="grid-cols-2 gap-2">
          {products.map(({ styleId, productIndex, product }) => (
            <ProductCatalogOption
              key={`${styleId}-${productIndex}`}
              name={product.name}
              previewSrc={resolveProductPreviewSrc(product)}
              onSelect={() => {
                onSelect(styleId, productIndex);
                setOpen(false);
              }}
            />
          ))}
        </Grid>
      </AtomPopoverContent>
    </AtomPopover>
  );
};

export { ProductCatalogPopover };
