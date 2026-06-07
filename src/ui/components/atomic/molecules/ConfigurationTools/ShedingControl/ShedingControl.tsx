'use client';

import { Flex } from '@atoms';
import { ColorControl, RangeControl, ToggleControl } from '@molecules';
import { DISABLED_PART_GRADIENT, useGarmentColor } from '@store';

interface ShedingControlProps {
  partId: string;
}

const ShedingControl = ({ partId }: ShedingControlProps) => {
  const gradient = useGarmentColor((state) => state.gradientsByPart[partId] ?? DISABLED_PART_GRADIENT);
  const setPartGradientEnabled = useGarmentColor((state) => state.setPartGradientEnabled);
  const setPartGradientColor2 = useGarmentColor((state) => state.setPartGradientColor2);
  const setPartGradientRotation = useGarmentColor((state) => state.setPartGradientRotation);
  const setPartGradientPosition = useGarmentColor((state) => state.setPartGradientPosition);
  const setPartGradientSoftness = useGarmentColor((state) => state.setPartGradientSoftness);
  const setPartGradientOpacity = useGarmentColor((state) => state.setPartGradientOpacity);

  return (
    <Flex variant="configurator_part">
      <ToggleControl label="Sfumatura" active={gradient.enabled} onChange={(enabled) => setPartGradientEnabled(partId, enabled)} />

      {gradient.enabled && (
        <>
          <ColorControl
            label="Colore sfumatura"
            color={gradient.color2}
            onSelect={(color) => setPartGradientColor2(partId, color)}
            onPreviewSelect={(color) => setPartGradientColor2(partId, color)}
          />
          <RangeControl
            label="Rotazione"
            value={Math.round(gradient.rotation)}
            onChange={(value) => setPartGradientRotation(partId, value)}
            min={0}
            max={360}
            unit="°"
          />
          <RangeControl
            label="Posizione"
            value={Math.round(gradient.position * 100)}
            onChange={(value) => setPartGradientPosition(partId, value / 100)}
            min={0}
            max={100}
            unit="%"
          />
          <RangeControl
            label="Morbidezza"
            value={Math.round(gradient.softness * 100)}
            onChange={(value) => setPartGradientSoftness(partId, value / 100)}
            min={0}
            max={100}
            unit="%"
          />
          <RangeControl
            label="Trasparenza"
            value={Math.round(gradient.opacity * 100)}
            onChange={(value) => setPartGradientOpacity(partId, value / 100)}
            min={0}
            max={100}
            unit="%"
          />
        </>
      )}
    </Flex>
  );
};

export { ShedingControl };
