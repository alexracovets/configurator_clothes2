'use client';

import type { ReactNode } from 'react';

import { useAsyncGarmentPbrMaps } from '@hooks';
import { PbrMapsProvider } from '@providers';
import type { PbrTexturePaths } from '@utils';

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
  const maps = useAsyncGarmentPbrMaps(paths);

  return <PbrMapsProvider maps={maps}>{children}</PbrMapsProvider>;
};

export { PbrMapsLoader };
