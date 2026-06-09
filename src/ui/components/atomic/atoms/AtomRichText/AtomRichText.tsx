'use client';

import type { ReactNode } from 'react';

import { type VariantProps } from 'class-variance-authority';

import type { FaqContentSection } from '@data';
import { cn } from '@utils';

import { AtomList, atomListWrapperVariants } from '../AtomList';
import { Text } from '../Text';

type RichTextSection = { type: 'list'; items: string[] } | { type: 'paragraphs'; paragraphs: string[] };

type TextVariant = NonNullable<React.ComponentProps<typeof Text>['variant']>;

const getSectionContent = (section: RichTextSection | FaqContentSection) => {
  if (section.type === 'list') return section.items;
  return section.paragraphs;
};

type AtomRichTextTextProps = Omit<React.ComponentProps<typeof Text>, 'children' | 'asChild'> & {
  content: string;
  section?: never;
  listIcon?: never;
};

type AtomRichTextSectionProps = Omit<React.ComponentProps<typeof Text>, 'children' | 'asChild'> & {
  section: RichTextSection | FaqContentSection;
  content?: never;
  listVariant?: VariantProps<typeof atomListWrapperVariants>['variant'];
  listIcon?: ReactNode;
};

type AtomRichTextProps = AtomRichTextTextProps | AtomRichTextSectionProps;

const defaultListIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="text-default">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.5 10.25L8.75 12.5L13.5 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RichTextItem = ({ content, className, variant = 'default', ...props }: AtomRichTextTextProps) => {
  return (
    <Text variant={variant} className={cn('leading-[1.4]', className)} asChild {...props}>
      <span dangerouslySetInnerHTML={{ __html: content }} />
    </Text>
  );
};

const AtomRichText = (props: AtomRichTextProps) => {
  if ('section' in props && props.section) {
    const { section, variant = 'default', listVariant = 'default', listIcon, className, ...rest } = props;
    const items = getSectionContent(section);
    const textVariant = variant as TextVariant;

    if (section.type === 'list') {
      return (
        <AtomList
          variant={listVariant}
          icon={listIcon ?? defaultListIcon}
          items={items.map((item, index) => (
            <RichTextItem key={index} variant={textVariant} className={className} content={item} {...rest} />
          ))}
        />
      );
    }

    return items.map((item, index) => <RichTextItem key={index} variant={textVariant} className={className} content={item} {...rest} />);
  }

  const { content, className, variant, ...rest } = props;
  return <RichTextItem content={content} className={className} variant={variant} {...rest} />;
};

export { AtomRichText };
export type { AtomRichTextProps, RichTextSection };
