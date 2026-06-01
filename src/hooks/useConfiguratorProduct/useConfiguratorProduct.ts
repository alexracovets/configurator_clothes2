'use client';

import { useLayoutEffect, useMemo } from 'react';

import crewneckData from '../../data/crewneck/crewneck.json';

import { useConfigurationControl, useStepColor, useStepDesign, useStepLogo, useStepName, useStepNumber } from '@store';
import type { StepLogoPartState, StepLogoPositionState } from '@store';

const DEFAULT_PART_COLOR = '#ffffff';

interface CrewneckPart {
  id: string;
  name: string;
  label: string;
}

interface CrewneckPattern {
  id: number;
  name: string;
  path_name: string;
}

interface CrewneckTextPosition {
  label: string;
  uv: { x: number; y: number };
  rotation: number;
  fontSize: number;
  interactive: boolean;
}

interface CrewneckNumberPosition extends CrewneckTextPosition {
  zone: string;
}

interface CrewneckLogoPosition {
  label: string;
  uv: { x: number; y: number };
  src?: string;
  rotation: number;
  scale: number;
  default: boolean;
  interactive: boolean;
}

const resolveLogoSrc = (productPath: string, src: string) => {
  if (src.startsWith('/')) return src;
  return `${productPath}${src}`;
};

interface ConfiguratorProduct {
  name: string;
  price: number;
  bonus_count: number;
  bonus_discount: number;
  path: string;
  parts: CrewneckPart[];
  patterns: CrewneckPattern[];
  namePositions?: CrewneckTextPosition[];
  numberPositions?: CrewneckNumberPosition[];
  logoPositions?: CrewneckLogoPosition[];
}

const mapProductParts = (product: ConfiguratorProduct) =>
  product.parts.map((part) => ({
    id: part.id,
    name: part.name,
    label: part.label,
    color: DEFAULT_PART_COLOR,
  }));

const mapProductDesigns = (product: ConfiguratorProduct) => product.patterns.map((pattern) => `${product.path}designs/${pattern.path_name}`);
const mapProductNamePositions = (product: ConfiguratorProduct) =>
  (product.namePositions ?? []).map((position) => ({
    key: position.label,
    label: position.label,
    uv: position.uv,
    rotation: position.rotation,
    fontSize: position.fontSize,
    interactive: position.interactive,
  }));

const mapProductNumberPositions = (product: ConfiguratorProduct) =>
  (product.numberPositions ?? []).map((position) => ({
    key: position.label,
    label: position.label,
    zone: position.zone,
    uv: position.uv,
    rotation: position.rotation,
    fontSize: position.fontSize,
    interactive: position.interactive,
  }));

const mapProductLogoPositions = (product: ConfiguratorProduct): StepLogoPositionState[] =>
  (product.logoPositions ?? []).map((position) => {
    const src = position.src ?? 'designs/crewneck_logos.svg';
    const defaultSrc = resolveLogoSrc(product.path, src);

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

const mapDefaultLogoParts = (_product: ConfiguratorProduct, positions: StepLogoPositionState[]): StepLogoPartState[] =>
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

const useConfiguratorProductData = () => {
  const numberProduct = useConfigurationControl((state) => state.numberProduct);

  const product = useMemo(() => crewneckData.products[numberProduct - 1] as ConfiguratorProduct | undefined, [numberProduct]);

  return { product, numberProduct };
};

const useSyncConfiguratorProduct = () => {
  const { product } = useConfiguratorProductData();
  const setName = useConfigurationControl((state) => state.setName);
  const setPrice = useConfigurationControl((state) => state.setPrice);
  const setCountToBonus = useConfigurationControl((state) => state.setCountToBonus);
  const setBonusDiscount = useConfigurationControl((state) => state.setBonusDiscount);
  const setParts = useStepColor((state) => state.setParts);
  const setDesign = useStepDesign((state) => state.setDesign);
  const setNamePositions = useStepName((state) => state.setPositions);
  const setNumberPositions = useStepNumber((state) => state.setPositions);
  const setLogoPositions = useStepLogo((state) => state.setPositions);
  const setLogoParts = useStepLogo((state) => state.setParts);

  useLayoutEffect(() => {
    if (!product) return;

    const logoPositions = mapProductLogoPositions(product);

    setName(product.name);
    setPrice(product.price);
    setCountToBonus(product.bonus_count);
    setBonusDiscount(product.bonus_discount);
    setParts(mapProductParts(product));
    setDesign(mapProductDesigns(product));
    setNamePositions(mapProductNamePositions(product));
    setNumberPositions(mapProductNumberPositions(product));
    setLogoPositions(logoPositions);
    setLogoParts(mapDefaultLogoParts(product, logoPositions));
  }, [
    product,
    setBonusDiscount,
    setCountToBonus,
    setDesign,
    setLogoParts,
    setLogoPositions,
    setName,
    setNamePositions,
    setNumberPositions,
    setParts,
    setPrice,
  ]);
};

const useConfiguratorProduct = () => useConfiguratorProductData();

export { useConfiguratorProduct, useSyncConfiguratorProduct };
export type { ConfiguratorProduct };
