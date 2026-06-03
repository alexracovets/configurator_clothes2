import type { DesignPatternState, PatternCustomization, StepColorPart, StepLogoPartState } from '@store';

import type { CompositingShadingPart } from '../types';

/** Pipeline 1–2: base color + SFUMATURA (per part canvas). */
interface FabricCompositingInput {
  colorParts: StepColorPart[];
  shadingParts: CompositingShadingPart[];
}

/** Pipeline 4–7: global print atlas. */
interface PrintCompositingInput {
  activePattern: DesignPatternState | null;
  activePatternCustomization: PatternCustomization | null;
  defaultPattern: DesignPatternState | null;
  defaultPatternCustomization: PatternCustomization | null;
  logoParts: StepLogoPartState[];
}

export type { FabricCompositingInput, PrintCompositingInput };
