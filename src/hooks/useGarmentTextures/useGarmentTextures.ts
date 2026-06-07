'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';

import { useGarmentMaterialRegistry } from '@providers';
import { DEFAULT_COLOR, useConfiguratorProduct, useGarmentColor, useGarmentDesign } from '@store';
import { applyGarmentPrint, clearImageTextureCache, composePrintAtlas, resolvePartUvBounds, resolvePrintAtlasSize } from '@utils';

const buildAtlasKey = (
  activePatternKey: string | undefined,
  activeOpacity: number,
  patternColors: Record<string, string>,
  defaultPatternKey: string | undefined,
) => `${activePatternKey ?? 'none'}|${activeOpacity}|${JSON.stringify(patternColors)}|${defaultPatternKey ?? 'none'}`;

const useGarmentTextures = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const byPart = useGarmentColor((state) => state.byPart);
  const productPath = useGarmentDesign((state) => state.productPath);
  const activePattern = useGarmentDesign((state) => state.activePattern);
  const patternColors = useGarmentDesign((state) => state.patternColors);
  const activeOpacity = useGarmentDesign((state) => state.activeOpacity);
  const defaultPattern = useGarmentDesign((state) => state.defaultPattern);
  const { getMaterials } = useGarmentMaterialRegistry();
  const invalidate = useThree((state) => state.invalidate);

  const atlasCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const printTextureRef = useRef<CanvasTexture | null>(null);
  const atlasKeyRef = useRef('');
  const requestIdRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const syncQueueRef = useRef(Promise.resolve());

  const clearRuntime = useCallback(() => {
    printTextureRef.current?.dispose();
    printTextureRef.current = null;
    atlasCanvasRef.current = null;
    atlasKeyRef.current = '';
    clearImageTextureCache();
  }, []);

  const applyPrintAtlas = useCallback(
    (printTexture: Texture) => {
      for (const part of product.parts) {
        const uvBounds = resolvePartUvBounds(part);

        for (const material of getMaterials(part.id)) {
          applyGarmentPrint(material, printTexture, uvBounds);
        }
      }
    },
    [getMaterials, product.parts],
  );

  const applyPartColors = useCallback(() => {
    for (const part of product.parts) {
      const color = byPart[part.id] ?? DEFAULT_COLOR;

      for (const material of getMaterials(part.id)) {
        material.color.set(color);
        material.map = null;
        material.needsUpdate = true;
      }
    }
  }, [byPart, getMaterials, product.parts]);

  const applyToMaterials = useCallback(() => {
    const printTexture = printTextureRef.current;
    if (!printTexture) return;

    applyPartColors();
    applyPrintAtlas(printTexture);
    invalidate();
  }, [applyPartColors, applyPrintAtlas, invalidate]);

  const syncAtlas = useCallback(async () => {
    if (productPath !== product.path) return;

    const atlasSize = resolvePrintAtlasSize(product);
    const atlasKey = buildAtlasKey(activePattern?.key, activeOpacity, patternColors, defaultPattern?.key);

    if (atlasKey === atlasKeyRef.current && printTextureRef.current) {
      applyToMaterials();
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (!atlasCanvasRef.current) {
      atlasCanvasRef.current = document.createElement('canvas');
    }

    await composePrintAtlas({
      atlasSize,
      activePattern,
      patternColors,
      activeOpacity,
      defaultPattern,
      targetCanvas: atlasCanvasRef.current,
    });

    if (requestIdRef.current !== requestId) return;

    if (!printTextureRef.current) {
      const texture = new CanvasTexture(atlasCanvasRef.current);
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;
      printTextureRef.current = texture;
    } else {
      printTextureRef.current.needsUpdate = true;
    }

    atlasKeyRef.current = atlasKey;
    applyToMaterials();
  }, [activeOpacity, activePattern, applyToMaterials, defaultPattern, patternColors, product, productPath]);

  const scheduleAtlasSync = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncQueueRef.current = syncQueueRef.current.then(() => syncAtlas());
    });
  }, [syncAtlas]);

  useEffect(() => {
    if (productPath !== product.path) {
      clearRuntime();
      return;
    }

    scheduleAtlasSync();
  }, [activeOpacity, activePattern, clearRuntime, defaultPattern, patternColors, product.path, productPath, scheduleAtlasSync]);

  useEffect(() => {
    if (productPath !== product.path || !printTextureRef.current) return;

    applyPartColors();
    invalidate();
  }, [applyPartColors, byPart, invalidate, product.path, productPath]);

  useEffect(() => () => clearRuntime(), [clearRuntime]);
};

export { useGarmentTextures };
