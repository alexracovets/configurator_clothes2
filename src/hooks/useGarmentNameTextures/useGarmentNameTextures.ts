'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import type { Texture } from 'three';

import { useGarmentMaterialRegistry } from '@providers';
import { resolveInstancesForRender, useConfiguratorProduct, useGarmentName } from '@store';
import type { NameInstance } from '@store';
import {
  applyGarmentNameMasks,
  applyGarmentNameStyle,
  applyGarmentPrintAtlasSize,
  buildNameStyleUniforms,
  canvasToMaskTexture,
  composeNameMaskAtlas,
  getEmptyPrintTexture,
  resolveNameStampSize,
  resolvePrintAtlasSize,
} from '@utils';
import type { NameMaskAtlas } from '@utils';

type StampPixelSize = NameMaskAtlas['stampSize'];

const DEFAULT_STAMP_SIZE: StampPixelSize = { width: 1, height: 1 };

const buildNameFillSignature = (instances: NameInstance[]) => JSON.stringify(instances.map((instance) => ({ text: instance.text, font: instance.font })));

const buildNameStrokeSignature = (instances: NameInstance[]) =>
  JSON.stringify(
    instances.map((instance) => ({
      text: instance.text,
      font: instance.font,
      strokeWidth: instance.strokeWidth,
      fontSize: instance.fontSize,
    })),
  );

const buildNameStyleSignature = (instances: NameInstance[]) =>
  JSON.stringify(
    instances.map((instance) => ({
      textColor: instance.textColor,
      strokeColor: instance.strokeColor,
      fontSize: instance.fontSize,
      uv: instance.uv,
      rotation: instance.rotation,
      partId: instance.partId,
    })),
  );

const stampSizeChanged = (previous: StampPixelSize, next: StampPixelSize) => previous.width !== next.width || previous.height !== next.height;

const useGarmentNameTextures = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const nameProductPath = useGarmentName((state) => state.productPath);
  const nameInstances = useGarmentName((state) => state.instances);
  const namePreview = useGarmentName((state) => state.preview);
  const { getMaterials } = useGarmentMaterialRegistry();
  const invalidate = useThree((state) => state.invalidate);

  const fillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fillTextureRef = useRef<Texture | null>(null);
  const strokeTextureRef = useRef<Texture | null>(null);
  const stampSizeRef = useRef<StampPixelSize>(DEFAULT_STAMP_SIZE);
  const maskGenerationRef = useRef(0);
  const prevFillSignatureRef = useRef('');

  const instancesForRender = useMemo(() => resolveInstancesForRender(nameInstances, namePreview), [nameInstances, namePreview]);
  const fillSignature = useMemo(() => buildNameFillSignature(instancesForRender), [instancesForRender]);
  const strokeSignature = useMemo(() => buildNameStrokeSignature(instancesForRender), [instancesForRender]);
  const styleSignature = useMemo(() => buildNameStyleSignature(instancesForRender), [instancesForRender]);
  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);

  const clearRuntime = useCallback(() => {
    fillTextureRef.current?.dispose();
    strokeTextureRef.current?.dispose();
    fillTextureRef.current = null;
    strokeTextureRef.current = null;
    fillCanvasRef.current = null;
    strokeCanvasRef.current = null;
    stampSizeRef.current = DEFAULT_STAMP_SIZE;
    prevFillSignatureRef.current = '';
  }, []);

  const ensureMaskResources = useCallback((stampSize: StampPixelSize) => {
    if (!fillCanvasRef.current) {
      fillCanvasRef.current = document.createElement('canvas');
      fillTextureRef.current = canvasToMaskTexture(fillCanvasRef.current);
    }

    if (!strokeCanvasRef.current) {
      strokeCanvasRef.current = document.createElement('canvas');
      strokeTextureRef.current = canvasToMaskTexture(strokeCanvasRef.current);
    }

    if (!stampSizeChanged(stampSizeRef.current, stampSize)) return;

    fillCanvasRef.current.width = stampSize.width;
    fillCanvasRef.current.height = stampSize.height;
    strokeCanvasRef.current.width = stampSize.width;
    strokeCanvasRef.current.height = stampSize.height;
    fillTextureRef.current?.dispose();
    strokeTextureRef.current?.dispose();
    fillTextureRef.current = canvasToMaskTexture(fillCanvasRef.current);
    strokeTextureRef.current = canvasToMaskTexture(strokeCanvasRef.current);
    stampSizeRef.current = stampSize;
  }, []);

  const applyNameMasks = useCallback(
    (fillMask: Texture, strokeMask: Texture) => {
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentNameMasks(material, { fillMask, strokeMask });
        }
      }
      invalidate();
    },
    [getMaterials, invalidate, product.parts],
  );

  const applyNameStyle = useCallback(
    (stampSize: StampPixelSize = stampSizeRef.current) => {
      for (const part of product.parts) {
        const style = buildNameStyleUniforms(instancesForRender, product.parts, stampSize, part.id);

        for (const material of getMaterials(part.id)) {
          applyGarmentPrintAtlasSize(material, atlasSize.width, atlasSize.height);
          applyGarmentNameStyle(material, style);
        }
      }

      invalidate();
    },
    [atlasSize.height, atlasSize.width, getMaterials, instancesForRender, invalidate, product.parts],
  );

  const updateNameMasks = useCallback(
    async (redrawFill: boolean, redrawStroke: boolean) => {
      if (nameProductPath !== product.path) return;

      const generation = ++maskGenerationRef.current;
      const empty = getEmptyPrintTexture();

      if (instancesForRender.length === 0) {
        stampSizeRef.current = DEFAULT_STAMP_SIZE;
        applyNameMasks(empty, empty);
        applyNameStyle(DEFAULT_STAMP_SIZE);
        return;
      }

      await document.fonts.ready;
      if (generation !== maskGenerationRef.current) return;

      const stampSize = resolveNameStampSize(instancesForRender);
      ensureMaskResources(stampSize);
      if (generation !== maskGenerationRef.current) return;

      composeNameMaskAtlas({
        instances: instancesForRender,
        fillCanvas: fillCanvasRef.current!,
        strokeCanvas: strokeCanvasRef.current!,
        redrawFill,
        redrawStroke,
      });

      if (generation !== maskGenerationRef.current) return;

      fillTextureRef.current!.needsUpdate = true;
      strokeTextureRef.current!.needsUpdate = true;
      applyNameMasks(fillTextureRef.current!, strokeTextureRef.current!);
      applyNameStyle(stampSize);
    },
    [applyNameMasks, applyNameStyle, ensureMaskResources, instancesForRender, nameProductPath, product.path],
  );

  useEffect(() => {
    if (nameProductPath !== product.path) {
      clearRuntime();
      return;
    }

    const fillChanged = prevFillSignatureRef.current !== fillSignature;
    prevFillSignatureRef.current = fillSignature;

    void updateNameMasks(fillChanged, true);
  }, [clearRuntime, fillSignature, nameProductPath, product.path, strokeSignature, updateNameMasks]);

  useEffect(() => {
    if (nameProductPath !== product.path) return;

    applyNameStyle();
  }, [applyNameStyle, nameProductPath, product.path, styleSignature]);

  useEffect(() => () => clearRuntime(), [clearRuntime]);
};

export { useGarmentNameTextures };
