'use client';

import { memo, useMemo } from 'react';

import { AccordionAtom, Flex } from '@atoms';
import { ColorControl, PartColorSwitch } from '@molecules';

import { useStepColor } from '@store';

const MemoPartColorSwitch = memo(PartColorSwitch);

const ConfigurationColorize = () => {
  const parts = useStepColor((state) => state.parts);

  const items = useMemo(
    () =>
      parts.map((part) => ({
        value: part.id,
        trigger: <MemoPartColorSwitch color={part.color} label={part.label} />,
        content: <ColorControl partId={part.id} color={part.color} label={part.label} />,
      })),
    [parts],
  );

  if (parts.length === 0) return null;

  return (
    <Flex variant="step_design">
      <AccordionAtom items={items} defaultValue={[parts[0].id]} />
    </Flex>
  );
};

export { ConfigurationColorize };
