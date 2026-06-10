'use client';

import Image, { ImageProps } from 'next/image';

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils';
import type { ChildrenType } from '@types';

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

interface AtomImageProps extends ChildrenType, ImageProps {
  src: string;
  alt: string;
  variant?: VariantProps<typeof variantAtomImage>['variant'];
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  'data-active'?: boolean;
}

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
}: AtomImageProps) => {
  const hasDimensions = width != null && height != null;
  const useFill = !hasDimensions;
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedStyle = hasDimensions ? { width, height, ...style } : style;

  const imageElement = (
    <Image
      src={src || ''}
      alt={alt || 'image'}
      priority={priority}
      sizes={useFill ? '100%' : undefined}
      loading={resolvedLoading}
      {...(hasDimensions ? { width, height } : { fill: true })}
      className={cn(!useFill && className)}
      style={resolvedStyle}
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
