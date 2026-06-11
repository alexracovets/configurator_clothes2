'use client';

import { Flex, Text } from '@atoms';
import type { partColorSwitchPropsType } from '@types';

const PartColorSwitch = ({ color, label }: partColorSwitchPropsType) => {
  return (
    <Flex className="gap-2 items-center text-inherit">
      <div className="w-5 h-5 rounded-[3px] shrink-0 border-[.3px] border-gray-30 transition-colors duration-150" style={{ background: color }} />
      <Text variant="configurator_part_label">{label}</Text>
    </Flex>
  );
};

export { PartColorSwitch };
