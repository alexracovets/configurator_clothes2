import { NoColorSpace, Texture } from 'three';

const canvasToMaskTexture = (canvas: HTMLCanvasElement): Texture => {
  const texture = new Texture(canvas);
  texture.colorSpace = NoColorSpace;
  texture.premultiplyAlpha = false;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
};

export { canvasToMaskTexture };
