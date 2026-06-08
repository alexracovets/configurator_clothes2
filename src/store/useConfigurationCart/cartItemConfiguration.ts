import type { GarmentConfig } from '@data';

import type { PartGradient } from '../useGarmentColor';
import { useGarmentColor } from '../useGarmentColor';
import { useGarmentDesign } from '../useGarmentDesign';
import { useGarmentLogo } from '../useGarmentLogo';
import type { LogoInstance } from '../useGarmentLogo';
import { useGarmentName } from '../useGarmentName';
import type { NameInstance } from '../useGarmentName';
import { useGarmentNumber } from '../useGarmentNumber';
import type { NumberInstance } from '../useGarmentNumber';

interface GarmentColorSnapshot {
  byPart: Record<string, string>;
  gradientsByPart: Record<string, PartGradient>;
}

interface GarmentDesignSnapshot {
  activePatternKey: string | null;
  patternColors: Record<string, string>;
  designLayerColors: Record<number, string>;
  activeOpacity: number;
  designOpacity: number;
}

interface GarmentNameSnapshot {
  instances: NameInstance[];
  selectedInstanceId: string | null;
}

interface GarmentNumberSnapshot {
  instances: NumberInstance[];
}

interface GarmentLogoSnapshot {
  instances: LogoInstance[];
  selectedInstanceId: string | null;
}

interface CartItemConfiguration {
  color: GarmentColorSnapshot;
  design: GarmentDesignSnapshot;
  name: GarmentNameSnapshot;
  number: GarmentNumberSnapshot;
  logo: GarmentLogoSnapshot;
}

const captureGarmentConfiguration = (): CartItemConfiguration => {
  const color = useGarmentColor.getState();
  const design = useGarmentDesign.getState();
  const name = useGarmentName.getState();
  const number = useGarmentNumber.getState();
  const logo = useGarmentLogo.getState();

  return {
    color: {
      byPart: color.byPart,
      gradientsByPart: color.gradientsByPart,
    },
    design: {
      activePatternKey: design.activePattern?.key ?? null,
      patternColors: design.patternColors,
      designLayerColors: design.designLayerColors,
      activeOpacity: design.activeOpacity,
      designOpacity: design.designOpacity,
    },
    name: {
      instances: name.instances,
      selectedInstanceId: name.selectedInstanceId,
    },
    number: {
      instances: number.instances,
    },
    logo: {
      instances: logo.instances,
      selectedInstanceId: logo.selectedInstanceId,
    },
  };
};

const applyGarmentConfiguration = (product: GarmentConfig, configuration: CartItemConfiguration | undefined) => {
  if (!configuration) {
    useGarmentColor.getState().initForProduct(product);
    useGarmentDesign.getState().initForProduct(product);
    useGarmentName.getState().initForProduct(product);
    useGarmentNumber.getState().initForProduct(product);
    useGarmentLogo.getState().initForProduct(product);
    return;
  }

  useGarmentColor.getState().restoreSnapshot(configuration.color);
  useGarmentDesign.getState().restoreSnapshot(product, configuration.design);
  useGarmentName.getState().restoreSnapshot(product, configuration.name);
  useGarmentNumber.getState().restoreSnapshot(product, configuration.number);
  useGarmentLogo.getState().restoreSnapshot(product, configuration.logo);
};

export { applyGarmentConfiguration, captureGarmentConfiguration };
export type { CartItemConfiguration };
