'use client';

import { memo, useCallback } from 'react';

import { AtomInputHex, Button, ColorPicker, Flex, Grid, SvgIcon, Text } from '@atoms';
import { useStepColor } from '@store';
import { PALETTE_COLORS } from '@constants';

interface ColorControlProps {
  color: string;
  label?: string;
  partId?: string;
  onSelect?: (color: string) => void;
}

const ColorControl = memo(({ partId, color, label, onSelect }: ColorControlProps) => {
  const setPartColor = useStepColor((state) => state.setPartColor);

  const handleSelect = useCallback(
    (nextColor: string) => {
      if (onSelect) {
        onSelect(nextColor);
        return;
      }

      if (partId) setPartColor(partId, nextColor);
    },
    [onSelect, partId, setPartColor],
  );

  return (
    <Flex variant="configurator_part">
      {label && <Text variant="configurator_part_label">{label}</Text>}
      <Grid className="grid-cols-[auto_auto] items-center justify-between gap-2 w-full">
        <ColorPicker
          color={color}
          onChange={handleSelect}
          trigger={
            <Button variant="destructive" size="icon">
              <span>Seleziona il colore</span>
              <SvgIcon name="select_color" />
            </Button>
          }
        />
        <AtomInputHex value={color} onChange={handleSelect} />
      </Grid>
      <Grid variant="select_parts">
        {PALETTE_COLORS.map((paletteColor) => (
          <Button
            key={paletteColor}
            variant="select_part_short"
            data-active={color === paletteColor}
            style={{ backgroundColor: paletteColor }}
            onClick={() => handleSelect(paletteColor)}
          />
        ))}
      </Grid>
    </Flex>
  );
});

ColorControl.displayName = 'ColorControl';

export { ColorControl };
