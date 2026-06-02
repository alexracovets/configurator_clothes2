import type { DesignPatternState, PatternCustomization, StepColorPart, StepLogoPartState } from '@store';

import type { PbrMaps } from './types/pbrMaps';

interface CompositingShadingPart {
  id: string;
  color: string;
  colorPicked: string;
  enabled: boolean;
  rotation: number;
  position: number;
  softness: number;
  opacity: number;
}

interface CompositingStoreInput {
  colorParts: StepColorPart[];
  shadingParts: CompositingShadingPart[];
  activePattern: DesignPatternState | null;
  activePatternCustomization: PatternCustomization | null;
  defaultPattern: DesignPatternState | null;
  defaultPatternCustomization: PatternCustomization | null;
  logoParts: StepLogoPartState[];
}

interface CompositingInput extends CompositingStoreInput {
  pbrMaps: PbrMaps | null;
}

interface LayerContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  input: CompositingStoreInput;
  partId: string | null;
}

interface PrintLayerContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: CompositingStoreInput;
}

export type { CompositingInput, CompositingShadingPart, CompositingStoreInput, LayerContext, PrintLayerContext };
export type { PbrMaps, PbrTexturePaths } from './types/pbrMaps';
