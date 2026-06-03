import { PART_TEXTURE_SIZE } from '@constants';

import type { CompositingStoreInput } from '../types';
import type { FabricCompositingInput, PrintCompositingInput } from '../types/pipelineInputs';

const buildPrintAtlasCacheKey = (input: PrintCompositingInput | CompositingStoreInput) =>
  JSON.stringify({
    activePatternKey: input.activePattern?.key ?? null,
    activeOpacity: input.activePatternCustomization?.opacity ?? null,
    activeColors: input.activePatternCustomization?.colors ?? null,
    defaultPatternKey: input.defaultPattern?.key ?? null,
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
  });

export { buildFabricCacheKey, buildPrintAtlasCacheKey };
