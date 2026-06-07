'use client';

import { createContext, useContext, useMemo } from 'react';

import type { PbrMaps } from '@utils';

const PbrMapsContext = createContext<PbrMaps | null>(null);

const PbrMapsProvider = ({ maps, children }: { maps: PbrMaps | null; children: React.ReactNode }) => {
  const value = useMemo(() => maps, [maps]);
  return <PbrMapsContext.Provider value={value}>{children}</PbrMapsContext.Provider>;
};

const usePbrMaps = (): PbrMaps | null => useContext(PbrMapsContext);

export { PbrMapsProvider, usePbrMaps };
