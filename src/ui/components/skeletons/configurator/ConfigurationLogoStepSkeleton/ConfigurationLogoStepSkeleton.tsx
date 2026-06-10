import { AtomSkeleton, Flex } from '@atoms';

import { LogoUploadSkeleton } from '@skeletons';

const ConfigurationLogoStepSkeleton = () => {
  return (
    <Flex variant="step_design" className="w-full gap-4" data-testid="skeleton-step-logo">
      <LogoUploadSkeleton />
      <Flex className="w-full flex-col gap-3">
        <AtomSkeleton className="h-[15px] w-28" />
        {Array.from({ length: 2 }, (_, index) => (
          <Flex key={index} className="min-h-[24px] w-full items-center gap-2 px-2">
            <AtomSkeleton className="size-4 shrink-0" />
            <AtomSkeleton className="h-4 w-40" />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export { ConfigurationLogoStepSkeleton };
