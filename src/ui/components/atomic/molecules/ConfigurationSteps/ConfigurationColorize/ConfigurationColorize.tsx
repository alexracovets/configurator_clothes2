'use client';

import { memo } from 'react';

import { AccordionAtom, Flex, Text } from '@atoms';
import { ColorControl } from '@molecules';

import { DEFAULT_COLOR, useConfiguratorProduct, useGarmentColor } from '@store';

interface PartColorControlProps {
  partId: string;
}

const PartColorControl = memo(({ partId }: PartColorControlProps) => {
  const color = useGarmentColor((state) => state.byPart[partId] ?? DEFAULT_COLOR);
  const setPartColor = useGarmentColor((state) => state.setPartColor);

  return <ColorControl color={color} onSelect={(value) => setPartColor(partId, value)} onPreviewSelect={(value) => setPartColor(partId, value)} />;
});

PartColorControl.displayName = 'PartColorControl';

const ConfigurationColorize = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const parts = product.parts;

  if (parts.length === 0) return null;

  return (
    <Flex variant="step_design">
      <AccordionAtom
        key={product.path}
        items={parts.map((part) => ({
          value: part.id,
          trigger: <Text>{part.label}</Text>,
          content: <PartColorControl partId={part.id} />,
        }))}
        defaultValue={[parts[0].id]}
        multiple
      />
    </Flex>
  );
};

export { ConfigurationColorize };
