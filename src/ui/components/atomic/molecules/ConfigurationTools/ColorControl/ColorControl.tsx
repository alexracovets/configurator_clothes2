'use client';

import { memo, useCallback } from 'react';

import { AtomInputHex, Button, ColorPicker, Flex, Grid, SvgIcon, Text } from '@atoms';
import { useGarmentColorPreview, useStepColor } from '@store';
import { PALETTE_COLORS } from '@constants';

interface ColorControlProps {
  color: string;
  label?: string;
  partId?: string;
  onSelect?: (color: string) => void;
  /** Live updates while dragging the wheel (e.g. SFUMATURA Colore 2 → useGarmentShadingPreview). */
  onPreviewSelect?: (color: string) => void;
}

const ColorControl = memo(({ partId, color, label, onSelect, onPreviewSelect }: ColorControlProps) => {
  const setPartColor = useStepColor((state) => state.setPartColor);
  const setColorPreview = useGarmentColorPreview((state) => state.setColorPreview);
  const clearColorPreview = useGarmentColorPreview((state) => state.clearColorPreview);

  const handleCommit = useCallback(
    (nextColor: string) => {
      clearColorPreview();

      if (onSelect) {
        onSelect(nextColor);
        return;
      }

      if (partId) setPartColor(partId, nextColor);
    },
    [clearColorPreview, onSelect, partId, setPartColor],
  );

  const handlePreview = useCallback(
    (nextColor: string) => {
      if (onPreviewSelect) {
        onPreviewSelect(nextColor);
        return;
      }

      if (onSelect || !partId) return;
      setColorPreview(partId, nextColor);
    },
    [onPreviewSelect, onSelect, partId, setColorPreview],
  );

  return (
    <Flex variant="configurator_part">
      {label && <Text variant="configurator_part_label">{label}</Text>}
      <Grid className="grid-cols-[auto_auto] items-center justify-between gap-2 w-full">
        <ColorPicker
          color={color}
          onChange={handleCommit}
          onPreviewChange={handlePreview}
          trigger={
            <Button variant="destructive" size="icon">
              <span>Seleziona il colore</span>
              <SvgIcon name="select_color" />
            </Button>
          }
        />
        <AtomInputHex value={color} onChange={handleCommit} />
      </Grid>
      <Grid variant="select_parts">
        {PALETTE_COLORS.map((paletteColor) => (
          <Button
            key={paletteColor}
            variant="select_part_short"
            data-active={color === paletteColor}
            style={{ backgroundColor: paletteColor }}
            onClick={() => handleCommit(paletteColor)}
          />
        ))}
      </Grid>
    </Flex>
  );
});

ColorControl.displayName = 'ColorControl';

export { ColorControl };
