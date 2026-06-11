'use client';

import { Grid, Text } from '@atoms';
import type { productGalleryBlockPropsType } from '@types';
import { cn } from '@utils';

import { ProductFlipCard } from '../ProductFlipCard';

const ProductGalleryBlock = ({ title, items, className }: productGalleryBlockPropsType) => {
  return (
    <section className={cn('w-full', className)}>
      <Text variant="h2">{title}</Text>
      <Grid className="grid-cols-4 gap-6">
        {items.map(({ collection, slug, alt }) => (
          <ProductFlipCard key={`${collection}-${slug}`} collection={collection} slug={slug} alt={alt} />
        ))}
      </Grid>
    </section>
  );
};

export { ProductGalleryBlock };
