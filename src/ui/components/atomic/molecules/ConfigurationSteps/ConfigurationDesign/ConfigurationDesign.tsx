'use client';

import { AtomImage, Button, Flex, Grid, SvgIcon } from '@atoms';
import { ColorControl, RangeControl } from '@molecules';

import { useStepDesign } from '@store';

const ConfigurationDesign = () => {
  const design = useStepDesign((state) => state.design);
  const activeDesign = useStepDesign((state) => state.activeDesign);
  const activeDesignColor = useStepDesign((state) => state.activeDesignColor);
  const activeDesignOpacity = useStepDesign((state) => state.activeDesignOpacity);
  const setActiveDesign = useStepDesign((state) => state.setActiveDesign);
  const setActiveDesignColor = useStepDesign((state) => state.setActiveDesignColor);
  const setActiveDesignOpacity = useStepDesign((state) => state.setActiveDesignOpacity);

  if (design.length === 0) return null;

  return (
    <Flex variant="step_design">
      <Grid variant="select_parts">
        <Button variant="select_none" title="Nessuno" data-active={activeDesign === null} onClick={() => setActiveDesign(null)}>
          <SvgIcon name="none" />
          Nessuno
        </Button>
        {design.map((patternSrc, index) => (
          <Button
            key={patternSrc}
            variant="select_part"
            className="transition-none will-change-auto"
            title={patternSrc}
            data-active={patternSrc === activeDesign}
            onClick={() => setActiveDesign(patternSrc)}
            style={{ contentVisibility: 'auto', contain: 'layout paint style' }}
          >
            <AtomImage
              src={patternSrc}
              alt={patternSrc}
              width={80}
              height={80}
              loading={index < 2 ? 'eager' : 'lazy'}
              fetchPriority={index < 2 ? 'high' : 'low'}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </Button>
        ))}
      </Grid>
      {activeDesign && <ColorControl color={activeDesignColor} onSelect={setActiveDesignColor} label="Colore design" />}
      {activeDesign && (
        <RangeControl
          value={Math.round(activeDesignOpacity * 100)}
          onChange={(value) => setActiveDesignOpacity(value / 100)}
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
