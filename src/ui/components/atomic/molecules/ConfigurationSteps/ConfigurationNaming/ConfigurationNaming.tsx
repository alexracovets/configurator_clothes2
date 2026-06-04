'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { AccordionAtom, AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Button, Flex, SvgIcon, Text } from '@atoms';
import { ColorTabControl, FontSelectRow, PartColorSwitch, RangeControl } from '@molecules';
import { useGarmentNamePreview, useStepName } from '@store';
import { cn } from '@utils';
import { DEFAULT_TEXT_CONFIGURATION, FONTS_CONFIGURATION } from '@constants';

const DEFAULT_NAME_TEXT = 'PLAYER NAME';

interface NamePartFormProps {
  instId: string;
}

const NamePartForm = ({ instId }: NamePartFormProps) => {
  const inst = useStepName((state) => state.parts.find((p) => p.id === instId));
  const updatePart = useStepName((state) => state.updatePart);
  const removePart = useStepName((state) => state.removePart);
  const setNamePreview = useGarmentNamePreview((state) => state.setNamePreview);
  const clearNamePreview = useGarmentNamePreview((state) => state.clearNamePreview);

  const commit = useCallback(
    (patch: Parameters<typeof updatePart>[1]) => {
      clearNamePreview();
      updatePart(instId, patch);
    },
    [clearNamePreview, instId, updatePart],
  );

  const commitFromPreview = useCallback(() => {
    const preview = useGarmentNamePreview.getState().preview;
    if (preview?.partId === instId) {
      updatePart(instId, preview.patch);
    }
    clearNamePreview();
  }, [clearNamePreview, instId, updatePart]);

  if (!inst) return null;

  return (
    <Flex variant="configurator_part" className="gap-4 pt-2">
      <FontSelectRow font={inst.font} onChange={(font) => commit({ font })} />

      <Flex variant="configurator_part">
        <Text variant="configurator_part_label">Testo</Text>
        <input
          type="text"
          value={inst.text}
          maxLength={20}
          onChange={(e) => commit({ text: e.target.value })}
          className="w-full h-10 bg-white border border-input-border rounded-[8px] px-3 text-sm font-inter text-default outline-none focus:border-active transition-colors"
          placeholder="PLAYER NAME"
        />
      </Flex>

      <ColorTabControl
        textColor={inst.textColor}
        strokeColor={inst.strokeColor}
        onTextColor={(textColor) => commit({ textColor })}
        onStrokeColor={(strokeColor) => commit({ strokeColor })}
        onPreviewTextColor={(textColor) => setNamePreview(instId, { textColor })}
        onPreviewStrokeColor={(strokeColor) => setNamePreview(instId, { strokeColor })}
      />

      <RangeControl
        label="Dimensione testo"
        value={inst.fontSize}
        onChange={(fontSize) => setNamePreview(instId, { fontSize })}
        onCommit={commitFromPreview}
        min={10}
        max={120}
        unit="px"
      />

      <RangeControl
        label="Spessore contorno"
        value={inst.strokeWidth}
        onChange={(strokeWidth) => setNamePreview(instId, { strokeWidth })}
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

const ConfigurationNaming = () => {
  const parts = useStepName((state) => state.parts);
  const positions = useStepName((state) => state.positions);
  const addPart = useStepName((state) => state.addPart);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const nextPartIdRef = useRef(0);

  const availablePositions = useMemo(() => {
    const used = new Set(parts.map((part) => part.positionKey));
    return positions.filter((position) => position.interactive && !used.has(position.key));
  }, [positions, parts]);

  const [hasInitialized, setHasInitialized] = useState(false);

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
      uv: position.uv,
      rotation: position.rotation,
      text: DEFAULT_NAME_TEXT,
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
    content: <NamePartForm instId={inst.id} />,
  }));

  return (
    <Flex variant="step_design" className="gap-3">
      <AtomPopover open={isLocationPickerOpen && availablePositions.length > 0} onOpenChange={setIsLocationPickerOpen}>
        <AtomPopoverTrigger asChild>
          <Button variant="default" size="sm" className="w-full justify-center" disabled={availablePositions.length === 0}>
            + Aggiungi nome
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

export { ConfigurationNaming };
