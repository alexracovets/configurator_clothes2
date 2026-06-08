import type { GarmentTextRenderInstance } from '@store';

import { drawNameMaskGeometry } from '../drawNameOnAtlas/drawNameMaskGeometry';
import { drawNameStrokeMaskGeometry } from '../drawNameOnAtlas/drawNameStrokeMaskGeometry';
import { measureNameStampPixelSize, type StampPixelSize, unionStampPixelSize } from '../drawNameOnAtlas/measureNameStampBounds';
import { NAME_SLOT_COUNT } from '../garmentPrint/nameSlotConstants';

import { mergeMaskChannel } from './mergeMaskChannel';

interface ComposeNameMaskAtlasInput {
  instances: GarmentTextRenderInstance[];
  fillCanvas?: HTMLCanvasElement;
  strokeCanvas?: HTMLCanvasElement;
  redrawFill?: boolean;
  redrawStroke?: boolean;
}

interface NameMaskAtlas {
  fillCanvas: HTMLCanvasElement;
  strokeCanvas: HTMLCanvasElement;
  stampSize: StampPixelSize;
}

const createWorkCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const ensureCanvasSize = (canvas: HTMLCanvasElement, width: number, height: number) => {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
};

const resolveNameStampSize = (instances: GarmentTextRenderInstance[]): StampPixelSize => {
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  if (!measureCtx) return { width: 1, height: 1 };

  return unionStampPixelSize(
    instances
      .slice(0, NAME_SLOT_COUNT)
      .map((instance) => measureNameStampPixelSize(instance.text, instance.font, measureCtx))
      .filter((size): size is StampPixelSize => size !== null),
  );
};

const composeNameMaskAtlas = (input: ComposeNameMaskAtlasInput): NameMaskAtlas => {
  const redrawFill = input.redrawFill ?? true;
  const redrawStroke = input.redrawStroke ?? true;
  const activeInstances = input.instances.slice(0, NAME_SLOT_COUNT);
  const stampSize = resolveNameStampSize(activeInstances);
  const fillCanvas = input.fillCanvas ?? createWorkCanvas(stampSize.width, stampSize.height);
  const strokeCanvas = input.strokeCanvas ?? createWorkCanvas(stampSize.width, stampSize.height);
  const fillCtx = fillCanvas.getContext('2d', { willReadFrequently: true });
  const strokeCtx = strokeCanvas.getContext('2d', { willReadFrequently: true });
  const scratchCanvas = createWorkCanvas(stampSize.width, stampSize.height);
  const scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });

  if (!fillCtx || !strokeCtx || !scratchCtx) {
    return { fillCanvas, strokeCanvas, stampSize };
  }

  ensureCanvasSize(fillCanvas, stampSize.width, stampSize.height);
  ensureCanvasSize(strokeCanvas, stampSize.width, stampSize.height);
  ensureCanvasSize(scratchCanvas, stampSize.width, stampSize.height);

  if (redrawFill) {
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

    activeInstances.forEach((instance, slotIndex) => {
      scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      drawNameMaskGeometry(scratchCtx, { text: instance.text, font: instance.font }, scratchCanvas.width, scratchCanvas.height);
      mergeMaskChannel(fillCtx, scratchCtx, slotIndex as 0 | 1 | 2 | 3);
    });
  }

  if (redrawStroke) {
    strokeCtx.clearRect(0, 0, strokeCanvas.width, strokeCanvas.height);

    activeInstances.forEach((instance, slotIndex) => {
      scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      drawNameStrokeMaskGeometry(
        scratchCtx,
        { text: instance.text, font: instance.font, strokeWidth: instance.strokeWidth, fontSize: instance.fontSize },
        scratchCanvas.width,
        scratchCanvas.height,
      );
      mergeMaskChannel(strokeCtx, scratchCtx, slotIndex as 0 | 1 | 2 | 3);
    });
  }

  return { fillCanvas, strokeCanvas, stampSize };
};

export { composeNameMaskAtlas, resolveNameStampSize };
export type { ComposeNameMaskAtlasInput, NameMaskAtlas };
