'use client';

import { useCallback } from 'react';
import { IoMdRedo, IoMdUndo } from 'react-icons/io';

import { Button, Flex, Grid, SvgIcon, Text } from '@atoms';

import { STEPS_CONFIGURATION } from '@constants';
import { useConfigurationControl, useTutorialDialog } from '@store';

const AsideConfigurationUtility = () => {
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const goToPreviousStep = useConfigurationControl((state) => state.goToPreviousStep);
  const goToNextStep = useConfigurationControl((state) => state.goToNextStep);
  const setTutorialOpen = useTutorialDialog((state) => state.setIsOpen);

  const handleTutorial = useCallback(() => {
    setTutorialOpen(true);
  }, [setTutorialOpen]);

  return (
    <aside className="p-4 pr-12">
      <Flex className="flex-col justify-start h-full w-[253px] gap-6">
        <Grid className="grid-cols-2 gap-2">
          <Button size="sm" onClick={goToPreviousStep} disabled={activeStep === 1}>
            <IoMdUndo className="size-4" />
            Annulla
          </Button>
          <Button size="sm" onClick={goToNextStep} disabled={activeStep === STEPS_CONFIGURATION.length}>
            Ripristina
            <IoMdRedo className="size-4" />
          </Button>
        </Grid>
        <Flex className="flex-col gap-3 p-4 rounded-md border-2 border-input-border">
          <Text className="text-[16px] text-base-black font-medium">Hai bisogno di aiuto?</Text>
          <Button size="sm" variant="center" className="w-full" onClick={handleTutorial}>
            <SvgIcon name="question" />
            Tutorial
          </Button>
        </Flex>
      </Flex>
    </aside>
  );
};

export { AsideConfigurationUtility };
