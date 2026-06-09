import faqContentData from './faqContent.json';

import type { FaqContentData } from './types';

const faqContent = faqContentData as FaqContentData;

export { faqContent };
export type { FaqContentData, FaqContentListSection, FaqContentParagraphsSection, FaqContentSection } from './types';
