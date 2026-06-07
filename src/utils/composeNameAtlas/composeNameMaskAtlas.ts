import type { PrintAtlasConfig } from '@data';
import type { NameInstance } from '@store';

import { drawNameMaskGeometry } from '../drawNameOnAtlas/drawNameMaskGeometry';
import { NAME_SLOT_COUNT } from '../garmentPrint/nameSlotConstants';

import { mergeMaskChannel } from './mergeMaskChannel';

interface ComposeNameMaskAtlasInput {
  atlasSize: PrintAtlasConfig;
  instances: NameInstance[];
  fillCanvas?: HTMLCanvasElement;
}

interface NameMaskAtlas {
  fillCanvas: HTMLCanvasElement;
}

const createWorkCanvas = (size: PrintAtlasConfig) => {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  return canvas;
};

const ensureCanvasSize = (canvas: HTMLCanvasElement, size: PrintAtlasConfig) => {
  if (canvas.width !== size.width || canvas.height !== size.height) {
    canvas.width = size.width;
    canvas.height = size.height;
  }
};

const composeNameMaskAtlas = (input: ComposeNameMaskAtlasInput): NameMaskAtlas => {
  const fillCanvas = input.fillCanvas ?? createWorkCanvas(input.atlasSize);
  const fillCtx = fillCanvas.getContext('2d', { willReadFrequently: true });
  const scratchCanvas = createWorkCanvas(input.atlasSize);
  const scratchCtx = scratchCanvas.getContext('2d');

  if (!fillCtx || !scratchCtx) {
    return { fillCanvas };
  }

  ensureCanvasSize(fillCanvas, input.atlasSize);
  ensureCanvasSize(scratchCanvas, input.atlasSize);
  fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

  input.instances.slice(0, NAME_SLOT_COUNT).forEach((instance, slotIndex) => {
    scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    drawNameMaskGeometry(scratchCtx, { text: instance.text, font: instance.font }, scratchCanvas.width, scratchCanvas.height);
    mergeMaskChannel(fillCtx, scratchCanvas, slotIndex as 0 | 1 | 2 | 3);
  });

  return { fillCanvas };
};

export { composeNameMaskAtlas };
export type { ComposeNameMaskAtlasInput, NameMaskAtlas };
