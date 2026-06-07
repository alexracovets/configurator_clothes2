'use client';

import { useCallback, useMemo } from 'react';

import { AccordionAtom, Flex } from '@atoms';
import { PartColorSwitch, ShedingControl } from '@molecules';
import { DEFAULT_COLOR, useConfiguratorProduct, useGarmentColor } from '@store';

const ConfigurationShading = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const byPart = useGarmentColor((state) => state.byPart);
  const gradientsByPart = useGarmentColor((state) => state.gradientsByPart);
  const parts = product.parts;

  const getShadingPreview = useCallback(
    (partId: string) => {
      const baseColor = byPart[partId] ?? DEFAULT_COLOR;
      const gradient = gradientsByPart[partId];

      if (!gradient?.enabled) return baseColor;

      return `linear-gradient(${gradient.rotation}deg, ${baseColor}, ${gradient.color2})`;
    },
    [byPart, gradientsByPart],
  );

  const items = useMemo(
    () =>
      parts.map((part) => ({
        value: part.id,
        trigger: <PartColorSwitch color={getShadingPreview(part.id)} label={part.label} />,
        content: <ShedingControl partId={part.id} />,
      })),
    [getShadingPreview, parts],
  );

  if (parts.length === 0) return null;

  return (
    <Flex key={product.path} variant="step_design">
      <AccordionAtom items={items} defaultValue={[parts[0].id]} multiple className="gap-3" />
    </Flex>
  );
};

export { ConfigurationShading };
