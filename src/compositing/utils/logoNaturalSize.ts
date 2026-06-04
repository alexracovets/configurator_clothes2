import { loadImage } from '../canvas/loadImage';

/** Cache of logo image natural dimensions, keyed by src.
 * Populated as a side effect of drawing logos on the atlas; read synchronously
 * by the logo gizmo (hit-test + frame layout). */
const cache = new Map<string, { w: number; h: number }>();

const getCachedNaturalSize = (src: string): { w: number; h: number } | null => cache.get(src) ?? null;

const setCachedNaturalSize = (src: string, w: number, h: number): void => {
  cache.set(src, { w, h });
};

const ensureNaturalSize = async (src: string): Promise<{ w: number; h: number }> => {
  const cached = cache.get(src);
  if (cached) return cached;
  const img = await loadImage(src);
  const size = { w: img.naturalWidth, h: img.naturalHeight };
  cache.set(src, size);
  return size;
};

export { getCachedNaturalSize, setCachedNaturalSize, ensureNaturalSize };
