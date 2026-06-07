'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import type { Texture } from 'three';

import { useGarmentMaterialRegistry } from '@providers';
import type { DesignPatternItem } from '@store';
import { DEFAULT_COLOR, DISABLED_PART_GRADIENT, resolveGradientColors, useConfiguratorProduct, useGarmentColor, useGarmentDesign } from '@store';
import {
  applyGarmentGradient,
  applyGarmentPartUvBounds,
  applyGarmentPatternTints,
  applyGarmentPrint,
  clearImageTextureCache,
  emptyMaskPair,
  type GarmentPrintState,
  imageToTexture,
  PATTERN_LAYER_COUNT,
  type PatternColorPair,
  type PatternMaskPair,
  resolvePartUvBounds,
} from '@utils';

const DEFAULT_PATTERN_COLOR = '#000000';

const buildPatternColors = (pattern: DesignPatternItem | null, patternColors: Record<string, string>): PatternColorPair => {
  const colors: [string, string] = [DEFAULT_PATTERN_COLOR, DEFAULT_PATTERN_COLOR];

  if (!pattern) return colors;

  for (let index = 0; index < Math.min(pattern.parts.length, PATTERN_LAYER_COUNT); index += 1) {
    colors[index] = patternColors[pattern.parts[index].key] ?? DEFAULT_PATTERN_COLOR;
  }

  return colors;
};

const useGarmentTextures = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const byPart = useGarmentColor((state) => state.byPart);
  const gradientsByPart = useGarmentColor((state) => state.gradientsByPart);
  const productPath = useGarmentDesign((state) => state.productPath);
  const activePattern = useGarmentDesign((state) => state.activePattern);
  const patternColors = useGarmentDesign((state) => state.patternColors);
  const activeOpacity = useGarmentDesign((state) => state.activeOpacity);
  const defaultPattern = useGarmentDesign((state) => state.defaultPattern);
  const { getMaterials } = useGarmentMaterialRegistry();
  const invalidate = useThree((state) => state.invalidate);

  const logosTextureRef = useRef<Texture | null>(null);
  const maskTexturesRef = useRef<PatternMaskPair>(emptyMaskPair());
  const masksPatternKeyRef = useRef<string | null>(null);
  const logosProductPathRef = useRef<string | null>(null);

  const clearRuntime = useCallback(() => {
    logosTextureRef.current = null;
    maskTexturesRef.current = emptyMaskPair();
    masksPatternKeyRef.current = null;
    logosProductPathRef.current = null;
    clearImageTextureCache();
  }, []);

  const buildPrintState = useCallback((): GarmentPrintState => {
    return {
      defaultLogos: logosTextureRef.current ?? emptyMaskPair()[0],
      patternMasks: maskTexturesRef.current,
      patternColors: buildPatternColors(activePattern, patternColors),
      patternOpacity: activeOpacity,
    };
  }, [activeOpacity, activePattern, patternColors]);

  const applyPrintState = useCallback(
    (state: GarmentPrintState) => {
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentPrint(material, state);
        }
      }
      invalidate();
    },
    [getMaterials, invalidate, product.parts],
  );

  const applyPartColors = useCallback(() => {
    for (const part of product.parts) {
      const color = byPart[part.id] ?? DEFAULT_COLOR;
      const gradient = gradientsByPart[part.id] ?? DISABLED_PART_GRADIENT;
      const { fabricColor, gradientColor2 } = resolveGradientColors(color, gradient);
      const uvBounds = resolvePartUvBounds(part);

      for (const material of getMaterials(part.id)) {
        material.color.set(fabricColor);
        material.map = null;
        applyGarmentPartUvBounds(material, uvBounds);
        applyGarmentGradient(material, { ...gradient, color2: gradientColor2 });
        material.needsUpdate = true;
      }
    }
  }, [byPart, getMaterials, gradientsByPart, product.parts]);

  const applyPatternTints = useCallback(() => {
    const colors = buildPatternColors(activePattern, patternColors);

    for (const part of product.parts) {
      for (const material of getMaterials(part.id)) {
        applyGarmentPatternTints(material, colors, activeOpacity);
      }
    }

    invalidate();
  }, [activeOpacity, activePattern, getMaterials, invalidate, patternColors, product.parts]);

  useEffect(() => {
    if (productPath !== product.path) {
      clearRuntime();
      return;
    }

    const logosSrc = defaultPattern?.parts[0]?.src;
    if (!logosSrc) return;

    if (logosProductPathRef.current === product.path && logosTextureRef.current) {
      applyPrintState(buildPrintState());
      return;
    }

    let cancelled = false;

    imageToTexture(logosSrc).then((texture) => {
      if (cancelled) return;

      logosTextureRef.current = texture;
      logosProductPathRef.current = product.path;
      applyPrintState(buildPrintState());
    });

    return () => {
      cancelled = true;
    };
  }, [applyPrintState, buildPrintState, clearRuntime, defaultPattern, product.path, productPath]);

  useEffect(() => {
    if (productPath !== product.path) return;

    if (!activePattern) {
      maskTexturesRef.current = emptyMaskPair();
      masksPatternKeyRef.current = null;
      applyPrintState(buildPrintState());
      return;
    }

    if (masksPatternKeyRef.current === activePattern.key) {
      applyPrintState(buildPrintState());
      return;
    }

    let cancelled = false;

    const loadMasks = async () => {
      const masks = emptyMaskPair();

      await Promise.all(
        activePattern.parts.slice(0, PATTERN_LAYER_COUNT).map(async (part, index) => {
          masks[index] = await imageToTexture(part.src);
        }),
      );

      if (cancelled) return;

      maskTexturesRef.current = masks;
      masksPatternKeyRef.current = activePattern.key;
      applyPrintState(buildPrintState());
    };

    loadMasks();

    return () => {
      cancelled = true;
    };
  }, [activePattern, applyPrintState, buildPrintState, product.path, productPath]);

  useEffect(() => {
    if (productPath !== product.path) return;

    applyPatternTints();
  }, [activeOpacity, applyPatternTints, patternColors, product.path, productPath]);

  useEffect(() => {
    if (productPath !== product.path) return;

    applyPartColors();
    invalidate();
  }, [applyPartColors, byPart, gradientsByPart, invalidate, product.path, productPath]);

  useEffect(() => () => clearRuntime(), [clearRuntime]);
};

export { useGarmentTextures };
