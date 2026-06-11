'use client';

import Image from 'next/image';

import { cva } from 'class-variance-authority';

import { cn } from '@utils';
import type { atomImagePropsType } from '@types';

const variantAtomImage = cva('', {
  variants: {
    variant: {
      default: 'w-full h-full',
      logo: 'relative h-[109px] aspect-[143/154] shrink-0',
      logo_full: 'relative h-[38px] aspect-[170/38] shrink-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const AtomImage = ({
  src,
  alt,
  variant = 'default',
  priority = false,
  loading,
  className,
  width,
  height,
  unoptimized = true,
  'data-active': dataActive,
  style,
  ...props
}: atomImagePropsType) => {
  const hasDimensions = width != null && height != null;
  const useFill = !hasDimensions;
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');

  const imageElement = (
    <Image
      src={src || ''}
      alt={alt || 'image'}
      priority={priority}
      sizes={useFill ? '100%' : undefined}
      loading={resolvedLoading}
      {...(hasDimensions ? { width, height } : { fill: true })}
      className={cn(useFill && 'object-contain', !useFill && className)}
      style={style}
      unoptimized={unoptimized}
      {...props}
    />
  );

  if (useFill) {
    return (
      <div data-active={dataActive} className={cn('relative', variantAtomImage({ variant }), className)}>
        {imageElement}
      </div>
    );
  }

  return imageElement;
};

export { AtomImage };
