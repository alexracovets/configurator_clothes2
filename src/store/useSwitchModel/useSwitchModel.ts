'use client';

import { create } from 'zustand';

const DEFAULT_MODEL_PATH = '/models/crewneck/crewneck/';
const DEFAULT_MODEL_FILE = 'crewneck.gltf';

const deriveModelFileName = (modelPath: string) => {
  const folderName = modelPath.replace(/\/$/, '').split('/').pop();
  return folderName ? `${folderName}.gltf` : DEFAULT_MODEL_FILE;
};

const buildModelUrl = (modelPath: string, modelFileName: string) => `${modelPath}${modelFileName}`;

interface SwitchModelState {
  modelPath: string;
  modelFileName: string;
  setModelSource: (modelPath: string, modelFileName: string) => void;
}

const useSwitchModel = create<SwitchModelState>((set) => ({
  modelPath: DEFAULT_MODEL_PATH,
  modelFileName: DEFAULT_MODEL_FILE,
  setModelSource: (modelPath, modelFileName) => set({ modelPath, modelFileName }),
}));

export { buildModelUrl, DEFAULT_MODEL_FILE, DEFAULT_MODEL_PATH, deriveModelFileName, useSwitchModel };
