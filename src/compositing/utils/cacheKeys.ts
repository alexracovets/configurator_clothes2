import type { CompositingStoreInput } from '../types';

const buildPrintAtlasCacheKey = (input: CompositingStoreInput) =>
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

const buildFabricCacheKey = (input: CompositingStoreInput, partId: string | null) => {
  const shading = partId ? input.shadingParts.find((part) => part.id === partId) : null;

  return JSON.stringify({
    partId,
    color: partId ? input.colorParts.find((part) => part.id === partId)?.color : null,
    shading: shading
      ? {
          enabled: shading.enabled,
          colorPicked: shading.colorPicked,
          rotation: shading.rotation,
          position: shading.position,
          softness: shading.softness,
          opacity: shading.opacity,
        }
      : null,
  });
};

export { buildFabricCacheKey, buildPrintAtlasCacheKey };
