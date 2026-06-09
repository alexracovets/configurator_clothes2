'use client';

import { AtomRichText, AtomTabsContent, Flex, Text } from '@atoms';
import { faqContent } from '@data';

const FAQContent = () => {
  return (
    <AtomTabsContent value="faq">
      <Text variant="h2" asChild>
        <h2>{faqContent.title}</h2>
      </Text>
      <Flex className="w-full flex-col gap-6">
        {faqContent.sections.map((section) => (
          <Flex key={section.id} variant="info_part">
            <Text variant="h3" className={section.headingClassName} asChild>
              <h3>{section.heading}</h3>
            </Text>
            <AtomRichText section={section} listVariant="faq" />
          </Flex>
        ))}
      </Flex>
    </AtomTabsContent>
  );
};

export { FAQContent };
