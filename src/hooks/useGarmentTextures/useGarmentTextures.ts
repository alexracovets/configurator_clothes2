'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useFrame, useThree } from '@react-three/fiber';
import type { Texture } from 'three';

import { resolvePbrTexturePaths } from '@hooks';
import { useGarmentMaterialRegistry, useMaterialRegistryRevision, usePbrMaps } from '@providers';
import {
  DEFAULT_COLOR,
  type DesignPatternItem,
  DISABLED_PART_GRADIENT,
  resolveGradientColors,
  useConfigurationCart,
  useConfiguratorProduct,
  useConfiguratorSceneLoad,
  useGarmentColor,
  useGarmentDesign,
} from '@store';
import {
  applyGarmentGradient,
  applyGarmentPartUvBounds,
  applyGarmentPatternTints,
  applyGarmentPrint,
  emptyMaskPair,
  type GarmentPrintState,
  imageToTexture,
  PATTERN_LAYER_COUNT,
  type PatternColorPair,
  type PatternMaskPair,
  readProductAppearanceTextures,
  resolvePartUvBounds,
  resolveRasterDesignSrc,
  scheduleGarmentShaderUpgrade,
  syncProductAppearanceTextures,
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
  const partIds = useMemo(() => product.parts.map((part) => part.id), [product.parts]);
  const byPart = useGarmentColor((state) => state.byPart);
  const gradientsByPart = useGarmentColor((state) => state.gradientsByPart);
  const productPath = useGarmentDesign((state) => state.productPath);
  const activePattern = useGarmentDesign((state) => state.activePattern);
  const patternColors = useGarmentDesign((state) => state.patternColors);
  const activeOpacity = useGarmentDesign((state) => state.activeOpacity);
  const defaultPattern = useGarmentDesign((state) => state.defaultPattern);
  const activeItemId = useConfigurationCart((state) => state.activeItemId);
  const markInitialSceneLoaded = useConfiguratorSceneLoad((state) => state.markInitialSceneLoaded);
  const markSceneTransitionLoaded = useConfiguratorSceneLoad((state) => state.markSceneTransitionLoaded);
  const isInitialSceneLoading = useConfiguratorSceneLoad((state) => state.isInitialSceneLoading);
  const isSceneTransitionLoading = useConfiguratorSceneLoad((state) => state.isSceneTransitionLoading);
  const { getMaterials, hasMaterialsForParts } = useGarmentMaterialRegistry();
  const materialRevision = useMaterialRegistryRevision();
  const pbrMaps = usePbrMaps();
  const requiresPbrMaps = useMemo(() => Boolean(resolvePbrTexturePaths(product)), [product]);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const textureAnisotropy = gl.capabilities.getMaxAnisotropy();

  const logosTextureRef = useRef<Texture | null>(null);
  const maskTexturesRef = useRef<PatternMaskPair>(emptyMaskPair());
  const masksPatternKeyRef = useRef<string | null>(null);
  const loadSessionRef = useRef(0);
  const pendingFrameReapplyRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  const transitionLoadCompletedRef = useRef(false);
  const productTransitionRef = useRef(false);
  const previousProductPathRef = useRef(product.path);
  const cancelShaderUpgradeRef = useRef<(() => void) | null>(null);

  const syncAppearanceCache = useCallback((targetPath: string) => {
    syncProductAppearanceTextures(targetPath, {
      logosTexture: logosTextureRef.current,
      maskTextures: maskTexturesRef.current,
      masksPatternKey: masksPatternKeyRef.current,
    });
  }, []);

  const isLoadSessionActive = useCallback(
    (session: number, targetPath: string) => {
      return session === loadSessionRef.current && useGarmentDesign.getState().productPath === targetPath && targetPath === product.path;
    },
    [product.path],
  );

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

    invalidate();
  }, [byPart, getMaterials, gradientsByPart, invalidate, product.parts]);

  const applyPatternTints = useCallback(() => {
    const colors = buildPatternColors(activePattern, patternColors);

    for (const part of product.parts) {
      for (const material of getMaterials(part.id)) {
        applyGarmentPatternTints(material, colors, activeOpacity);
      }
    }

    invalidate();
  }, [activeOpacity, activePattern, getMaterials, invalidate, patternColors, product.parts]);

  const activePatternKey = activePattern?.key ?? null;

  const isInitialAppearanceReady = useCallback(() => {
    if (!hasMaterialsForParts(partIds)) return false;
    if (requiresPbrMaps && !pbrMaps) return false;
    if (productPath !== product.path) return false;
    if (pendingFrameReapplyRef.current) return false;

    const logosSrc = defaultPattern?.parts[0]?.src ? resolveRasterDesignSrc(defaultPattern.parts[0].src) : null;
    if (logosSrc && !logosTextureRef.current) return false;

    if (activePatternKey) {
      if (masksPatternKeyRef.current !== activePatternKey || !maskTexturesRef.current[0]) return false;
    }

    return true;
  }, [activePatternKey, defaultPattern, hasMaterialsForParts, partIds, pbrMaps, product.path, productPath, requiresPbrMaps]);

  const reapplyAppearanceCore = useCallback(() => {
    if (!hasMaterialsForParts(partIds)) {
      pendingFrameReapplyRef.current = true;
      return;
    }

    pendingFrameReapplyRef.current = false;
    applyPartColors();

    if (productPath !== product.path) return;

    applyPatternTints();
    applyPrintState(buildPrintState());
  }, [applyPartColors, applyPatternTints, applyPrintState, buildPrintState, hasMaterialsForParts, partIds, product.path, productPath]);

  const finishSceneLoad = useCallback(
    (onLoaded: () => void) => {
      invalidate();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onLoaded();
        });
      });
    },
    [invalidate],
  );

  const scheduleFullShaderUpgrade = useCallback(
    (onLoaded: () => void) => {
      cancelShaderUpgradeRef.current?.();

      cancelShaderUpgradeRef.current = scheduleGarmentShaderUpgrade({
        parts: product.parts,
        getMaterials,
        invalidate,
        onComplete: () => {
          reapplyAppearanceCore();
          finishSceneLoad(onLoaded);
        },
      });
    },
    [finishSceneLoad, getMaterials, invalidate, product.parts, reapplyAppearanceCore],
  );

  const tryMarkInitialSceneLoaded = useCallback(() => {
    if (!isInitialAppearanceReady()) return;
    if (initialLoadCompletedRef.current) return;

    initialLoadCompletedRef.current = true;
    scheduleFullShaderUpgrade(markInitialSceneLoaded);
  }, [isInitialAppearanceReady, markInitialSceneLoaded, scheduleFullShaderUpgrade]);

  const tryMarkSceneTransitionLoaded = useCallback(() => {
    if (!isSceneTransitionLoading) return;
    if (!isInitialAppearanceReady()) return;
    if (transitionLoadCompletedRef.current) return;

    transitionLoadCompletedRef.current = true;

    if (productTransitionRef.current) {
      scheduleFullShaderUpgrade(() => {
        productTransitionRef.current = false;
        markSceneTransitionLoaded();
      });
      return;
    }

    finishSceneLoad(markSceneTransitionLoaded);
  }, [finishSceneLoad, isInitialAppearanceReady, isSceneTransitionLoading, markSceneTransitionLoaded, scheduleFullShaderUpgrade]);

  const reapplyAppearance = useCallback(() => {
    reapplyAppearanceCore();

    if (isInitialSceneLoading) {
      tryMarkInitialSceneLoaded();
      return;
    }

    tryMarkSceneTransitionLoaded();
  }, [isInitialSceneLoading, reapplyAppearanceCore, tryMarkInitialSceneLoaded, tryMarkSceneTransitionLoaded]);

  useEffect(() => {
    const cached = readProductAppearanceTextures(product.path);
    logosTextureRef.current = cached.logosTexture;
    maskTexturesRef.current = cached.maskTextures;
    masksPatternKeyRef.current = cached.masksPatternKey;
    pendingFrameReapplyRef.current = true;
  }, [activeItemId, product.path]);

  useEffect(() => {
    const isProductChange = previousProductPathRef.current !== product.path;
    previousProductPathRef.current = product.path;

    loadSessionRef.current += 1;
    initialLoadCompletedRef.current = false;
    transitionLoadCompletedRef.current = false;
    productTransitionRef.current = isProductChange && !useConfiguratorSceneLoad.getState().isInitialSceneLoading;
    cancelShaderUpgradeRef.current?.();
    cancelShaderUpgradeRef.current = null;

    return () => {
      loadSessionRef.current += 1;
      cancelShaderUpgradeRef.current?.();
      cancelShaderUpgradeRef.current = null;
    };
  }, [product.path]);

  useEffect(() => {
    transitionLoadCompletedRef.current = false;
  }, [activePatternKey]);

  useLayoutEffect(() => {
    reapplyAppearance();
  }, [activeItemId, activeOpacity, activePatternKey, byPart, gradientsByPart, materialRevision, patternColors, reapplyAppearance]);

  useFrame(() => {
    if (!pendingFrameReapplyRef.current) return;
    reapplyAppearance();
  });

  useEffect(() => {
    if (productPath !== product.path) return;

    const logosSrc = defaultPattern?.parts[0]?.src ? resolveRasterDesignSrc(defaultPattern.parts[0].src) : null;
    if (!logosSrc) return;

    if (logosTextureRef.current) return;

    const session = loadSessionRef.current;
    const targetPath = product.path;
    let cancelled = false;

    void imageToTexture(logosSrc, { anisotropy: textureAnisotropy }).then((texture) => {
      if (cancelled || !isLoadSessionActive(session, targetPath)) return;

      logosTextureRef.current = texture;
      syncAppearanceCache(targetPath);
      reapplyAppearance();
    });

    return () => {
      cancelled = true;
    };
  }, [defaultPattern, isLoadSessionActive, product.path, productPath, reapplyAppearance, syncAppearanceCache, textureAnisotropy]);

  useEffect(() => {
    if (productPath !== product.path) return;

    if (!activePatternKey) {
      maskTexturesRef.current = emptyMaskPair();
      masksPatternKeyRef.current = null;
      syncAppearanceCache(product.path);
      reapplyAppearance();
      return;
    }

    if (masksPatternKeyRef.current === activePatternKey && maskTexturesRef.current[0]) return;

    const session = loadSessionRef.current;
    const targetPath = product.path;
    let cancelled = false;

    const loadMasks = async () => {
      const masks = emptyMaskPair();

      await Promise.all(
        activePattern!.parts.slice(0, PATTERN_LAYER_COUNT).map(async (part, index) => {
          masks[index] = await imageToTexture(resolveRasterDesignSrc(part.src), { anisotropy: textureAnisotropy });
        }),
      );

      if (cancelled || !isLoadSessionActive(session, targetPath)) return;

      maskTexturesRef.current = masks;
      masksPatternKeyRef.current = activePatternKey;
      syncAppearanceCache(targetPath);
      reapplyAppearance();
    };

    void loadMasks();

    return () => {
      cancelled = true;
    };
  }, [activePattern, activePatternKey, isLoadSessionActive, product.path, productPath, reapplyAppearance, syncAppearanceCache, textureAnisotropy]);
};

export { useGarmentTextures };
