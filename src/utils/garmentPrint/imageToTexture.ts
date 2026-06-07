import { SRGBColorSpace, Texture } from 'three';

import { loadCachedImage } from '../loadCachedImage/loadCachedImage';

const textureCache = new Map<string, Texture>();

const imageToTexture = async (src: string): Promise<Texture> => {
  const cached = textureCache.get(src);
  if (cached) return cached;

  const image = await loadCachedImage(src);
  const texture = new Texture(image);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  textureCache.set(src, texture);

  return texture;
};

const clearImageTextureCache = () => {
  for (const texture of textureCache.values()) {
    texture.dispose();
  }
  textureCache.clear();
};

export { clearImageTextureCache, imageToTexture };
