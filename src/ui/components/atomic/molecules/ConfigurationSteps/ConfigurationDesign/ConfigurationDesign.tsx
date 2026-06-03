'use client';

import { useCallback, useMemo } from 'react';

import { AtomImage, Button, Flex, Grid, SvgIcon } from '@atoms';
import { ColorControl, ColorTabControl, PatternLayerColorControl, RangeControl } from '@molecules';
import type { DesignPatternPartState, DesignPatternState } from '@store';
import { useGarmentDesignPreview, useStepDesign } from '@store';
import { cn } from '@utils';

const DEFAULT_PART_COLOR = '#000000';

const PatternPreview = ({ parts, eager }: { parts: DesignPatternPartState[]; eager?: boolean }) => (
  <div className="relative w-full h-full">
    {parts.map((part, index) => (
      <AtomImage
        key={part.key}
        src={part.src}
        alt=""
        width={80}
        height={80}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'low'}
        className={cn('w-full h-full object-cover', index > 0 && 'absolute inset-0')}
        draggable={false}
      />
    ))}
  </div>
);

const ConfigurationDesign = () => {
  const patterns = useStepDesign((state) => state.patterns);
  const activePatternKey = useStepDesign((state) => state.activePatternKey);
  const customizations = useStepDesign((state) => state.customizations);
  const setActivePattern = useStepDesign((state) => state.setActivePattern);
  const setPartColor = useStepDesign((state) => state.setPartColor);
  const setPatternOpacity = useStepDesign((state) => state.setPatternOpacity);
  const setDesignPreview = useGarmentDesignPreview((state) => state.setDesignPreview);
  const clearDesignPreview = useGarmentDesignPreview((state) => state.clearDesignPreview);
  const setOpacityPreview = useGarmentDesignPreview((state) => state.setOpacityPreview);
  const clearOpacityPreview = useGarmentDesignPreview((state) => state.clearOpacityPreview);

  const activePattern = useMemo(() => patterns.find((pattern) => pattern.key === activePatternKey), [activePatternKey, patterns]);
  const activeCustomization = activePatternKey ? customizations[activePatternKey] : undefined;

  const getPartColor = (partKey: string) => activeCustomization?.colors[partKey] ?? DEFAULT_PART_COLOR;

  const handleCommit = useCallback(
    (partKey: string, color: string) => {
      clearDesignPreview();
      setPartColor(partKey, color);
    },
    [clearDesignPreview, setPartColor],
  );

  const handlePreview = useCallback(
    (partKey: string, color: string) => {
      if (!activePatternKey) return;
      setDesignPreview(activePatternKey, partKey, color);
    },
    [activePatternKey, setDesignPreview],
  );

  if (patterns.length === 0) return null;

  return (
    <Flex variant="step_design">
      <Grid variant="select_parts">
        <Button variant="select_none" title="Nessuno" data-active={activePatternKey === null} onClick={() => setActivePattern(null)}>
          <SvgIcon name="none" />
          Nessuno
        </Button>
        {patterns.map((pattern: DesignPatternState, index) => (
          <Button
            key={pattern.key}
            variant="select_part"
            className="transition-none will-change-auto"
            title={pattern.name}
            data-active={pattern.key === activePatternKey}
            onClick={() => setActivePattern(pattern.key)}
            style={{ contentVisibility: 'auto', contain: 'layout paint style' }}
          >
            <PatternPreview parts={pattern.parts} eager={index < 2} />
          </Button>
        ))}
      </Grid>
      {activePattern && activePattern.parts.length === 1 && (
        <ColorControl
          color={getPartColor(activePattern.parts[0].key)}
          onSelect={(color) => handleCommit(activePattern.parts[0].key, color)}
          onPreviewSelect={(color) => handlePreview(activePattern.parts[0].key, color)}
          label="Colore design"
        />
      )}
      {activePattern && activePattern.parts.length === 2 && (
        <ColorTabControl
          textColor={getPartColor(activePattern.parts[0].key)}
          strokeColor={getPartColor(activePattern.parts[1].key)}
          onTextColor={(color) => handleCommit(activePattern.parts[0].key, color)}
          onStrokeColor={(color) => handleCommit(activePattern.parts[1].key, color)}
          onPreviewTextColor={(color) => handlePreview(activePattern.parts[0].key, color)}
          onPreviewStrokeColor={(color) => handlePreview(activePattern.parts[1].key, color)}
          label="Colore design"
        />
      )}
      {activePattern && activePattern.parts.length > 2 && (
        <PatternLayerColorControl
          layers={activePattern.parts.map((part, index) => ({
            key: part.key,
            label: `Colore ${index + 1}`,
          }))}
          colors={Object.fromEntries(activePattern.parts.map((part) => [part.key, getPartColor(part.key)]))}
          onColorChange={(partKey, color) => handleCommit(partKey, color)}
          onPreviewColorChange={(partKey, color) => handlePreview(partKey, color)}
          label="Colore design"
        />
      )}
      {activePattern && (
        <RangeControl
          value={Math.round((activeCustomization?.opacity ?? 1) * 100)}
          onChange={(value) => setOpacityPreview(value / 100)}
          onCommit={() => {
            const opacity = useGarmentDesignPreview.getState().opacityPreview;
            clearOpacityPreview();
            if (opacity !== null) setPatternOpacity(opacity);
          }}
          min={0}
          max={100}
          unit="%"
          label="Trasparenza"
        />
      )}
    </Flex>
  );
};

export { ConfigurationDesign };
