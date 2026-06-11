'use client';

import { AtomTable, AtomTableBody, Button, SvgIcon } from '@atoms';

import { CHECKOUT_TABLE_ADD_ROW_LABEL } from '@constants';
import { useCheckoutConfigurationTable } from '@hooks';
import type { checkoutConfigurationTablePropsType } from '@types';

import { CheckoutConfigurationTableHeader } from './CheckoutConfigurationTableHeader';
import { CheckoutConfigurationTableRow } from './CheckoutConfigurationTableRow';

const CheckoutConfigurationTable = ({ cartItemId, rows }: checkoutConfigurationTablePropsType) => {
  const { handleAddRow, handleRemoveRow, handlePatchRow } = useCheckoutConfigurationTable(cartItemId);

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <AtomTable variant="checkout">
        <CheckoutConfigurationTableHeader />
        <AtomTableBody>
          {rows.map((row, index) => (
            <CheckoutConfigurationTableRow
              key={row.id}
              row={row}
              rowNumber={index + 1}
              onSizeChange={(size) => handlePatchRow(row.id, { size })}
              onNameChange={(name) => handlePatchRow(row.id, { name })}
              onNumberChange={(number) => handlePatchRow(row.id, { number })}
              onQuantityChange={(quantity) => handlePatchRow(row.id, { quantity: Math.max(1, quantity) })}
              onRemove={() => handleRemoveRow(row.id)}
            />
          ))}
        </AtomTableBody>
      </AtomTable>

      <Button type="button" variant="ghost" size="sm" className="mt-4 border border-gray-20 bg-white" onClick={handleAddRow}>
        <SvgIcon name="plus" />
        {CHECKOUT_TABLE_ADD_ROW_LABEL}
      </Button>
    </div>
  );
};

export { CheckoutConfigurationTable };
