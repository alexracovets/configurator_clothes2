import { ConfigurationAccordionStepSkeleton } from '../ConfigurationAccordionStepSkeleton';
import { ConfigurationDesignStepSkeleton } from '../ConfigurationDesignStepSkeleton';
import { ConfigurationLogoStepSkeleton } from '../ConfigurationLogoStepSkeleton';
import { ConfigurationNamingStepSkeleton } from '../ConfigurationNamingStepSkeleton';

type ConfigurationStepSkeletonProps = {
  step: number;
};

const ConfigurationStepSkeleton = ({ step }: ConfigurationStepSkeletonProps) => {
  switch (step) {
    case 1:
      return <ConfigurationAccordionStepSkeleton expandedContent="color" />;
    case 2:
      return <ConfigurationDesignStepSkeleton />;
    case 3:
      return <ConfigurationAccordionStepSkeleton expandedContent="shading" />;
    case 4:
    case 5:
      return <ConfigurationNamingStepSkeleton />;
    case 6:
      return <ConfigurationLogoStepSkeleton />;
    default:
      return null;
  }
};

export { ConfigurationStepSkeleton };
