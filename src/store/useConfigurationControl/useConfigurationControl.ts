'use client';

import { create } from 'zustand';

import { STEPS_CONFIGURATION } from '@constants';

interface ConfigurationControlStore {
  activeStep: number;
  name: string;
  price: number;
  count: number;
  count_to_bonus: number;
  bonus_discount: number;
  minimum_count: number;
  numberProduct: number;
  setName: (name: string) => void;
  setCount: (count: number) => void;
  setCountToBonus: (count_to_bonus: number) => void;
  setPrice: (price: number) => void;
  setBonusDiscount: (bonus_discount: number) => void;
  setMinimumCount: (minimum_count: number) => void;
  setActiveStep: (step: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  setNumberProduct: (numberProduct: number) => void;
}

const useConfigurationControl = create<ConfigurationControlStore>((set, get) => ({
  activeStep: 1,
  name: 'Maglia Federer',
  numberProduct: 1,
  price: 100,
  count: 6,
  count_to_bonus: 5,
  bonus_discount: 0,
  minimum_count: 5,
  setName: (name) => {
    set({ name });
  },
  setCount: (count) => {
    set({ count });
  },
  setCountToBonus: (count_to_bonus) => {
    set({ count_to_bonus });
  },
  setPrice: (price) => {
    set({ price });
  },
  setBonusDiscount: (bonus_discount) => {
    set({ bonus_discount });
  },
  setMinimumCount: (minimum_count) => {
    set({ minimum_count });
  },
  setActiveStep: (step) => {
    if (step < 1 || step > STEPS_CONFIGURATION.length) return;
    set({ activeStep: step });
  },
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
  setNumberProduct: (numberProduct) => {
    set({ numberProduct });
  },
}));

export { useConfigurationControl };
