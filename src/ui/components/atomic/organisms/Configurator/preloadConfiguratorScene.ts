import { useGLTF } from '@react-three/drei';

import { resolvePbrTexturePaths } from '@hooks';
import { useConfiguratorProduct } from '@store';
import { resolveModelUrl } from '@utils';

const preloadConfiguratorScene = () => {
  const product = useConfiguratorProduct.getState().product;
  const modelUrl = resolveModelUrl(product);

  useGLTF.preload(modelUrl);

  const pbrPaths = resolvePbrTexturePaths(product);
  if (!pbrPaths) return;

  for (const url of Object.values(pbrPaths)) {
    void fetch(url, { priority: 'low' });
  }
};

export { preloadConfiguratorScene };
