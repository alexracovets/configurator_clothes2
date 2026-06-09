'use client';

import { create } from 'zustand';

const MIN_LOADER_VISIBLE_MS = 400;

interface ConfiguratorSceneLoadState {
  isInitialSceneLoading: boolean;
  loaderSession: number;
  loaderVisibleUntil: number;
  beginInitialSceneLoad: () => void;
  markInitialSceneLoaded: () => void;
}

let markLoaderTimeoutId: ReturnType<typeof setTimeout> | null = null;

const useConfiguratorSceneLoad = create<ConfiguratorSceneLoadState>((set, get) => ({
  isInitialSceneLoading: true,
  loaderSession: 0,
  loaderVisibleUntil: 0,
  beginInitialSceneLoad: () => {
    if (markLoaderTimeoutId) {
      clearTimeout(markLoaderTimeoutId);
      markLoaderTimeoutId = null;
    }

    const loaderSession = get().loaderSession + 1;

    set({
      isInitialSceneLoading: true,
      loaderSession,
      loaderVisibleUntil: Date.now() + MIN_LOADER_VISIBLE_MS,
    });
  },
  markInitialSceneLoaded: () => {
    const { isInitialSceneLoading, loaderSession, loaderVisibleUntil } = get();

    if (!isInitialSceneLoading) return;

    const complete = () => {
      const state = get();
      if (!state.isInitialSceneLoading || state.loaderSession !== loaderSession) return;
      set({ isInitialSceneLoading: false });
    };

    const remaining = loaderVisibleUntil - Date.now();

    if (remaining > 0) {
      if (markLoaderTimeoutId) clearTimeout(markLoaderTimeoutId);
      markLoaderTimeoutId = setTimeout(() => {
        markLoaderTimeoutId = null;
        complete();
      }, remaining);
      return;
    }

    complete();
  },
}));

export { useConfiguratorSceneLoad };
