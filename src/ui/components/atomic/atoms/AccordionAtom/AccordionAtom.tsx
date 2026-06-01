'use client';

import { cva, type VariantProps } from 'class-variance-authority';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared';
import { cn } from '@utils';
import type { AccordionItem as AccordionItemConfig } from '@types';

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionTriggerVariants = cva('', {
  variants: {
    variant: {
      default: cn('py-3 color-gray-30', 'transition-colors duration-150 ease-out'),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionContentVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bordered: '',
      ghost: 'px-2',
      filled: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AccordionAtomProps extends VariantProps<typeof accordionItemVariants> {
  items: AccordionItemConfig[];
  className?: string;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
}

const AccordionAtom = ({ items, variant = 'default', className, defaultValue, value, onValueChange, multiple = false }: AccordionAtomProps) => {
  return (
    <Accordion className={cn(className)} multiple={multiple} defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      {items.map(({ value, trigger, content }) => (
        <AccordionItem key={value} value={value} className={accordionItemVariants({ variant })}>
          <AccordionTrigger className={cn(accordionTriggerVariants({ variant }))}>{trigger}</AccordionTrigger>
          <AccordionContent className={accordionContentVariants({ variant })}>{content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export { AccordionAtom };
