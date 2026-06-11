'use client';

import { AtomTableHead, AtomTableHeader, AtomTableRow } from '@atoms';

import { CHECKOUT_CONFIGURATION_TABLE_COLUMNS } from '@constants';
import { cn } from '@utils';

const CheckoutConfigurationTableHeader = () => {
  return (
    <AtomTableHeader>
      <AtomTableRow>
        {CHECKOUT_CONFIGURATION_TABLE_COLUMNS.map(({ id, header, className }) => (
          <AtomTableHead key={id} className={cn(className)}>
            {header}
          </AtomTableHead>
        ))}
      </AtomTableRow>
    </AtomTableHeader>
  );
};

export { CheckoutConfigurationTableHeader };
