'use client';

import { useState } from 'react';

import { AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Grid, Text } from '@atoms';

import { type CatalogProductRef, resolveProductPreviewSrc } from '@data';

import { ProductCatalogOption } from '../ProductCatalogOption';
import { ProductSessionAddButton } from '../ProductSessionAddButton';

interface ProductCatalogPopoverProps {
  products: CatalogProductRef[];
  onSelect: (styleId: CatalogProductRef['styleId'], productIndex: number) => void;
}

const ProductCatalogPopover = ({ products, onSelect }: ProductCatalogPopoverProps) => {
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
