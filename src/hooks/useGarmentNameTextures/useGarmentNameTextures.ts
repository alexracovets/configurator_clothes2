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
  resolvePrintAtlasSize,
} from '@utils';

const buildNameGeometrySignature = (instances: NameInstance[]) => JSON.stringify(instances.map((instance) => ({ text: instance.text, font: instance.font })));

const buildNameStyleSignature = (instances: NameInstance[]) =>
  JSON.stringify(
    instances.map((instance) => ({
      textColor: instance.textColor,
      strokeColor: instance.strokeColor,
      fontSize: instance.fontSize,
      strokeWidth: instance.strokeWidth,
      uv: instance.uv,
      rotation: instance.rotation,
    })),
  );

const useGarmentNameTextures = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const nameProductPath = useGarmentName((state) => state.productPath);
  const nameInstances = useGarmentName((state) => state.instances);
  const namePreview = useGarmentName((state) => state.preview);
  const { getMaterials } = useGarmentMaterialRegistry();
  const invalidate = useThree((state) => state.invalidate);

  const fillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fillTextureRef = useRef<Texture | null>(null);
  const instancesForRender = useMemo(() => resolveInstancesForRender(nameInstances, namePreview), [nameInstances, namePreview]);
  const geometrySignature = useMemo(() => buildNameGeometrySignature(instancesForRender), [instancesForRender]);
  const styleSignature = useMemo(() => buildNameStyleSignature(instancesForRender), [instancesForRender]);
  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);

  const clearRuntime = useCallback(() => {
    fillTextureRef.current?.dispose();
    fillTextureRef.current = null;
    fillCanvasRef.current = null;
  }, []);

  const applyNameMasks = useCallback(
    (fillMask: Texture) => {
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentNameMasks(material, { fillMask });
        }
      }
      invalidate();
    },
    [getMaterials, invalidate, product.parts],
  );

  const applyNameStyle = useCallback(() => {
    const style = buildNameStyleUniforms(instancesForRender);

    for (const part of product.parts) {
      for (const material of getMaterials(part.id)) {
        applyGarmentPrintAtlasSize(material, atlasSize.width, atlasSize.height);
        applyGarmentNameStyle(material, style);
      }
    }

    invalidate();
  }, [atlasSize.height, atlasSize.width, getMaterials, instancesForRender, invalidate, product.parts]);

  const updateNameMasks = useCallback(async () => {
    if (nameProductPath !== product.path) return;

    const empty = getEmptyPrintTexture();

    if (instancesForRender.length === 0) {
      applyNameMasks(empty);
      return;
    }

    await document.fonts.ready;

    const printAtlasSize = resolvePrintAtlasSize(product);

    if (!fillCanvasRef.current) {
      fillCanvasRef.current = document.createElement('canvas');
      fillTextureRef.current = canvasToMaskTexture(fillCanvasRef.current);
    }

    composeNameMaskAtlas({
      atlasSize: printAtlasSize,
      instances: instancesForRender,
      fillCanvas: fillCanvasRef.current,
    });

    fillTextureRef.current!.needsUpdate = true;
    applyNameMasks(fillTextureRef.current!);
  }, [applyNameMasks, instancesForRender, nameProductPath, product]);

  useEffect(() => {
    if (nameProductPath !== product.path) {
      clearRuntime();
      return;
    }

    void updateNameMasks();
  }, [clearRuntime, geometrySignature, nameProductPath, product.path, updateNameMasks]);

  useEffect(() => {
    if (nameProductPath !== product.path) return;

    applyNameStyle();
  }, [applyNameStyle, nameProductPath, product.path, styleSignature]);

  useEffect(() => () => clearRuntime(), [clearRuntime]);
};

export { useGarmentNameTextures };
