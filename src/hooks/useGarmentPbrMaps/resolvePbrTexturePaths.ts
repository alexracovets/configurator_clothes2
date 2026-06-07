import type { GarmentConfig } from '@data';
import type { PbrTexturePaths } from '@utils';

const resolvePbrTexturePaths = (product: GarmentConfig): PbrTexturePaths | null => {
  const files = product.pbrTextures;
  if (!files) return null;

  const base = product.path.endsWith('/') ? product.path : `${product.path}/`;

  return {
    bakeNormal: `${base}${files.bakeNormal}`,
    bakeAoRoughness: `${base}${files.bakeAoRoughness}`,
    fabricNormal: `${base}${files.fabricNormal}`,
    fabricRoughness: `${base}${files.fabricRoughness}`,
  };
};

export { resolvePbrTexturePaths };
