'use client';

import { type ChangeEvent, useCallback } from 'react';

import { AtomInput, AtomTableCell, AtomTableRow, Button } from '@atoms';

import type { checkoutConfigurationTableRowPropsType } from '@types';

import { CheckoutQuantityStepper } from '../CheckoutQuantityStepper';
import { CheckoutSizePopover } from '../CheckoutSizePopover';

const CheckoutConfigurationTableRow = ({
  row,
  rowNumber,
  onSizeChange,
  onNameChange,
  onNumberChange,
  onQuantityChange,
  onRemove,
}: checkoutConfigurationTableRowPropsType) => {
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value), [onNameChange]);
  const handleNumberChange = useCallback((event: ChangeEvent<HTMLInputElement>) => onNumberChange(event.target.value), [onNumberChange]);
  const handleDecrease = useCallback(() => onQuantityChange(row.quantity - 1), [onQuantityChange, row.quantity]);
  const handleIncrease = useCallback(() => onQuantityChange(row.quantity + 1), [onQuantityChange, row.quantity]);

  return (
    <AtomTableRow>
      <AtomTableCell className="text-[14px] font-medium">{rowNumber}</AtomTableCell>
      <AtomTableCell className="p-0">
        <CheckoutSizePopover value={row.size} onChange={onSizeChange} />
      </AtomTableCell>
      <AtomTableCell>
        <AtomInput variant="checkout" value={row.name} onChange={handleNameChange} placeholder="Nome" />
      </AtomTableCell>
      <AtomTableCell>
        <AtomInput variant="checkout" value={row.number} onChange={handleNumberChange} placeholder="N." />
      </AtomTableCell>
      <AtomTableCell>
        <CheckoutQuantityStepper quantity={row.quantity} onDecrease={handleDecrease} onIncrease={handleIncrease} />
      </AtomTableCell>
      <AtomTableCell>
        <Button type="button" variant="delete" size="delete" className="mx-auto" onClick={onRemove}>
          Eliminare
        </Button>
      </AtomTableCell>
    </AtomTableRow>
  );
};

export { CheckoutConfigurationTableRow };
