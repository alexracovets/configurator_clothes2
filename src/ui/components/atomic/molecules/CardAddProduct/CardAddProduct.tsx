'use client';

import { Flex } from '@atoms';

import { getProduct, listCatalogProducts, resolveProductPreviewSrc } from '@data';
import { useConfigurationCart } from '@store';

import { ProductCatalogPopover } from '../ProductCatalogPopover';
import { ProductSessionRow } from '../ProductSessionRow';

const CardAddProduct = () => {
  const items = useConfigurationCart((state) => state.items);
  const activeItemId = useConfigurationCart((state) => state.activeItemId);
  const addItem = useConfigurationCart((state) => state.addItem);
  const selectItem = useConfigurationCart((state) => state.selectItem);
  const removeItem = useConfigurationCart((state) => state.removeItem);
  const catalogProducts = listCatalogProducts();

  return (
    <Flex className="absolute left-4 top-4 z-30 flex-col gap-0">
      {items.map((item) => {
        const product = getProduct(item.styleId, item.productIndex);
        if (!product) return null;

        return (
          <ProductSessionRow
            key={item.id}
            name={product.name}
            previewSrc={resolveProductPreviewSrc(product)}
            active={item.id === activeItemId}
            canRemove={items.length > 1}
            onSelect={() => selectItem(item.id)}
            onRemove={() => removeItem(item.id)}
          />
        );
      })}
      <ProductCatalogPopover products={catalogProducts} onSelect={addItem} />
    </Flex>
  );
};

export { CardAddProduct };
