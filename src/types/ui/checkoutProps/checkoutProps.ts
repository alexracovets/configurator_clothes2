import type { checkoutLineRowType, checkoutProductType } from '../../checkout';

interface checkoutProductCardPropsType {
  product: checkoutProductType;
}

interface checkoutConfigurationTablePropsType {
  cartItemId: string;
  rows: checkoutProductType['rows'];
}

interface checkoutConfigurationTableRowPropsType {
  row: checkoutLineRowType;
  rowNumber: number;
  onSizeChange: (size: string) => void;
  onNameChange: (name: string) => void;
  onNumberChange: (number: string) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

interface checkoutQuantityStepperPropsType {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

interface checkoutSizePopoverPropsType {
  value: string;
  onChange: (size: string) => void;
}

export type {
  checkoutConfigurationTablePropsType,
  checkoutConfigurationTableRowPropsType,
  checkoutProductCardPropsType,
  checkoutQuantityStepperPropsType,
  checkoutSizePopoverPropsType,
};
