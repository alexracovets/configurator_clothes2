import type { styleIdType } from '@types';

interface checkoutLineRowType {
  id: string;
  size: string;
  name: string;
  number: string;
  quantity: number;
}

interface checkoutProductType {
  cartItemId: string;
  styleId: styleIdType;
  productIndex: number;
  rows: checkoutLineRowType[];
}

type checkoutLineRowPatchType = Partial<Pick<checkoutLineRowType, 'size' | 'name' | 'number' | 'quantity'>>;

export type { checkoutLineRowPatchType, checkoutLineRowType, checkoutProductType };
