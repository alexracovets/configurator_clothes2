import type { ButtonHTMLAttributes } from 'react';

import type { catalogProductRefType } from '@types';

interface productCatalogOptionPropsType {
  name: string;
  previewSrc: string;
  onSelect: () => void;
}

interface productCatalogPopoverPropsType {
  products: catalogProductRefType[];
  onSelect: (styleId: catalogProductRefType['styleId'], productIndex: number) => void;
}

type productSessionAddButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement>;

interface productSessionRowPropsType {
  name: string;
  previewSrc: string;
  active?: boolean;
  canRemove?: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export type { productCatalogOptionPropsType, productCatalogPopoverPropsType, productSessionAddButtonPropsType, productSessionRowPropsType };
