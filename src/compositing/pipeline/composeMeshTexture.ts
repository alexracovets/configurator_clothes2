import { UV0_BOUNDS, type UvBounds } from '@constants';

import type { CompositingInput } from '../types';
import { composePartTexture } from '../utils/composePartTexture';

import { composePrintAtlas } from './composePrintAtlas';

/**
 * Full mesh albedo for one part (fabric + print cropped by UV0 bounds).
 * Layer 3 (PBR maps) is applied on MeshStandardMaterial separately.
 */
const composeMeshTexture = async (input: CompositingInput, partId: string | null, printCanvas?: HTMLCanvasElement, bounds: UvBounds = UV0_BOUNDS.full) => {
  const atlas = printCanvas ?? (await composePrintAtlas(input));
  return composePartTexture(input, partId, atlas, bounds);
};

export { composeMeshTexture };
