'use client';

import { useLayoutEffect, useMemo } from 'react';

import { getProduct } from '@data';
import type { GarmentConfig } from '@data';
import { useConfigurationControl, useStepColor, useStepDesign, useStepLogo, useStepName, useStepNumber } from '@store';
import type { DesignPatternState, StepLogoPartState, StepLogoPositionState } from '@store';
import { DEFAULT_TEXT_CONFIGURATION, FONTS_CONFIGURATION } from '@constants';

const DEFAULT_PART_COLOR = '#ffffff';
const DEFAULT_NAME_TEXT = 'PLAYER NAME';
const DEFAULT_NUMBER_TEXT = '9';
const DEFAULT_MINIMUM_COUNT = 5;

const resolveAssetSrc = (productPath: string, src: string) => {
  if (src.startsWith('/')) return src;
  return `${productPath}${src}`;
};

const resolveDefaultLogoAsset = (product: GarmentConfig) => `${product.path}designs/crewneck_logos.svg`;

const mapProductParts = (product: GarmentConfig) =>
  product.parts.map((part) => ({
    id: part.id,
    name: part.name,
    label: part.label,
    color: DEFAULT_PART_COLOR,
  }));

const mapProductDesigns = (product: GarmentConfig): DesignPatternState[] =>
  product.patterns.map((pattern, patternIndex) => ({
    key: `pattern-${patternIndex}`,
    name: pattern.name,
    parts: pattern.parts.map((part, partIndex) => ({
      key: `pattern-${patternIndex}-part-${partIndex}`,
      materialId: part.id,
      src: `${product.path}designs/${part.path_name}`,
    })),
  }));

const mapDefaultPattern = (product: GarmentConfig): DesignPatternState | null => {
  const pattern = product.default_pattern?.[0];
  if (!pattern) return null;

  return {
    key: 'default-pattern',
    name: pattern.name,
    parts: pattern.parts.map((part, partIndex) => ({
      key: `default-pattern-part-${partIndex}`,
      materialId: part.id,
      src: `${product.path}designs/${part.path_name}`,
    })),
  };
};

const mapProductNamePositions = (product: GarmentConfig) =>
  (product.namePositions ?? []).map((position) => ({
    key: position.label,
    label: position.label,
    uv: position.uv,
    rotation: position.rotation,
    fontSize: position.fontSize,
    interactive: position.interactive,
  }));

const mapProductNumberPositions = (product: GarmentConfig) =>
  (product.numberPositions ?? []).map((position) => ({
    key: position.label,
    label: position.label,
    zone: position.zone,
    uv: position.uv,
    rotation: position.rotation,
    fontSize: position.fontSize,
    interactive: position.interactive,
  }));

const mapProductLogoPositions = (product: GarmentConfig): StepLogoPositionState[] => {
  const fallbackSrc = resolveDefaultLogoAsset(product);

  return (product.logoPositions ?? []).map((position) => {
    const src = position.src ?? fallbackSrc;
    const defaultSrc = resolveAssetSrc(product.path, src);

    return {
      key: position.label,
      label: position.label,
      uv: position.uv,
      rotation: position.rotation,
      scale: position.scale,
      default: position.default,
      interactive: position.interactive,
      defaultSrc,
    };
  });
};

const mapDefaultLogoParts = (_product: GarmentConfig, positions: StepLogoPositionState[]): StepLogoPartState[] =>
  positions
    .filter((position) => position.default)
    .map((position) => ({
      id: `default-${position.key}`,
      positionKey: position.key,
      label: position.label,
      uv: position.uv,
      rotation: position.rotation,
      opacity: 1,
      baseScale: position.scale,
      scale: 1,
      src: position.defaultSrc,
      fileName: position.defaultSrc.split('/').pop() ?? 'logo',
      visible: true,
      isDefault: true,
    }));

const mapDefaultNameParts = (product: GarmentConfig) => {
  const font = FONTS_CONFIGURATION[0]?.name ?? 'Oswald';

  return (product.namePositions ?? [])
    .filter((position) => !position.interactive)
    .map((position) => ({
      id: `default-${position.label}`,
      positionKey: position.label,
      label: position.label,
      uv: position.uv,
      rotation: position.rotation,
      text: DEFAULT_NAME_TEXT,
      font,
      fontSize: position.fontSize,
      textColor: DEFAULT_TEXT_CONFIGURATION.text,
      strokeColor: DEFAULT_TEXT_CONFIGURATION.stroke,
      strokeWidth: DEFAULT_TEXT_CONFIGURATION.strokeWidth,
      isDefault: true,
    }));
};

const mapDefaultNumberParts = (product: GarmentConfig) => {
  const font = FONTS_CONFIGURATION[0]?.name ?? 'Oswald';

  return (product.numberPositions ?? [])
    .filter((position) => !position.interactive)
    .map((position) => ({
      id: `default-${position.label}`,
      positionKey: position.label,
      label: position.label,
      zone: position.zone,
      uv: position.uv,
      rotation: position.rotation,
      text: DEFAULT_NUMBER_TEXT,
      font,
      fontSize: position.fontSize,
      textColor: DEFAULT_TEXT_CONFIGURATION.text,
      strokeColor: DEFAULT_TEXT_CONFIGURATION.stroke,
      strokeWidth: DEFAULT_TEXT_CONFIGURATION.strokeWidth,
      isDefault: true,
    }));
};

const useConfiguratorProductData = () => {
  const numberProduct = useConfigurationControl((state) => state.numberProduct);
  const product = useMemo(() => getProduct('crewneck', numberProduct), [numberProduct]);

  return { product, numberProduct };
};

const useSyncConfiguratorProduct = () => {
  const { product } = useConfiguratorProductData();
  const setName = useConfigurationControl((state) => state.setName);
  const setPrice = useConfigurationControl((state) => state.setPrice);
  const setCountToBonus = useConfigurationControl((state) => state.setCountToBonus);
  const setBonusDiscount = useConfigurationControl((state) => state.setBonusDiscount);
  const setMinimumCount = useConfigurationControl((state) => state.setMinimumCount);
  const setProductType = useConfigurationControl((state) => state.setProductType);
  const setParts = useStepColor((state) => state.setParts);
  const setPatterns = useStepDesign((state) => state.setPatterns);
  const setDefaultPattern = useStepDesign((state) => state.setDefaultPattern);
  const setNamePositions = useStepName((state) => state.setPositions);
  const setNameParts = useStepName((state) => state.setParts);
  const setNumberPositions = useStepNumber((state) => state.setPositions);
  const setNumberParts = useStepNumber((state) => state.setParts);
  const setLogoPositions = useStepLogo((state) => state.setPositions);
  const setLogoParts = useStepLogo((state) => state.setParts);

  useLayoutEffect(() => {
    if (!product) return;

    const logoPositions = mapProductLogoPositions(product);

    setName(product.name);
    setPrice(product.price);
    setCountToBonus(product.bonus_count);
    setBonusDiscount(product.bonus_discount);
    setMinimumCount(product.minimum_count ?? DEFAULT_MINIMUM_COUNT);
    setProductType(product.type);
    setParts(mapProductParts(product));
    setPatterns(mapProductDesigns(product));
    setDefaultPattern(mapDefaultPattern(product));
    setNamePositions(mapProductNamePositions(product));
    setNameParts(mapDefaultNameParts(product));
    setNumberPositions(mapProductNumberPositions(product));
    setNumberParts(mapDefaultNumberParts(product));
    setLogoPositions(logoPositions);
    setLogoParts(mapDefaultLogoParts(product, logoPositions));
  }, [
    product,
    setBonusDiscount,
    setCountToBonus,
    setLogoParts,
    setLogoPositions,
    setMinimumCount,
    setName,
    setNameParts,
    setNamePositions,
    setNumberParts,
    setNumberPositions,
    setParts,
    setPatterns,
    setDefaultPattern,
    setPrice,
    setProductType,
  ]);
};

const useConfiguratorProduct = () => useConfiguratorProductData();

export { useConfiguratorProduct, useSyncConfiguratorProduct };
export type { GarmentConfig as ConfiguratorProduct };
