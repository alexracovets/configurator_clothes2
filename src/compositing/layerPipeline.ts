import { applyBaseColorLayer } from './layers/01-baseColorLayer';
import { applyPatternLayer } from './layers/04-patternLayer';
import { applyLogoLayer } from './layers/05-logoLayer';
import { applyDefaultPatternLayer } from './layers/07-defaultPatternLayer';
import type { LayerContext, PrintLayerContext } from './types';

type FabricLayerStep = (context: LayerContext) => void;
type PrintLayerStep = (context: PrintLayerContext) => Promise<void>;

/** Layer 1: per-part base color. Layer 2 (SFUMATURA) + 4–7 (print) composite in GPU shader — gradient before print. */
const FABRIC_LAYER_STEPS: FabricLayerStep[] = [applyBaseColorLayer];

/**
 * Layers 4–7 on print atlas (lowest first).
 * Slot 5: Logo — reserved
 * Slot 6: Name / Number — reserved
 */
const PRINT_LAYER_STEPS: PrintLayerStep[] = [
  applyPatternLayer, // 4
  applyLogoLayer, // 5 — user-uploaded logos only (defaults come from default_pattern SVG)
  applyDefaultPatternLayer, // 7 — crewneck_logos.svg etc. (6: name/number — reserved)
];

const runFabricLayers = (context: LayerContext) => {
  for (const step of FABRIC_LAYER_STEPS) {
    step(context);
  }
};

const runPrintLayers = async (context: PrintLayerContext) => {
  for (const step of PRINT_LAYER_STEPS) {
    await step(context);
  }
};

export { FABRIC_LAYER_STEPS, PRINT_LAYER_STEPS, runFabricLayers, runPrintLayers };
export type { FabricLayerStep, PrintLayerStep };
