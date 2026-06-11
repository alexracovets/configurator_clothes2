'use client';

import { useCallback, useMemo } from 'react';

import { AccordionAtom, Flex } from '@atoms';
import { PartColorSwitch } from '../../ConfigurationTools/PartColorSwitch';
import { ShadingControl } from '../../ConfigurationTools/ShadingControl';
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

      const color1 = gradient.reversed ? gradient.color2 : baseColor;
      const color2 = gradient.reversed ? baseColor : gradient.color2;

      return `linear-gradient(${gradient.rotation}deg, ${color1}, ${color2})`;
    },
    [byPart, gradientsByPart],
  );

  const items = useMemo(
    () =>
      parts.map((part) => ({
        value: part.id,
        trigger: <PartColorSwitch color={getShadingPreview(part.id)} label={part.label} />,
        content: <ShadingControl partId={part.id} />,
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
