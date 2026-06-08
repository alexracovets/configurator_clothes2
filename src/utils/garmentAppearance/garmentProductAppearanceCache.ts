import type { Texture } from 'three';

import { emptyMaskPair, type PatternMaskPair } from '../garmentPrint/applyGarmentPrint';

interface ProductAppearanceTextures {
  logosTexture: Texture | null;
  maskTextures: PatternMaskPair;
  masksPatternKey: string | null;
}

const appearanceByProductPath = new Map<string, ProductAppearanceTextures>();

const getProductAppearanceTextures = (productPath: string): ProductAppearanceTextures => {
  const existing = appearanceByProductPath.get(productPath);
  if (existing) return existing;

  const created: ProductAppearanceTextures = {
    logosTexture: null,
    maskTextures: emptyMaskPair(),
    masksPatternKey: null,
  };

  appearanceByProductPath.set(productPath, created);
  return created;
};

const syncProductAppearanceTextures = (productPath: string, textures: Pick<ProductAppearanceTextures, 'logosTexture' | 'maskTextures' | 'masksPatternKey'>) => {
  const cache = getProductAppearanceTextures(productPath);
  cache.logosTexture = textures.logosTexture;
  cache.maskTextures = textures.maskTextures;
  cache.masksPatternKey = textures.masksPatternKey;
};

const readProductAppearanceTextures = (productPath: string): ProductAppearanceTextures => getProductAppearanceTextures(productPath);

export { getProductAppearanceTextures, readProductAppearanceTextures, syncProductAppearanceTextures };
export type { ProductAppearanceTextures };
