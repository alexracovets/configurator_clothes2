'use client';

import { AnimatePresence, motion } from 'motion/react';

import { MainLoader, MainLoaderBackground } from '@molecules';
import { useConfiguratorSceneLoad } from '@store';

const ConfiguratorInitialLoader = () => {
  const isInitialSceneLoading = useConfiguratorSceneLoad((state) => state.isInitialSceneLoading);

  return (
    <AnimatePresence>
      {isInitialSceneLoading && (
        <motion.div
          key="configurator-initial-loader"
          className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <MainLoaderBackground />
          <div className="relative z-10">
            <MainLoader />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { ConfiguratorInitialLoader };
