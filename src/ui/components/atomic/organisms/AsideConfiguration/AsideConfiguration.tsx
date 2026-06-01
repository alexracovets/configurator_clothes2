'use client';

import { Grid, ScrollArea } from '@atoms';
import { ConfiguratorProduct } from '@molecules';

import { STEPS_CONFIGURATION } from '@constants';
import { useConfigurationControl } from '@store';

const ActiveStepContent = () => {
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const stepConfig = STEPS_CONFIGURATION.find(({ step }) => step === activeStep);

  if (!stepConfig) return null;

  const { content: Content } = stepConfig;

  return (
    <div className="flex min-h-0 flex-1 flex-col py-1">
      <ScrollArea className="min-h-0 flex-1 w-full pt-0">
        <Content />
      </ScrollArea>
    </div>
  );
};

const AsideConfiguration = () => {
  return (
    <aside className="h-full min-h-0 overflow-hidden p-4 pl-28">
      <Grid className="grid h-full min-h-0 w-[334px] grid-rows-[auto_minmax(0,1fr)] gap-6">
        <ConfiguratorProduct />
        <ActiveStepContent />
      </Grid>
    </aside>
  );
};

export { AsideConfiguration };
