'use client';

import { useCallback } from 'react';

import { AtomTabs } from '@atoms';
import { STEPS_CONFIGURATION } from '@constants';
import { useConfigurationControl } from '@store';

const HeaderConfiguration = () => {
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const setActiveStep = useConfigurationControl((state) => state.setActiveStep);
  const activeItem = STEPS_CONFIGURATION[activeStep - 1];

  const handleValueChange = useCallback(
    (value: string) => {
      const step = STEPS_CONFIGURATION.findIndex((item) => item.value === value) + 1;
      if (step > 0) setActiveStep(step);
    },
    [setActiveStep],
  );

  return (
    <header className="flex items-center justify-center bg-white py-2">
      <AtomTabs variant="configurator" items={STEPS_CONFIGURATION} value={activeItem.value} onValueChange={handleValueChange} hideContent />
    </header>
  );
};

export { HeaderConfiguration };
