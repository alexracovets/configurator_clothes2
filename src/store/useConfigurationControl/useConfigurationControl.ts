'use client';

import { create } from 'zustand';

import { STEPS_CONFIGURATION } from '@constants';

interface ConfigurationControlState {
  activeStep: number;
  name: string;
  numberProduct: number;
  price: number;
  count: number;
  count_to_bonus: number;
  bonus_discount: number;
  minimum_count: number;
  setActiveStep: (step: number) => void;
  setNumberProduct: (numberProduct: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

const useConfigurationControl = create<ConfigurationControlState>((set, get) => ({
  activeStep: 1,
  name: 'Maglia Federer',
  numberProduct: 1,
  price: 100,
  count: 6,
  count_to_bonus: 5,
  bonus_discount: 0,
  minimum_count: 5,
  setActiveStep: (step) => {
    if (step < 1 || step > STEPS_CONFIGURATION.length) return;
    set({ activeStep: step });
  },
  setNumberProduct: (numberProduct) => set({ numberProduct }),
  goToPreviousStep: () => {
    const { activeStep } = get();
    if (activeStep <= 1) return;
    set({ activeStep: activeStep - 1 });
  },
  goToNextStep: () => {
    const { activeStep } = get();
    if (activeStep >= STEPS_CONFIGURATION.length) return;
    set({ activeStep: activeStep + 1 });
  },
}));

export { useConfigurationControl };
