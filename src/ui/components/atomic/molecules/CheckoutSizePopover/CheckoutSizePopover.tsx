'use client';

import { useCallback, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { AtomPopover, AtomPopoverContent, AtomPopoverTrigger } from '@atoms';

import { CHECKOUT_SIZES } from '@constants';
import type { checkoutSizePopoverPropsType } from '@types';
import { cn } from '@utils';

const CheckoutSizePopover = ({ value, onChange }: checkoutSizePopoverPropsType) => {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (size: string) => {
      onChange(size);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <AtomPopover open={open} onOpenChange={setOpen}>
      <AtomPopoverTrigger asChild>
        <button
          type="button"
          className="flex h-full min-h-10 w-full items-center justify-center gap-1 px-2 py-2 text-[14px] font-medium text-default outline-none transition-colors hover:bg-gray-100/60 focus-visible:ring-2 focus-visible:ring-active focus-visible:ring-inset"
          aria-label={`Taglia: ${value}`}
        >
          <span>{value}</span>
          <ChevronDown className={cn('size-4 shrink-0 text-gray transition-transform', open && 'rotate-180')} aria-hidden />
        </button>
      </AtomPopoverTrigger>
      <AtomPopoverContent align="center" sideOffset={4} className="min-w-[88px] p-1">
        <ul className="flex flex-col">
          {CHECKOUT_SIZES.map((size) => (
            <li key={size}>
              <button
                type="button"
                onClick={() => handleSelect(size)}
                className={cn(
                  'w-full rounded-[6px] px-3 py-2 text-center text-[14px] font-medium transition-colors hover:bg-gray-100',
                  size === value && 'bg-gray-100 text-default',
                )}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </AtomPopoverContent>
    </AtomPopover>
  );
};

export { CheckoutSizePopover };
