'use client';

import { useState } from 'react';

import { AtomImage, Button, SvgIcon, Text } from '@atoms';

import { ProductSessionPreviewSkeleton } from '@skeletons';
import type { productSessionRowPropsType } from '@types';
import { cn } from '@utils';

const ProductSessionRow = ({ name, previewSrc, active = false, canRemove = true, onSelect, onRemove }: productSessionRowPropsType) => {
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);

  return (
    <div className="group relative h-[92px] w-[92px]">
      <div
        data-active={active}
        className={cn(
          'absolute left-0 top-0 z-10 flex h-[92px] items-center overflow-hidden border border-gray-200 bg-white',
          'w-[92px] transition-[width,box-shadow] duration-200 ease-out',
          'group-hover:z-30 group-hover:w-[220px] group-hover:shadow-md',
          active && 'border-active shadow-sm',
        )}
      >
        <button type="button" onClick={onSelect} className="flex h-full min-w-0 flex-1 items-center">
          <div className="relative h-[90px] w-[90px] shrink-0">
            {!isPreviewLoaded && <ProductSessionPreviewSkeleton />}
            <AtomImage src={previewSrc} alt={name} className={cn('h-full w-full', !isPreviewLoaded && 'opacity-0')} onLoad={() => setIsPreviewLoaded(true)} />
          </div>
          <Text className="min-w-0 flex-1 truncate px-2 text-left text-[14px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {name}
          </Text>
        </button>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mr-2 size-8 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={onRemove}
            aria-label={`Rimuovi ${name}`}
          >
            <SvgIcon name="delete" className="text-error" />
          </Button>
        )}
      </div>
    </div>
  );
};

export { ProductSessionRow };
