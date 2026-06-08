'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { SvgIcon } from '@atoms';

import { cn } from '@utils';

type ProductSessionAddButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ProductSessionAddButton = forwardRef<HTMLButtonElement, ProductSessionAddButtonProps>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex h-[92px] w-[92px] items-center justify-center border border-gray-200 bg-white',
        'transition-colors duration-200 hover:border-active hover:bg-gray-50',
        className,
      )}
      aria-label="Aggiungi prodotto"
      {...props}
    >
      <SvgIcon name="plus" className="size-6" />
    </button>
  );
});

ProductSessionAddButton.displayName = 'ProductSessionAddButton';

export { ProductSessionAddButton };
