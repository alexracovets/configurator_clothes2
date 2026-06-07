'use client';

import type { ReactNode } from 'react';

import type { PbrTexturePaths } from '@utils';
import { useGarmentPbrMaps } from '@hooks';
import { PbrMapsProvider } from '@providers';

interface PbrMapsLoaderProps {
  paths: PbrTexturePaths | null;
  children: ReactNode;
}

const PbrMapsLoader = ({ paths, children }: PbrMapsLoaderProps) => {
  if (!paths) {
    return <PbrMapsProvider maps={null}>{children}</PbrMapsProvider>;
  }

  return <PbrMapsLoaderWithMaps paths={paths}>{children}</PbrMapsLoaderWithMaps>;
};

const PbrMapsLoaderWithMaps = ({ paths, children }: { paths: PbrTexturePaths; children: ReactNode }) => {
  const maps = useGarmentPbrMaps(paths);
  return <PbrMapsProvider maps={maps}>{children}</PbrMapsProvider>;
};

export { PbrMapsLoader };
