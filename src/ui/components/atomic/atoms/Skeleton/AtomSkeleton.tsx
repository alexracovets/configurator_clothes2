import { cn } from '@utils';

type AtomSkeletonProps = React.ComponentProps<'div'>;

const AtomSkeleton = ({ className, ...props }: AtomSkeletonProps) => {
  return <div aria-hidden data-slot="skeleton" className={cn('animate-pulse rounded-md bg-gray-20', className)} {...props} />;
};

export { AtomSkeleton };
export type { AtomSkeletonProps };
