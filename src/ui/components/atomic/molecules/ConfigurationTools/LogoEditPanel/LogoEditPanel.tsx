'use client';

import { AtomImage, Button, Flex, Grid, SvgIcon, Text } from '@atoms';
import { useStepLogo } from '@store';

import { RangeControl } from '../RangeControl';

interface LogoEditPanelProps {
  partId: string;
  onClose: () => void;
  onReplaceImage: () => void;
  replacing?: boolean;
}

const LogoEditPanel = ({ partId, onClose, onReplaceImage, replacing = false }: LogoEditPanelProps) => {
  const part = useStepLogo((state) => state.parts.find((item) => item.id === partId));
  const updatePart = useStepLogo((state) => state.updatePart);

  if (!part || part.isDefault) return null;

  const opacity = part.opacity ?? 1;
  const opacityPercent = Math.round(opacity * 100);

  return (
    <Flex className="w-full flex-col items-start justify-start gap-5">
      <Grid className="grid-cols-[1fr_auto] items-center w-full gap-2">
        <Text className="text-[14px] leading-[15px] text-gray">File caricati</Text>
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-1 px-0 py-0 text-[16px] font-semibold hover:text-error hover:bg-transparent"
          onClick={onClose}
        >
          Chiudi
          <SvgIcon name="close" />
        </Button>
      </Grid>

      <Button
        type="button"
        variant="ghost"
        disabled={replacing}
        onClick={onReplaceImage}
        aria-label="Sostituisci immagine"
        className="grid h-auto w-full min-w-0 grid-cols-[auto_1fr] items-center justify-start gap-2 bg-transparent"
      >
        <AtomImage src={part.src} alt={part.fileName} width={24} height={24} className="object-contain shrink-0" />
        <Text className="text-[16px] leading-[20px] font-semibold text-black-10 tracking-wide line-clamp-2 text-left">{part.fileName}</Text>
      </Button>
      <RangeControl label="Rotazione" value={part.rotation} onChange={(rotation) => updatePart(part.id, { rotation })} min={0} max={360} unit="°" />
      <RangeControl label="Trasparenza" value={opacityPercent} onChange={(value) => updatePart(part.id, { opacity: value / 100 })} min={0} max={100} unit="%" />
    </Flex>
  );
};

export { LogoEditPanel };
