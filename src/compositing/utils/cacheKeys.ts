import { PART_TEXTURE_SIZE } from '@constants';
import { useStepLogoSelection } from '@store';

import type { CompositingStoreInput } from '../types';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';

const buildPrintAtlasCacheKey = (
  input: PrintCompositingInput | CompositingStoreInput,
  selectedLogoId: string | null = useStepLogoSelection.getState().selectedPartId,
) =>
  JSON.stringify({
    activePatternKey: input.activePattern?.key ?? null,
    activeOpacity: input.activePatternCustomization?.opacity ?? null,
    activeColors: input.activePatternCustomization?.colors ?? null,
    defaultPatternKey: input.defaultPattern?.key ?? null,
    // Selection is baked into the atlas so the gizmo frame appears/disappears.
    selectedLogoId,
    logoParts: input.logoParts.map((part) => ({
      id: part.id,
      src: part.src,
      uv: part.uv,
      rotation: part.rotation,
      opacity: part.opacity,
      scale: part.scale,
      baseScale: part.baseScale,
    })),
  });

const buildFabricCacheKey = (input: FabricCompositingInput | CompositingStoreInput, partId: string | null, partTextureSize = PART_TEXTURE_SIZE) =>
  JSON.stringify({
    partTextureSize,
    partId,
    color: partId ? input.colorParts.find((part) => part.id === partId)?.color : null,
    shading: partId
      ? (() => {
          const s = input.shadingParts?.find((p) => p.id === partId);
          return s ? { enabled: s.enabled, color: s.colorPicked, position: s.position, softness: s.softness, opacity: s.opacity, rotation: s.rotation } : null;
        })()
      : null,
    nameParts: input.nameParts.map((part) => ({
      id: part.id,
      text: part.text,
      font: part.font,
      fontSize: part.fontSize,
      textColor: part.textColor,
      strokeColor: part.strokeColor,
      strokeWidth: part.strokeWidth,
      uv: part.uv,
      rotation: part.rotation,
    })),
    numberParts: input.numberParts.map((part) => ({
      id: part.id,
      text: part.text,
      font: part.font,
      fontSize: part.fontSize,
      textColor: part.textColor,
      strokeColor: part.strokeColor,
      strokeWidth: part.strokeWidth,
      uv: part.uv,
      rotation: part.rotation,
    })),
  });

export { buildFabricCacheKey, buildPrintAtlasCacheKey };
