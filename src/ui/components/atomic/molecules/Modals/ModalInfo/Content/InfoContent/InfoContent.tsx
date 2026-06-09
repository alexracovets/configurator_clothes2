'use client';

import { AtomTabsContent, Flex } from '@atoms';

const InfoContent = () => {
  return (
    <AtomTabsContent value="info">
      <Flex className="w-full flex-col"></Flex>
    </AtomTabsContent>
  );
};

export { InfoContent };
