'use client';

import { createContext, useContext } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@shared';
import { cn } from '@utils';

type AtomTableVariant = NonNullable<VariantProps<typeof atomTableVariants>['variant']>;

const AtomTableVariantContext = createContext<AtomTableVariant>('default');

const useAtomTableVariant = () => useContext(AtomTableVariantContext);

const atomTableVariants = cva('w-full caption-bottom', {
  variants: {
    variant: {
      default: 'text-sm',
      size_chart: 'border-collapse text-center text-[14px] font-inter',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableHeaderVariants = cva('', {
  variants: {
    variant: {
      default: '',
      size_chart: '[&_tr]:border-b-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableBodyVariants = cva('', {
  variants: {
    variant: {
      default: '',
      size_chart: '[&_tr:last-child]:border-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableRowVariants = cva('transition-colors', {
  variants: {
    variant: {
      default: 'border-b hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
      size_chart: 'border-b-0 hover:bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableHeadVariants = cva('align-middle font-medium whitespace-nowrap text-foreground', {
  variants: {
    variant: {
      default: 'h-10 px-2 text-left [&:has([role=checkbox])]:pr-0',
      size_chart: 'h-auto border border-gray-20 bg-gray-100 px-3 py-2 text-center font-semibold text-default whitespace-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableCellVariants = cva('align-middle', {
  variants: {
    variant: {
      default: 'p-2 whitespace-nowrap [&:has([role=checkbox])]:pr-0',
      size_chart: 'border border-gray-20 px-3 py-2 text-center text-default whitespace-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const atomTableCaptionVariants = cva('mt-4 text-sm', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      size_chart: 'text-gray text-left',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AtomTableProps = React.ComponentProps<typeof Table> & VariantProps<typeof atomTableVariants>;

const AtomTable = ({ className, variant = 'default', children, ...props }: AtomTableProps) => {
  return (
    <AtomTableVariantContext.Provider value={variant ?? 'default'}>
      <Table className={cn(atomTableVariants({ variant }), className)} {...props}>
        {children}
      </Table>
    </AtomTableVariantContext.Provider>
  );
};

type AtomTableSectionProps = React.ComponentProps<typeof TableHeader> & VariantProps<typeof atomTableHeaderVariants>;

const AtomTableHeader = ({ className, variant: variantProp, ...props }: AtomTableSectionProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableHeader className={cn(atomTableHeaderVariants({ variant }), className)} {...props} />;
};

type AtomTableBodyProps = React.ComponentProps<typeof TableBody> & VariantProps<typeof atomTableBodyVariants>;

const AtomTableBody = ({ className, variant: variantProp, ...props }: AtomTableBodyProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableBody className={cn(atomTableBodyVariants({ variant }), className)} {...props} />;
};

type AtomTableFooterProps = React.ComponentProps<typeof TableFooter> & VariantProps<typeof atomTableBodyVariants>;

const AtomTableFooter = ({ className, variant: variantProp, ...props }: AtomTableFooterProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableFooter className={cn(atomTableBodyVariants({ variant }), className)} {...props} />;
};

type AtomTableRowProps = React.ComponentProps<typeof TableRow> & VariantProps<typeof atomTableRowVariants>;

const AtomTableRow = ({ className, variant: variantProp, ...props }: AtomTableRowProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableRow className={cn(atomTableRowVariants({ variant }), className)} {...props} />;
};

type AtomTableHeadProps = React.ComponentProps<typeof TableHead> & VariantProps<typeof atomTableHeadVariants>;

const AtomTableHead = ({ className, variant: variantProp, ...props }: AtomTableHeadProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableHead className={cn(atomTableHeadVariants({ variant }), className)} {...props} />;
};

type AtomTableCellProps = React.ComponentProps<typeof TableCell> & VariantProps<typeof atomTableCellVariants>;

const AtomTableCell = ({ className, variant: variantProp, ...props }: AtomTableCellProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableCell className={cn(atomTableCellVariants({ variant }), className)} {...props} />;
};

type AtomTableCaptionProps = React.ComponentProps<typeof TableCaption> & VariantProps<typeof atomTableCaptionVariants>;

const AtomTableCaption = ({ className, variant: variantProp, ...props }: AtomTableCaptionProps) => {
  const contextVariant = useAtomTableVariant();
  const variant = variantProp ?? contextVariant;

  return <TableCaption className={cn(atomTableCaptionVariants({ variant }), className)} {...props} />;
};

export {
  AtomTable,
  AtomTableHeader,
  AtomTableBody,
  AtomTableFooter,
  AtomTableHead,
  AtomTableRow,
  AtomTableCell,
  AtomTableCaption,
  atomTableVariants,
  atomTableHeaderVariants,
  atomTableBodyVariants,
  atomTableRowVariants,
  atomTableHeadVariants,
  atomTableCellVariants,
  atomTableCaptionVariants,
};

export type {
  AtomTableProps,
  AtomTableBodyProps,
  AtomTableCaptionProps,
  AtomTableCellProps,
  AtomTableFooterProps,
  AtomTableHeadProps,
  AtomTableRowProps,
  AtomTableSectionProps,
  AtomTableVariant,
};
