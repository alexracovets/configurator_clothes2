'use client';

import { create } from 'zustand';

interface StepDesignStore {
  design: string[];
  activeDesign: string | null;
  activeDesignColor: string;
  activeDesignOpacity: number;
  setDesign: (design: string[]) => void;
  setActiveDesign: (activeDesign: string | null) => void;
  setActiveDesignColor: (activeDesignColor: string) => void;
  setActiveDesignOpacity: (activeDesignOpacity: number) => void;
}

const useStepDesign = create<StepDesignStore>((set) => ({
  design: [],
  activeDesign: null,
  activeDesignColor: '#000000',
  activeDesignOpacity: 1,
  setDesign: (design) => set({ design, activeDesign: null }),
  setActiveDesign: (activeDesign) => set({ activeDesign }),
  setActiveDesignColor: (activeDesignColor) => set({ activeDesignColor }),
  setActiveDesignOpacity: (activeDesignOpacity) => set({ activeDesignOpacity }),
}));

export { useStepDesign };
