import type { WebGLRenderer } from 'three';

import { type ComposePrintAtlasFboInput, PrintAtlasFbo } from './PrintAtlasFbo';

const composePrintAtlasFbo = async (renderer: WebGLRenderer, fbo: PrintAtlasFbo, input: ComposePrintAtlasFboInput) => {
  return fbo.compose(input);
};

export { composePrintAtlasFbo };
export type { ComposePrintAtlasFboInput };
