'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { AccordionAtom, AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Button, Flex, SvgIcon, Text } from '@atoms';
import { ColorTabControl, FontSelectRow, PartColorSwitch, RangeControl } from '@molecules';
import { useGarmentNumberPreview, useStepNumber } from '@store';
import { cn } from '@utils';
import { DEFAULT_TEXT_CONFIGURATION, FONTS_CONFIGURATION } from '@constants';

const DEFAULT_NUMBER_TEXT = '9';

interface NumberPartFormProps {
  instId: string;
}

const NumberPartForm = ({ instId }: NumberPartFormProps) => {
  const inst = useStepNumber((state) => state.parts.find((p) => p.id === instId));
  const updatePart = useStepNumber((state) => state.updatePart);
  const removePart = useStepNumber((state) => state.removePart);
  const setNumberPreview = useGarmentNumberPreview((state) => state.setNumberPreview);
  const clearNumberPreview = useGarmentNumberPreview((state) => state.clearNumberPreview);

  const commit = useCallback(
    (patch: Parameters<typeof updatePart>[1]) => {
      clearNumberPreview();
      updatePart(instId, patch);
    },
    [clearNumberPreview, instId, updatePart],
  );

  const commitFromPreview = useCallback(() => {
    const preview = useGarmentNumberPreview.getState().preview;
    if (preview?.partId === instId) {
      updatePart(instId, preview.patch);
    }
    clearNumberPreview();
  }, [clearNumberPreview, instId, updatePart]);

  if (!inst) return null;

  return (
    <Flex variant="configurator_part" className="gap-4 pt-2">
      <FontSelectRow font={inst.font} onChange={(font) => commit({ font })} />

      <Flex variant="configurator_part">
        <Text variant="configurator_part_label">Numero</Text>
        <input
          type="text"
          inputMode="numeric"
          value={inst.text}
          maxLength={3}
          onChange={(e) => commit({ text: e.target.value.replace(/\D/g, '') })}
          className="w-full h-10 bg-white border border-input-border rounded-[8px] px-3 text-sm font-inter text-default outline-none focus:border-active transition-colors"
          placeholder="9"
        />
      </Flex>

      <ColorTabControl
        textColor={inst.textColor}
        strokeColor={inst.strokeColor}
        onTextColor={(textColor) => commit({ textColor })}
        onStrokeColor={(strokeColor) => commit({ strokeColor })}
        onPreviewTextColor={(textColor) => setNumberPreview(instId, { textColor })}
        onPreviewStrokeColor={(strokeColor) => setNumberPreview(instId, { strokeColor })}
      />

      <RangeControl
        label="Dimensione testo"
        value={inst.fontSize}
        onChange={(fontSize) => setNumberPreview(instId, { fontSize })}
        onCommit={commitFromPreview}
        min={10}
        max={500}
        unit="px"
      />

      <RangeControl
        label="Spessore contorno"
        value={inst.strokeWidth}
        onChange={(strokeWidth) => setNumberPreview(instId, { strokeWidth })}
        onCommit={commitFromPreview}
        min={0}
        max={20}
        unit="px"
      />

      {!inst.isDefault && (
        <Button variant="delete" size="delete" onClick={() => removePart(instId)}>
          <SvgIcon name="delete" className="w-[14px] h-[15.75px]" />
          Eliminare
        </Button>
      )}
    </Flex>
  );
};

const ConfigurationNumbers = () => {
  const parts = useStepNumber((state) => state.parts);
  const positions = useStepNumber((state) => state.positions);
  const addPart = useStepNumber((state) => state.addPart);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const nextPartIdRef = useRef(0);

  const availablePositions = useMemo(() => {
    const used = new Set(parts.map((part) => part.positionKey));
    return positions.filter((position) => position.interactive && !used.has(position.key));
  }, [positions, parts]);

  const resolvedOpenItems = useMemo(() => {
    const validPartIds = new Set(parts.map((part) => part.id));
    const filtered = openItems.filter((id) => validPartIds.has(id));
    if (!hasInitialized && parts.length > 0) return [parts[0].id];
    return filtered;
  }, [openItems, parts, hasInitialized]);

  const handleAccordionChange = (value: string | string[]) => {
    if (!hasInitialized) setHasInitialized(true);
    setOpenItems(Array.isArray(value) ? value : value ? [value] : []);
  };

  const createPartForPosition = (position: (typeof positions)[number]) => {
    if (!position.interactive) return;

    nextPartIdRef.current += 1;
    const font = FONTS_CONFIGURATION[0]?.name ?? 'Oswald';
    const newId = `${position.key}_${nextPartIdRef.current}`;
    addPart({
      id: newId,
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
    setHasInitialized(true);
    setOpenItems((prev) => [...prev, newId]);
    setIsLocationPickerOpen(false);
  };

  const items = parts.map((inst) => ({
    value: inst.id,
    trigger: <PartColorSwitch color={inst.textColor} label={inst.label} />,
    content: <NumberPartForm instId={inst.id} />,
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

      {parts.length > 0 && <AccordionAtom items={items} value={resolvedOpenItems} onValueChange={handleAccordionChange} multiple={true} className="gap-2" />}
    </Flex>
  );
};

export { ConfigurationNumbers };
