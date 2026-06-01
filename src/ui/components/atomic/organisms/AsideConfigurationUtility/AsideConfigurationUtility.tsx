'use client';

import { IoMdRedo, IoMdUndo } from 'react-icons/io';

import { Button, Flex } from '@atoms';

import { STEPS_CONFIGURATION } from '@constants';
import { useConfigurationControl } from '@store';

const AsideConfigurationUtility = () => {
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const goToPreviousStep = useConfigurationControl((state) => state.goToPreviousStep);
  const goToNextStep = useConfigurationControl((state) => state.goToNextStep);

  return (
    <aside className="p-4 pr-12">
      <Flex className="h-full w-[253px] pointer-events-auto items-start justify-between">
        <Button size="sm" onClick={goToPreviousStep} disabled={activeStep === 1}>
          <IoMdUndo className="size-4" />
          Annulla
        </Button>
        <Button size="sm" onClick={goToNextStep} disabled={activeStep === STEPS_CONFIGURATION.length}>
          Ripristina
          <IoMdRedo className="size-4" />
        </Button>
      </Flex>
    </aside>
  );
};

export { AsideConfigurationUtility };
