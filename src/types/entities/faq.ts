type FaqContentSectionBase = {
  id: string;
  heading: string;
  headingClassName?: string;
};

type FaqContentListSection = FaqContentSectionBase & {
  type: 'list';
  items: string[];
};

type FaqContentParagraphsSection = FaqContentSectionBase & {
  type: 'paragraphs';
  paragraphs: string[];
};

type FaqContentSection = FaqContentListSection | FaqContentParagraphsSection;

type FaqContentData = {
  title: string;
  sections: FaqContentSection[];
};

export type { FaqContentData, FaqContentListSection, FaqContentParagraphsSection, FaqContentSection };
