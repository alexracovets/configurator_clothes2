import type { GarmentConfig, LogoInstance, NameInstance, NumberInstance, PartGradient, UvPoint } from '@types';
import { PALETTE_COLORS } from '@constants';

import { useGarmentColor, useGarmentDesign, useGarmentLogo, useGarmentName, useGarmentNumber } from '@store';

import { buildDefaultGradients } from '../useGarmentColor/mapPartGradientDefaults';

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

const DEFAULT_COLOR = PALETTE_COLORS[0];
const DEFAULT_OPACITY = 1;

const createDefaultColorSnapshot = (product: GarmentConfig): GarmentColorSnapshot => ({
  byPart: Object.fromEntries(product.parts.map((part) => [part.id, DEFAULT_COLOR])),
  gradientsByPart: buildDefaultGradients(product),
});

const cloneUvPoint = (uv: UvPoint): UvPoint => ({ ...uv });

const clonePartGradient = (gradient: PartGradient): PartGradient => ({ ...gradient });

const cloneNameInstance = (instance: NameInstance): NameInstance => ({
  ...instance,
  uv: cloneUvPoint(instance.uv),
});

const cloneNumberInstance = (instance: NumberInstance): NumberInstance => ({
  ...instance,
  uv: cloneUvPoint(instance.uv),
});

const cloneLogoInstance = (instance: LogoInstance): LogoInstance => ({
  ...instance,
  uv: cloneUvPoint(instance.uv),
});

const cloneCartItemConfiguration = (configuration: CartItemConfiguration): CartItemConfiguration => ({
  color: {
    byPart: { ...configuration.color.byPart },
    gradientsByPart: Object.fromEntries(Object.entries(configuration.color.gradientsByPart).map(([partId, gradient]) => [partId, clonePartGradient(gradient)])),
  },
  design: {
    activePatternKey: configuration.design.activePatternKey,
    patternColors: { ...configuration.design.patternColors },
    designLayerColors: { ...configuration.design.designLayerColors },
    activeOpacity: configuration.design.activeOpacity,
    designOpacity: configuration.design.designOpacity,
  },
  name: {
    instances: configuration.name.instances.map(cloneNameInstance),
    selectedInstanceId: configuration.name.selectedInstanceId,
  },
  number: {
    instances: configuration.number.instances.map(cloneNumberInstance),
  },
  logo: {
    instances: configuration.logo.instances.map(cloneLogoInstance),
    selectedInstanceId: configuration.logo.selectedInstanceId,
  },
});

const createDefaultCartItemConfiguration = (product: GarmentConfig): CartItemConfiguration => ({
  color: createDefaultColorSnapshot(product),
  design: {
    activePatternKey: null,
    patternColors: {},
    designLayerColors: {},
    activeOpacity: DEFAULT_OPACITY,
    designOpacity: DEFAULT_OPACITY,
  },
  name: {
    instances: [],
    selectedInstanceId: null,
  },
  number: {
    instances: [],
  },
  logo: {
    instances: [],
    selectedInstanceId: null,
  },
});

const captureGarmentConfiguration = (): CartItemConfiguration => {
  const color = useGarmentColor.getState();
  const design = useGarmentDesign.getState();
  const name = useGarmentName.getState();
  const number = useGarmentNumber.getState();
  const logo = useGarmentLogo.getState();

  return cloneCartItemConfiguration({
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
  });
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

  const snapshot = cloneCartItemConfiguration(configuration);

  useGarmentColor.getState().restoreSnapshot(snapshot.color);
  useGarmentDesign.getState().restoreSnapshot(product, snapshot.design);
  useGarmentName.getState().restoreSnapshot(product, snapshot.name);
  useGarmentNumber.getState().restoreSnapshot(product, snapshot.number);
  useGarmentLogo.getState().restoreSnapshot(product, snapshot.logo);
};

export { applyGarmentConfiguration, captureGarmentConfiguration, cloneCartItemConfiguration, createDefaultCartItemConfiguration, createDefaultColorSnapshot };
export type { CartItemConfiguration, GarmentColorSnapshot };
