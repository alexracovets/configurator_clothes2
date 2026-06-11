import type { CSSProperties, ReactNode } from 'react';

import type { atomListVariantType, faqContentSectionType, richTextSectionType, textVariantType } from '@types';

interface atomRichTextTextPropsType {
  content: string;
  section?: never;
  listIcon?: never;
  className?: string;
  variant?: textVariantType;
  style?: CSSProperties;
}

interface atomRichTextSectionPropsType {
  section: richTextSectionType | faqContentSectionType;
  content?: never;
  listVariant?: atomListVariantType;
  listIcon?: ReactNode;
  className?: string;
  variant?: textVariantType;
  style?: CSSProperties;
}

type atomRichTextPropsType = atomRichTextTextPropsType | atomRichTextSectionPropsType;

export type { atomRichTextPropsType, atomRichTextTextPropsType };
