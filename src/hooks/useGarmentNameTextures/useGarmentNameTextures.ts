'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useThree } from '@react-three/fiber';
import type { Texture } from 'three';

import {
  getGizmoButtonsRevealUniforms,
  getGizmoHoverUniforms,
  setGizmoButtonsRevealTarget,
  subscribeGizmoButtonHover,
  subscribeGizmoButtonReveal,
} from '@gizmo';
import { useGizmoIconAtlas } from '@hooks';
import { useGarmentMaterialRegistry, useMaterialRegistryRevision } from '@providers';
import {
  resolveInstancesForRender,
  resolveNumberInstancesForRender,
  useConfigurationControl,
  useConfiguratorProduct,
  useGarmentName,
  useGarmentNumber,
} from '@store';
import type { garmentTextRenderInstanceType, stampPixelSizeType } from '@types';
import { NAME_SLOT_COUNT } from '@constants';
import {
  applyGarmentGizmoButtonsReveal,
  applyGarmentGizmoFrame,
  applyGarmentGizmoHover,
  applyGarmentGizmoIcons,
  applyGarmentNameMasks,
  applyGarmentNameStyle,
  applyGarmentNumberGizmoFrame,
  applyGarmentNumberMasks,
  applyGarmentNumberStyle,
  applyGarmentPrintAtlasSize,
  buildGizmoFrameUniforms,
  buildNameStyleUniforms,
  canvasToMaskTexture,
  composeNameMaskAtlas,
  getEmptyPrintTexture,
  repairPrintInstancePlacement,
  resolveNameStampSize,
  resolvePrintAtlasSize,
} from '@utils';

const NAME_STEP = 4;
const NUMBER_STEP = 5;
const LOGO_STEP = 6;

const DEFAULT_STAMP_SIZE: stampPixelSizeType = { width: 1, height: 1 };

const buildFillSignature = (instances: garmentTextRenderInstanceType[]) =>
  JSON.stringify(instances.map((instance) => ({ text: instance.text, font: instance.font })));

const buildStrokeSignature = (instances: garmentTextRenderInstanceType[]) =>
  JSON.stringify(
    instances.map((instance) => ({
      text: instance.text,
      font: instance.font,
      strokeWidth: instance.strokeWidth,
      fontSize: instance.fontSize,
    })),
  );

const buildStyleSignature = (instances: garmentTextRenderInstanceType[]) =>
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

const stampSizeChanged = (previous: stampPixelSizeType, next: stampPixelSizeType) => previous.width !== next.width || previous.height !== next.height;

const useGarmentNameTextures = () => {
  const product = useConfiguratorProduct((state) => state.product);
  const partIds = useMemo(() => product.parts.map((part) => part.id), [product.parts]);
  const activeStep = useConfigurationControl((state) => state.activeStep);
  const gizmoIcons = useGizmoIconAtlas();
  const nameProductPath = useGarmentName((state) => state.productPath);
  const nameInstances = useGarmentName((state) => state.instances);
  const namePreview = useGarmentName((state) => state.preview);
  const selectedInstanceId = useGarmentName((state) => state.selectedInstanceId);
  const numberProductPath = useGarmentNumber((state) => state.productPath);
  const numberInstances = useGarmentNumber((state) => state.instances);
  const numberPreview = useGarmentNumber((state) => state.preview);
  const { getMaterials, hasMaterialsForParts } = useGarmentMaterialRegistry();
  const materialRevision = useMaterialRegistryRevision();
  const invalidate = useThree((state) => state.invalidate);

  const nameFillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nameStrokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nameFillTextureRef = useRef<Texture | null>(null);
  const nameStrokeTextureRef = useRef<Texture | null>(null);
  const nameStampSizeRef = useRef<stampPixelSizeType>(DEFAULT_STAMP_SIZE);

  const numberFillCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const numberStrokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const numberFillTextureRef = useRef<Texture | null>(null);
  const numberStrokeTextureRef = useRef<Texture | null>(null);
  const numberStampSizeRef = useRef<stampPixelSizeType>(DEFAULT_STAMP_SIZE);

  const nameMaskGenerationRef = useRef(0);
  const numberMaskGenerationRef = useRef(0);
  const prevNameFillSignatureRef = useRef('');
  const prevNumberFillSignatureRef = useRef('');
  const prevSelectedSlotRef = useRef(-1);
  const prevSelectedIdRef = useRef<string | null>(null);

  const nameInstancesForRender = useMemo(
    () => resolveInstancesForRender(nameInstances, namePreview).map((instance) => repairPrintInstancePlacement(instance, product.parts)),
    [nameInstances, namePreview, product.parts],
  );
  const numberInstancesForRender = useMemo(
    () =>
      resolveNumberInstancesForRender(numberInstances, numberPreview)
        .slice(0, NAME_SLOT_COUNT)
        .map((instance) => repairPrintInstancePlacement(instance, product.parts)),
    [numberInstances, numberPreview, product.parts],
  );

  const selectedSlotIndex = useMemo(() => {
    if (activeStep !== NAME_STEP || !selectedInstanceId) return -1;
    return nameInstancesForRender.slice(0, NAME_SLOT_COUNT).findIndex((instance) => instance.id === selectedInstanceId);
  }, [activeStep, nameInstancesForRender, selectedInstanceId]);

  const nameFillSignature = useMemo(() => buildFillSignature(nameInstancesForRender), [nameInstancesForRender]);
  const nameStrokeSignature = useMemo(() => buildStrokeSignature(nameInstancesForRender), [nameInstancesForRender]);
  const nameStyleSignature = useMemo(() => buildStyleSignature(nameInstancesForRender), [nameInstancesForRender]);

  const numberFillSignature = useMemo(() => buildFillSignature(numberInstancesForRender), [numberInstancesForRender]);
  const numberStrokeSignature = useMemo(() => buildStrokeSignature(numberInstancesForRender), [numberInstancesForRender]);
  const numberStyleSignature = useMemo(() => buildStyleSignature(numberInstancesForRender), [numberInstancesForRender]);

  const atlasSize = useMemo(() => resolvePrintAtlasSize(product), [product]);

  const isNameSynced = nameProductPath === product.path;
  const isNumberSynced = numberProductPath === product.path;
  const sceneReady = hasMaterialsForParts(partIds);
  const isNameReady = isNameSynced && sceneReady;
  const isNumberReady = isNumberSynced && sceneReady;

  const clearNameRuntime = useCallback(() => {
    nameFillTextureRef.current?.dispose();
    nameStrokeTextureRef.current?.dispose();
    nameFillTextureRef.current = null;
    nameStrokeTextureRef.current = null;
    nameFillCanvasRef.current = null;
    nameStrokeCanvasRef.current = null;
    nameStampSizeRef.current = DEFAULT_STAMP_SIZE;
    prevNameFillSignatureRef.current = '';
  }, []);

  const clearNumberRuntime = useCallback(() => {
    numberFillTextureRef.current?.dispose();
    numberStrokeTextureRef.current?.dispose();
    numberFillTextureRef.current = null;
    numberStrokeTextureRef.current = null;
    numberFillCanvasRef.current = null;
    numberStrokeCanvasRef.current = null;
    numberStampSizeRef.current = DEFAULT_STAMP_SIZE;
    prevNumberFillSignatureRef.current = '';
  }, []);

  const ensureMaskResources = useCallback(
    (
      stampSize: stampPixelSizeType,
      refs: {
        fillCanvasRef: { current: HTMLCanvasElement | null };
        strokeCanvasRef: { current: HTMLCanvasElement | null };
        fillTextureRef: { current: Texture | null };
        strokeTextureRef: { current: Texture | null };
        stampSizeRef: { current: stampPixelSizeType };
      },
    ) => {
      if (!refs.fillCanvasRef.current) {
        refs.fillCanvasRef.current = document.createElement('canvas');
        refs.fillTextureRef.current = canvasToMaskTexture(refs.fillCanvasRef.current);
      }

      if (!refs.strokeCanvasRef.current) {
        refs.strokeCanvasRef.current = document.createElement('canvas');
        refs.strokeTextureRef.current = canvasToMaskTexture(refs.strokeCanvasRef.current);
      }

      if (!stampSizeChanged(refs.stampSizeRef.current, stampSize)) return;

      refs.fillCanvasRef.current.width = stampSize.width;
      refs.fillCanvasRef.current.height = stampSize.height;
      refs.strokeCanvasRef.current.width = stampSize.width;
      refs.strokeCanvasRef.current.height = stampSize.height;
      refs.fillTextureRef.current?.dispose();
      refs.strokeTextureRef.current?.dispose();
      refs.fillTextureRef.current = canvasToMaskTexture(refs.fillCanvasRef.current);
      refs.strokeTextureRef.current = canvasToMaskTexture(refs.strokeCanvasRef.current);
      refs.stampSizeRef.current = stampSize;
    },
    [],
  );

  const applyNameMasksToMaterials = useCallback(
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

  const applyNumberMasksToMaterials = useCallback(
    (fillMask: Texture, strokeMask: Texture) => {
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentNumberMasks(material, { fillMask, strokeMask });
        }
      }
      invalidate();
    },
    [getMaterials, invalidate, product.parts],
  );

  const applyNameStyleToMaterials = useCallback(
    (stampSize: stampPixelSizeType = nameStampSizeRef.current) => {
      for (const part of product.parts) {
        const style = buildNameStyleUniforms(nameInstancesForRender, product.parts, stampSize, part.id);

        for (const material of getMaterials(part.id)) {
          applyGarmentPrintAtlasSize(material, atlasSize.width, atlasSize.height);
          applyGarmentNameStyle(material, style);
        }
      }

      invalidate();
    },
    [atlasSize.height, atlasSize.width, getMaterials, nameInstancesForRender, invalidate, product.parts],
  );

  const applyNumberStyleToMaterials = useCallback(
    (stampSize: stampPixelSizeType = numberStampSizeRef.current) => {
      for (const part of product.parts) {
        const style = buildNameStyleUniforms(numberInstancesForRender, product.parts, stampSize, part.id);

        for (const material of getMaterials(part.id)) {
          applyGarmentPrintAtlasSize(material, atlasSize.width, atlasSize.height);
          applyGarmentNumberStyle(material, style);
        }
      }

      invalidate();
    },
    [atlasSize.height, atlasSize.width, getMaterials, numberInstancesForRender, invalidate, product.parts],
  );

  const applyGizmoFrames = useCallback(() => {
    const nameGizmoEnabled = activeStep === NAME_STEP;
    const numberGizmoEnabled = activeStep === NUMBER_STEP;

    for (const part of product.parts) {
      const nameFrame = buildGizmoFrameUniforms(nameInstancesForRender, part.id, nameGizmoEnabled);
      const numberFrame = buildGizmoFrameUniforms(numberInstancesForRender, part.id, numberGizmoEnabled);

      for (const material of getMaterials(part.id)) {
        applyGarmentGizmoFrame(material, nameFrame);
        applyGarmentNumberGizmoFrame(material, numberFrame);
        if (gizmoIcons) applyGarmentGizmoIcons(material, gizmoIcons);
      }
    }

    invalidate();
  }, [activeStep, getMaterials, gizmoIcons, nameInstancesForRender, numberInstancesForRender, invalidate, product.parts]);

  useEffect(() => {
    if (activeStep !== NAME_STEP) return;

    const snap =
      prevSelectedIdRef.current === selectedInstanceId &&
      prevSelectedSlotRef.current !== selectedSlotIndex &&
      prevSelectedSlotRef.current >= 0 &&
      selectedSlotIndex >= 0;

    prevSelectedIdRef.current = selectedInstanceId;
    prevSelectedSlotRef.current = selectedSlotIndex;

    setGizmoButtonsRevealTarget(selectedSlotIndex, snap);
  }, [activeStep, selectedInstanceId, selectedSlotIndex]);

  useEffect(() => {
    if (activeStep === NAME_STEP || activeStep === LOGO_STEP) return;
    setGizmoButtonsRevealTarget(-1);
  }, [activeStep]);

  const updateNameMasks = useCallback(
    async (redrawFill: boolean, redrawStroke: boolean) => {
      if (!isNameReady) return;

      const generation = ++nameMaskGenerationRef.current;
      const empty = getEmptyPrintTexture();

      if (nameInstancesForRender.length === 0) {
        nameStampSizeRef.current = DEFAULT_STAMP_SIZE;
        applyNameMasksToMaterials(empty, empty);
        applyNameStyleToMaterials(DEFAULT_STAMP_SIZE);
        return;
      }

      await document.fonts.ready;
      if (generation !== nameMaskGenerationRef.current) return;

      const stampSize = resolveNameStampSize(nameInstancesForRender);
      ensureMaskResources(stampSize, {
        fillCanvasRef: nameFillCanvasRef,
        strokeCanvasRef: nameStrokeCanvasRef,
        fillTextureRef: nameFillTextureRef,
        strokeTextureRef: nameStrokeTextureRef,
        stampSizeRef: nameStampSizeRef,
      });
      if (generation !== nameMaskGenerationRef.current) return;

      composeNameMaskAtlas({
        instances: nameInstancesForRender,
        fillCanvas: nameFillCanvasRef.current!,
        strokeCanvas: nameStrokeCanvasRef.current!,
        redrawFill,
        redrawStroke,
      });

      if (generation !== nameMaskGenerationRef.current) return;

      nameFillTextureRef.current!.needsUpdate = true;
      nameStrokeTextureRef.current!.needsUpdate = true;
      applyNameMasksToMaterials(nameFillTextureRef.current!, nameStrokeTextureRef.current!);
      applyNameStyleToMaterials(stampSize);
    },
    [applyNameMasksToMaterials, applyNameStyleToMaterials, ensureMaskResources, isNameReady, nameInstancesForRender],
  );

  const updateNumberMasks = useCallback(
    async (redrawFill: boolean, redrawStroke: boolean) => {
      if (!isNumberReady) return;

      const generation = ++numberMaskGenerationRef.current;
      const empty = getEmptyPrintTexture();

      if (numberInstancesForRender.length === 0) {
        numberStampSizeRef.current = DEFAULT_STAMP_SIZE;
        applyNumberMasksToMaterials(empty, empty);
        applyNumberStyleToMaterials(DEFAULT_STAMP_SIZE);
        return;
      }

      await document.fonts.ready;
      if (generation !== numberMaskGenerationRef.current) return;

      const stampSize = resolveNameStampSize(numberInstancesForRender);
      ensureMaskResources(stampSize, {
        fillCanvasRef: numberFillCanvasRef,
        strokeCanvasRef: numberStrokeCanvasRef,
        fillTextureRef: numberFillTextureRef,
        strokeTextureRef: numberStrokeTextureRef,
        stampSizeRef: numberStampSizeRef,
      });
      if (generation !== numberMaskGenerationRef.current) return;

      composeNameMaskAtlas({
        instances: numberInstancesForRender,
        fillCanvas: numberFillCanvasRef.current!,
        strokeCanvas: numberStrokeCanvasRef.current!,
        redrawFill,
        redrawStroke,
      });

      if (generation !== numberMaskGenerationRef.current) return;

      numberFillTextureRef.current!.needsUpdate = true;
      numberStrokeTextureRef.current!.needsUpdate = true;
      applyNumberMasksToMaterials(numberFillTextureRef.current!, numberStrokeTextureRef.current!);
      applyNumberStyleToMaterials(stampSize);
    },
    [applyNumberMasksToMaterials, applyNumberStyleToMaterials, ensureMaskResources, isNumberReady, numberInstancesForRender],
  );

  useEffect(() => {
    if (!isNameReady) {
      if (nameProductPath !== product.path) {
        clearNameRuntime();
      }
      return;
    }

    const fillChanged = prevNameFillSignatureRef.current !== nameFillSignature;
    prevNameFillSignatureRef.current = nameFillSignature;

    void updateNameMasks(fillChanged, true);
  }, [clearNameRuntime, isNameReady, nameFillSignature, nameProductPath, nameStrokeSignature, product.path, updateNameMasks]);

  useEffect(() => {
    if (!isNumberReady) {
      if (numberProductPath !== product.path) {
        clearNumberRuntime();
      }
      return;
    }

    const fillChanged = prevNumberFillSignatureRef.current !== numberFillSignature;
    prevNumberFillSignatureRef.current = numberFillSignature;

    void updateNumberMasks(fillChanged, true);
  }, [clearNumberRuntime, isNumberReady, numberFillSignature, numberProductPath, numberStrokeSignature, product.path, updateNumberMasks]);

  useLayoutEffect(() => {
    if (!hasMaterialsForParts(partIds)) return;

    if (isNameSynced) {
      applyNameStyleToMaterials();

      if (nameFillTextureRef.current && nameStrokeTextureRef.current) {
        applyNameMasksToMaterials(nameFillTextureRef.current, nameStrokeTextureRef.current);
      }
    }

    if (isNumberSynced) {
      applyNumberStyleToMaterials();

      if (numberFillTextureRef.current && numberStrokeTextureRef.current) {
        applyNumberMasksToMaterials(numberFillTextureRef.current, numberStrokeTextureRef.current);
      }
    }

    if (isNameSynced || isNumberSynced) {
      applyGizmoFrames();
    }
  }, [
    applyGizmoFrames,
    applyNameMasksToMaterials,
    applyNameStyleToMaterials,
    applyNumberMasksToMaterials,
    applyNumberStyleToMaterials,
    hasMaterialsForParts,
    isNameSynced,
    isNumberSynced,
    materialRevision,
    nameStyleSignature,
    numberStyleSignature,
    partIds,
  ]);

  useEffect(() => {
    const applyHover = () => {
      const hover = getGizmoHoverUniforms();
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentGizmoHover(material, hover);
        }
      }
      invalidate();
    };

    applyHover();
    return subscribeGizmoButtonHover(applyHover);
  }, [getMaterials, invalidate, product.parts]);

  useEffect(() => {
    const applyReveal = () => {
      const reveal = getGizmoButtonsRevealUniforms();
      for (const part of product.parts) {
        for (const material of getMaterials(part.id)) {
          applyGarmentGizmoButtonsReveal(material, reveal);
        }
      }
      invalidate();
    };

    applyReveal();
    return subscribeGizmoButtonReveal(applyReveal);
  }, [getMaterials, invalidate, product.parts]);

  useEffect(
    () => () => {
      clearNameRuntime();
      clearNumberRuntime();
    },
    [clearNameRuntime, clearNumberRuntime],
  );
};

export { useGarmentNameTextures };
