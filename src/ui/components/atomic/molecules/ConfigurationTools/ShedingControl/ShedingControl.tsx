'use client';

import { useCallback, useEffect, useRef } from 'react';

import { Flex } from '@atoms';

import { ColorControl, RangeControl, ToggleControl } from '@molecules';

import { useStepShading } from '@store';

interface ShedingControlProps {
  partId: string;
}

const ShedingControl = ({ partId }: ShedingControlProps) => {
  const part = useStepShading((state) => state.parts.find((currentPart) => currentPart.id === partId));
  const setPartColorPicked = useStepShading((state) => state.setPartColorPicked);
  const setPartGradient = useStepShading((state) => state.setPartGradient);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queuedPatchRef = useRef<Partial<{ rotation: number; position: number; softness: number; opacity: number }>>({});

  const flushGradientPatch = useCallback(() => {
    const patch = queuedPatchRef.current;
    queuedPatchRef.current = {};
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (Object.keys(patch).length > 0) setPartGradient(partId, patch);
  }, [partId, setPartGradient]);

  const queueGradientPatch = useCallback(
    (patch: Partial<{ rotation: number; position: number; softness: number; opacity: number }>) => {
      queuedPatchRef.current = { ...queuedPatchRef.current, ...patch };
      if (timerRef.current !== null) return;
      timerRef.current = setTimeout(() => {
        flushGradientPatch();
      }, 32);
    },
    [flushGradientPatch],
  );

  useEffect(
    () => () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    },
    [],
  );

  if (!part) return null;

  return (
    <Flex variant="configurator_part" className="gap-7">
      <ToggleControl label="Sfumatura" active={part.enabled} onChange={(enabled) => setPartGradient(part.id, { enabled })} />
      {part.enabled && (
        <>
          <Flex variant="configurator_part">
            <div className="w-[60px] h-[60px] rounded-[8px] border border-gray-200" style={{ backgroundColor: part.color }} />
          </Flex>
          <ColorControl label="Colore 2" color={part.colorPicked} onSelect={(color) => setPartColorPicked(part.id, color)} />
          <RangeControl
            label="Rotazione"
            value={part.rotation}
            onChange={(value) => queueGradientPatch({ rotation: value })}
            onCommit={flushGradientPatch}
            min={0}
            max={360}
            unit="°"
          />
          <RangeControl
            label="Posizione linea"
            value={part.position}
            onChange={(value) => queueGradientPatch({ position: value })}
            onCommit={flushGradientPatch}
            unit="%"
          />
          <RangeControl
            label="Morbidezza"
            value={part.softness}
            onChange={(value) => queueGradientPatch({ softness: value })}
            onCommit={flushGradientPatch}
            unit="%"
          />
          <RangeControl
            label="Trasparenza"
            value={part.opacity}
            onChange={(value) => queueGradientPatch({ opacity: value })}
            onCommit={flushGradientPatch}
            unit="%"
          />
        </>
      )}
    </Flex>
  );
};

export { ShedingControl };
