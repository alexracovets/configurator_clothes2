'use client';

import { useCallback, useEffect, useRef } from 'react';

import { motion } from 'motion/react';

import { CanvasLoaderBackground, MainLoader } from '@molecules';
import { useConfiguratorProduct, useConfiguratorSceneLoad, useGarmentDesign } from '@store';

const useSceneTransitionTrigger = (value: string | null, beginSceneTransitionLoad: () => void, isInitialSceneLoading: boolean) => {
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (isInitialSceneLoading) {
      previousValueRef.current = value;
      return;
    }

    if (previousValueRef.current === value) return;

    previousValueRef.current = value;
    beginSceneTransitionLoad();
  }, [beginSceneTransitionLoad, isInitialSceneLoading, value]);
};

const ConfiguratorCanvasLoader = () => {
  const isInitialSceneLoading = useConfiguratorSceneLoad((state) => state.isInitialSceneLoading);
  const isSceneTransitionLoading = useConfiguratorSceneLoad((state) => state.isSceneTransitionLoading);
  const beginSceneTransitionLoad = useConfiguratorSceneLoad((state) => state.beginSceneTransitionLoad);

  const productPath = useConfiguratorProduct((state) => state.product.path);
  const activePatternKey = useGarmentDesign((state) => state.activePattern?.key ?? null);

  const beginProductTransition = useCallback(() => {
    beginSceneTransitionLoad({ affectsConfigurationPanel: true });
  }, [beginSceneTransitionLoad]);

  const beginPatternTransition = useCallback(() => {
    beginSceneTransitionLoad({ affectsConfigurationPanel: false });
  }, [beginSceneTransitionLoad]);

  useSceneTransitionTrigger(productPath, beginProductTransition, isInitialSceneLoading);
  useSceneTransitionTrigger(activePatternKey, beginPatternTransition, isInitialSceneLoading);

  const isVisible = isSceneTransitionLoading && !isInitialSceneLoading;

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={isVisible ? { duration: 0 } : { duration: 0.45, ease: 'easeInOut' }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      aria-busy={isVisible}
      aria-hidden={!isVisible}
    >
      <CanvasLoaderBackground />
      <div className="relative z-10">
        <MainLoader />
      </div>
    </motion.div>
  );
};

export { ConfiguratorCanvasLoader };
