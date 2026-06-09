'use client';

import { create } from 'zustand';

interface ConfiguratorSceneLoadState {
  isInitialSceneLoading: boolean;
  markInitialSceneLoaded: () => void;
}

const useConfiguratorSceneLoad = create<ConfiguratorSceneLoadState>((set, get) => ({
  isInitialSceneLoading: true,
  markInitialSceneLoaded: () => {
    if (!get().isInitialSceneLoading) return;
    set({ isInitialSceneLoading: false });
  },
}));

export { useConfiguratorSceneLoad };
