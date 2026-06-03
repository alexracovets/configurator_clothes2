'use client';

import { useCallback } from 'react';

import { Flex } from '@atoms';

import { ColorControl, RangeControl, ToggleControl } from '@molecules';

import { useGarmentShadingPreview, useStepShading } from '@store';

interface ShedingControlProps {
  partId: string;
}

const ShedingControl = ({ partId }: ShedingControlProps) => {
  const part = useStepShading((state) => state.parts.find((currentPart) => currentPart.id === partId));
  const setPartColorPicked = useStepShading((state) => state.setPartColorPicked);
  const setPartGradient = useStepShading((state) => state.setPartGradient);
  const setShadingPreview = useGarmentShadingPreview((state) => state.setShadingPreview);
  const clearShadingPreview = useGarmentShadingPreview((state) => state.clearShadingPreview);

  const commitShadingPreview = useCallback(() => {
    const preview = useGarmentShadingPreview.getState().preview;
    if (preview?.partId === partId) {
      const { colorPicked, ...gradientPatch } = preview.patch;
      if (colorPicked !== undefined) {
        setPartColorPicked(partId, colorPicked);
      }
      if (Object.keys(gradientPatch).length > 0) {
        setPartGradient(partId, gradientPatch);
      }
    }
    clearShadingPreview();
  }, [clearShadingPreview, partId, setPartColorPicked, setPartGradient]);

  if (!part) return null;

  return (
    <Flex variant="configurator_part" className="gap-7">
      <ToggleControl
        label="Sfumatura"
        active={part.enabled}
        onChange={(enabled) => {
          clearShadingPreview();
          setPartGradient(part.id, { enabled });
        }}
      />
      {part.enabled && (
        <>
          <Flex variant="configurator_part">
            <div className="w-[60px] h-[60px] rounded-[8px] border border-gray-200" style={{ backgroundColor: part.color }} />
          </Flex>
          <ColorControl
            label="Colore 2"
            color={part.colorPicked}
            onPreviewSelect={(color) => setShadingPreview(part.id, { colorPicked: color })}
            onSelect={(color) => {
              clearShadingPreview();
              setPartColorPicked(part.id, color);
            }}
          />
          <RangeControl
            label="Rotazione"
            value={part.rotation}
            onChange={(value) => setShadingPreview(part.id, { rotation: value })}
            onCommit={commitShadingPreview}
            min={0}
            max={360}
            unit="°"
          />
          <RangeControl
            label="Posizione linea"
            value={part.position}
            onChange={(value) => setShadingPreview(part.id, { position: value })}
            onCommit={commitShadingPreview}
            unit="%"
          />
          <RangeControl
            label="Morbidezza"
            value={part.softness}
            onChange={(value) => setShadingPreview(part.id, { softness: value })}
            onCommit={commitShadingPreview}
            unit="%"
          />
          <RangeControl
            label="Trasparenza"
            value={part.opacity}
            onChange={(value) => setShadingPreview(part.id, { opacity: value })}
            onCommit={commitShadingPreview}
            unit="%"
          />
        </>
      )}
    </Flex>
  );
};

export { ShedingControl };
