'use client';

import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

import type { MeshStandardMaterial } from 'three';

interface GarmentMaterialRegistryValue {
  register: (key: string, material: MeshStandardMaterial) => void;
  unregister: (key: string, material: MeshStandardMaterial) => void;
  getMaterials: (key: string) => readonly MeshStandardMaterial[];
}

const GarmentMaterialRegistryContext = createContext<GarmentMaterialRegistryValue | null>(null);

const GarmentMaterialRegistryProvider = ({ children }: { children: React.ReactNode }) => {
  const materialsRef = useRef<Map<string, Set<MeshStandardMaterial>>>(new Map());

  const register = useCallback((key: string, material: MeshStandardMaterial) => {
    const bucket = materialsRef.current.get(key) ?? new Set<MeshStandardMaterial>();
    bucket.add(material);
    materialsRef.current.set(key, bucket);
  }, []);

  const unregister = useCallback((key: string, material: MeshStandardMaterial) => {
    const bucket = materialsRef.current.get(key);
    if (!bucket) return;
    bucket.delete(material);
    if (bucket.size === 0) materialsRef.current.delete(key);
  }, []);

  const getMaterials = useCallback((key: string) => {
    return Array.from(materialsRef.current.get(key) ?? []);
  }, []);

  const value = useMemo(
    () => ({
      register,
      unregister,
      getMaterials,
    }),
    [getMaterials, register, unregister],
  );

  return <GarmentMaterialRegistryContext.Provider value={value}>{children}</GarmentMaterialRegistryContext.Provider>;
};

const useGarmentMaterialRegistry = (): GarmentMaterialRegistryValue => {
  const context = useContext(GarmentMaterialRegistryContext);
  if (!context) throw new Error('useGarmentMaterialRegistry must be used within GarmentMaterialRegistryProvider');
  return context;
};

export { GarmentMaterialRegistryProvider, useGarmentMaterialRegistry };
