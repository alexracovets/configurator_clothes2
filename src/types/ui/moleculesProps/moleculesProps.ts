import type { ButtonHTMLAttributes, ReactElement } from 'react';

import type { catalogProductRefType } from '@types';
import type { ReactPlayerProps } from 'react-player/types';

type videoPlayerVariantType = 'default' | 'tutorial';

type videoPlayerPropsType = Omit<ReactPlayerProps, 'width' | 'height' | 'style' | 'wrapper' | 'light' | 'poster'> & {
  variant?: videoPlayerVariantType;
  className?: string;
  poster?: string | false | ReactElement;
};

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

export type {
  productCatalogOptionPropsType,
  productCatalogPopoverPropsType,
  productSessionAddButtonPropsType,
  productSessionRowPropsType,
  videoPlayerPropsType,
  videoPlayerVariantType,
};
