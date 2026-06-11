'use client';

import { createContext, forwardRef, memo, useContext } from 'react';

import { cva } from 'class-variance-authority';

import { SlidingIndicator, Text } from '@atoms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared';
import { useSlidingIndicator } from '@hooks';
import type {
  atomTabsContentPropsType,
  atomTabsListPropsType,
  atomTabsRootPropsType,
  atomTabsTriggerPropsType,
  atomTabsVariantType,
  configuratorTabItemPropsType,
  configuratorTabsListPropsType,
} from '@types';
import { cn } from '@utils';

import { AtomTabsSeparator } from './AtomTabsSeparator';

const AtomTabsVariantContext = createContext<atomTabsVariantType>('default');

const useAtomTabsVariant = () => useContext(AtomTabsVariantContext);

type SharedTabsListVariant = 'default' | 'line';

const atomTabsRootVariants = cva('', {
  variants: {
    variant: {
      default: '',
      line: '',
      configurator: 'gap-0',
      modal: 'flex min-h-0 w-full flex-1 flex-col overflow-hidden gap-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTabsListVariants = cva('', {
  variants: {
    variant: {
      default: '',
      line: '',
      configurator: cn('inline-flex h-auto w-fit items-center rounded-none bg-transparent p-0', 'group-data-horizontal/tabs:h-auto'),
      modal: cn('inline-flex h-auto w-fit items-center rounded-none bg-transparent', 'group-data-horizontal/tabs:h-auto'),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTabsTriggerVariants = cva('', {
  variants: {
    variant: {
      default: cn('text-default text-[14px] font-[500] flex items-center justify-center gap-2 bg-transparent', 'px-6.5 pb-3 [&_svg]:size-5'),
      line: '',
      configurator: cn(
        'h-auto flex-none rounded-none border-transparent bg-transparent shadow-none',
        'hover:bg-transparent data-active:bg-transparent',
        'after:hidden',
        'focus-visible:ring-0 focus-visible:outline-none',
      ),
      modal: cn(
        'flex-none text-gray-30 text-[14px] font-[500] inline-flex items-center justify-center gap-2 bg-transparent',
        'px-6.5 pb-3 [&_svg]:size-5',
        'data-active:text-default transition-colors duration-200',
      ),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTabsContentVariants = cva('', {
  variants: {
    variant: {
      default: '',
      line: '',
      configurator: 'pt-4',
      modal: 'flex-none min-h-0 pt-2 outline-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sharedTabsListVariantMap: Record<atomTabsVariantType, SharedTabsListVariant> = {
  default: 'default',
  line: 'line',
  configurator: 'line',
  modal: 'line',
};

const AtomTabsList = ({ className, variant: variantProp, ...props }: atomTabsListPropsType) => {
  const contextVariant = useAtomTabsVariant();
  const variant = variantProp ?? contextVariant;
  const sharedVariant = sharedTabsListVariantMap[variant ?? 'default'];

  return <TabsList variant={sharedVariant} className={cn(atomTabsListVariants({ variant }), className)} {...props} />;
};

const AtomTabsTrigger = forwardRef<HTMLButtonElement, atomTabsTriggerPropsType>(({ className, variant: variantProp, ...props }, ref) => {
  const contextVariant = useAtomTabsVariant();
  const variant = variantProp ?? contextVariant;

  return <TabsTrigger ref={ref} className={cn(atomTabsTriggerVariants({ variant }), className)} {...props} />;
});

AtomTabsTrigger.displayName = 'AtomTabsTrigger';

const AtomTabsContent = ({ className, variant: variantProp, ...props }: atomTabsContentPropsType) => {
  const contextVariant = useAtomTabsVariant();
  const variant = variantProp ?? contextVariant;

  return <TabsContent className={cn(atomTabsContentVariants({ variant }), className)} {...props} />;
};

const ConfiguratorTabItem = memo(({ item, index, activeIndex, getItemRef }: configuratorTabItemPropsType) => {
  const isReached = index <= activeIndex;

  return (
    <>
      {index > 0 && <AtomTabsSeparator isActive={isReached} />}
      <span
        ref={(node) => {
          const trigger = node?.querySelector<HTMLElement>('[data-slot="tabs-trigger"]') ?? node;
          getItemRef(index)(trigger);
        }}
        className="inline-flex"
      >
        <AtomTabsTrigger value={item.value} disabled={item.disabled} data-progress-active={isReached || undefined}>
          <Text variant="menu_step_buy" data-active={isReached} asChild>
            <span>{item.label}</span>
          </Text>
        </AtomTabsTrigger>
      </span>
    </>
  );
});

ConfiguratorTabItem.displayName = 'ConfiguratorTabItem';

const ConfiguratorTabsList = ({ items, activeIndex, listClassName }: configuratorTabsListPropsType) => {
  const { wrapperRef, getItemRef, indicatorRef } = useSlidingIndicator(activeIndex);

  return (
    <div ref={wrapperRef} className="relative w-fit pt-2">
      <AtomTabsList className={cn('gap-3', listClassName)}>
        {items.map((item, index) => (
          <ConfiguratorTabItem key={item.value} item={item} index={index} activeIndex={activeIndex} getItemRef={getItemRef} />
        ))}
      </AtomTabsList>

      <SlidingIndicator ref={indicatorRef} variant="gradient" />
    </div>
  );
};

const AtomTabs = ({
  className,
  variant = 'default',
  items,
  listClassName,
  contentClassName,
  hideList,
  hideContent,
  children,
  value,
  ...props
}: atomTabsRootPropsType) => {
  const activeIndex = items?.findIndex((item) => item.value === value) ?? 0;
  const isConfiguratorList = variant === 'configurator' && items && !hideList;

  return (
    <AtomTabsVariantContext.Provider value={variant ?? 'default'}>
      <Tabs className={cn(atomTabsRootVariants({ variant }), className)} value={value} {...props}>
        {items ? (
          <>
            {!hideList &&
              (isConfiguratorList ? (
                <ConfiguratorTabsList items={items} activeIndex={activeIndex} listClassName={listClassName} />
              ) : (
                <AtomTabsList className={listClassName}>
                  {items.map(({ value: itemValue, label, disabled }) => (
                    <AtomTabsTrigger key={itemValue} value={itemValue} disabled={disabled}>
                      {label}
                    </AtomTabsTrigger>
                  ))}
                </AtomTabsList>
              ))}
            {!hideContent &&
              items.map(({ value: itemValue, content: Content }) => (
                <AtomTabsContent key={itemValue} value={itemValue} className={contentClassName}>
                  <Content />
                </AtomTabsContent>
              ))}
          </>
        ) : (
          children
        )}
      </Tabs>
    </AtomTabsVariantContext.Provider>
  );
};

export {
  AtomTabs,
  AtomTabsList,
  AtomTabsTrigger,
  AtomTabsContent,
  atomTabsRootVariants,
  atomTabsListVariants,
  atomTabsTriggerVariants,
  atomTabsContentVariants,
};
