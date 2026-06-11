import type { checkoutProductType } from '@types';
import { getProduct } from '@data';

const getProductRowQuantity = (product: checkoutProductType) => product.rows.reduce((sum, row) => sum + row.quantity, 0);

const getCheckoutDiscountPercent = (totalQuantity: number): number => {
  if (totalQuantity >= 110) return 10;
  if (totalQuantity >= 81) return 7;
  if (totalQuantity >= 51) return 5;
  if (totalQuantity >= 26) return 3;
  return 0;
};

const getProductUnitPrice = (product: checkoutProductType) => {
  const garment = getProduct(product.styleId, product.productIndex);
  return garment?.price ?? 0;
};

const getProductsSubtotal = (products: checkoutProductType[]) =>
  products.reduce((sum, product) => {
    const unitPrice = getProductUnitPrice(product);
    const quantity = getProductRowQuantity(product);
    return sum + unitPrice * quantity;
  }, 0);

export { getCheckoutDiscountPercent, getProductRowQuantity, getProductUnitPrice, getProductsSubtotal };
