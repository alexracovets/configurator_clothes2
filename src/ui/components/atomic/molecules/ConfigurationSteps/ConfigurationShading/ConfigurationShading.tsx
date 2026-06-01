'use client';

import { memo, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { AccordionAtom, Flex } from '@atoms';
import { PartColorSwitch, ShedingControl } from '@molecules';

import { useStepShading } from '@store';

interface ShadingItemProps {
  partId: string;
}

const ShadingTrigger = memo(({ partId }: ShadingItemProps) => {
  const part = useStepShading((state) => state.parts.find((currentPart) => currentPart.id === partId));
  if (!part) return null;
  return <PartColorSwitch color={part.shadingColor} label={part.label} />;
});

ShadingTrigger.displayName = 'ShadingTrigger';

const ShadingContent = memo(({ partId }: ShadingItemProps) => <ShedingControl partId={partId} />);

ShadingContent.displayName = 'ShadingContent';

const ConfigurationShading = () => {
  const partIds = useStepShading(useShallow((state) => state.parts.map((part) => part.id)));

  const items = useMemo(() => {
    return partIds.map((partId) => ({
      value: partId,
      trigger: <ShadingTrigger partId={partId} />,
      content: <ShadingContent partId={partId} />,
    }));
  }, [partIds]);

  if (partIds.length === 0) return null;

  return (
    <Flex variant="step_design">
      <AccordionAtom items={items} defaultValue={[partIds[0]]} className="gap-3" />
    </Flex>
  );
};

export { ConfigurationShading };
