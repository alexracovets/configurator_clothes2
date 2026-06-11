'use client';

import { type ChangeEvent, useMemo, useRef, useState } from 'react';

import { AtomImage, Button, Flex, Grid, SvgIcon, Text } from '@atoms';
import { useLogoFileHandler, useStepLogo } from '@hooks';
import { HiddenLogoFileInput, LogoUpload } from '../../ConfigurationTools/LogoUpload';
import { LogoEditPanel } from '../../ConfigurationTools/LogoEditPanel';
import type { filePickContextType, stepLogoPartStateType } from '@types';

const LogoListRow = ({ part, onEdit, onDelete }: { part: stepLogoPartStateType; onEdit?: () => void; onDelete?: () => void }) => (
  <Grid className="grid-cols-[1fr_auto] items-center min-h-[24px] px-2 gap-5 w-full">
    <Grid className="grid-cols-[auto_1fr] items-center gap-2 min-w-0">
      <AtomImage src={part.src} alt={part.fileName} width={16} height={16} className="object-contain shrink-0" />
      <Text className="text-[16px] text-black-10 tracking-wide font-semibold line-clamp-1">{part.fileName}</Text>
    </Grid>
    {onEdit && onDelete && (
      <Flex className="gap-1 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-[26px] h-[26px] border border-gray-30 hover:bg-white"
          onClick={onEdit}
          aria-label="Modifica logo"
        >
          <SvgIcon name="edit" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="w-[26px] h-[26px] border border-error text-error hover:bg-white hover:text-error"
          onClick={onDelete}
          aria-label="Elimina logo"
        >
          <SvgIcon name="delete" />
        </Button>
      </Flex>
    )}
  </Grid>
);

const ConfigurationLogo = () => {
  const parts = useStepLogo((state) => state.parts);
  const positions = useStepLogo((state) => state.positions);
  const canAddUserLogo = useStepLogo((state) => state.canAddUserLogo);
  const removePart = useStepLogo((state) => state.removePart);
  const { uploadLogo, loading, error } = useLogoFileHandler();

  const [editingPartId, setEditingPartId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickContextRef = useRef<filePickContextType>({ mode: 'upload' });

  const brandLogos = useMemo(() => parts.filter((part) => part.isDefault), [parts]);
  const userLogos = useMemo(() => parts.filter((part) => !part.isDefault), [parts]);
  const editingPart = useMemo(() => (editingPartId ? parts.find((part) => part.id === editingPartId && !part.isDefault) : undefined), [editingPartId, parts]);

  const freeInteractivePosition = useMemo(() => {
    const interactive = positions.filter((position) => position.interactive);
    const usedKeys = new Set(parts.filter((part) => !part.isDefault).map((part) => part.positionKey));
    return interactive.find((position) => !usedKeys.has(position.key));
  }, [parts, positions]);

  const canUpload = canAddUserLogo();

  const handleUploadFile = async (file: File) => {
    await uploadLogo(file, freeInteractivePosition ? { position: freeInteractivePosition } : undefined);
  };

  const handleInputChange = async (file: File | undefined) => {
    if (!file) return;

    const context = pickContextRef.current;

    if (context.mode === 'replace') {
      await uploadLogo(file, { partId: context.partId });
      return;
    }

    await handleUploadFile(file);
  };

  const openFilePicker = () => {
    if (loading || !canUpload) return;
    pickContextRef.current = { mode: 'upload' };
    fileInputRef.current?.click();
  };

  const openReplaceFilePicker = (partId: string) => {
    if (loading) return;
    pickContextRef.current = { mode: 'replace', partId };
    fileInputRef.current?.click();
  };

  const handleDelete = (partId: string) => {
    removePart(partId);
    if (editingPartId === partId) setEditingPartId(null);
  };

  const hasUploadedList = brandLogos.length > 0 || userLogos.length > 0;

  if (editingPart) {
    return (
      <>
        <HiddenLogoFileInput
          ref={fileInputRef}
          disabled={loading}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            void handleInputChange(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <Flex variant="step_design" className="w-full min-h-0 flex-col items-start justify-start gap-4">
          <LogoEditPanel
            partId={editingPart.id}
            onClose={() => setEditingPartId(null)}
            onReplaceImage={() => openReplaceFilePicker(editingPart.id)}
            replacing={loading}
          />
        </Flex>
      </>
    );
  }

  return (
    <>
      <HiddenLogoFileInput
        ref={fileInputRef}
        disabled={loading}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          void handleInputChange(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <Flex variant="step_design" className="w-full min-h-0 flex-col items-start justify-start gap-4">
        <LogoUpload canUpload={canUpload} loading={loading} error={error} onOpenFilePicker={openFilePicker} onFileSelected={handleUploadFile} />

        {hasUploadedList && (
          <Flex className="flex-col gap-3 items-start w-full">
            <Text className="text-[14px] leading-[15px] text-gray">File caricati</Text>
            <Flex className="flex-col gap-4 items-start w-full" asChild>
              <ul>
                {brandLogos.map((part) => (
                  <li key={part.id} className="w-full">
                    <LogoListRow part={part} />
                  </li>
                ))}
                {userLogos.map((part) => (
                  <li key={part.id} className="w-full">
                    <LogoListRow part={part} onEdit={() => setEditingPartId(part.id)} onDelete={() => handleDelete(part.id)} />
                  </li>
                ))}
              </ul>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export { ConfigurationLogo };
