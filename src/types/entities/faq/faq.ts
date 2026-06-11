type richTextListSectionType = {
  type: 'list';
  items: string[];
};

type richTextParagraphsSectionType = {
  type: 'paragraphs';
  paragraphs: string[];
};

type richTextSectionType = richTextListSectionType | richTextParagraphsSectionType;

interface faqContentSectionBaseType {
  id: string;
  heading: string;
  headingClassName?: string;
}

type faqContentSectionType = faqContentSectionBaseType & richTextSectionType;

interface faqContentDataType {
  title: string;
  sections: faqContentSectionType[];
}

export type { faqContentDataType, faqContentSectionType, richTextSectionType };
