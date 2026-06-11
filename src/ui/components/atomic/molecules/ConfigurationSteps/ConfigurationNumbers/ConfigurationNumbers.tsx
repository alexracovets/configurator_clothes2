'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { AccordionAtom, AtomPopover, AtomPopoverContent, AtomPopoverTrigger, Button, Flex, SvgIcon, Text } from '@atoms';
import { ColorTabControl } from '../../ConfigurationTools/ColorTabControl';
import { FontSelectRow } from '../../ConfigurationTools/FontSelectRow';
import { PartColorSwitch } from '../../ConfigurationTools/PartColorSwitch';
import { RangeControl } from '../../ConfigurationTools/RangeControl';
import { createNumberInstance, resolveNumberDefaults, resolveNumberLimits, sanitizeNumberText, useConfiguratorProduct, useGarmentNumber } from '@store';
import type { numberPartFormPropsType, numberPositionType } from '@types';
import { cn } from '@utils';

const NumberPartForm = ({ instanceId, limits, placeholder }: numberPartFormPropsType) => {
  const instance = useGarmentNumber((state) => state.instances.find((item) => item.id === instanceId));
  const updateInstance = useGarmentNumber((state) => state.updateInstance);
  const removeInstance = useGarmentNumber((state) => state.removeInstance);
  const setPreview = useGarmentNumber((state) => state.setPreview);
  const clearPreview = useGarmentNumber((state) => state.clearPreview);
  const previewPatch = useGarmentNumber((state) => (state.preview?.instanceId === instanceId ? state.preview.patch : null));
  const previewText = previewPatch?.text;
  const previewTextColor = previewPatch?.textColor;
  const previewStrokeColor = previewPatch?.strokeColor;
  const previewFontSize = previewPatch?.fontSize;
  const previewStrokeWidth = previewPatch?.strokeWidth;

  const commit = useCallback(
    (patch: Parameters<typeof updateInstance>[1]) => {
      const preview = useGarmentNumber.getState().preview;
      if (preview?.instanceId === instanceId) {
        updateInstance(instanceId, { ...preview.patch, ...patch });
      } else {
        updateInstance(instanceId, patch);
      }
      clearPreview();
    },
    [clearPreview, instanceId, updateInstance],
  );

  const commitFromPreview = useCallback(() => {
    const preview = useGarmentNumber.getState().preview;
    if (preview?.instanceId === instanceId) {
      updateInstance(instanceId, preview.patch);
    }
    clearPreview();
  }, [clearPreview, instanceId, updateInstance]);

  if (!instance) return null;

  return (
    <Flex variant="configurator_part" className="gap-4 pt-2">
      <FontSelectRow font={instance.font} onChange={(font) => commit({ font })} />

      <Flex variant="configurator_part">
        <Text variant="configurator_part_label">Numero</Text>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={previewText ?? instance.text}
          maxLength={limits.maxLength}
          onChange={(e) => setPreview(instanceId, { text: sanitizeNumberText(e.target.value) })}
          onBlur={commitFromPreview}
          className="w-full h-10 bg-white border border-input-border rounded-[8px] px-3 text-sm font-inter text-default outline-none focus:border-active transition-colors"
          placeholder={placeholder}
        />
      </Flex>

      <ColorTabControl
        textColor={previewTextColor ?? instance.textColor}
        strokeColor={previewStrokeColor ?? instance.strokeColor}
        onTextColor={(textColor) => commit({ textColor })}
        onStrokeColor={(strokeColor) => commit({ strokeColor })}
        onPreviewTextColor={(textColor) => setPreview(instanceId, { textColor })}
        onPreviewStrokeColor={(strokeColor) => setPreview(instanceId, { strokeColor })}
      />

      <RangeControl
        label="Dimensione testo"
        value={previewFontSize ?? instance.fontSize}
        onChange={(fontSize) => setPreview(instanceId, { fontSize })}
        onCommit={commitFromPreview}
        min={limits.fontSizeMin}
        max={limits.fontSizeMax}
        unit="px"
      />

      <RangeControl
        label="Spessore contorno"
        value={previewStrokeWidth ?? instance.strokeWidth}
        onChange={(strokeWidth) => setPreview(instanceId, { strokeWidth })}
        onCommit={commitFromPreview}
        min={0}
        max={limits.strokeWidthMax}
        unit="px"
      />

      <Button variant="delete" size="delete" onClick={() => removeInstance(instanceId)}>
        <SvgIcon name="delete" className="w-[14px] h-[15.75px]" />
        Eliminare
      </Button>
    </Flex>
  );
};

const ConfigurationNumbers = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const positions = useGarmentNumber((state) => state.positions);
  const instances = useGarmentNumber((state) => state.instances);
  const addInstance = useGarmentNumber((state) => state.addInstance);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const nextInstanceIdRef = useRef(0);

  const numberDefaults = useMemo(() => (positions.length > 0 ? resolveNumberDefaults(product) : null), [positions.length, product]);
  const limits = useMemo(() => (positions.length > 0 ? resolveNumberLimits(product) : null), [positions.length, product]);

  const availablePositions = useMemo(() => {
    const used = new Set(instances.map((instance) => instance.positionKey));
    return positions.filter((position) => position.interactive && !used.has(position.key));
  }, [instances, positions]);

  const resolvedOpenItems = useMemo(() => {
    const validIds = new Set(instances.map((instance) => instance.id));
    return openItems.filter((id) => validIds.has(id));
  }, [instances, openItems]);

  const createInstanceForPosition = (position: numberPositionType) => {
    if (!position.interactive) return;

    nextInstanceIdRef.current += 1;
    const instanceId = `${position.key}_${nextInstanceIdRef.current}`;
    addInstance(createNumberInstance(product, position, instanceId));
    setOpenItems((current) => [...current, instanceId]);
    setIsLocationPickerOpen(false);
  };

  const items = useMemo(
    () =>
      instances.map((instance) => ({
        value: instance.id,
        trigger: <PartColorSwitch color={instance.textColor} label={instance.label} />,
        content: <NumberPartForm instanceId={instance.id} limits={limits!} placeholder={numberDefaults?.text ?? '00'} />,
      })),
    [instances, limits, numberDefaults?.text],
  );

  if (positions.length === 0 || !limits || !numberDefaults) return null;

  return (
    <Flex key={product.path} variant="step_design" className="gap-3">
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
              variant="outline"
              className={cn('w-full justify-start rounded-[8px] bg-gray-100 px-3 py-2', 'hover:bg-gray-200')}
              onClick={() => createInstanceForPosition(position)}
            >
              {position.label}
            </Button>
          ))}
          {availablePositions.length === 0 && <Text variant="configurator_part_label">Nessuna posizione disponibile</Text>}
        </AtomPopoverContent>
      </AtomPopover>

      {instances.length > 0 && (
        <AccordionAtom
          items={items}
          value={resolvedOpenItems}
          onValueChange={(value) => setOpenItems(Array.isArray(value) ? value : value ? [value] : [])}
          multiple
          className="gap-2"
        />
      )}
    </Flex>
  );
};

export { ConfigurationNumbers };
