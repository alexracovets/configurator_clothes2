'use client';

import type { ReactNode } from 'react';

import type { PbrTexturePaths } from '@compositing';
import { useGarmentPbrMaps } from '@hooks';
import { PbrMapsProvider } from '@providers';

interface PbrMapsLoaderProps {
  paths: PbrTexturePaths;
  children: ReactNode;
}

const PbrMapsLoader = ({ paths, children }: PbrMapsLoaderProps) => {
  const maps = useGarmentPbrMaps(paths);
  return <PbrMapsProvider maps={maps}>{children}</PbrMapsProvider>;
};

export { PbrMapsLoader };
