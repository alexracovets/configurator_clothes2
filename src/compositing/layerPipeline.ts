import { applyBaseColorLayer } from './layers/01-baseColorLayer';
import { applyGradientLayer } from './layers/02-gradientLayer';
import { applyNameLayer } from './layers/06-nameLayer';
import { applyNumberLayer } from './layers/08-numberLayer';
import { applyPatternLayer } from './layers/04-patternLayer';
import { applyLogoLayer } from './layers/05-logoLayer';
import { applyDefaultPatternLayer } from './layers/07-defaultPatternLayer';
import type { LayerContext, PrintLayerContext } from './types';

type FabricLayerStep = (context: LayerContext) => void;
type PrintLayerStep = (context: PrintLayerContext) => Promise<void>;

const FABRIC_LAYER_STEPS: FabricLayerStep[] = [applyBaseColorLayer, applyGradientLayer, applyNameLayer, applyNumberLayer];

const PRINT_LAYER_STEPS: PrintLayerStep[] = [applyPatternLayer, applyLogoLayer, applyDefaultPatternLayer];

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
