import type { GarmentConfig } from '@types';

const resolveModelUrl = (product: GarmentConfig): string => {
  const base = product.path.endsWith('/') ? product.path : `${product.path}/`;
  return `${base}${product.modelFile ?? 'model.gltf'}`;
};

export { resolveModelUrl };
