'use client';

import { useMemo, useRef, useState } from 'react';

import { AccordionAtom, AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Button, Flex, SvgIcon, Text } from '@atoms';
import { ColorTabControl, FontSelectRow, PartColorSwitch, RangeControl } from '@molecules';
import { useStepNumber } from '@store';
import { cn } from '@utils';
import { DEFAULT_TEXT_CONFIGURATION, FONTS_CONFIGURATION } from '@constants';

const DEFAULT_NUMBER_TEXT = '9';

const ConfigurationNumbers = () => {
  const parts = useStepNumber((state) => state.parts);
  const positions = useStepNumber((state) => state.positions);
  const addPart = useStepNumber((state) => state.addPart);
  const removePart = useStepNumber((state) => state.removePart);
  const updatePart = useStepNumber((state) => state.updatePart);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const nextPartIdRef = useRef(0);

  const availablePositions = useMemo(() => {
    const used = new Set(parts.map((part) => part.positionKey));
    return positions.filter((position) => position.interactive && !used.has(position.key));
  }, [positions, parts]);

  const resolvedOpenItems = useMemo(() => {
    const validPartIds = new Set(parts.map((part) => part.id));
    const filtered = openItems.filter((id) => validPartIds.has(id));
    if (filtered.length > 0) return filtered;
    return parts.length > 0 ? [parts[0].id] : [];
  }, [openItems, parts]);

  const createPartForPosition = (position: (typeof positions)[number]) => {
    if (!position.interactive) return;

    nextPartIdRef.current += 1;
    const font = FONTS_CONFIGURATION[0]?.name ?? 'Oswald';
    addPart({
      id: `${position.key}_${nextPartIdRef.current}`,
      positionKey: position.key,
      label: position.label,
      zone: position.zone,
      uv: position.uv,
      rotation: position.rotation,
      text: DEFAULT_NUMBER_TEXT,
      font,
      fontSize: position.fontSize,
      textColor: DEFAULT_TEXT_CONFIGURATION.text,
      strokeColor: DEFAULT_TEXT_CONFIGURATION.stroke,
      strokeWidth: DEFAULT_TEXT_CONFIGURATION.strokeWidth,
      isDefault: false,
    });
    setIsLocationPickerOpen(false);
  };

  const items = parts.map((inst) => ({
    value: inst.id,
    trigger: <PartColorSwitch color={inst.textColor} label={inst.label} />,
    content: (
      <Flex variant="configurator_part" className="gap-4 pt-2">
        <FontSelectRow font={inst.font} onChange={(font) => updatePart(inst.id, { font })} />

        <Flex variant="configurator_part">
          <Text variant="configurator_part_label">Numero</Text>
          <input
            type="text"
            inputMode="numeric"
            value={inst.text}
            maxLength={3}
            onChange={(e) => updatePart(inst.id, { text: e.target.value.replace(/\D/g, '') })}
            className="w-full h-10 bg-white border border-input-border rounded-[8px] px-3 text-sm font-inter text-default outline-none focus:border-active transition-colors"
            placeholder="9"
          />
        </Flex>

        <ColorTabControl
          textColor={inst.textColor}
          strokeColor={inst.strokeColor}
          onTextColor={(textColor) => updatePart(inst.id, { textColor })}
          onStrokeColor={(strokeColor) => updatePart(inst.id, { strokeColor })}
        />

        <RangeControl label="Dimensione testo" value={inst.fontSize} onChange={(fontSize) => updatePart(inst.id, { fontSize })} min={10} max={500} unit="px" />

        <RangeControl
          label="Spessore contorno"
          value={inst.strokeWidth}
          onChange={(strokeWidth) => updatePart(inst.id, { strokeWidth })}
          min={0}
          max={20}
          unit="px"
        />

        {!inst.isDefault && (
          <Button variant="delete" size="delete" onClick={() => removePart(inst.id)}>
            <SvgIcon name="delete" className="w-[14px] h-[15.75px]" />
            Eliminare
          </Button>
        )}
      </Flex>
    ),
  }));

  return (
    <Flex variant="step_design" className="gap-3">
      <AtomPopover open={isLocationPickerOpen && availablePositions.length > 0} onOpenChange={setIsLocationPickerOpen}>
        <AtomPopoverTrigger asChild>
          <Button variant="default" size="sm" className="w-full justify-center" disabled={availablePositions.length === 0}>
            + Aggiungi numero
          </Button>
        </AtomPopoverTrigger>
        <AtomPopoverContent className="w-(--anchor-width) p-3" gap="sm">
          <Text variant="configurator_part_label">Scegli posizione</Text>
          {availablePositions.map((position) => (
            <Button
              key={position.key}
              variant="ghost"
              className={cn('w-full justify-start rounded-[8px] bg-gray-100 px-3 py-2', 'hover:bg-gray-200')}
              onClick={() => createPartForPosition(position)}
            >
              {position.label}
            </Button>
          ))}
          {availablePositions.length === 0 && <Text variant="configurator_part_label">Nessuna posizione disponibile</Text>}
        </AtomPopoverContent>
      </AtomPopover>

      {parts.length > 0 && (
        <AccordionAtom
          items={items}
          value={resolvedOpenItems}
          onValueChange={(value) => setOpenItems(Array.isArray(value) ? value : value ? [value] : [])}
          className="gap-2"
        />
      )}
    </Flex>
  );
};

export { ConfigurationNumbers };
